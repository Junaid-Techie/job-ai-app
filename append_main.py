with open('backend/api/main.py', 'a') as f:
    f.write('''
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
        resume = db.query(Resume).filter(Resume.user_id == user_id).order_by(Resume.uploaded_at.desc()).first()
        if not resume:
            raise HTTPException(status_code=404, detail="No resume found to generate recommendations")
            
        jobs = db.query(Job).order_by(
            Job.embedding.l2_distance(resume.embedding)
        ).limit(5).all()
        
        return [
            {
                "job_id": job.id,
                "title": job.title,
                "company": job.company_size,
                "location": job.location,
                "similarity_score": round((1 / (1 + getattr(job, 'distance', 0)))) * 100 if hasattr(job, 'distance') else 0
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
''')
