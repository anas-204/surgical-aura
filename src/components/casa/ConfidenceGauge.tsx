export function ConfidenceGauge({ value }: { value: number }) {
  const safe = value >= 90;
  const warn = !safe && value >= 75;
  const color = safe ? "var(--safe)" : warn ? "var(--warning)" : "var(--critical)";
  const r = 78;
  const circumference = Math.PI * r;
  const dash = (Math.min(100, Math.max(0, value)) / 100) * circumference;

  return (
    <div className="flex h-full flex-col items-center justify-center px-4 py-2">
      <svg viewBox="0 0 200 116" className="w-full max-w-[240px]" aria-hidden="true">
        <path
          d={`M ${100 - r} 100 A ${r} ${r} 0 0 1 ${100 + r} 100`}
          fill="none"
          stroke="var(--panel-raised)"
          strokeWidth="14"
          strokeLinecap="round"
        />
        <path
          d={`M ${100 - r} 100 A ${r} ${r} 0 0 1 ${100 + r} 100`}
          fill="none"
          stroke={color}
          strokeWidth="14"
          strokeLinecap="round"
          strokeDasharray={`${dash} ${circumference}`}
          style={{ filter: `drop-shadow(0 0 8px ${color})`, transition: "stroke-dasharray 300ms" }}
        />
        {[0, 25, 50, 75, 100].map((tick) => {
          const a = Math.PI * (1 - tick / 100);
          const x1 = 100 + Math.cos(a) * (r - 12);
          const y1 = 100 - Math.sin(a) * (r - 12);
          const x2 = 100 + Math.cos(a) * (r - 19);
          const y2 = 100 - Math.sin(a) * (r - 19);
          return (
            <line
              key={tick}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="var(--muted-foreground)"
              strokeWidth="1.5"
            />
          );
        })}
      </svg>
      <div className="-mt-5 flex flex-col items-center">
        <span className="readout text-3xl font-semibold" style={{ color }}>
          {value.toFixed(1)}%
        </span>
        <span className="panel-label mt-1">AI Confidence Score</span>
        <span className="readout mt-2 rounded-sm px-2 py-0.5 text-[10px]" style={{ color }}>
          {safe ? "WITHIN SAFE ENVELOPE" : warn ? "MARGINAL — MONITOR" : "BELOW THRESHOLD — HALT"}
        </span>
      </div>
    </div>
  );
}
