from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
from app.database import supabase
from app.engines.validation.algorithms import (
    calculate_behavioral_confidence,
    classify_student,
    calculate_compatibility
)

router = APIRouter()

class EvaluationPayload(BaseModel):
    student_id: str
    topic_id: str
    teacher_id: str

@router.post("/evaluate-initial-test")
async def evaluate_initial_test(payload: EvaluationPayload):
    try:
        # Step 1: Query raw telemetry and academic vectors from student_responses
        responses_res = supabase.table("student_responses")\
            .select("*")\
            .eq("student_id", payload.student_id)\
            .execute()
        
        responses = responses_res.data
        if not responses:
            raise HTTPException(status_code=404, detail="No assessment telemetry found for this student.")

        # Step 2: Calculate primary academic score
        correct_count = sum(1 for r in responses if r.get("is_correct") is True)
        academic_score = correct_count / len(responses)

        # Step 3: Pass telemetry matrices to the behavioral algorithm
        behavioral_confidence = calculate_behavioral_confidence(responses)

        # Step 4: Synthesize the final AI classification
        ai_tier = classify_student(academic_score, behavioral_confidence)

        # Step 5: Extract the qualitative teacher hypothesis for comparison
        obs_res = supabase.table("teacher_observations")\
            .select("observed_tier")\
            .eq("student_id", payload.student_id)\
            .eq("topic_id", payload.topic_id)\
            .eq("teacher_id", payload.teacher_id)\
            .execute()
        
        teacher_tier = "UNASSIGNED"
        if obs_res.data and len(obs_res.data) > 0:
            teacher_tier = obs_res.data[0].get("observed_tier", "UNASSIGNED")
        
        # Step 6: Compute Educator Compatibility Index
        compatibility_data = calculate_compatibility(teacher_tier, ai_tier)
        
        # Step 7: Database State Mutations (Decoupled State Mesh)
        # 7a. Mutate student profile with new AI Tier
        supabase.table("student_profiles").upsert(
            {
                "user_id": payload.student_id,
                "current_tier": ai_tier,
                "clickstream_confidence_index": behavioral_confidence
            }
        ).execute()
        
        # 7b. Mutate Teacher Compatibility Metrics (Point System)
        # Fetch existing scores to increment cumulatively (or use Supabase RPC in production)
        t_score_res = supabase.table("compatibility_scores").select("teacher_points, ai_points").eq("teacher_id", payload.teacher_id).execute()
        existing_tp = 0
        existing_aip = 0
        if t_score_res.data and len(t_score_res.data) > 0:
            existing_tp = t_score_res.data[0].get("teacher_points", 0)
            existing_aip = t_score_res.data[0].get("ai_points", 0)
            
        supabase.table("compatibility_scores").upsert(
            {
                "teacher_id": payload.teacher_id,
                "teacher_points": existing_tp + compatibility_data["teacher_points"],
                "ai_points": existing_aip + compatibility_data["ai_points"],
                "compatibility_index": None # Deprecated in favor of direct points
            }
        ).execute()

        # Step 8: Return computed payload mapping
        return {
            "status": "success",
            "academic_score": round(academic_score, 4),
            "behavioral_confidence": behavioral_confidence,
            "ai_classification": ai_tier,
            "compatibility": compatibility_data
        }

    except Exception as e:
        print(f"Matrix Validation Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))
