import os
import sys
from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, EmailStr
from sqlalchemy.orm import Session
from datetime import datetime

sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))
from database import get_db
import models
from auth import (
    hash_password,
    verify_password,
    create_access_token,
    get_current_user_optional,
    get_current_user_required
)
from routes.progress_route import compute_rank

router = APIRouter(prefix="/api/auth", tags=["Autenticación & Control de Usuarios"])

class RegisterPayload(BaseModel):
    username: str
    email: str
    password: str
    full_name: Optional[str] = None

class LoginPayload(BaseModel):
    identifier: str  # puede ser username o email
    password: str

@router.post("/register")
def register_user(payload: RegisterPayload, db: Session = Depends(get_db)):
    """Registra una nueva cuenta de usuario y le asigna su perfil gamificado."""
    username = payload.username.strip().lower()
    email = payload.email.strip().lower()
    password = payload.password.strip()

    if len(username) < 3:
        raise HTTPException(status_code=400, detail="El nombre de usuario debe tener al menos 3 caracteres.")
    if len(password) < 6:
        raise HTTPException(status_code=400, detail="La contraseña debe tener al menos 6 caracteres.")

    # Validar si ya existe
    existing_user = db.query(models.UserAccount).filter(
        (models.UserAccount.username == username) | (models.UserAccount.email == email)
    ).first()

    if existing_user:
        if existing_user.username == username:
            raise HTTPException(status_code=400, detail="El nombre de usuario ya está registrado.")
        else:
            raise HTTPException(status_code=400, detail="El correo electrónico ya está registrado.")

    # Crear cuenta de usuario con hash seguro
    hashed_pwd = hash_password(password)
    new_account = models.UserAccount(
        username=username,
        email=email,
        password_hash=hashed_pwd,
        full_name=payload.full_name or username.capitalize(),
        is_active=True
    )
    db.add(new_account)
    db.commit()
    db.refresh(new_account)

    # Crear o enlazar perfil gamificado
    profile = db.query(models.UserProfile).filter(models.UserProfile.user_id == username).first()
    if not profile:
        profile = models.UserProfile(
            user_id=username,
            username=payload.full_name or username.capitalize(),
            xp=150,
            level=1,
            rank_title="Recluta del Byte",
            streak_days=1
        )
        db.add(profile)
        db.commit()
        db.refresh(profile)

    # Generar token JWT
    token = create_access_token(data={"sub": username, "email": email, "id": new_account.id})

    return {
        "status": "success",
        "message": "¡Cuenta creada exitosamente! Bienvenido al reino de Python Master.",
        "token": token,
        "token_type": "bearer",
        "user": {
            "id": new_account.id,
            "username": new_account.username,
            "email": new_account.email,
            "full_name": new_account.full_name,
            "xp": profile.xp,
            "level": profile.level,
            "rank_title": profile.rank_title
        }
    }

@router.post("/login")
def login_user(payload: LoginPayload, db: Session = Depends(get_db)):
    """Inicia sesión, verifica credenciales y devuelve un token de acceso JWT."""
    ident = payload.identifier.strip().lower()
    pwd = payload.password.strip()

    # Buscar por username o email
    user = db.query(models.UserAccount).filter(
        (models.UserAccount.username == ident) | (models.UserAccount.email == ident)
    ).first()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Credenciales inválidas. Usuario o contraseña incorrectos."
        )

    if not verify_password(pwd, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Credenciales inválidas. Usuario o contraseña incorrectos."
        )

    # Buscar perfil
    profile = db.query(models.UserProfile).filter(models.UserProfile.user_id == user.username).first()
    if not profile:
        profile = models.UserProfile(
            user_id=user.username,
            username=user.full_name or user.username.capitalize(),
            xp=150,
            level=1,
            rank_title="Recluta del Byte"
        )
        db.add(profile)

    profile.last_active = datetime.utcnow()
    db.commit()
    db.refresh(profile)

    # Generar token JWT
    token = create_access_token(data={"sub": user.username, "email": user.email, "id": user.id})

    return {
        "status": "success",
        "message": f"¡Bienvenido de nuevo, {user.full_name or user.username}!",
        "token": token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "full_name": user.full_name,
            "xp": profile.xp,
            "level": profile.level,
            "rank_title": profile.rank_title,
            "streak_days": profile.streak_days
        }
    }

@router.get("/me")
def get_current_user_profile(user: models.UserAccount = Depends(get_current_user_required), db: Session = Depends(get_db)):
    """Obtiene el perfil y estadísticas del usuario actualmente autenticado."""
    profile = db.query(models.UserProfile).filter(models.UserProfile.user_id == user.username).first()
    progress_count = db.query(models.UserProgress).filter(
        models.UserProgress.user_id == user.username,
        models.UserProgress.completed == True
    ).count()

    return {
        "user_id": user.username,
        "email": user.email,
        "full_name": user.full_name,
        "is_admin": user.is_admin,
        "xp": profile.xp if profile else 0,
        "level": profile.level if profile else 1,
        "rank_title": profile.rank_title if profile else "Recluta del Byte",
        "streak_days": profile.streak_days if profile else 1,
        "completed_lessons_count": progress_count
    }

@router.get("/users")
def list_users(db: Session = Depends(get_db)):
    """Lista todos los usuarios para la tabla de control / clasificación."""
    profiles = db.query(models.UserProfile).order_by(models.UserProfile.xp.desc()).all()
    results = []
    for p in profiles:
        results.append({
            "username": p.username,
            "xp": p.xp,
            "level": p.level,
            "rank_title": p.rank_title,
            "streak_days": p.streak_days,
            "last_active": p.last_active.strftime("%Y-%m-%d %H:%M") if p.last_active else None
        })
    return {"leaderboard": results}
