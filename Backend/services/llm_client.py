import logging
import os
from pathlib import Path
from typing import Optional
from dotenv import load_dotenv
from openai import OpenAI

__all__ = ["generate_with_gemini", "llm_call", "chat_completion"]

# Load .env from Backend directory
env_path = Path(__file__).parent.parent / ".env"
load_dotenv(dotenv_path=env_path)

logger = logging.getLogger(__name__)

_api_key = os.getenv("Openai_API_KEY")
if not _api_key:
    raise ValueError("Openai_API_KEY is required")

_client = OpenAI(
    api_key=_api_key,
    base_url="https://openrouter.ai/api/v1"
)

_MODEL_NAME = os.getenv("Openai_MODEL", "gpt-3.5-turbo")

_SYSTEM_PROMPT = """You are an AI tutor focused on improving student thinking and exam performance.

CORE BEHAVIOR:

* Do not agree blindly. Evaluate responses logically.
* Reinforce correct understanding clearly.
* Explain mistakes with reasoning (if applicable).
* Identify thinking patterns behind errors (not just topics).
* Keep output concise, actionable, and structured.

TASKS:

1. Evaluate performance
2. Identify strengths and weaknesses
3. Detect thinking pattern issues
4. Suggest better approach
5. Generate targeted, comprehensive study plan (monthly/weekly/daily with timings)
6. Recommend high-quality resources
7. Generate 2–3 targeted practice questions

OUTPUT FORMAT (STRICT JSON ONLY):

{
"score": number (0–100 scale),
"verdict": "Correct" | "Partially Correct" | "Incorrect",

"strengths": [
"max 2–3 short points"
],

"weaknesses": [
"max 2–3 specific weak areas"
],

"thinking_pattern": "1 concise insight about how the student is thinking",

"better_approach": [
"max 3 short actionable steps"
],

"questions": [
"2–3 targeted conceptual or application-based questions based on weak areas"
],

"study_plan": {
"duration": "duration of plan",
"monthly_goals": [
"max 15 goals"
],
"weekly_schedule": [
"max 15 schedules"
],
"daily_routine_with_timings": [
"max 15 routines with timings like '08:00 AM - 10:00 AM: ...'"
],
"update_strategy": "Plan will be updated dynamically through weekly tests."
},

"resources": {
"videos": [
"max 2 high-quality, trusted sources (e.g., Khan Academy, Physics Wallah, Unacademy)"
],
"reading": [
"max 1–2 trusted notes/articles"
],
"practice": [
"max 2 reliable platforms or question sources"
],
"paid": [
"max 1 optional premium resource (only if valuable)"
]
}
}

CONTEXT:

* Exam: {exam}
* Topic(s): {topics}
* Student Level: {level}
* Weak Areas: {weaknesses}

IMPORTANT RULES:

* Keep total output concise but ensure the study plan is comprehensive
* Do NOT exceed limits for any section
* Prioritize clarity and usefulness over quantity
* Ensure all suggestions are relevant to the exam level
* Questions must target weak concepts directly
* Resources must be real, trusted, and not obscure
* Everything should feel personalized, not generic

GOAL:
Act like a smart mentor who diagnoses problems, guides improvement, and gives focused next steps—not a generic study planner."""


def llm_call(prompt: str) -> Optional[str]:
    """Send a prompt to the LLM and return raw text output."""
    if not prompt:
        logger.warning("Empty prompt provided to LLM client.")
        return None

    try:
        response = _client.chat.completions.create(
            model=_MODEL_NAME,
            messages=[
                {"role": "system", "content": _SYSTEM_PROMPT},
                {"role": "user", "content": prompt}
            ],
            temperature=0.7,
            max_tokens=1500,
        )
        if not response or not response.choices:
            logger.error("OpenAI returned an empty response.")
            return None
        return response.choices[0].message.content
    except Exception:
        logger.exception("OpenAI error while generating content.")
        return None


def generate_with_gemini(prompt: str) -> Optional[str]:
    return llm_call(prompt)

def chat_completion(messages: list) -> Optional[str]:
    """Send a list of messages to the LLM for a conversational interaction."""
    if not messages:
        logger.warning("Empty messages provided to chat_completion.")
        return None

    try:
        response = _client.chat.completions.create(
            model=_MODEL_NAME,
            messages=messages,
            temperature=0.7,
            max_tokens=1500,
        )
        if not response or not response.choices:
            logger.error("OpenAI returned an empty response for chat.")
            return None
        return response.choices[0].message.content
    except Exception:
        logger.exception("OpenAI error while generating chat content.")
        return None