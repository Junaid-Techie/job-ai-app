from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel, EmailStr
from .database import get_db
from .models import User
from .security import create_access_token


router = APIRouter(prefix="/auth", tags=["Authentication"])


# =========================
# Request Schemas
# =========================

class RegisterRequest(BaseModel):
    email: EmailStr
    password: str


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


# =========================
# Register Endpoint
# =========================

@router.post("/register")
def register(data: RegisterRequest, db: Session = Depends(get_db)):
    existing_user = db.query(User).filter(User.email == data.email).first()

    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    new_user = User(
        email=data.email,
        hashed_password=User.hash_password(data.password),
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {
        "message": "User created successfully",
        "email": new_user.email
    }


# =========================
# Login Endpoint
# =========================

@router.post("/login")
def login(data: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == data.email).first()

    if not user or not user.verify_password(data.password):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    access_token = create_access_token({
        "sub": str(user.id),
        "email": user.email
    })

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "email": user.email
        }
    }
