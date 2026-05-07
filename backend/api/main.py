from fastapi import FastAPI, HTTPException, Depends, Header
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from pydantic import BaseModel

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
class ResumeRequest(BaseModel):
    content: str

@app.post("/add-resume/")
def add_resume(
    data: ResumeRequest,
    db: Session = Depends(SessionLocal),
    user=Depends(get_current_user),
):
    try:
        user_id = int(user["sub"])
        embedding = generate_embedding(data.content)

        resume = Resume(
            content=data.content,
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

        if not jobs:
            return []

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

    except HTTPException as he:
        raise he
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Match error: {str(e)}")

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
class UpdateProfileRequest(BaseModel):
    first_name: str
    last_name: str
    location: str
    job_type: str
    headline: str | None = None
    about: str | None = None
    skills: str | None = None
    linkedin_url: str | None = None
    github_url: str | None = None
    portfolio_url: str | None = None
    experience_years: int | None = None
    gender: str | None = None
    ethnicity: str | None = None
    veteran_status: str | None = None
    disability_status: str | None = None
    work_authorization: str | None = None
    requires_sponsorship: bool = False
    target_salary: int | None = None
    avatar_url: str | None = None
    phone_number: str | None = None
    current_company: str | None = None
    highest_education: str | None = None

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
        return {
            "first_name": db_user.first_name, 
            "last_name": db_user.last_name, 
            "email": db_user.email,
            "location": db_user.location,
            "job_type": db_user.job_type,
            "headline": db_user.headline,
            "about": db_user.about,
            "skills": db_user.skills,
            "linkedin_url": db_user.linkedin_url,
            "github_url": db_user.github_url,
            "portfolio_url": db_user.portfolio_url,
            "experience_years": db_user.experience_years,
            "gender": db_user.gender,
            "ethnicity": db_user.ethnicity,
            "veteran_status": db_user.veteran_status,
            "disability_status": db_user.disability_status,
            "work_authorization": db_user.work_authorization,
            "requires_sponsorship": db_user.requires_sponsorship,
            "target_salary": db_user.target_salary,
            "avatar_url": db_user.avatar_url,
            "phone_number": db_user.phone_number,
            "current_company": db_user.current_company,
            "highest_education": db_user.highest_education
        }
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
        db_user.location = data.location
        db_user.job_type = data.job_type
        db_user.headline = data.headline
        db_user.about = data.about
        db_user.skills = data.skills
        db_user.linkedin_url = data.linkedin_url
        db_user.github_url = data.github_url
        db_user.portfolio_url = data.portfolio_url
        db_user.experience_years = data.experience_years
        db_user.gender = data.gender
        db_user.ethnicity = data.ethnicity
        db_user.veteran_status = data.veteran_status
        db_user.disability_status = data.disability_status
        db_user.work_authorization = data.work_authorization
        db_user.requires_sponsorship = data.requires_sponsorship
        db_user.target_salary = data.target_salary
        db_user.avatar_url = data.avatar_url
        db_user.phone_number = data.phone_number
        db_user.current_company = data.current_company
        db_user.highest_education = data.highest_education
        db.commit()
        return {"message": "Profile updated successfully"}
    finally:
        db.close()

# -------------------------
# Phase 2 Features (Automation)
# -------------------------
from fastapi import BackgroundTasks

@app.post("/save-job/{job_id}")
def save_job(
    job_id: int,
    db: Session = Depends(SessionLocal),
    user=Depends(get_current_user),
):
    try:
        user_id = int(user["sub"])
        from .models import SavedJob, Job
        job = db.query(Job).filter(Job.id == job_id).first()
        if not job:
            raise HTTPException(status_code=404, detail="Job not found")
            
        existing = db.query(SavedJob).filter(SavedJob.user_id == user_id, SavedJob.job_id == job_id).first()
        if existing:
            return {"message": "Job already saved", "saved_job_id": existing.id}
            
        new_save = SavedJob(user_id=user_id, job_id=job_id)
        db.add(new_save)
        db.commit()
        return {"message": "Job saved successfully", "saved_job_id": new_save.id}
    finally:
        db.close()

@app.get("/saved-jobs/")
def get_saved_jobs(
    db: Session = Depends(SessionLocal),
    user=Depends(get_current_user),
):
    try:
        user_id = int(user["sub"])
        from .models import SavedJob
        saved = db.query(SavedJob).filter(SavedJob.user_id == user_id).all()
        return [
            {
                "id": s.id,
                "job_id": s.job.id,
                "title": s.job.title,
                "company": s.job.company_size,
                "location": s.job.location,
                "saved_at": s.saved_at
            }
            for s in saved
        ]
    finally:
        db.close()

@app.get("/recommendations/")
def get_recommendations(
    db: Session = Depends(SessionLocal),
    user=Depends(get_current_user),
):
    try:
        user_id = int(user["sub"])
        from .models import Resume, Job
        
        # Get latest resume
        resume = db.query(Resume).filter(Resume.user_id == user_id).order_by(Resume.id.desc()).first()
        if not resume:
            raise HTTPException(status_code=404, detail="No resume found to generate recommendations")
            
        jobs = db.query(
            Job.id,
            Job.title,
            Job.company_size,
            Job.location,
            Job.embedding.l2_distance(resume.embedding).label("distance")
        ).order_by(
            Job.embedding.l2_distance(resume.embedding)
        ).limit(5).all()
        
        return [
            {
                "job_id": job.id,
                "title": job.title,
                "company": job.company_size,
                "location": job.location,
                "similarity_score": round((1 / (1 + job.distance)) * 100, 2)
            }
            for job in jobs
        ]
    finally:
        db.close()

def run_sync():
    import os
    script_path = os.path.join(os.path.dirname(__file__), '..', 'scripts', 'ingest_jobs.py')
    os.system(f"python {script_path}")

@app.post("/admin/sync-jobs/")
def admin_sync_jobs(
    background_tasks: BackgroundTasks,
    user=Depends(get_current_user),
):
    background_tasks.add_task(run_sync)
    return {"message": "Job sync started in background"}

@app.get("/resumes/")
def get_resumes(db: Session = Depends(SessionLocal), user=Depends(get_current_user)):
    try:
        user_id = int(user["sub"])
        from .models import Resume
        resumes = db.query(Resume).filter(Resume.user_id == user_id).order_by(Resume.id.desc()).all()
        return [
            {
                "id": r.id,
                "file_type": r.file_type,
                "uploaded_at": getattr(r, "id", 0)
            }
            for r in resumes
        ]
    finally:
        db.close()
