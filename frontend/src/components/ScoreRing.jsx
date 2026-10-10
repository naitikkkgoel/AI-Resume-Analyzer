import { useEffect, useState } from "react";

export function scoreColor(v) {
  if (v >= 75) return "#34d399"; // emerald
  if (v >= 50) return "#fbbf24"; // amber
  return "#fb7185"; // rose
}

export default function ScoreRing({ value, size = 190 }) {
  const stroke = 14;
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const [shown, setShown] = useState(0);

  // Animates from 0 to the score whenever a new result arrives
  useEffect(() => {
    const t = requestAnimationFrame(() => setShown(value));
    return () => cancelAnimationFrame(t);
  }, [value]);

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth={stroke} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={scoreColor(value)}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={circ - (shown / 100) * circ}
          style={{ transition: "stroke-dashoffset 1s cubic-bezier(.2,.8,.2,1)" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-display text-5xl font-bold">{value}</span>
        <span className="text-sm text-white/60">out of 100</span>
      </div>
    </div>
  );
}