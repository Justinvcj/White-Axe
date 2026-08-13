import json
import PyPDF2
from io import BytesIO
from langchain_community.llms import Ollama
from langchain_core.prompts import PromptTemplate

# Mock JSON in case PyPDF2/LLM fails or for MVP demo speed
MOCK_CURRICULUM_JSON = [
    {
        "id": "sub-1",
        "name": "Physics",
        "units": [
            {
                "id": "unit-1",
                "name": "Mechanics",
                "chapters": [
                    {
                        "id": "chap-1",
                        "name": "Newton's Laws",
                        "concepts": [
                            {"id": "con-1", "name": "Inertia"},
                            {"id": "con-2", "name": "Force and Acceleration"},
                            {"id": "con-3", "name": "Action and Reaction"}
                        ]
                    }
                ]
            }
        ]
    }
]

def extract_text_from_pdf(file_bytes: bytes) -> str:
    """Extracts text from a given PDF byte array using PyPDF2."""
    try:
        reader = PyPDF2.PdfReader(BytesIO(file_bytes))
        text = ""
        for page in reader.pages:
            text += page.extract_text() + "\n"
        return text
    except Exception as e:
        print(f"Failed to parse PDF: {e}")
        return ""

def generate_curriculum_tree(syllabus_text: str):
    """
    Passes the syllabus text to an LLM to generate a JSON hierarchy:
    Subject -> Unit -> Chapter -> Concept.
    """
    try:
        # Fallback early if text is completely empty
        if not syllabus_text.strip():
            print("No text extracted, returning mock curriculum.")
            return MOCK_CURRICULUM_JSON

        llm = Ollama(model="llama3", temperature=0.2)
        
        template = """
        You are an expert curriculum director. Parse the following syllabus text into a strictly formatted JSON array representing the curriculum hierarchy.
        
        The hierarchy MUST be:
        [
            {{
                "id": "unique-subject-id",
                "name": "Subject Name",
                "units": [
                    {{
                        "id": "unique-unit-id",
                        "name": "Unit Name",
                        "chapters": [
                            {{
                                "id": "unique-chapter-id",
                                "name": "Chapter Name",
                                "concepts": [
                                    {{ "id": "unique-concept-id", "name": "Concept Name" }}
                                ]
                            }}
                        ]
                    }}
                ]
            }}
        ]
        
        Ensure you ONLY output the valid JSON array. No markdown, no explanations.

        SYLLABUS TEXT:
        {syllabus_text}
        """
        
        prompt = PromptTemplate(
            input_variables=["syllabus_text"],
            template=template
        )
        
        chain = prompt | llm
        
        # Take the first 3000 chars to avoid overloading context limit for the MVP
        response = chain.invoke({
            "syllabus_text": syllabus_text[:3000] 
        })
        
        # Clean up output
        cleaned = str(response).strip()
        if cleaned.startswith("```json"):
            cleaned = cleaned[7:-3]
            
        return json.loads(cleaned)
        
    except Exception as e:
        print(f"[LLM Curriculum Engine Error] Falling back to deterministic curriculum tree. Error: {e}")
        return MOCK_CURRICULUM_JSON
