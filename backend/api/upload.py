from fastapi import APIRouter, UploadFile, File, Depends, HTTPException
from sqlalchemy.orm import Session
from .database import get_db
from .models import Resume
from .security import get_current_user
from .supabase_client import supabase
import uuid
from PyPDF2 import PdfReader
from docx import Document
import io

router = APIRouter(tags=["Upload"])


def extract_text(file: UploadFile):
    filename = file.filename.lower()

    if filename.endswith(".pdf"):
        reader = PdfReader(file.file)
        text = ""
        for page in reader.pages:
            text += page.extract_text() or ""
        return text

    elif filename.endswith(".docx"):
        document = Document(file.file)
        return "\n".join([p.text for p in document.paragraphs])

    elif filename.endswith(".txt"):
        return file.file.read().decode("utf-8")

    else:
        raise HTTPException(status_code=400, detail="Unsupported file type")
 #

@router.post("/upload-resume")
def upload_resume(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    user=Depends(get_current_user),
):
    user_id = int(user["sub"])

    file_id = str(uuid.uuid4())
    file_path = f"{user_id}/{file_id}_{file.filename}"

    # Upload to Supabase Storage
    supabase.storage.from_("resumes").upload(file_path, file.file.read())

    file.file.seek(0)
    extracted_text = extract_text(file)
    
    # Generate Embedding for Semantic Match
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

    # Automatically extract skills (Phase 1 Roadmap Feature)
    try:
        from .embedding_service import client
        from .models import User
        prompt = f"Extract the top 10 most prominent technical and soft skills from this resume. Return ONLY a comma separated list of skills, nothing else. Resume snippet: {extracted_text[:3000]}"
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[{"role": "user", "content": prompt}],
            max_tokens=100
        )
        extracted_skills = response.choices[0].message.content.strip()
        
        # Save extracted skills to User profile if they don't have any
        db_user = db.query(User).filter(User.id == user_id).first()
        if db_user and not db_user.skills:
            db_user.skills = extracted_skills
            db.commit()
    except Exception as e:
        print("Skill extraction failed:", e)

    return {"resume_id": new_resume.id}
