from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.engines.communication.generator import generate_parent_insight_report

router = APIRouter()

class ParentReportPayload(BaseModel):
    student_name: str
    topic: str
    interest: str
    performance_status: str

@router.post("/generate-parent-report")
async def generate_parent_report(payload: ParentReportPayload):
    try:
        report = generate_parent_insight_report(
            student_name=payload.student_name,
            topic=payload.topic,
            interest=payload.interest,
            performance_status=payload.performance_status
        )
        
        return {
            "status": "success",
            "data": {
                "report": report
            }
        }
    except Exception as e:
        print(f"Communication Engine Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))
