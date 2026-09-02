const PAIRS = [
  { id: "V-041", entry: [58, 132], end: [172, 62], mm: 12.4 },
  { id: "V-052", entry: [74, 154], end: [214, 96], mm: 15.1 },
  { id: "V-067", entry: [96, 168], end: [188, 138], mm: 9.6 },
  { id: "V-081", entry: [122, 176], end: [246, 150], mm: 13.8 },
  { id: "V-094", entry: [148, 158], end: [232, 196], mm: 10.2 },
  { id: "V-112", entry: [176, 140], end: [268, 178], mm: 11.7 },
] as const;

export function LandmarkGraph() {
  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="relative min-h-0 flex-1">
        <div className="grid-backdrop absolute inset-0" />
        <svg viewBox="0 0 300 220" className="absolute inset-0 h-full w-full" aria-hidden="true">
          {PAIRS.map((p) => (
            <g key={p.id}>
              <line
                x1={p.entry[0]}
                y1={p.entry[1]}
                x2={p.end[0]}
                y2={p.end[1]}
                stroke="var(--primary)"
                strokeWidth="1.2"
                strokeDasharray="5 3"
              />
              <circle cx={p.entry[0]} cy={p.entry[1]} r="3.2" fill="var(--safe)" />
              <circle
                cx={p.end[0]}
                cy={p.end[1]}
                r="3.2"
                fill="none"
                stroke="var(--warning)"
                strokeWidth="1.6"
              />
              <text
                x={p.end[0] + 6}
                y={p.end[1] + 3}
                fill="var(--muted-foreground)"
                fontSize="7"
                fontFamily="var(--font-mono)"
              >
                {p.id}
              </text>
            </g>
          ))}
        </svg>
        <div className="readout pointer-events-none absolute bottom-2 left-2 flex gap-3 text-[9px]">
          <span className="text-safe">● ENTRY</span>
          <span className="text-warning">○ END</span>
          <span className="text-muted-foreground">{PAIRS.length} SELECTED PAIRS</span>
        </div>
      </div>
      <div className="max-h-[92px] overflow-auto border-t border-border">
        {PAIRS.map((p) => (
          <div
            key={p.id}
            className="readout flex items-center justify-between px-3 py-1 text-[10px] text-muted-foreground"
          >
            <span className="text-safe">{p.id}</span>
            <span>
              [{p.entry[0]},{p.entry[1]}] → [{p.end[0]},{p.end[1]}]
            </span>
            <span className="text-primary">{p.mm.toFixed(1)} mm</span>
          </div>
        ))}
      </div>
    </div>
  );
}
