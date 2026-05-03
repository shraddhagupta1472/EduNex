import json
import logging
import re
from typing import Any, Dict, List, Optional

from Backend.services.llm_client import llm_call

logger = logging.getLogger(__name__)

MAX_WORDS = 800
MAX_SECTION_BULLETS = 5
MAX_STUDY_PLAN = 15

TRUSTED_RESOURCES = [
    "Khan Academy",
    "NPTEL",
    "Unacademy",
    "Physics Wallah",
    "Brilliant",
    "Vedantu",
    "Toppr",
    "Aakash",
    "BYJU'S",
    "Coursera",
    "edX",
]

RESPONSE_SCHEMA = {
    "score": int,
    "verdict": str,
    "strengths": list,
    "weaknesses": list,
    "thinking_pattern": str,
    "better_approach": list,
    "questions": list,
    "study_plan": dict,
    "resources": dict,
}


def build_prompt(analysis: Dict[str, Any], exam: str, topics: str, level: str, duration: str = "6 months") -> str:
    weak = ", ".join(analysis.get("weak", [])) or "none"
    average = ", ".join(analysis.get("average", [])) or "none"
    strong = ", ".join(analysis.get("strong", [])) or "none"

    return f"""You are an AI tutor for competitive exam preparation.

Use the following input to generate a concise JSON tutor response.

Exam: {exam}
Topics: {topics}
Student Level: {level}
Performance:
- weak topics: {weak}
- average topics: {average}
- strong topics: {strong}

Task:
1. Evaluate the student's performance.
2. Identify strengths and weaknesses.
3. Explain mistakes clearly if applicable.
4. Suggest a better problem-solving approach.
5. Create a comprehensive study plan for the given duration ({duration}). Break it down into monthly goals, weekly schedule, and a daily routine with specific timings. Explicitly state that the plan will be updated dynamically through weekly tests.
6. Recommend high-quality resources.

Output schema (return valid JSON only):
{{
  "score": number,
  "verdict": "Correct" | "Partially Correct" | "Incorrect",
  "strengths": [string],
  "weaknesses": [string],
  "thinking_pattern": string,
  "better_approach": [string],
  "questions": [string],
  "study_plan": {{
    "duration": string,
    "monthly_goals": [string],
    "weekly_schedule": [string],
    "daily_routine_with_timings": [string],
    "update_strategy": string
  }},
  "resources": {{
    "videos": [string],
    "reading": [string],
    "practice": [string],
    "paid": [string]
  }}
}}

Rules:
- Output valid JSON only, without extra text.
- Keep the full response under {MAX_WORDS} words.
- Do NOT include markdown grids. You can use timings in daily routines.
- Keep lists to reasonable lengths (at most {MAX_SECTION_BULLETS} for standard lists, up to {MAX_STUDY_PLAN} for study plan items).
- Use concise, action-oriented phrasing.
- Prefer trusted education platforms and resources.
- If a section cannot be generated, return an empty list or empty string for that field.
"""


def _clean_text(raw: str) -> str:
    text = re.sub(r"```[\s\S]*?```", "", raw)
    text = re.sub(r"^\|.*\n", "", text, flags=re.MULTILINE)
    text = re.sub(r"\n{2,}", "\n", text)
    text = re.sub(r"\*\*|__|~~|```", "", text)
    return text.strip()


def _extract_json(raw: str) -> Optional[Dict[str, Any]]:
    candidate = raw.strip()
    try:
        return json.loads(candidate)
    except json.JSONDecodeError:
        pass

    match = re.search(r"\{[\s\S]*\}", candidate)
    if not match:
        return None

    json_text = match.group(0)
    try:
        return json.loads(json_text)
    except json.JSONDecodeError:
        return None


def _trim_string(value: str, max_words: int = 25) -> str:
    words = re.split(r"\s+", value.strip())
    if len(words) <= max_words:
        return value.strip()
    return " ".join(words[:max_words]).rstrip(".,;:")


def _normalize_list(items: Any, max_items: int) -> List[str]:
    if isinstance(items, list):
        cleaned = []
        for item in items:
            if not isinstance(item, str):
                continue
            text = _trim_string(item)
            if text and text not in cleaned:
                cleaned.append(text)
            if len(cleaned) >= max_items:
                break
        return cleaned

    if isinstance(items, str):
        lines = [line.strip() for line in re.split(r"\n|\r", items) if line.strip()]
        bullets = []
        for line in lines:
            if re.match(r"^[\-*+]\s+", line):
                bullets.append(re.sub(r"^[\-*+]\s+", "", line))
            elif re.match(r"^\d+\.\s+", line):
                bullets.append(re.sub(r"^\d+\.\s+", "", line))
            else:
                bullets.append(line)
            if len(bullets) >= max_items:
                break
        return [_trim_string(item) for item in bullets]

    return []


def _validate_response(data: Any) -> bool:
    if not isinstance(data, dict):
        return False
    for key, expected in RESPONSE_SCHEMA.items():
        if key not in data:
            return False
        if expected is int and not isinstance(data[key], int):
            return False
        if expected is str and not isinstance(data[key], str):
            return False
        if expected is list and not isinstance(data[key], list):
            return False
        if key == "resources" and not isinstance(data[key], dict):
            return False
    return True


def _post_process(data: Dict[str, Any]) -> Dict[str, Any]:
    processed = {
        "score": data.get("score", 0) if isinstance(data.get("score", 0), int) else 0,
        "verdict": _trim_string(str(data.get("verdict", "Partially Correct")), 10),
        "strengths": _normalize_list(data.get("strengths", []), MAX_SECTION_BULLETS),
        "weaknesses": _normalize_list(data.get("weaknesses", []), MAX_SECTION_BULLETS),
        "thinking_pattern": _trim_string(str(data.get("thinking_pattern", "")), 15),
        "better_approach": _normalize_list(data.get("better_approach", []), MAX_SECTION_BULLETS),
        "questions": _normalize_list(data.get("questions", []), MAX_SECTION_BULLETS),
        "study_plan": {
            "duration": _trim_string(str(data.get("study_plan", {}).get("duration", "Not specified")), 15),
            "monthly_goals": _normalize_list(data.get("study_plan", {}).get("monthly_goals", []), MAX_STUDY_PLAN),
            "weekly_schedule": _normalize_list(data.get("study_plan", {}).get("weekly_schedule", []), MAX_STUDY_PLAN),
            "daily_routine_with_timings": _normalize_list(data.get("study_plan", {}).get("daily_routine_with_timings", []), MAX_STUDY_PLAN),
            "update_strategy": _trim_string(str(data.get("study_plan", {}).get("update_strategy", "Plan will be updated through weekly tests.")), 50),
        } if isinstance(data.get("study_plan"), dict) else build_fallback_response()["study_plan"],
        "resources": {
            "videos": _normalize_list(data.get("resources", {}).get("videos", []), MAX_SECTION_BULLETS),
            "reading": _normalize_list(data.get("resources", {}).get("reading", []), MAX_SECTION_BULLETS),
            "practice": _normalize_list(data.get("resources", {}).get("practice", []), MAX_SECTION_BULLETS),
            "paid": _normalize_list(data.get("resources", {}).get("paid", []), MAX_SECTION_BULLETS),
        },
    }
    return processed


def build_fallback_response() -> Dict[str, Any]:
    logger.warning("Using minimal fallback response after invalid LLM output.")
    return {
        "score": 0,
        "verdict": "Partially Correct",
        "strengths": [],
        "weaknesses": [],
        "thinking_pattern": "Unable to infer",
        "better_approach": [],
        "questions": [],
        "study_plan": {
            "duration": "Not specified",
            "monthly_goals": [],
            "weekly_schedule": [],
            "daily_routine_with_timings": [],
            "update_strategy": "Plan will be updated dynamically through weekly tests."
        },
        "resources": {"videos": [], "reading": [], "practice": [], "paid": []},
    }


def process_llm_response(raw_text: Optional[str], prompt: str, max_retries: int = 2) -> Dict[str, Any]:
    attempts = 0
    while attempts < max_retries:
        attempts += 1
        if raw_text is None:
            raw_text = llm_call(prompt)
        if not raw_text:
            raw_text = llm_call(prompt)
            continue

        cleaned = _clean_text(raw_text)
        parsed = _extract_json(cleaned)
        if parsed and _validate_response(parsed):
            return _post_process(parsed)

        raw_text = llm_call(prompt)

    return build_fallback_response()
