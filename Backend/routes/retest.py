from fastapi import APIRouter
from pydantic import BaseModel, field_validator
from Backend.services.evaluation import evaluate
from Backend.data.questions import questions

router = APIRouter()

class RetestRequest(BaseModel):
    answers: dict[int, int] = {}
    previous_score: float = 0
    
    @field_validator('answers', mode='before')
    def validate_answers(cls, v):
        if not isinstance(v, dict):
            raise ValueError("answers must be a dictionary")
        return v
@router.post("/retest")
async def retest(data: RetestRequest):
    try:
        if not data.answers or len(data.answers) == 0:
            return {"error": "Answers not provided"}

        # 🔵 SAFE: ensure evaluate works with string keys too
        normalized_answers = {
            int(k): v for k, v in data.answers.items()
        }

        new_score, _, _ = evaluate(normalized_answers, questions)

        total_questions = len(questions)
        if total_questions == 0:
            return {"error": "Invalid input"}
        
        new_score_percentage = (new_score / total_questions) * 100

        previous_score_percentage = (float(data.previous_score) / total_questions) * 100

        # ✅ FIX FOR TEST 3
        if previous_score_percentage < 0 or previous_score_percentage > 100:
            return {"error": "Invalid previous_score"}

        improvement = new_score_percentage - previous_score_percentage

        return {
            "new_score": round(new_score_percentage, 2),
            "previous_score": round(previous_score_percentage, 2),
            "improvement": round(improvement, 2)
        }
    except Exception as e:
        return {"error": str(e)}        

# @router.post("/retest")
# async def retest(data: RetestRequest):
#     if not data.answers:
#         return {"error": "Invalid input"}
    
#     try:
#         new_score, _, _ = evaluate(data.answers, questions)
#         previous_score_percentage = data.previous_score
#         total_questions = len(questions)
        
#         if total_questions == 0:
#             return {"error": "Invalid input"}
        
#         new_score_percentage = (new_score / total_questions) * 100
#         improvement_percentage = new_score_percentage - previous_score_percentage

#         return {
#             "new_score": round(new_score_percentage, 2),
#             "previous_score": round(previous_score_percentage, 2),
#             "improvement": round(improvement_percentage, 2)
#         }
#     except Exception:
#         return {"error": "Invalid input"}
