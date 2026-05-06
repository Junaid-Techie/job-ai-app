from fastapi import FastAPI, HTTPException, Depends, Header
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from datetime import datetime, timedelta

from .auth import router as auth_router
from .upload import router as upload_router
from .database import engine, SessionLocal
from .models import Base, Resume, Job, Application
from .embedding_service import generate_embedding
from .security import get_current_user

app = FastAPI()

# -------------------------
# Routers
# -------------------------
app.include_router(auth_router)
app.include_router(upload_router)

# -------------------------
# CORS
# -------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://job-ai-app-six.vercel.app"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -------------------------
# Create Tables
# -------------------------
Base.metadata.create_all(bind=engine)


# -------------------------
# Root
# -------------------------
@app.get("/")
def root():
    return {"message": "Job AI Matcher Running"}


# -------------------------
# Add Resume (Protected)
# -------------------------
@app.post("/add-resume/")
def add_resume(
    content: str,
    db: Session = Depends(SessionLocal),
    user=Depends(get_current_user),
):
    try:
        user_id = int(user["sub"])
        embedding = generate_embedding(content)

        resume = Resume(
            content=content,
            embedding=embedding,
            user_id=user_id,
            file_path="manual_input",
            file_type="text",
        )

        db.add(resume)
        db.commit()
        db.refresh(resume)

        return {"resume_id": resume.id}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    finally:
        db.close()


# -------------------------
# Add Job (Admin Only Later)
# -------------------------
@app.post("/add-job/")
def add_job(
    title: str,
    description: str,
    location: str = "",
    work_mode: str = "",
    job_type: str = "",
    experience_level: str = "",
    salary_min: float = 0,
    salary_max: float = 0,
    sponsorship: bool = False,
    company_size: str = "",
    industry: str = "",
    db: Session = Depends(SessionLocal),
    admin_secret: str = Header(None, description="Secret key for admin operations"),
):
    import os
    expected_secret = os.getenv("ADMIN_SECRET", "supersecretadmin")
    if admin_secret != expected_secret:
        raise HTTPException(status_code=403, detail="Unauthorized access to add job")
    try:
        combined_text = f"{title}\n{description}"
        embedding = generate_embedding(combined_text)

        job = Job(
            title=title,
            description=description,
            location=location,
            work_mode=work_mode,
            job_type=job_type,
            experience_level=experience_level,
            salary_min=salary_min,
            salary_max=salary_max,
            sponsorship=sponsorship,
            company_size=company_size,
            industry=industry,
            embedding=embedding,
        )

        db.add(job)
        db.commit()
        db.refresh(job)

        return {"job_id": job.id}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    finally:
        db.close()


# -------------------------
# Match Jobs (Protected + Ownership Enforced)
# -------------------------
@app.get("/match-jobs/{resume_id}")
def match_jobs(
    resume_id: int,
    min_salary: float = 0,
    max_salary: float = 0,
    job_type: str = "",
    work_mode: str = "",
    location: str = "",
    experience_level: str = "",
    sponsorship_required: bool = False,
    company_size: str = "",
    industry: str = "",
    posted_within_days: int = 0,
    db: Session = Depends(SessionLocal),
    user=Depends(get_current_user),
):
    try:
        user_id = int(user["sub"])

        resume = db.query(Resume).filter(
            Resume.id == resume_id,
            Resume.user_id == user_id
        ).first()

        if not resume:
            raise HTTPException(status_code=404, detail="Resume not found")

        query = db.query(
            Job.id,
            Job.title,
            Job.location,
            Job.work_mode,
            Job.salary_min,
            Job.job_type,
            Job.embedding.l2_distance(resume.embedding).label("distance")
        )

        # Filters
        if min_salary > 0:
            query = query.filter(Job.salary_min >= min_salary)

        if max_salary > 0:
            query = query.filter(Job.salary_max <= max_salary)

        if job_type:
            query = query.filter(Job.job_type == job_type)

        if work_mode:
            query = query.filter(Job.work_mode == work_mode)

        if location:
            query = query.filter(Job.location.ilike(f"%{location}%"))

        if experience_level:
            query = query.filter(Job.experience_level == experience_level)

        if sponsorship_required:
            query = query.filter(Job.sponsorship == True)

        if company_size:
            query = query.filter(Job.company_size == company_size)

        if industry:
            query = query.filter(Job.industry == industry)

        if posted_within_days > 0:
            cutoff = datetime.utcnow() - timedelta(days=posted_within_days)
            query = query.filter(Job.posted_date >= cutoff)

        jobs = query.order_by(
            Job.embedding.l2_distance(resume.embedding)
        ).limit(10).all()

        return [
            {
                "job_id": job.id,
                "title": job.title,
                "location": job.location,
                "work_mode": job.work_mode,
                "salary_min": job.salary_min,
                "job_type": job.job_type,
                "similarity_score": round((1 / (1 + job.distance)) * 100, 2)
            }
            for job in jobs
        ]

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    finally:
        db.close()

# -------------------------
# Auto Apply (AI Cover Letter + Tracking)
# -------------------------
@app.post("/auto-apply/")
def auto_apply(
    job_id: int,
    resume_id: int,
    db: Session = Depends(SessionLocal),
    user=Depends(get_current_user),
):
    try:
        user_id = int(user["sub"])
        
        job = db.query(Job).filter(Job.id == job_id).first()
        resume = db.query(Resume).filter(Resume.id == resume_id, Resume.user_id == user_id).first()
        
        if not job or not resume:
            raise HTTPException(status_code=404, detail="Job or Resume not found")
            
        existing_app = db.query(Application).filter(
            Application.job_id == job_id, 
            Application.user_id == user_id
        ).first()
        
        if existing_app:
            raise HTTPException(status_code=400, detail="Already applied to this job")

        # Generate a cover letter using OpenAI
        from .embedding_service import client
        
        prompt = f"Write a very short 3-sentence cover letter for a {job.title} position based on this resume snippet: {resume.content[:1000]}"
        
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": "You are an expert career coach writing tailored, professional, and concise cover letters."},
                {"role": "user", "content": prompt}
            ],
            max_tokens=250
        )
        
        cover_letter = response.choices[0].message.content

        application = Application(
            user_id=user_id,
            job_id=job_id,
            resume_id=resume_id,
            status="APPLIED",
            cover_letter=cover_letter
        )
        
        db.add(application)
        db.commit()
        db.refresh(application)
        
        return {"status": "success", "application_id": application.id, "cover_letter": cover_letter}

    except HTTPException as he:
        raise he
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        db.close()


# -------------------------
# Get Applications
# -------------------------
@app.get("/applications/")
def get_applications(
    db: Session = Depends(SessionLocal),
    user=Depends(get_current_user),
):
    try:
        user_id = int(user["sub"])
        applications = db.query(Application).filter(Application.user_id == user_id).order_by(Application.applied_at.desc()).all()
        
        return [
            {
                "id": app.id,
                "job_title": app.job.title,
                "job_location": app.job.location,
                "status": app.status,
                "applied_at": app.applied_at,
                "cover_letter": app.cover_letter
            }
            for app in applications
        ]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        db.close()

# -------------------------
# Interview Prep (AI Generated)
# -------------------------
@app.get("/interview-prep/{application_id}")
def get_interview_prep(
    application_id: int,
    db: Session = Depends(SessionLocal),
    user=Depends(get_current_user),
):
    try:
        user_id = int(user["sub"])
        application = db.query(Application).filter(Application.id == application_id, Application.user_id == user_id).first()
        
        if not application:
            raise HTTPException(status_code=404, detail="Application not found")

        from .embedding_service import client
        
        prompt = f"Act as an expert technical recruiter. Based on this job title ({application.job.title}) and description ({application.job.description[:1000]}) and this candidate's resume ({application.resume.content[:1000]}), generate 3 likely interview questions and a brief 1-sentence tip on how this specific candidate should answer each."
        
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": "You are an expert career coach helping a candidate prepare for an interview. Be concise and practical."},
                {"role": "user", "content": prompt}
            ],
            max_tokens=400
        )
        
        prep_guide = response.choices[0].message.content
        return {"prep_guide": prep_guide}

    except HTTPException as he:
        raise he
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        db.close()

# -------------------------
# Profile Endpoints
# -------------------------
from pydantic import BaseModel
class UpdateProfileRequest(BaseModel):
    first_name: str
    last_name: str

@app.get("/profile/")
def get_profile(
    db: Session = Depends(SessionLocal),
    user=Depends(get_current_user),
):
    try:
        user_id = int(user["sub"])
        from .models import User
        db_user = db.query(User).filter(User.id == user_id).first()
        if not db_user:
            raise HTTPException(status_code=404, detail="User not found")
        return {"first_name": db_user.first_name, "last_name": db_user.last_name, "email": db_user.email}
    finally:
        db.close()

@app.put("/profile/")
def update_profile(
    data: UpdateProfileRequest,
    db: Session = Depends(SessionLocal),
    user=Depends(get_current_user),
):
    try:
        user_id = int(user["sub"])
        from .models import User
        db_user = db.query(User).filter(User.id == user_id).first()
        if not db_user:
            raise HTTPException(status_code=404, detail="User not found")
        
        db_user.first_name = data.first_name
        db_user.last_name = data.last_name
        db.commit()
        return {"message": "Profile updated successfully"}
    finally:
        db.close()
