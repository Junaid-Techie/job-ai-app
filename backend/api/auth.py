from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel, EmailStr
from .database import get_db
from .models import User, PasswordResetToken
from .security import create_access_token
import os, secrets
from datetime import datetime, timedelta


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

class ResetPasswordRequest(BaseModel):
    token: str
    new_password: str

class LoginRequest(BaseModel):
    email: EmailStr
    password: str


# =========================
# Helpers
# =========================

def send_reset_email(to_email: str, reset_link: str):
    """Send password reset email via Resend."""
    try:
        import httpx
        resend_api_key = os.getenv("RESEND_API_KEY")
        if not resend_api_key:
            raise RuntimeError("RESEND_API_KEY is not set")

        from_email = os.getenv("RESEND_FROM_EMAIL", "noreply@resend.dev")

        html_body = f"""
        <div style="font-family:sans-serif;max-width:480px;margin:auto;padding:32px;background:#0d0d0d;color:#fff;border-radius:12px;border:1px solid #222">
          <h2 style="color:#60a5fa;margin-bottom:8px">Job AI – Password Reset</h2>
          <p style="color:#aaa;margin-bottom:24px">You requested a password reset. Click the button below to set a new password. This link expires in <strong>1 hour</strong>.</p>
          <a href="{reset_link}" style="display:inline-block;padding:14px 28px;background:linear-gradient(90deg,#3b82f6,#10b981);color:#fff;border-radius:8px;text-decoration:none;font-weight:600">
            Reset My Password
          </a>
          <p style="color:#555;font-size:12px;margin-top:24px">If you didn't request this, you can safely ignore this email.</p>
          <p style="color:#333;font-size:11px;margin-top:8px">{reset_link}</p>
        </div>
        """

        response = httpx.post(
            "https://api.resend.com/emails",
            headers={
                "Authorization": f"Bearer {resend_api_key}",
                "Content-Type": "application/json",
            },
            json={
                "from": from_email,
                "to": [to_email],
                "subject": "Reset your Job AI password",
                "html": html_body,
            },
            timeout=10,
        )
        response.raise_for_status()
        return True
    except Exception as e:
        print(f"Email send failed: {e}")
        return False


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
    # Always return success to prevent email enumeration
    user = db.query(User).filter(User.email == data.email).first()

    if user:
        # Invalidate any existing tokens for this user
        db.query(PasswordResetToken).filter(
            PasswordResetToken.user_id == user.id,
            PasswordResetToken.used == False
        ).delete()
        db.commit()

        # Generate a secure random token
        raw_token = secrets.token_urlsafe(32)
        expires_at = datetime.utcnow() + timedelta(hours=1)

        reset_token = PasswordResetToken(
            user_id=user.id,
            token=raw_token,
            expires_at=expires_at,
        )
        db.add(reset_token)
        db.commit()

        # Build reset link
        frontend_url = os.getenv("FRONTEND_URL", "https://job-ai-app-six.vercel.app")
        reset_link = f"{frontend_url}/reset-password?token={raw_token}"

        email_sent = send_reset_email(user.email, reset_link)
        if not email_sent:
            # Don't leak the error to the user, but log it
            print(f"WARNING: Failed to send reset email to {user.email}")

    return {"message": "If an account with that email exists, a password reset link has been sent."}


# =========================
# Reset Password Endpoint
# =========================

@router.post("/reset-password")
def reset_password(data: ResetPasswordRequest, db: Session = Depends(get_db)):
    reset_token = db.query(PasswordResetToken).filter(
        PasswordResetToken.token == data.token,
        PasswordResetToken.used == False,
    ).first()

    if not reset_token:
        raise HTTPException(status_code=400, detail="Invalid or expired reset token.")

    if datetime.utcnow() > reset_token.expires_at:
        raise HTTPException(status_code=400, detail="Reset token has expired. Please request a new one.")

    # Update password
    user = db.query(User).filter(User.id == reset_token.user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found.")

    user.hashed_password = User.hash_password(data.new_password)
    reset_token.used = True
    db.commit()

    return {"message": "Password reset successfully. You can now sign in."}


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
