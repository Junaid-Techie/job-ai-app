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

    new_resume = Resume(
        content=extracted_text,
        user_id=user_id,
        file_path=file_path,
        file_type=file.filename.split(".")[-1],
    )

    db.add(new_resume)
    db.commit()
    db.refresh(new_resume)

    return {"resume_id": new_resume.id}
