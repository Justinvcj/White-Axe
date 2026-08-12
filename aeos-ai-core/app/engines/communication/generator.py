import json
from langchain_community.llms import Ollama
from langchain_core.prompts import PromptTemplate

# Fallback mechanism for Enterprise resiliency
def get_fallback_report(student_name: str, topic: str, interest: str) -> str:
    return (
        f"We have noticed {student_name} has been focusing heavily on {topic} this week. "
        f"To keep {student_name} highly engaged, our adaptive systems are bringing elements of {interest} "
        f"into the learning experience. Ask {student_name} how {interest} connects to {topic} this weekend!"
    )

def generate_parent_insight_report(student_name: str, topic: str, interest: str, performance_status: str) -> str:
    try:
        # Utilizing local Llama3 for rapid, secure processing
        llm = Ollama(model="llama3", temperature=0.7)
        
        template = """
        You are a highly empathetic, encouraging, and articulate school principal writing a short weekly insight report to a parent.
        
        Student Name: {student_name}
        Recent Topic: {topic}
        Current Interest/Hobby: {interest}
        Performance Status: {performance_status}
        
        Write exactly ONE warm, human-sounding paragraph (max 4 sentences). 
        Do not use technical jargon. 
        Focus on how the school's AI is using the student's interest to help them learn the topic.
        Always end with an actionable question the parent can ask the child this weekend.
        """
        
        prompt = PromptTemplate(
            input_variables=["student_name", "topic", "interest", "performance_status"],
            template=template
        )
        
        chain = prompt | llm
        
        # Execute the chain
        response = chain.invoke({
            "student_name": student_name,
            "topic": topic,
            "interest": interest,
            "performance_status": performance_status
        })
        
        return str(response).strip()
        
    except Exception as e:
        print(f"[LLM Communication Engine Error] Falling back to deterministic template. Error: {e}")
        return get_fallback_report(student_name, topic, interest)
