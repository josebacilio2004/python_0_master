from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from pydantic import BaseModel
from datetime import datetime
from database import get_db
import models
from curriculum_data import ACHIEVEMENTS_LIST

router = APIRouter(prefix="/api/progress", tags=["Progress & Gamification"])

class ProgressPayload(BaseModel):
    user_id: str = "default_user"
    block_id: str
    lesson_id: str
    completed: bool = True
    score: float = 100.0
    xp_earned: int = 50

class AddXPPayload(BaseModel):
    user_id: str = "default_user"
    xp_amount: int
    reason: str = "Reto completado"

def compute_rank(xp: int):
    if xp < 200:
        return 1, "Recluta del Byte", 200
    elif xp < 600:
        return 2, "Explorador de Bucles", 600
    elif xp < 1200:
        return 3, "Maestro de Estructuras", 1200
    elif xp < 2000:
        return 4, "Mago de la POO", 2000
    elif xp < 3200:
        return 5, "Titán de SQL & Datos", 3200
    else:
        return 6, "Staff Engineer & Arquitecto", 5000

@router.get("")
def get_user_progress(user_id: str = "default_user", db: Session = Depends(get_db)):
    progress_records = db.query(models.UserProgress).filter(models.UserProgress.user_id == user_id).all()
    achievements = db.query(models.Achievement).all()
    
    # Obtener o crear perfil de usuario
    profile = db.query(models.UserProfile).filter(models.UserProfile.user_id == user_id).first()
    if not profile:
        profile = models.UserProfile(
            user_id=user_id,
            username="Python Master",
            xp=150,
            level=1,
            rank_title="Recluta del Byte",
            streak_days=3
        )
        db.add(profile)
        db.commit()
        db.refresh(profile)

    # Inicializar logros si la tabla está vacía
    if not achievements:
        for b in ACHIEVEMENTS_LIST:
            new_ach = models.Achievement(
                badge_key=b["badge_key"],
                title=b["title"],
                description=b["description"],
                icon=b["icon"],
                unlocked=False
            )
            db.add(new_ach)
        db.commit()
        achievements = db.query(models.Achievement).all()

    completed_lessons = [p.lesson_id for p in progress_records if p.completed]
    lvl, title, next_xp = compute_rank(profile.xp)
    profile.level = lvl
    profile.rank_title = title
    db.commit()
    
    return {
        "user_id": user_id,
        "xp": profile.xp,
        "level": profile.level,
        "rank_title": profile.rank_title,
        "next_level_xp": next_xp,
        "streak_days": profile.streak_days,
        "completed_lessons": completed_lessons,
        "total_completed": len(set(completed_lessons)),
        "achievements": [
            {
                "badge_key": a.badge_key,
                "title": a.title,
                "description": a.description,
                "icon": a.icon,
                "unlocked": a.unlocked
            } for a in achievements
        ]
    }

@router.post("")
def update_progress(payload: ProgressPayload, db: Session = Depends(get_db)):
    record = db.query(models.UserProgress).filter(
        models.UserProgress.user_id == payload.user_id,
        models.UserProgress.lesson_id == payload.lesson_id
    ).first()

    first_time = False
    if record:
        record.completed = payload.completed
        record.score = max(record.score, payload.score)
        record.completed_at = datetime.utcnow()
    else:
        first_time = True
        record = models.UserProgress(
            user_id=payload.user_id,
            block_id=payload.block_id,
            lesson_id=payload.lesson_id,
            completed=payload.completed,
            score=payload.score,
            xp_earned=payload.xp_earned
        )
        db.add(record)

    # Actualizar XP del perfil de usuario si es primera vez
    profile = db.query(models.UserProfile).filter(models.UserProfile.user_id == payload.user_id).first()
    if profile and first_time:
        profile.xp += payload.xp_earned
        profile.completed_lessons += 1
        lvl, title, _ = compute_rank(profile.xp)
        profile.level = lvl
        profile.rank_title = title

    db.commit()

    # Desbloquear logro del bloque
    badge_key = f"{payload.block_id.replace('bloque_', 'b')}_master"
    badge = db.query(models.Achievement).filter(models.Achievement.badge_key == badge_key).first()
    if badge and not badge.unlocked:
        badge.unlocked = True
        badge.unlocked_at = datetime.utcnow()
        db.commit()

    return {
        "status": "success",
        "lesson_id": payload.lesson_id,
        "xp_total": profile.xp if profile else 0,
        "level": profile.level if profile else 1,
        "rank_title": profile.rank_title if profile else ""
    }

@router.post("/add_xp")
def add_xp(payload: AddXPPayload, db: Session = Depends(get_db)):
    profile = db.query(models.UserProfile).filter(models.UserProfile.user_id == payload.user_id).first()
    if not profile:
        profile = models.UserProfile(user_id=payload.user_id, xp=150)
        db.add(profile)

    profile.xp += payload.xp_amount
    lvl, title, next_xp = compute_rank(profile.xp)
    leveled_up = (lvl > profile.level)
    profile.level = lvl
    profile.rank_title = title
    db.commit()

    return {
        "status": "success",
        "xp": profile.xp,
        "level": profile.level,
        "rank_title": profile.rank_title,
        "next_level_xp": next_xp,
        "leveled_up": leveled_up,
        "message": f"+{payload.xp_amount} XP ganados por: {payload.reason}!"
    }
