from fastapi import APIRouter
from Backend.services.analysis import ai_analyze
import logging

logger = logging.getLogger(__name__)

router = APIRouter()

@router.post("/analyze")
async def analyze_route(data: dict):
    topic_scores = data.get("topic_scores")
    if not topic_scores:
        return {"success": False, "error": "topic_scores is required"}

    try:
        result = ai_analyze(topic_scores)
        if result:
            return {"success": True, "result": result}
        else:
            return {"success": False, "error": "Failed to analyze topic scores"}
    except Exception as e:
        logger.error(f"Error in analyze endpoint: {e}")
        return {"success": False, "error": f"Analysis failed: {str(e)}"}

