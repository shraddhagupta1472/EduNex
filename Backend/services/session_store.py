import uuid

# In-memory dictionary to store active test sessions
# Format: session_id -> {"score": int, "topic_scores": dict, "mistakes": list, "history": list}
sessions = {}

def create_session(score: float, topic_scores: dict, mistakes: list) -> str:
    session_id = str(uuid.uuid4())
    sessions[session_id] = {
        "score": score,
        "topic_scores": topic_scores,
        "mistakes": mistakes,
        "history": []
    }
    return session_id

def get_session(session_id: str):
    return sessions.get(session_id)
