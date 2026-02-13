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
    email = Column(String, unique=True, index=True, nullable=False)
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

    # Relationship
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

    embedding = Column(Vector(1536))
