import requests
import json
import os
import uuid

OLLAMA_URL = os.getenv("OLLAMA_URL", "http://localhost:11434")

def generate_personalized_quiz(topic: str, tier: str, interest: str, count: int = 3) -> list:
    prompt = f"""
    You are an expert AI tutor. You are creating a {count}-question multiple choice quiz on the topic of "{topic}".
    The student's current cognitive tier is {tier} (C1 = Advanced, C2 = Proficient, C3 = Struggling). Adjust the difficulty appropriately.
    The student's personal interest is "{interest}". You MUST weave this interest into the scenario of every question to maximize engagement.
    
    You MUST output valid JSON ONLY. No markdown, no conversational text. Use this exact schema:
    [
        {{
            "id": "q1",
            "content": "Question text incorporating {interest}...",
            "options": [
                {{"id": "A", "text": "Option A"}},
                {{"id": "B", "text": "Option B"}},
                {{"id": "C", "text": "Option C"}},
                {{"id": "D", "text": "Option D"}}
            ],
            "correct_answer": "B"
        }},
        ... (generate {count} questions)
    ]
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
        raw_json = response.json().get("response", "[]")
        questions = json.loads(raw_json)
        
        # Ensure unique IDs
        for q in questions:
            q["id"] = f"q-{uuid.uuid4().hex[:8]}"
            
        return questions
    except Exception as e:
        print(f"LLM Generation failed: {e}")
        # Deterministic Fallback if Ollama is down
        return [
            {
                "id": f"q-{uuid.uuid4().hex[:8]}",
                "content": f"While analyzing {interest} dynamics, how does the fundamental principle of {topic} apply when velocity is constant?",
                "options": [
                    {"id": "A", "text": "Acceleration is maximum"},
                    {"id": "B", "text": "Net force is zero"},
                    {"id": "C", "text": "Momentum decreases"},
                    {"id": "D", "text": "Mass increases"}
                ],
                "correct_answer": "B"
            },
            {
                "id": f"q-{uuid.uuid4().hex[:8]}",
                "content": f"If a player in {interest} applies a force over a specific time interval, which aspect of {topic} is directly altered?",
                "options": [
                    {"id": "A", "text": "Impulse"},
                    {"id": "B", "text": "Potential Energy"},
                    {"id": "C", "text": "Static Friction"},
                    {"id": "D", "text": "Terminal Velocity"}
                ],
                "correct_answer": "A"
            },
            {
                "id": f"q-{uuid.uuid4().hex[:8]}",
                "content": f"Considering the constraints of {topic}, if a structure related to {interest} undergoes uniform circular motion, where is the centripetal force directed?",
                "options": [
                    {"id": "A", "text": "Tangential to the path"},
                    {"id": "B", "text": "Outward from the center"},
                    {"id": "C", "text": "Inward toward the center"},
                    {"id": "D", "text": "Perpendicular to the plane"}
                ],
                "correct_answer": "C"
            }
        ]
