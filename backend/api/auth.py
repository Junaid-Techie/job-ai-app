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
    first_name: str
    last_name: str
    email: EmailStr
    password: str

class ForgotPasswordRequest(BaseModel):
    email: EmailStr


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
        first_name=data.first_name,
        last_name=data.last_name,
        email=data.email,
        hashed_password=User.hash_password(data.password),
    )

    db.add(new_user)
    db.commit()
    return {
        "message": "User created successfully",
        "email": new_user.email
    }

# =========================
# Forgot Password Endpoint
# =========================

@router.post("/forgot-password")
def forgot_password(data: ForgotPasswordRequest, db: Session = Depends(get_db)):
    # Simulating email logic for free deployment
    # Check if user exists (optional, but good practice is to return same response regardless)
    user = db.query(User).filter(User.email == data.email).first()
    return {"message": "If an account with that email exists, a password reset link has been sent."}


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
