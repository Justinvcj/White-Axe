from fastapi import APIRouter
import time
from pydantic import BaseModel
from app.engines.predictive.algorithms import trace_knowledge_graph_risk

router = APIRouter()

# Mock DAG Curriculum Edges
MOCK_GRAPH_EDGES = [
    {"parent_topic_id": "Vector Addition", "child_topic_id": "Kinematics: 2D Motion"},
    {"parent_topic_id": "Kinematics: 2D Motion", "child_topic_id": "Projectile Motion"},
    {"parent_topic_id": "Projectile Motion", "child_topic_id": "Kinematics: Calculus Integration"}
]

class RiskPayload(BaseModel):
    class_id: str

@router.post("/calculate-risk-profile")
async def calculate_risk_profile(payload: RiskPayload):
    # Simulate some processing time to allow the UI to show the "Analyzing DAG..." animation
    time.sleep(2)
    
    # In a real app, we would query the `classes` and `enrollments` table, 
    # then check each student's `teacher_observations` for C3 gaps.
    # For this MVP demo, we will simulate 2 students with C3 gaps.
    
    demo_students = [
        {"id": "s1", "name": "Caleb Foster", "class": "AP Physics C", "gaps": ["Vector Addition"]},
        {"id": "s2", "name": "Harrison Ford", "class": "AP Physics C", "gaps": ["Kinematics: 2D Motion"]}
    ]
    
    high_risk_students = []
    
    for student in demo_students:
        # Step 1: Trace the graph
        risk_vectors = trace_knowledge_graph_risk(
            student_id=student["id"],
            current_gaps=student["gaps"],
            graph_edges=MOCK_GRAPH_EDGES
        )
        
        # Step 2: Grab the most critical downstream failure prediction
        if risk_vectors and len(risk_vectors) > 0:
            top_risk = risk_vectors[0]
            high_risk_students.append({
                "name": student["name"],
                "class": student["class"],
                "riskScore": top_risk["failure_probability_percentage"],
                "primaryGap": top_risk["target_topic_id"]
            })
            
    return {
        "status": "success",
        "data": {
            "globalRisk": "14.2%",
            "riskTrend": "-2.4%",
            "criticalTrajectories": len(high_risk_students),
            "hypothesisAccuracy": "92%",
            "highRiskStudents": high_risk_students
        }
    }
