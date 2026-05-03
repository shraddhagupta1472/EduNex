from fastapi import APIRouter
from pydantic import BaseModel, Field, field_validator

from Backend.services.evaluation import evaluate
from Backend.services.session_store import create_session, get_session
from Backend.data.questions import questions

router = APIRouter()

class TestSubmission(BaseModel):
    answers: dict[int, int] = Field(default_factory=dict)
    
    @field_validator('answers', mode='before')
    def validate_answers(cls, v):
        if not isinstance(v, dict):
            raise ValueError("answers must be a dictionary")
        return v

@router.get("/questions")
async def get_questions():
    # Return questions without the answer key for security
    sanitized = []
    for q in questions:
        sanitized.append({
            "id": q["id"],
            "question": q["question"],
            "options": q["options"],
            "topic": q["topic"]
        })
    return {"questions": sanitized}

@router.post("/submit-test")
async def submit_test(submission: TestSubmission):
    if not submission.answers:
        return {"error": "Answers not provided"}

    try:
        score, topic_scores, mistakes = evaluate(submission.answers, questions)
    except Exception:
        return {"error": "Invalid input"}

    total_questions = len(questions)

    if score < total_questions * 0.5:
        level = "Beginner"
        message = "You need to improve your basics"
    elif score < total_questions * 0.75:
        level = "Intermediate"
        message = "You are doing okay but need more practice"
    else:
        level = "Advanced"
        message = "Great job! You have strong understanding"

    percentage = (score / total_questions) * 100
    session_id = create_session(percentage, topic_scores, mistakes)

    return {
        "score": score,
        "level": level,
        "message": message,
        "total_questions": total_questions,
        "topic_scores": topic_scores,
        "session_id": session_id,
    }

















