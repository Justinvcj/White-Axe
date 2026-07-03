from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.database import supabase
from app.engines.personalization.prompts import contextual_assessment_prompt
from langchain_community.llms import Ollama
import json
import uuid
import os

router = APIRouter()

class ContextualPayload(BaseModel):
    student_id: str
    topic_id: str
    complexity_level: int = 2

async def generate_generative_assessment_logic(student_id: str, topic_id: str, target_complexity: int) -> dict:
    # Step 1: Query Supabase student_profiles to retrieve interests
    profile_res = supabase.table("student_profiles").select("current_interest").eq("user_id", student_id).execute()
    interests = "General Science"
    if profile_res.data and len(profile_res.data) > 0:
        interests = profile_res.data[0].get("current_interest") or "General Science"

    # Step 2: Query Supabase topics for strict constraints
    topic_res = supabase.table("topics").select("name, syllabus_constraints").eq("id", topic_id).execute()
    if not topic_res.data:
        raise HTTPException(status_code=404, detail="Topic not found.")
        
    topic_name = topic_res.data[0]["name"]
    syllabus_constraints = topic_res.data[0].get("syllabus_constraints", "No constraints.")

    # Step 3: Initialize Ollama (Local open-weight LLM on JarvisLabs)
    jarvis_url = os.environ.get("JARVISLABS_API_URL", "http://localhost:11434")
    llm = Ollama(model="llama3", temperature=0.2, base_url=jarvis_url)

    # Step 4: Execute LangChain LCEL for Generative AI
    chain = contextual_assessment_prompt | llm
    response_text = chain.invoke({
        "topic_name": topic_name,
        "complexity_level": target_complexity,
        "syllabus_constraints": syllabus_constraints,
        "student_interests": interests
    })

    # Step 5: Parse the JSON response securely
    try:
        clean_text = response_text.strip()
        if clean_text.startswith("```json"):
            clean_text = clean_text.removeprefix("```json").removesuffix("```").strip()
        generated_data = json.loads(clean_text)
    except json.JSONDecodeError:
        print("GAE Engine Hallucinated invalid JSON:", response_text)
        raise HTTPException(status_code=500, detail="LLM generated invalid JSON structure.")

    # Step 6: INSERT into Supabase `questions` table for telemetry tracking
    new_question_id = str(uuid.uuid4())
    serialized_content = json.dumps(generated_data)
    
    supabase.table("questions").insert({
        "id": new_question_id,
        "assessment_id": "00000000-0000-0000-0000-000000000000",
        "content": serialized_content,
        "complexity_level": target_complexity
    }).execute()

    return {
        "id": new_question_id,
        "complexity_level": target_complexity,
        "content": serialized_content
    }

@router.post("/generate-contextual-assessment")
async def generate_contextual_assessment(payload: ContextualPayload):
    try:
        result = await generate_generative_assessment_logic(payload.student_id, payload.topic_id, payload.complexity_level)
        return {
            "status": "success", 
            "generated_question_id": result["id"],
            "debug_output": json.loads(result["content"])
        }
    except Exception as e:
        print(f"GAE Engine Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))
