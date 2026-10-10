import os
from dotenv import load_dotenv
from groq import Groq
from pathlib import Path
from pydantic import BaseModel, Field
import json

load_dotenv()
API_KEY = os.getenv("GROQ_API_KEY")
if not API_KEY:
    raise ValueError("API key is invalid")

client = Groq(api_key=API_KEY)

model = "openai/gpt-oss-120b"



class Jobdescription(BaseModel):
    role: str
    required_skills: str
    preferred_skills: str
    minimum_experience: str
    education: str
    responsibilities: str

def extract_job_description(file_path):
    file_path = Path(file_path)
    with open(file_path, "r") as file:
        description = file.read()

    schema = Jobdescription.model_json_schema()
    response_format = {
        "type" : "json_object"
    }

    system_prompt = f"""
    You are an expert HR assistant.
    Extract job description information in json format strictly based on this schema: {schema}
    IMPORTANT:
    - The output should be a valid JSON object.
    - The output should strictly follow the schema provided above.
    - If any field is not present in the job description, return an empty string for that field.
    - DO NOT include any additional information or explanations in the output.
    - DO NOT invent any information. Only extract what is present in the job description."""

    message_system = {
        "role": "system",
        "content": system_prompt
    }


    text = f"""
    Analyse the following job description and extract the required information:

    {description}
    """

    user_prompt = {
        "role": "user",
        "content": text
    }

    messages = [message_system, user_prompt]

    response = client.chat.completions.create(model=model, messages=messages, response_format=response_format)
    answer = response.choices[0].message.content

    raw_json = answer
    job_data = json.loads(raw_json)
    job = Jobdescription(**job_data)

    return job


