from fastapi import APIRouter
from pydantic import BaseModel, field_validator

from Backend.services.ai_plan import generate_plan

router = APIRouter()


class GeneratePlanRequest(BaseModel):
    analysis: dict = {}
    exam: str | None = "JEE/GATE"
    topics: str | None = ""
    level: str | None = "intermediate"
    duration: str | None = "6 months"

    @field_validator("analysis", mode="before")
    def validate_analysis(cls, v):
        if not isinstance(v, dict):
            raise ValueError("analysis must be a dictionary")
        return v


@router.post("/generate-plan")
async def generate_plan_endpoint(request: GeneratePlanRequest):
    if not request.analysis:
        return {"error": "Invalid input"}

    try:
        study_plan = generate_plan(
            analysis=request.analysis,
            exam=request.exam or "JEE/GATE",
            topics=request.topics or "",
            level=request.level or "intermediate",
            duration=request.duration or "6 months",
        )
    except Exception:
        return {"error": "Invalid input"}

    return study_plan
