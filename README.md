# AI Resume Analyzer

An AI-powered resume analysis tool that evaluates how well a resume matches a target job description, generates a match score, and provides actionable suggestions to improve relevance and presentation.

Upload a resume in **PDF or DOCX format**, provide a job description, and receive AI-generated feedback to help identify skill gaps, missing keywords, and areas for improvement.

## Features

- **Resume Parsing:** Upload resumes in PDF or DOCX format for text extraction and analysis.
- **AI-Powered Match Score:** Evaluate resume relevance against a target job description.
- **Personalized Suggestions:** Receive actionable recommendations to improve resume alignment.
- **Skill Gap Identification:** Identify relevant skills and keywords that may be missing from the resume.
- **REST API Backend:** Built with FastAPI to handle requests and connect the frontend with the AI analysis pipeline.
- **Responsive User Interface:** A modern frontend built with React, Vite, and Tailwind CSS.

## Tech Stack

| Component | Technologies |
|---|---|
| Frontend | React, Vite |
| Styling | Tailwind CSS |
| Backend | Python, FastAPI |
| AI / LLM | Groq API, Large Language Models |
| Document Processing | PDF and DOCX parsing |

## How It Works

1. **Upload Resume:** Upload a resume as a PDF or DOCX file.
2. **Provide Job Description:** Enter the job description for the role you're targeting.
3. **Extract Resume Content:** The backend extracts text from the uploaded document.
4. **AI Analysis:** The extracted resume content and job description are processed using an LLM through Groq.
5. **View Results:** Receive a match score and suggestions to improve your resume's alignment with the role.

## Project Architecture

```text
React + Vite + Tailwind CSS
            |
            v
       FastAPI Backend
            |
            v
    Resume Text Extraction
            |
            v
   Groq API / LLM Analysis
            |
            v
 Match Score + Recommendations
            |
            v
     Results in Frontend
```

## Getting Started

### Prerequisites

- Python 3.10+
- Node.js and npm
- A Groq API key

### 1. Clone the Repository

```bash
git clone https://github.com/naitikkkgoel/AI-Resume-Analyzer
cd AI-Resume-Analyzer
```

### 2. Configure the Backend

Navigate to the backend directory, if your project uses one:

```bash
cd backend
python -m venv venv
```

Activate the virtual environment.

**Windows PowerShell:**

```powershell
.\venv\Scripts\Activate.ps1
```

Install the dependencies:

```bash
pip install -r requirements.txt
```

Create a `.env` file in the backend directory:

```env
GROQ_API_KEY=your_groq_api_key
```

Start the FastAPI server using your application's entry point. For example, if your FastAPI instance is named `app` in `main.py`:

```bash
uvicorn main:app --reload
```

The API documentation is typically available at:

```text
http://127.0.0.1:8000/docs
```

### 3. Configure the Frontend

Open a new terminal and navigate to your frontend directory:

```bash
cd frontend
npm install
npm run dev
```

Open the local URL displayed by Vite in your terminal.

> **Note:** Update the directory names and startup commands to match your actual project structure.

## Environment Variables

| Variable | Description |
|---|---|
| `GROQ_API_KEY` | API key used to access Groq-hosted language models |

**Security:** Keep your API key in environment variables. Never commit your `.env` file or expose the key in frontend code.

Add the following to your `.gitignore`:

```gitignore
.env
venv/
__pycache__/
node_modules/
dist/
```

## Future Improvements

- Support multiple resume versions and job descriptions.
- Add ATS-oriented keyword and section analysis.
- Provide section-specific feedback for experience, projects, and skills.
- Enable downloadable reports with improvement recommendations.
- Add resume version comparison and analysis history.

## Limitations

- Match scores are AI-generated estimates, not guarantees of ATS compatibility or interview selection.
- Analysis quality depends on the clarity of the resume, the job description, and the model's output.
- Complex layouts and scanned PDFs may require additional document-processing or OCR support.

## License

Add a license if you intend to distribute this project publicly.

---

**Built with Python, FastAPI, React, Tailwind CSS, and Groq.**