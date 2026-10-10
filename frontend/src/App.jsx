import { useState } from "react";
import UploadPanel from "./components/UploadPanel.jsx";
import Results from "./components/Results.jsx";
import { analyzeResume } from "./api.js";

export default function App() {
  const [file, setFile] = useState(null);
  const [jd, setJd] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  async function handleAnalyze() {
    setError("");
    setLoading(true);
    try {
      setResult(await analyzeResume(file, jd));
    } catch (e) {
      setResult(null);
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Colour blobs: glass needs something colourful behind it to blur */}
      <div className="pointer-events-none fixed inset-0 -z-10" aria-hidden="true">
        <div className="orb absolute -top-32 -left-24 h-[28rem] w-[28rem] rounded-full bg-violet-600/60 blur-[110px]" />
        <div className="orb absolute top-1/3 -right-32 h-[30rem] w-[30rem] rounded-full bg-cyan-500/40 blur-[120px]" style={{ animationDelay: "-6s" }} />
        <div className="orb absolute -bottom-40 left-1/4 h-[26rem] w-[26rem] rounded-full bg-fuchsia-500/35 blur-[110px]" style={{ animationDelay: "-12s" }} />
      </div>

      <main className="mx-auto max-w-6xl px-5 py-10 sm:py-16">
        <header className="mb-10 max-w-2xl">
          <h1 className="font-display text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
            See how well a resume fits the job.
          </h1>
          <p className="mt-4 text-lg text-white/70">
            Upload a resume, paste the job description, and get a match score with the skills that
            line up and the ones that are missing.
          </p>
        </header>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
          <UploadPanel
            file={file}
            setFile={setFile}
            jd={jd}
            setJd={setJd}
            loading={loading}
            error={error}
            onSubmit={handleAnalyze}
          />
          <Results result={result} loading={loading} />
        </div>
      </main>
    </div>
  );
}