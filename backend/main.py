import logging
import tempfile
from pathlib import Path
import os

from fastapi import FastAPI, File, Form, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware

# Your own code. run_analysis() must be a function that takes a file path and a
# job description string, and returns your result as a dict (the JSON you already produce).
from match_score import run_analysis

logger = logging.getLogger("resume-analyser")

ALLOWED = {".pdf", ".docx"}
MAX_BYTES = 5 * 1024 * 1024  # 5 MB

app = FastAPI(title="Resume Analyser API")

origins = ["http://localhost:5173", "http://127.0.0.1:5173"]
frontend_url = os.getenv("FRONTEND_URL")
if frontend_url:
    origins.append(frontend_url.rstrip("/"))


# Lets the React dev server (port 5173) call this API from the browser.
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/analyze")
def analyze(resume: UploadFile = File(...), job_description: str = Form(...)):
    suffix = Path(resume.filename or "").suffix.lower()
    if suffix not in ALLOWED:
        raise HTTPException(400, "Only PDF or DOCX files are supported.")
    if not job_description.strip():
        raise HTTPException(400, "Job description is empty.")

    data = resume.file.read()
    if len(data) > MAX_BYTES:
        raise HTTPException(400, "File is larger than 5 MB.")

    # Your extract_resume_info() expects a path, so save to a temp folder that is
    # deleted automatically when the block ends. Nothing is kept on disk.
    with tempfile.TemporaryDirectory() as tmp:
        path = Path(tmp) / f"resume{suffix}"
        path.write_bytes(data)
        try:
            return run_analysis(path, job_description)
        except ValueError as e:  # e.g. unreadable or empty file
            raise HTTPException(400, str(e))
        except Exception:
            logger.exception("Analysis failed")  # full traceback shows in your terminal
            raise HTTPException(500, "Analysis failed. Please try again.")