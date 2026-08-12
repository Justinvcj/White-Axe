from fastapi import APIRouter
from pydantic import BaseModel
from .action_planner import generate_40_min_plan

router = APIRouter()

class LessonPlanRequest(BaseModel):
    topic: str
    c1_count: int
    c2_count: int
    c3_count: int

@router.post("/generate")
def generate_lesson_plan(req: LessonPlanRequest):
    plan = generate_40_min_plan(
        topic=req.topic,
        c1_count=req.c1_count,
        c2_count=req.c2_count,
        c3_count=req.c3_count
    )
    return {"status": "success", "data": plan}
