from fastapi import APIRouter
from pydantic import BaseModel
from .generator import generate_personalized_quiz

router = APIRouter()

class QuizGenerationRequest(BaseModel):
    topic: str
    tier: str
    interest: str
    count: int = 3

@router.post("/generate-quiz")
def generate_quiz(req: QuizGenerationRequest):
    questions = generate_personalized_quiz(
        topic=req.topic,
        tier=req.tier,
        interest=req.interest,
        count=req.count
    )
    return {"status": "success", "data": questions}
