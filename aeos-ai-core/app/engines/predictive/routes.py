from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.database import supabase
from app.engines.predictive.algorithms import trace_knowledge_graph_risk

router = APIRouter()

class RiskPayload(BaseModel):
    student_id: str

@router.post("/calculate-student-risk-profile")
async def calculate_student_risk_profile(payload: RiskPayload):
    try:
        # Step 1: Query historical DB mapping to isolate critical conceptual failures (C3 Tier)
        obs_res = supabase.table("teacher_observations")\
            .select("topic_id")\
            .eq("student_id", payload.student_id)\
            .eq("observed_tier", "C3")\
            .execute()
            
        c3_gaps = [obs["topic_id"] for obs in obs_res.data] if obs_res.data else []
        
        # Step 2: Retrieve system edge arrays mapping the structural curriculum dependencies
        edges_res = supabase.table("knowledge_graph_edges").select("*").execute()
        graph_edges = edges_res.data or []
        
        # Step 3: Invoke the algorithmic engine to traverse the DAG network
        risk_vectors = trace_knowledge_graph_risk(
            student_id=payload.student_id,
            current_gaps=c3_gaps,
            graph_edges=graph_edges
        )
        
        # Step 4: System Event Handler for High-Risk Alerts
        if risk_vectors:
            try:
                # Scaffolding logic: in a real production environment, this mutation loops 
                # through risk_vectors filtering for >75.0% and pushing alerts to a specific table.
                for r in risk_vectors:
                    if r["failure_probability_percentage"] > 75.0:
                        # Emulating the proactive warning push for admin dashboard rendering
                        print(f"[White-Axe SECURITY] HIGH STRUCTURAL RISK ISOLATED: Topic {r['target_topic_id']} at {r['failure_probability_percentage']}% future failure trajectory.")
            except Exception as event_err:
                # Fatal exception blocks are prevented during alert dispatch failures
                print(f"Non-fatal error logging internal system notification: {event_err}")

        # Return: Serialized JSON output mapping identified dragging gaps and calculated future failures
        return {
            "status": "success",
            "student_id": payload.student_id,
            "identified_gaps": c3_gaps,
            "structural_risk_vectors": risk_vectors
        }

    except Exception as e:
        print(f"Predictive Analytics Engine Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))
