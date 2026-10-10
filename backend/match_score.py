import os
import json
from dotenv import load_dotenv
from pathlib import Path
from groq import Groq
from pydantic import BaseModel, Field
from jobdescription_processing import extract_job_description
from resume_processing import extract_resume_info
import tempfile

load_dotenv()

API_KEY = os.getenv("GROQ_API_KEY")
if not API_KEY:
    raise ValueError("API key is invalid")

client = Groq(api_key=API_KEY)

model = "openai/gpt-oss-120b"

class MatchScore(BaseModel):
    score: float
    skills_matched: list[str] = []
    missing_skills: list[str] = []
    weaknesses: list[str] = []
    suggestions: list[str] = []
    summary: str = ""


def calculate_match_score(job, resume):
    schema = MatchScore.model_json_schema()
    response_format = {
        "type": "json_object"
    }

    system_prompt = f"""
    You are an expert HR assistant.
    Calculate the match score between the job description and the resume in json format strictly based on this schema: {schema}

    Give me:

    1. Candidate name
    2. Matching skills
    3. Missing important skills
    4. Whether experience requirement is met
    5. Overall match percentage from 0 to 100
    6. A short final verdict

    Keep the response concise and easy to read.
    IMPORTANT:
    - The output should be a valid JSON object.
    - The output should strictly follow the schema provided above.
    - If any field is not present in the job description or resume, return an empty string or empty list for that field.
    - DO NOT include any additional information or explanations in the output.
    - DO NOT invent any information. Only extract what is present in the job description and resume."""

    message_system = {
        "role": "system",
        "content": system_prompt
    }

    text = f"""
    Analyse the following job description and resume and calculate the match score:

    Job Description: {job.json()}
    
    Resume: {resume.json()}
    """

    user_prompt = {
        "role": "user",
        "content": text
    }

    messages = [message_system, user_prompt]

    response = client.chat.completions.create(model=model, messages=messages, response_format=response_format)
    raw_json = response.choices[0].message.content
    match_data = json.loads(raw_json)
    match_score = MatchScore(**match_data)

    return match_score

def run_analysis(resume_path, jd_text: str) -> dict:
    """Entry point used by the FastAPI server. Returns a plain dict (-> JSON)."""
    with tempfile.TemporaryDirectory() as tmp:
        jd_file = Path(tmp) / "job_description.txt"
        jd_file.write_text(jd_text, encoding="utf-8")
        job = extract_job_description(str(jd_file))
 
    resume = extract_resume_info(Path(resume_path))
    return calculate_match_score(job, resume).model_dump()

if __name__ == "__main__":
    base = Path(__file__).parent
    job = extract_job_description(str(base / "job_description.txt"))
    resume = extract_resume_info(base / "sample_resume.pdf")
    print(calculate_match_score(job, resume).model_dump_json(indent=2))
 

 
