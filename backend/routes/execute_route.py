from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional
from database import get_db
import models
from code_runner import run_python_code
from curriculum_data import CURRICULUM

router = APIRouter(prefix="/api/execute", tags=["Execute"])

class ExecutePayload(BaseModel):
    block_id: str
    lesson_id: str
    code: str

@router.post("")
def execute_code(payload: ExecutePayload, db: Session = Depends(get_db)):
    # Find matching lesson test code if available
    test_code = ""
    for block in CURRICULUM:
        if block["id"] == payload.block_id:
            for lesson in block["lessons"]:
                if lesson["id"] == payload.lesson_id:
                    if "exercise" in lesson and "test_code" in lesson["exercise"]:
                        test_code = lesson["exercise"]["test_code"]
                    break

    result = run_python_code(payload.code, test_code=test_code)

    # Save submission in PostgreSQL
    submission = models.CodeSubmission(
        block_id=payload.block_id,
        exercise_id=payload.lesson_id,
        user_code=payload.code,
        stdout=result["stdout"],
        stderr=result["stderr"],
        passed=result["passed"]
    )
    db.add(submission)
    db.commit()

    return result
