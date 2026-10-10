const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

const pct = (v) => {
  if (v === null || v === undefined || v === "") return null; // Number(null) would be 0
  const n = Number(v);
  return Number.isFinite(n) ? Math.max(0, Math.min(100, Math.round(n))) : null;
};
const list = (v) => (Array.isArray(v) ? v.map(String) : []);

/**
 * Maps YOUR backend JSON to what the UI expects.
 * If your keys are named differently, change them here and nowhere else.
 */
export function normalize(raw) {
  return {
    overall: pct(raw.overall_score ?? raw.match_score ?? raw.score) ?? 0,
    breakdown: [
      { label: "Skills", value: pct(raw.skills_match ?? raw.skills_score) },
      { label: "Experience", value: pct(raw.experience_match ?? raw.experience_score) },
      { label: "Education", value: pct(raw.education_match ?? raw.education_score) },
    ].filter((b) => b.value !== null),
    matched: list(raw.matched_skills),
    missing: list(raw.missing_skills),
    strengths: list(raw.strengths),
    suggestions: list(raw.suggestions ?? raw.improvements),
    summary: raw.summary ?? "",
  };
}

export async function analyzeResume(file, jobDescription) {
  const formData = new FormData();
  formData.append("resume", file); // must match the parameter name in FastAPI
  formData.append("job_description", jobDescription);

  let res;
  try {
    // No Content-Type header: the browser sets it, including the multipart boundary.
    res = await fetch(`${API_URL}/analyze`, { method: "POST", body: formData });
  } catch {
    throw new Error("Can't reach the server. Check that the backend is running on port 8000.");
  }

  if (!res.ok) {
    let message = "Something went wrong. Please try again.";
    try {
      const body = await res.json();
      if (typeof body.detail === "string") message = body.detail;
    } catch {
      /* keep default message */
    }
    throw new Error(message);
  }

  return normalize(await res.json());
}