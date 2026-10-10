import { useState } from "react";
import ScoreRing, { scoreColor } from "./ScoreRing.jsx";

function verdict(score) {
  if (score >= 75) return "Strong match";
  if (score >= 50) return "Partial match";
  return "Weak match";
}

function Chips({ items, tone }) {
  if (!items.length) return <p className="text-sm text-white/50">None found.</p>;
  const styles =
    tone === "good"
      ? "border-emerald-300/30 bg-emerald-400/15 text-emerald-100"
      : "border-rose-300/30 bg-rose-400/15 text-rose-100";
  return (
    <ul className="flex flex-wrap gap-2">
      {items.map((s) => (
        <li key={s} className={`rounded-full border px-3 py-1 text-sm ${styles}`}>
          {s}
        </li>
      ))}
    </ul>
  );
}

function Block({ title, children }) {
  return (
    <div className="glass-inset rounded-2xl p-5">
      <h3 className="mb-3 font-display text-base font-semibold">{title}</h3>
      {children}
    </div>
  );
}

function BulletList({ items }) {
  if (!items.length) return <p className="text-sm text-white/50">Nothing to show.</p>;
  return (
    <ul className="space-y-2 text-sm leading-relaxed text-white/85">
      {items.map((s, i) => (
        <li key={i} className="flex gap-2">
          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-300" />
          <span>{s}</span>
        </li>
      ))}
    </ul>
  );
}

export default function Results({ result, loading }) {
  const [view, setView] = useState("candidate");

  if (loading) {
    return (
      <section className="glass flex min-h-[24rem] items-center justify-center rounded-3xl p-8">
        <p className="animate-pulse text-white/70">Reading the resume and comparing it to the job...</p>
      </section>
    );
  }

  if (!result) {
    return (
      <section className="glass flex min-h-[24rem] items-center justify-center rounded-3xl p-8 text-center">
        <p className="max-w-xs text-white/60">
          Your score and skill breakdown will show up here once you analyse a resume.
        </p>
      </section>
    );
  }

  const { overall, breakdown, matched, missing, strengths, suggestions, summary } = result;

  return (
    <section className="glass rounded-3xl p-6 sm:p-8">
      {/* Candidate / HR toggle */}
      <div className="glass-inset mb-7 inline-flex rounded-full p-1" role="tablist" aria-label="Result view">
        {[
          ["candidate", "Candidate view"],
          ["hr", "HR view"],
        ].map(([key, label]) => (
          <button
            key={key}
            role="tab"
            aria-selected={view === key}
            onClick={() => setView(key)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 ${
              view === key ? "bg-white/20 text-white" : "text-white/60 hover:text-white"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Score + breakdown */}
      <div className="flex flex-col items-center gap-8 sm:flex-row">
        <div className="flex flex-col items-center gap-3">
          <ScoreRing value={overall} />
          <span
            className="rounded-full px-3 py-1 text-sm font-semibold text-slate-950"
            style={{ background: scoreColor(overall) }}
          >
            {verdict(overall)}
          </span>
        </div>

        <div className="w-full space-y-4">
          {breakdown.map((b) => (
            <div key={b.label}>
              <div className="mb-1.5 flex justify-between text-sm">
                <span>{b.label}</span>
                <span className="text-white/70">{b.value}%</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full transition-[width] duration-1000"
                  style={{ width: `${b.value}%`, background: scoreColor(b.value) }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {summary && <p className="mt-7 leading-relaxed text-white/85">{summary}</p>}

      <div className="mt-7 grid gap-4 sm:grid-cols-2">
        <Block title="Skills that match">
          <Chips items={matched} tone="good" />
        </Block>
        <Block title="Skills that are missing">
          <Chips items={missing} tone="bad" />
        </Block>
      </div>

      <div className="mt-4">
        {view === "candidate" ? (
          <Block title="How to improve this resume">
            <BulletList items={suggestions} />
          </Block>
        ) : (
          <Block title="Strengths to note">
            <BulletList items={strengths} />
          </Block>
        )}
      </div>
    </section>
  );
}