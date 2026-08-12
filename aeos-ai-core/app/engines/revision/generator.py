import requests
import json
import os
import uuid

OLLAMA_URL = os.getenv("OLLAMA_URL", "http://localhost:11434")

# For the MVP demo, we simulate a list of weak topics 
# since we don't have months of telemetry data
MOCK_WEAK_TOPICS = [
    "Newton's First Law - Inertia",
    "Vector Addition",
    "Kinematic Equations - Free Fall"
]

def generate_spaced_repetition_quiz(tier: str, interest: str) -> dict:
    topics_str = ", ".join(MOCK_WEAK_TOPICS)
    
    prompt = f"""
    You are an expert AI tutor generating a daily spaced-repetition practice quiz for a student.
    The student's historical telemetry shows weakness in these 3 topics: {topics_str}.
    The student's current cognitive tier is {tier} (C1 = Advanced, C2 = Proficient, C3 = Struggling). Adjust the difficulty appropriately.
    The student's personal interest is "{interest}". You MUST weave this interest into the scenario of every question to maximize engagement.
    
    You MUST output valid JSON ONLY. No markdown, no conversational text. Use this exact schema:
    {{
        "topics": {json.dumps(MOCK_WEAK_TOPICS)},
        "questions": [
            {{
                "id": "q1",
                "topic": "Newton's First Law - Inertia",
                "q": "Question text incorporating {interest}...",
                "options": ["Option A", "Option B", "Option C", "Option D"],
                "answerIndex": 1
            }},
            ... (generate exactly 1 question for each of the 3 topics)
        ]
    }}
    """
    
    try:
        response = requests.post(
            f"{OLLAMA_URL}/api/generate",
            json={
                "model": "llama3",
                "prompt": prompt,
                "stream": False,
                "format": "json"
            },
            timeout=30
        )
        response.raise_for_status()
        raw_json = response.json().get("response", "{}")
        data = json.loads(raw_json)
        
        # Ensure unique IDs
        if "questions" in data:
            for q in data["questions"]:
                q["id"] = f"rev-{uuid.uuid4().hex[:8]}"
                
        return data
    except Exception as e:
        print(f"LLM Generation failed: {e}")
        # Deterministic Fallback if Ollama is down
        return {
            "topics": MOCK_WEAK_TOPICS,
            "questions": [
                {
                    "id": f"rev-{uuid.uuid4().hex[:8]}",
                    "topic": "Newton's First Law - Inertia",
                    "q": f"If a {interest} collectible is sliding across frictionless ice, what force is needed to keep it moving at a constant velocity?",
                    "options": ["A constant forward force", "No force is needed", "A force equal to its mass", "A force equal to its velocity"],
                    "answerIndex": 1
                },
                {
                    "id": f"rev-{uuid.uuid4().hex[:8]}",
                    "topic": "Vector Addition",
                    "q": f"A {interest} fanatic walks 3m East to a display, then 4m North. What is the magnitude of their resultant displacement?",
                    "options": ["1 m", "5 m", "7 m", "12 m"],
                    "answerIndex": 1
                },
                {
                    "id": f"rev-{uuid.uuid4().hex[:8]}",
                    "topic": "Kinematic Equations - Free Fall",
                    "q": f"A heavy {interest} manual is dropped from rest. How far does it fall in exactly 2 seconds? (use g = 10 m/s²)",
                    "options": ["10 m", "20 m", "30 m", "40 m"],
                    "answerIndex": 1
                }
            ]
        }
