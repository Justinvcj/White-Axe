from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
from app.database import supabase
from app.engines.adaptive.algorithms import determine_next_difficulty, recalculate_overall_mastery

router = APIRouter()

class AdaptivePayload(BaseModel):
    student_id: str
    topic_id: str
    last_response_id: Optional[str] = None
    is_initial_test: bool = False

@router.post("/next-question")
async def next_question(payload: AdaptivePayload):
    try:
        # Step 1: Query historical responses for the active assessment
        responses_res = supabase.table("student_responses")\
            .select("is_correct, questions(complexity_level)")\
            .eq("student_id", payload.student_id)\
            .execute()
        
        history = responses_res.data or []
        
        # Determine current stats
        consecutive_correct = 0
        consecutive_incorrect = 0
        last_answer_correct = False
        current_difficulty = "EASY"
        
        # Rigid integer-to-string complexity mapping matching DB schema
        level_map = {1: "EASY", 2: "MEDIUM", 3: "HARD", 4: "CHALLENGE"}
        reverse_map = {"EASY": 1, "MEDIUM": 2, "HARD": 3, "CHALLENGE": 4}

        if history:
            # Calculate streak vectors chronologically
            for r in history:
                is_correct = bool(r.get("is_correct", False))
                if is_correct:
                    consecutive_correct += 1
                    consecutive_incorrect = 0
                else:
                    consecutive_incorrect += 1
                    consecutive_correct = 0
                
            last_record = history[-1]
            last_answer_correct = bool(last_record.get("is_correct", False))
            
            # Safely parse nested foreign key json payload from Supabase
            q_data = last_record.get("questions")
            if not isinstance(q_data, dict):
                q_data = {}
            c_level = q_data.get("complexity_level", 1)
            current_difficulty = level_map.get(c_level, "EASY")

        # Step 2: Evaluate Adaptive IRT algorithm
        next_difficulty_str = determine_next_difficulty(
            current_difficulty=current_difficulty,
            last_answer_correct=last_answer_correct,
            consecutive_correct=consecutive_correct,
            consecutive_incorrect=consecutive_incorrect
        )
        
        target_complexity = reverse_map.get(next_difficulty_str, 1)

        # UNBIASED BASELINE OVERRIDE:
        # If this is the initial test, we cycle through Easy (1), Medium (2), Hard (3)
        # based on the question index to ensure a fair, uniform testing baseline.
        if payload.is_initial_test:
            # cycle 1, 2, 3 based on length of history
            target_complexity = (len(history) % 3) + 1

        # Step 3: Trigger the Fully Generative AI Engine to create the question on the fly!
        from app.engines.personalization.routes import generate_generative_assessment_logic
        question_data = await generate_generative_assessment_logic(payload.student_id, payload.topic_id, target_complexity)
        
        # Step 4: Finalize Module if Assessment is Complete (Max 5 questions for demo)
        if len(history) >= 5:
            calc_responses = []
            for r in history:
                q = r.get("questions")
                if not isinstance(q, dict):
                    q = {}
                calc_responses.append({
                    "is_correct": bool(r.get("is_correct", False)),
                    "complexity_level_str": level_map.get(q.get("complexity_level", 1), "EASY")
                })
            
            mastery_score = recalculate_overall_mastery(calc_responses)
            
            # Write final calculated mastery back to the structural decoupled mesh
            try:
                supabase.table("student_profiles").update(
                    {"overall_mastery_score": mastery_score}
                ).eq("user_id", payload.student_id).execute()
            except Exception as update_err:
                print(f"Warning: AAE Failed to update overall_mastery_score. {update_err}")

            return {
                "status": "completed",
                "mastery_score": mastery_score
            }

        # Step 5: Route question payload to Next.js
        return {
            "status": "success",
            "difficulty": next_difficulty_str,
            "question": question_data
        }

    except Exception as e:
        print(f"AAE Engine Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))
