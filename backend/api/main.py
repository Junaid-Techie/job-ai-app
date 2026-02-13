from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from datetime import datetime, timedelta

from .database import engine, SessionLocal
from .models import Base, Resume, Job
from .embedding_service import generate_embedding

app = FastAPI()

# Enable CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
    "http://localhost:3000",
    "https://job-ai-app-six.vercel.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create tables
Base.metadata.create_all(bind=engine)


@app.get("/")
def root():
    return {"message": "Job AI Matcher Running"}


# -------------------------
# Add Resume
# -------------------------
@app.post("/add-resume/")
def add_resume(content: str):
    db: Session = SessionLocal()

    try:
        embedding = generate_embedding(content)

        resume = Resume(
            content=content,
            embedding=embedding
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
# Add Job
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
):
    db: Session = SessionLocal()

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
# Match Jobs with Filters
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
):
    db: Session = SessionLocal()

    try:
        resume = db.query(Resume).filter(Resume.id == resume_id).first()

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

        # Apply filters
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
