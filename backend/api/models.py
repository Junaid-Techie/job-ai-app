from sqlalchemy import Column, Integer, String, Text, Boolean, Float, DateTime
from pgvector.sqlalchemy import Vector
from datetime import datetime
from passlib.hash import bcrypt
from .database import Base


# =========================
# Resume Model
# =========================

class Resume(Base):
    __tablename__ = "resumes"

    id = Column(Integer, primary_key=True, index=True)
    content = Column(Text, nullable=False)
    embedding = Column(Vector(1536))


# =========================
# Job Model
# =========================

class Job(Base):
    __tablename__ = "jobs"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=False)

    location = Column(String)
    work_mode = Column(String)  # remote, hybrid, onsite
    job_type = Column(String)   # full-time, part-time, contract
    experience_level = Column(String)

    salary_min = Column(Float)
    salary_max = Column(Float)

    sponsorship = Column(Boolean, default=False)
    company_size = Column(String)
    industry = Column(String)

    posted_date = Column(DateTime, default=datetime.utcnow)

    embedding = Column(Vector(1536))


# =========================
# User Model (NEW)
# =========================

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Verify password
    def verify_password(self, password: str) -> bool:
        return bcrypt.verify(password, self.hashed_password)

    # Hash password
    @staticmethod
    def hash_password(password: str) -> str:
        return bcrypt.hash(password)
