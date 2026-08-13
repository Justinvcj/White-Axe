from fastapi import APIRouter, HTTPException, UploadFile, File
from app.engines.curriculum.ingestion import extract_text_from_pdf, generate_curriculum_tree

router = APIRouter()

@router.post("/ingest")
async def ingest_syllabus(file: UploadFile = File(...)):
    if not file.filename.endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are supported.")
        
    try:
        contents = await file.read()
        
        # 1. Extract Text
        text = extract_text_from_pdf(contents)
        
        # 2. Map to JSON Hierarchy via LLM
        curriculum_json = generate_curriculum_tree(text)
        
        return {
            "status": "success",
            "message": "Syllabus successfully ingested and mapped.",
            "data": curriculum_json
        }
    except Exception as e:
        print(f"Curriculum Ingestion Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))
