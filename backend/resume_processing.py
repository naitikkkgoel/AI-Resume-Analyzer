import os
from dotenv import load_dotenv
from pathlib import Path
from groq import Groq
from pydantic import BaseModel, Field
from pdf_processing import read_pdf, read_docx
import json


load_dotenv()
API_KEY = os.getenv("GROQ_API_KEY")
if not API_KEY:
    raise ValueError("API key is invalid")

client = Groq(api_key=API_KEY)

model = "openai/gpt-oss-120b"


class Experience(BaseModel):
    company: str | None = None
    role: str | None = None
    duration: str | None = None
    responsibilities: str | None = None
    description: str | None = None
    skills_used: list[str] = []

class ResumeInfo(BaseModel):
    name: str | None = None
    email: str | None = None
    phone: str | None = None
    total_experience_years: float | None = None
    education: list[str] = []
    skills: list[str] = []
    experience: list[Experience]
    certifications: list[str] = []

def extract_resume_info(file_path):
    file_path = Path(file_path)
    if file_path.suffix.lower() == ".pdf":
        text = read_pdf(file_path)
    elif file_path.suffix.lower() == ".docx":
        text = read_docx(file_path)
    else:
        raise ValueError("Unsupported file format. Only PDF and DOCX are supported.")

    schema = ResumeInfo.model_json_schema()
    response_format = {
        "type": "json_object"
    }

    system_prompt = f"""
    You are an expert resume analyser.
    Extract resume information in json format strictly based on this schema: {schema}
    IMPORTANT:
    - The output should be a valid JSON object.
    - The output should strictly follow the schema provided above.
    - If any field is not present in the resume, return an empty string or empty list for that field.
    - DO NOT include any additional information or explanations in the output.
    - DO NOT invent any information. Only extract what is present in the resume."""

    message_system = {
        "role": "system",
        "content": system_prompt
    }

    user_prompt = {
        "role": "user",
        "content": text
    }

    messages = [message_system, user_prompt]

    response = client.chat.completions.create(model=model, messages=messages, response_format=response_format)
    answer = response.choices[0].message.content

    raw_json = answer
    data = json.loads(raw_json)
    
    resume_info = ResumeInfo(**data)
    
    return resume_info


