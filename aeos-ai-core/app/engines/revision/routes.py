from fastapi import APIRouter, HTTPException
from app.database import supabase
from app.engines.predictive.algorithms import predict_knowledge_decay
import datetime

router = APIRouter()

@router.get("/generate-daily-queue/{student_id}")
async def generate_daily_queue(student_id: str):
    try:
        # Step 1: Parse all previously mastered topics corresponding to this user profile
        # For this execution phase, we mock the retrieval of historical completion markers,
        # simulating data extracted from `student_responses` or `student_profiles` state tracking.
        
        current_time = datetime.datetime.now()
        
        mock_mastered_topics = [
            {
                "topic_id": "0000-0000-0001", 
                "name": "Newton's Second Law", 
                "last_mastery_score": 92.0, 
                "last_tested_date": (current_time - datetime.timedelta(days=14)).isoformat()
            },
            {
                "topic_id": "0000-0000-0002", 
                "name": "Vector Addition", 
                "last_mastery_score": 85.0, 
                "last_tested_date": (current_time - datetime.timedelta(days=3)).isoformat()
            },
            {
                "topic_id": "0000-0000-0003", 
                "name": "Kinetic Energy", 
                "last_mastery_score": 100.0, 
                "last_tested_date": (current_time - datetime.timedelta(days=30)).isoformat()
            }
        ]
        
        priority_queue = []
        
        # Step 2: Calculate localized real-time degradation metrics using Ebbinghaus formulas
        for t in mock_mastered_topics:
            tested_date = datetime.datetime.fromisoformat(t["last_tested_date"])
            days_elapsed = (current_time - tested_date).days
            
            # Utilizing 14.0 days as a standard initial neural stability factor
            current_retention = predict_knowledge_decay(
                last_mastery_score=t["last_mastery_score"],
                days_since_test=days_elapsed,
                halflife_days=14.0 
            )
            
            # Step 3: Trigger priority sorting flag if retention maps below critical 80% threshold
            if current_retention < 80.0:
                priority_queue.append({
                    "topic_id": t["topic_id"],
                    "topic_name": t["name"],
                    "retention_score": current_retention,
                    "days_since_test": days_elapsed
                })
                
        # Sort queue array strictly prioritizing the lowest conceptual retention mapping first
        priority_queue.sort(key=lambda x: x["retention_score"])

        return {
            "status": "success",
            "student_id": student_id,
            "queue": priority_queue
        }

    except Exception as e:
        print(f"Revision Generator Engine Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))
