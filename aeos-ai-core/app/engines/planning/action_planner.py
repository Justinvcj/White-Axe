import requests
import json
import os

OLLAMA_URL = os.getenv("OLLAMA_URL", "http://localhost:11434")

def generate_40_min_plan(topic: str, c1_count: int, c2_count: int, c3_count: int) -> dict:
    prompt = f"""
    You are an expert master teacher. You have exactly 40 minutes for your next class on {topic}.
    Your class has {c1_count} Advanced (C1) students, {c2_count} Proficient (C2) students, and {c3_count} Struggling (C3) students.
    Create a highly structured 40-minute lesson plan that differentiates instruction for these three groups.
    
    You MUST output valid JSON ONLY. No markdown, no conversational text. Use this exact schema:
    {{
        "total_minutes": 40,
        "topic": "{topic}",
        "sections": [
            {{
                "time_minutes": 10,
                "title": "Whole Class Review",
                "description": "...",
                "c1_activity": "...",
                "c2_activity": "...",
                "c3_activity": "..."
            }},
            ...
        ],
        "micro_interventions": [
            "Actionable 1-sentence tip for C3 students",
            "Actionable 1-sentence tip for pushing C1 students"
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
        return json.loads(raw_json)
    except Exception as e:
        print(f"LLM Generation failed: {e}")
        # Deterministic Fallback if Ollama is down (vital for demo resilience)
        return {
            "total_minutes": 40,
            "topic": topic,
            "sections": [
                {
                    "time_minutes": 10,
                    "title": "Whole Class Concept Introduction",
                    "description": f"Introduce the core principles of {topic} using a real-world visual analogy.",
                    "c1_activity": "Listen and predict outcomes.",
                    "c2_activity": "Listen and take guided notes.",
                    "c3_activity": "Listen with pre-filled vocabulary sheet."
                },
                {
                    "time_minutes": 20,
                    "title": "Differentiated Group Practice",
                    "description": "Split the class into tier-based groups.",
                    "c1_activity": "Independent complex problem-solving and peer-teaching C2s.",
                    "c2_activity": "Collaborative practice with C1 peers.",
                    "c3_activity": "Direct small-group instruction with the teacher focusing on foundational gaps."
                },
                {
                    "time_minutes": 10,
                    "title": "Exit Ticket & Wrap-Up",
                    "description": "Assess understanding before the bell rings.",
                    "c1_activity": "Complete challenge question.",
                    "c2_activity": "Complete standard exit ticket.",
                    "c3_activity": "Complete scaffolded exit ticket."
                }
            ],
            "micro_interventions": [
                "Pair C3 students with C1 students for 5 minutes during the group practice.",
                "Check on C3 students immediately after instructions are given to ensure clarity."
            ]
        }
