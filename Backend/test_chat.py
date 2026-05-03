from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def run_test():
    print("Submitting test...")
    # Assume 1 is wrong (answer 0, we give 1), 2 is correct (answer 1, we give 1)
    response = client.post("/submit-test", json={
        "answers": {
            "1": 1,
            "2": 1,
            "3": 0,
            "4": 0,
            "5": 2
        }
    })
    
    data = response.json()
    print("Submit Test Response:", data)
    
    session_id = data.get("session_id")
    if not session_id:
        print("Test failed: No session_id returned")
        return

    print(f"\nStarting chat for session {session_id}...")
    chat_response = client.post(f"/chat/{session_id}", json={
        "message": "Why did I get question 1 wrong? I thought it was 2x + 3."
    })
    
    print("Chat Response:", chat_response.json())

if __name__ == "__main__":
    run_test()
