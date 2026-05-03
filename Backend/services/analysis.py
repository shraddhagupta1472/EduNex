import json
import logging
from Backend.services.llm_client import generate_with_gemini

logger = logging.getLogger(__name__)

def ai_analyze(topic_scores):
    """Analyze topic scores using free Gemini API."""
    if not topic_scores:
        return fallback_analysis(topic_scores)
    
    prompt = f"""
You are an academic performance analyzer for competitive exams (JEE/GATE).

Given the following topic scores: {topic_scores}

Classify each topic into one of the categories: weak, average, or strong based on the scores.
- Weak: score < 50
- Average: 50 <= score <= 75
- Strong: score > 75

Return ONLY valid JSON in the format:
{{"weak": [], "average": [], "strong": []}}

"""
    response = generate_with_gemini(prompt)
    
    if response:
        try:
            result = json.loads(response)
            if all(key in result for key in ["weak", "average", "strong"]):
                return result
        except json.JSONDecodeError:
            logger.warning("Failed to parse Gemini response, using fallback analysis")
    
    return fallback_analysis(topic_scores)

def fallback_analysis(topic_scores):
    """Classify topics by score into weak, average, and strong categories."""
    if not topic_scores:
        return {"weak": [], "average": [], "strong": []}
    
    results = {
        "weak": [],
        "average": [],
        "strong": [],
    }

    for topic, score in topic_scores.items():
        if score < 50:
            results["weak"].append(topic)
        elif 50 <= score <= 75:
            results["average"].append(topic)
        else:
            results["strong"].append(topic)

    return results
