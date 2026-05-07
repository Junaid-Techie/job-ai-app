import os
import sys
import re
import requests
from dotenv import load_dotenv

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
load_dotenv()

from api.database import SessionLocal
from api.models import Job
from api.embedding_service import generate_embedding


def clean_html(text: str) -> str:
    return re.sub(r"<[^<]+?>", "", text or "").strip()


def fetch_remotive(db, limit=20) -> int:
    """Fetch remote jobs from Remotive API (free, no key)."""
    try:
        res = requests.get(f"https://remotive.com/api/remote-jobs?limit={limit}", timeout=10)
        if res.status_code != 200:
            print("Remotive: failed to fetch")
            return 0
        jobs = res.json().get("jobs", [])
        added = 0
        for j in jobs:
            title = j.get("title", "")
            company = j.get("company_name", "")
            if not title:
                continue
            existing = db.query(Job).filter(Job.title == title, Job.company_size == company).first()
            if existing:
                continue
            desc = clean_html(j.get("description", ""))
            combined = f"Title: {title} Company: {company} Description: {desc[:2000]}"
            embedding = generate_embedding(combined)
            db.add(Job(
                title=title,
                description=desc,
                location=j.get("candidate_required_location") or "Remote",
                work_mode="Remote",
                job_type=(j.get("job_type") or "").replace("_", " ").title(),
                company_size=company,
                industry=j.get("category", ""),
                salary_min=None,
                salary_max=None,
                embedding=embedding,
                url=j.get("url", ""),
            ))
            added += 1
        db.commit()
        print(f"Remotive: +{added} new jobs")
        return added
    except Exception as e:
        print(f"Remotive error: {e}")
        return 0


def fetch_arbeitnow(db, limit=20) -> int:
    """Fetch jobs from Arbeitnow (free, no key, great data)."""
    try:
        res = requests.get("https://arbeitnow.com/api/job-board-api", timeout=10)
        if res.status_code != 200:
            print("Arbeitnow: failed to fetch")
            return 0
        jobs = res.json().get("data", [])[:limit]
        added = 0
        for j in jobs:
            title = j.get("title", "")
            company = j.get("company_name", "")
            if not title:
                continue
            existing = db.query(Job).filter(Job.title == title, Job.company_size == company).first()
            if existing:
                continue
            desc = clean_html(j.get("description", ""))
            combined = f"Title: {title} Company: {company} Description: {desc[:2000]}"
            embedding = generate_embedding(combined)
            db.add(Job(
                title=title,
                description=desc,
                location=j.get("location") or "Remote",
                work_mode="Remote" if j.get("remote") else "On-site",
                job_type=j.get("job_types", [""])[0] if j.get("job_types") else "",
                company_size=company,
                industry=j.get("tags", [""])[0] if j.get("tags") else "",
                salary_min=None,
                salary_max=None,
                embedding=embedding,
                url=j.get("url", ""),
            ))
            added += 1
        db.commit()
        print(f"Arbeitnow: +{added} new jobs")
        return added
    except Exception as e:
        print(f"Arbeitnow error: {e}")
        return 0


def fetch_and_ingest_jobs(limit_per_source=15):
    """Main ingestion function: pulls from multiple free APIs."""
    db = SessionLocal()
    try:
        total = 0
        total += fetch_remotive(db, limit=limit_per_source)
        total += fetch_arbeitnow(db, limit=limit_per_source)
        print(f"Total new jobs ingested: {total}")
        return total
    finally:
        db.close()


if __name__ == "__main__":
    fetch_and_ingest_jobs()
