from fastapi import APIRouter, UploadFile, File, Depends, HTTPException
from sqlalchemy.orm import Session
from .database import get_db
from .models import Resume
from .security import get_current_user
from .supabase_client import supabase
import uuid, io
from PyPDF2 import PdfReader
from docx import Document

router = APIRouter(tags=["Upload"])


def extract_text_from_bytes(file_bytes: bytes, filename: str) -> str:
    """Extract plain text from file bytes given a filename."""
    name = filename.lower()

    if name.endswith(".pdf"):
        reader = PdfReader(io.BytesIO(file_bytes))
        text = ""
        for page in reader.pages:
            text += page.extract_text() or ""
        return text

    elif name.endswith(".docx"):
        document = Document(io.BytesIO(file_bytes))
        return "\n".join([p.text for p in document.paragraphs])

    elif name.endswith(".txt"):
        return file_bytes.decode("utf-8")

    else:
        raise HTTPException(status_code=400, detail=f"Unsupported file type: {name.split('.')[-1]}")


@router.post("/upload-resume")
def upload_resume(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    user=Depends(get_current_user),
):
    try:
        user_id = int(user["sub"])

        # Read entire file into memory ONCE — avoids stream exhaustion issues
        file_bytes = file.file.read()

        file_id = str(uuid.uuid4())
        file_path = f"{user_id}/{file_id}_{file.filename}"

        # Upload to Supabase Storage (optional — safe to fail if bucket missing)
        try:
            supabase.storage.from_("resumes").upload(file_path, file_bytes)
        except Exception as e:
            print("Supabase storage upload skipped:", e)

        # Extract text from in-memory bytes
        extracted_text = extract_text_from_bytes(file_bytes, file.filename)
        if not extracted_text or not extracted_text.strip():
            raise HTTPException(status_code=422, detail="Could not extract text from the file. Please try a .txt paste instead.")

        # Generate embedding
        from .embedding_service import generate_embedding
        embedding = generate_embedding(extracted_text)

        new_resume = Resume(
            content=extracted_text,
            embedding=embedding,
            user_id=user_id,
            file_path=file_path,
            file_type=file.filename.split(".")[-1],
        )

        db.add(new_resume)
        db.commit()
        db.refresh(new_resume)

        # Extract and save skills to user profile if empty
        try:
            from .embedding_service import client
            from .models import User
            prompt = f"Extract the top 10 most prominent technical and soft skills from this resume. Return ONLY a comma-separated list, nothing else. Resume snippet: {extracted_text[:3000]}"
            response = client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[{"role": "user", "content": prompt}],
                max_tokens=100
            )
            extracted_skills = response.choices[0].message.content.strip()
            db_user = db.query(User).filter(User.id == user_id).first()
            if db_user and not db_user.skills:
                db_user.skills = extracted_skills
                db.commit()
        except Exception as e:
            print("Skill extraction failed:", e)

        return {"resume_id": new_resume.id}

    except HTTPException as he:
        raise he
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Resume upload failed: {str(e)}")
