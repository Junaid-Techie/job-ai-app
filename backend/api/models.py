from sqlalchemy import Column, Integer, String, Text, Boolean, Float, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from pgvector.sqlalchemy import Vector
from datetime import datetime
from passlib.context import CryptContext
from .database import Base


# =========================
# Password Context
# =========================
pwd_context = CryptContext(schemes=["argon2"], deprecated="auto")


# =========================
# User Model
# =========================

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    first_name = Column(String, nullable=True)
    last_name = Column(String, nullable=True)
    email = Column(String, unique=True, index=True, nullable=False)
    location = Column(String, nullable=True)
    headline = Column(String, nullable=True)
    about = Column(String, nullable=True)
    skills = Column(String, nullable=True)
    linkedin_url = Column(String, nullable=True)
    github_url = Column(String, nullable=True)
    portfolio_url = Column(String, nullable=True)
    experience_years = Column(Integer, nullable=True)
    avatar_url = Column(String, nullable=True)
    phone_number = Column(String, nullable=True)
    current_company = Column(String, nullable=True)
    highest_education = Column(String, nullable=True)
    job_type = Column(String, nullable=True)
    gender = Column(String, nullable=True)
    ethnicity = Column(String, nullable=True)
    veteran_status = Column(String, nullable=True)
    disability_status = Column(String, nullable=True)
    work_authorization = Column(String, nullable=True)
    requires_sponsorship = Column(Boolean, default=False)
    target_salary = Column(Integer, nullable=True)
    hashed_password = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationship
    resumes = relationship("Resume", back_populates="user")

    def verify_password(self, password: str) -> bool:
        return pwd_context.verify(password, self.hashed_password)

    @staticmethod
    def hash_password(password: str) -> str:
        return pwd_context.hash(password)


# =========================
# Resume Model (UPDATED)
# =========================

class Resume(Base):
    __tablename__ = "resumes"

    id = Column(Integer, primary_key=True, index=True)
    content = Column(Text, nullable=False)
    embedding = Column(Vector(1536))

    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    file_path = Column(String, nullable=False)
    file_type = Column(String)

    user = relationship("User", back_populates="resumes")



# =========================
# Job Model (UNCHANGED)
# =========================

class Job(Base):
    __tablename__ = "jobs"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=False)

    location = Column(String)
    work_mode = Column(String)
    job_type = Column(String)
    experience_level = Column(String)

    salary_min = Column(Float)
    salary_max = Column(Float)

    sponsorship = Column(Boolean, default=False)
    company_size = Column(String)
    industry = Column(String)

    posted_date = Column(DateTime, default=datetime.utcnow)
    url = Column(String, nullable=True)

    embedding = Column(Vector(1536))

# =========================
# Application Model
# =========================

class Application(Base):
    __tablename__ = "applications"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    job_id = Column(Integer, ForeignKey("jobs.id"), nullable=False)
    resume_id = Column(Integer, ForeignKey("resumes.id"), nullable=False)
    
    status = Column(String, default="APPLIED") # APPLIED, INTERVIEW, REJECTED
    cover_letter = Column(Text, nullable=True)
    applied_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", backref="applications")
    job = relationship("Job", backref="applications")
    resume = relationship("Resume", backref="applications")

class SavedJob(Base):
    __tablename__ = "saved_jobs"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    job_id = Column(Integer, ForeignKey("jobs.id"))
    saved_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User")
    job = relationship("Job")


# =========================
# Password Reset Token Model
# =========================

class PasswordResetToken(Base):
    __tablename__ = "password_reset_tokens"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    token = Column(String, unique=True, nullable=False, index=True)
    expires_at = Column(DateTime, nullable=False)
    used = Column(Boolean, default=False)

    user = relationship("User")
