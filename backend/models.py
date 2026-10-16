from sqlalchemy import Column, Integer, String, Boolean, DateTime, Text, Float
from datetime import datetime
from database import Base

class UserProfile(Base):
    __tablename__ = "user_profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String(50), unique=True, index=True, default="default_user")
    username = Column(String(100), default="Python Master")
    xp = Column(Integer, default=150)
    level = Column(Integer, default=1)
    rank_title = Column(String(100), default="Recluta del Byte")
    streak_days = Column(Integer, default=3)
    completed_lessons = Column(Integer, default=0)
    completed_sql = Column(Integer, default=0)
    last_active = Column(DateTime, default=datetime.utcnow)

class UserProgress(Base):
    __tablename__ = "user_progress"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String(50), default="default_user")
    block_id = Column(String(50), index=True)
    lesson_id = Column(String(50), index=True)
    completed = Column(Boolean, default=False)
    score = Column(Float, default=0.0)
    xp_earned = Column(Integer, default=0)
    completed_at = Column(DateTime, default=datetime.utcnow)

class CodeSubmission(Base):
    __tablename__ = "code_submissions"

    id = Column(Integer, primary_key=True, index=True)
    block_id = Column(String(50))
    exercise_id = Column(String(50))
    user_code = Column(Text)
    stdout = Column(Text, nullable=True)
    stderr = Column(Text, nullable=True)
    passed = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

class Achievement(Base):
    __tablename__ = "achievements"

    id = Column(Integer, primary_key=True, index=True)
    badge_key = Column(String(50), unique=True, index=True)
    title = Column(String(100))
    description = Column(String(255))
    icon = Column(String(50))
    unlocked = Column(Boolean, default=False)
    unlocked_at = Column(DateTime, nullable=True)

class SQLSubmission(Base):
    __tablename__ = "sql_submissions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String(50), default="default_user")
    challenge_id = Column(String(50))
    query_text = Column(Text)
    passed = Column(Boolean, default=False)
    execution_ms = Column(Float, default=0.0)
    created_at = Column(DateTime, default=datetime.utcnow)
