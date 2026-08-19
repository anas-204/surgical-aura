import { useState } from "react";
import { ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { PointCloud } from "./PointCloud";

const TABS = [
  "Model Confidence",
  "Segmented Image",
  "3D Point Cloud",
  "Wound Graph & Vertices",
  "Needle Allowable Area",
] as const;

type Tab = (typeof TABS)[number];

function NeedleArea() {
  return (
    <div className="relative h-full w-full">
      <div className="grid-backdrop absolute inset-0" />
      <svg viewBox="0 0 300 190" className="absolute inset-0 h-full w-full" aria-hidden="true">
        <g fill="none" stroke="var(--safe)" strokeWidth="1.2" opacity="0.9">
          <polygon points="60,120 150,150 240,120 150,90" />
          <polygon points="60,70 150,100 240,70 150,40" />
          <line x1="60" y1="120" x2="60" y2="70" />
          <line x1="150" y1="150" x2="150" y2="100" />
          <line x1="240" y1="120" x2="240" y2="70" />
          <line x1="150" y1="90" x2="150" y2="40" />
        </g>
        <g stroke="var(--safe)" strokeWidth="0.5" opacity="0.35">
          {[0.25, 0.5, 0.75].map((f) => (
            <polygon
              key={f}
              points={`${60 + f * 0} ${120 - f * 50},150 ${150 - f * 50},240 ${120 - f * 50},150 ${90 - f * 50}`}
            />
          ))}
        </g>
        <line
          x1="120"
          y1="10"
          x2="165"
          y2="112"
          stroke="var(--warning)"
          strokeWidth="2"
          strokeDasharray="6 4"
        />
        <circle cx="165" cy="112" r="4" fill="var(--warning)" />
        <text x="10" y="182" fill="var(--muted-foreground)" fontSize="9" fontFamily="var(--font-mono)">
          SAFE INSERTION ENVELOPE · 18.4 mm³
        </text>
      </svg>
    </div>
  );
}

function ConfidenceBars() {
  const rows = [
    ["Segmentation", 98.5],
    ["Depth estimation", 96.1],
    ["Vertex regression", 93.4],
    ["Trajectory planner", 97.8],
  ] as const;
  return (
    <div className="space-y-3 p-3">
      {rows.map(([label, v]) => (
        <div key={label}>
          <div className="readout flex justify-between text-[10px]">
            <span className="text-muted-foreground">{label}</span>
            <span className="text-safe">{v.toFixed(1)}%</span>
          </div>
          <div className="mt-1 h-[3px] overflow-hidden rounded-full bg-panel-raised">
            <div className="h-full rounded-full bg-safe" style={{ width: `${v}%` }} />
          </div>
        </div>
      ))}
    </div>
  );
}

function WoundGraph() {
  const nodes = Array.from({ length: 14 }, (_, i) => ({
    x: 40 + ((i * 61) % 220),
    y: 30 + ((i * 47) % 130),
  }));
  return (
    <div className="relative h-full w-full">
      <div className="grid-backdrop absolute inset-0" />
      <svg viewBox="0 0 300 190" className="absolute inset-0 h-full w-full" aria-hidden="true">
        {nodes.map((n, i) =>
          i < nodes.length - 1 ? (
            <line
              key={`e${i}`}
              x1={n.x}
              y1={n.y}
              x2={nodes[i + 1]!.x}
              y2={nodes[i + 1]!.y}
              stroke="var(--primary)"
              strokeWidth="0.8"
              opacity="0.6"
            />
          ) : null,
        )}
        {nodes.map((n, i) => (
          <circle key={`n${i}`} cx={n.x} cy={n.y} r="2.6" fill="var(--safe)" />
        ))}
      </svg>
      <span className="readout absolute bottom-2 left-2 text-[9px] text-muted-foreground">
        128 VERTICES · 214 EDGES
      </span>
    </div>
  );
}

function SegmentedImage() {
  return (
    <div className="relative h-full w-full bg-black">
      <svg viewBox="0 0 300 190" className="absolute inset-0 h-full w-full" aria-hidden="true">
        <rect width="300" height="190" fill="oklch(0.2 0.02 320)" />
        <path
          d="M70 120 C 100 60, 190 55, 225 105 C 240 145, 120 170, 70 120 Z"
          fill="oklch(0.78 0.2 148 / 0.35)"
          stroke="var(--safe)"
          strokeWidth="1.6"
        />
        <rect x="60" y="45" width="180" height="120" fill="none" stroke="var(--safe)" strokeWidth="1" strokeDasharray="5 4" />
      </svg>
      <span className="readout absolute bottom-2 left-2 text-[9px] text-safe">MASK · CLASS wound_01</span>
    </div>
  );
}

export function AdminTabs() {
  const [tab, setTab] = useState<Tab>("Needle Allowable Area");

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="flex items-center gap-2 border-b border-border px-3 py-2">
        <ShieldCheck
          className="h-3.5 w-3.5 text-safe"
          style={{ filter: "drop-shadow(0 0 6px var(--safe))" }}
        />
        <span className="readout text-[10px] tracking-[0.14em] text-safe">
          STATUS: ADMIN KEY AUTHENTICATED
        </span>
      </div>
      <div className="flex flex-wrap gap-1 border-b border-border px-2 py-1.5">
        {TABS.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={cn(
              "readout rounded-sm px-1.5 py-1 text-[9px] uppercase tracking-[0.08em] transition-colors",
              t === tab
                ? "bg-primary/15 text-primary"
                : "text-muted-foreground hover:bg-panel-raised hover:text-foreground",
            )}
          >
            {t}
          </button>
        ))}
      </div>
      <div className="min-h-0 flex-1">
        {tab === "Needle Allowable Area" ? (
          <NeedleArea />
        ) : tab === "3D Point Cloud" ? (
          <PointCloud />
        ) : tab === "Model Confidence" ? (
          <ConfidenceBars />
        ) : tab === "Wound Graph & Vertices" ? (
          <WoundGraph />
        ) : (
          <SegmentedImage />
        )}
      </div>
    </div>
  );
}
