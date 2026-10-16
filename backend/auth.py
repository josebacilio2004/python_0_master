import os
import sys
from datetime import datetime, timedelta
from typing import Optional
import jwt
import bcrypt
from fastapi import Header, HTTPException, Depends, status
from sqlalchemy.orm import Session

sys.path.insert(0, os.path.dirname(__file__))
from database import get_db
import models

JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "python_master_jwt_secret_token_secure_2026_key_render")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_DAYS = 30

def hash_password(password: str) -> str:
    """Hashea una contraseña utilizando bcrypt con sal segura."""
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(password.encode("utf-8"), salt).decode("utf-8")

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verifica si la contraseña en texto plano coincide con el hash almacenado."""
    try:
        return bcrypt.checkpw(plain_password.encode("utf-8"), hashed_password.encode("utf-8"))
    except Exception:
        return False

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """Genera un token JWT firmado con expiración."""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(days=ACCESS_TOKEN_EXPIRE_DAYS)
    
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, JWT_SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def decode_access_token(token: str) -> Optional[dict]:
    """Decodifica y valida la firma y expiración de un token JWT."""
    try:
        payload = jwt.decode(token, JWT_SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except jwt.PyJWTError:
        return None

def extract_token_from_header(authorization: Optional[str] = Header(None)) -> Optional[str]:
    """Extrae el token Bearer del encabezado Authorization."""
    if not authorization:
        return None
    parts = authorization.split()
    if len(parts) == 2 and parts[0].lower() == "bearer":
        return parts[1]
    return authorization

def get_current_user_optional(authorization: Optional[str] = Header(None), db: Session = Depends(get_db)) -> Optional[models.UserAccount]:
    """Obtiene el usuario actual si el token es válido, o None si no hay token."""
    token = extract_token_from_header(authorization)
    if not token:
        return None
    
    payload = decode_access_token(token)
    if not payload or "sub" not in payload:
        return None
        
    username = payload["sub"]
    user = db.query(models.UserAccount).filter(models.UserAccount.username == username).first()
    return user

def get_current_user_required(authorization: Optional[str] = Header(None), db: Session = Depends(get_db)) -> models.UserAccount:
    """Exige un token JWT válido y retorna el usuario autenticado; lanza 401 si es inválido."""
    user = get_current_user_optional(authorization, db)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Autenticación requerida. Token no proporcionado o expirado.",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return user
