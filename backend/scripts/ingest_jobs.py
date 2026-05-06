import os
import sys
import requests
import asyncio
from datetime import datetime
from dotenv import load_dotenv

# Ensure we can import from backend
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from api.database import SessionLocal
from api.models import Job
from api.embedding_service import generate_embedding

load_dotenv()

def fetch_and_ingest_jobs():
    print("Fetching jobs from Remotive API...")
    # Fetch free remote jobs from Remotive
    response = requests.get("https://remotive.com/api/remote-jobs?limit=10")
    if response.status_code != 200:
        print("Failed to fetch jobs.")
        return

    data = response.json()
    jobs_list = data.get("jobs", [])
    
    db = SessionLocal()
    
    added_count = 0
    for j in jobs_list:
        # Check if job already exists (by exact title and company name match)
        # Remotive includes company name in 'company_name'
        existing = db.query(Job).filter(Job.title == j['title'], Job.company_size == j['company_name']).first()
        if existing:
            continue
            
        print(f"Ingesting: {j['title']} at {j['company_name']}")
        
        # Clean HTML from description
        import re
        clean_desc = re.sub('<[^<]+?>', '', j.get('description', ''))
        
        # Generate embedding for the job
        combined_text = f"Title: {j['title']} Description: {clean_desc[:2000]}"
        embedding = generate_embedding(combined_text)
        
        new_job = Job(
            title=j['title'],
            description=clean_desc,
            location=j.get('candidate_required_location', 'Remote'),
            work_mode='Remote',
            job_type=j.get('job_type', '').replace('_', ' ').title(),
            company_size=j.get('company_name', ''), # Reusing company_size for company_name to avoid altering DB
            industry=j.get('category', ''),
            salary_min=None,
            salary_max=None,
            embedding=embedding
        )
        
        db.add(new_job)
        added_count += 1
        
    db.commit()
    db.close()
    
    print(f"Successfully ingested {added_count} new remote jobs.")

if __name__ == "__main__":
    fetch_and_ingest_jobs()
