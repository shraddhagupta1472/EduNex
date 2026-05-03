import json
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from Backend.services.session_store import get_session
from Backend.services.llm_client import chat_completion

router = APIRouter()

class ChatRequest(BaseModel):
    message: str

def detect_intent(message: str) -> str:
    msg_lower = message.lower()
    if "why" in msg_lower:
        return "why"
    elif "explain" in msg_lower:
        return "explain"
    elif "improve" in msg_lower or "better" in msg_lower:
        return "improve"
    return "general"

@router.post("/chat/{session_id}")
async def chat_with_session(session_id: str, request: ChatRequest):
    session = get_session(session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")

    user_message = request.message
    intent = detect_intent(user_message)

    history = session.get("history", [])

    if not history:
        # Construct system prompt for the first message
        score = session.get("score")
        topic_scores = session.get("topic_scores")
        mistakes = session.get("mistakes")

        system_prompt = f"""You are an AI tutor helping a student understand their test performance.
The student scored {score}%.
Here are their topic-wise scores: {json.dumps(topic_scores)}.
Here are the specific mistakes they made on the test: {json.dumps(mistakes)}.

Your goal is to provide a personalized, encouraging response directly addressing their mistakes.
The student's current intent seems to be: '{intent}'.
Keep your response conversational, concise, and helpful. Do not just give generic answers. 
If they ask why they got something wrong, explain the concept behind the correct answer."""

        history.append({"role": "system", "content": system_prompt})

    # Append user message
    history.append({"role": "user", "content": user_message})

    # Call LLM
    ai_response = chat_completion(history)

    if not ai_response:
        # If LLM fails, rollback user message and return error
        history.pop()
        raise HTTPException(status_code=500, detail="Failed to generate response")

    # Append AI response to history
    history.append({"role": "assistant", "content": ai_response})

    # Update session history
    session["history"] = history

    return {"response": ai_response, "intent": intent}
