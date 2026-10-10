import { useRef, useState } from "react";

const MAX_MB = 5;

export default function UploadPanel({ file, setFile, jd, setJd, loading, error, onSubmit }) {
  const inputRef = useRef(null);
  const [dragging, setDragging] = useState(false);
  const [fileError, setFileError] = useState("");

  function pick(f) {
    if (!f) return;
    const ext = f.name.split(".").pop().toLowerCase();
    if (!["pdf", "docx"].includes(ext)) return setFileError("Please choose a PDF or DOCX file.");
    if (f.size > MAX_MB * 1024 * 1024) return setFileError(`File must be under ${MAX_MB} MB.`);
    setFileError("");
    setFile(f);
  }

  const canSubmit = file && jd.trim().length > 0 && !loading;

  return (
    <section className="glass rounded-3xl p-6 sm:p-7">
      <h2 className="font-display text-xl font-semibold">Your files</h2>

      {/* Drop zone */}
      <div
        role="button"
        tabIndex={0}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => { e.preventDefault(); setDragging(false); pick(e.dataTransfer.files[0]); }}
        className={`mt-5 flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed px-4 py-9 text-center transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 ${
          dragging ? "border-cyan-300 bg-cyan-300/10" : "border-white/25 bg-white/5 hover:bg-white/10"
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".pdf,.docx"
          className="hidden"
          onChange={(e) => pick(e.target.files[0])}
        />
        {file ? (
          <>
            <p className="max-w-full truncate font-medium">{file.name}</p>
            <p className="mt-1 text-sm text-white/60">
              {(file.size / 1024).toFixed(0)} KB. Click to replace.
            </p>
          </>
        ) : (
          <>
            <p className="font-medium">Drop your resume here</p>
            <p className="mt-1 text-sm text-white/60">or click to browse. PDF or DOCX, up to {MAX_MB} MB.</p>
          </>
        )}
      </div>
      {fileError && <p className="mt-2 text-sm text-rose-300">{fileError}</p>}

      <label htmlFor="jd" className="mt-6 block font-medium">
        Job description
      </label>
      <textarea
        id="jd"
        value={jd}
        onChange={(e) => setJd(e.target.value)}
        rows={8}
        placeholder="Paste the full job posting here"
        className="glass-inset mt-2 w-full resize-y rounded-2xl p-4 text-sm leading-relaxed text-white placeholder-white/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300"
      />

      <button
        onClick={onSubmit}
        disabled={!canSubmit}
        className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-violet-500 to-cyan-400 px-5 py-3.5 font-semibold text-slate-950 transition hover:brightness-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-white disabled:cursor-not-allowed disabled:opacity-40"
      >
        {loading && (
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-950/30 border-t-slate-950" />
        )}
        {loading ? "Analysing" : "Analyse resume"}
      </button>

      {error && (
        <p role="alert" className="mt-4 rounded-xl border border-rose-300/30 bg-rose-400/10 p-3 text-sm text-rose-200">
          {error}
        </p>
      )}
    </section>
  );
}