export function ConfidenceGauge({ value }: { value: number }) {
  const safe = value >= 90;
  const warn = !safe && value >= 75;
  const color = safe ? "var(--safe)" : warn ? "var(--warning)" : "var(--critical)";
  const r = 78;
  const circumference = 2 * Math.PI * r;
  const pct = Math.min(100, Math.max(0, value));
  const dash = (pct / 100) * circumference;

  return (
    <div className="flex h-full flex-col items-center justify-center px-3 py-2">
      <div className="relative w-full max-w-[132px]">
        <svg viewBox="0 0 200 200" className="w-full" aria-hidden="true">
          <circle
            cx="100"
            cy="100"
            r={r}
            fill="none"
            stroke="var(--panel-raised)"
            strokeWidth="16"
          />
          <circle
            cx="100"
            cy="100"
            r={r}
            fill="none"
            stroke={color}
            strokeWidth="16"
            strokeLinecap="round"
            strokeDasharray={`${dash} ${circumference}`}
            transform="rotate(-90 100 100)"
            style={{ filter: `drop-shadow(0 0 10px ${color})`, transition: "stroke-dasharray 300ms" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span
            className="readout text-3xl font-bold leading-none"
            style={{ color, textShadow: `0 0 16px ${color}` }}
          >
            {value.toFixed(1)}
            <span className="text-lg">%</span>
          </span>
          <span className="panel-label mt-1.5 text-center leading-tight">AI Confidence</span>
        </div>
      </div>
      <span className="readout mt-1 text-[9px]" style={{ color }}>
        {safe ? "SAFE ENVELOPE" : warn ? "MARGINAL" : "BELOW THRESHOLD"}
      </span>
    </div>
  );
}
