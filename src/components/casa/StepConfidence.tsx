export const PIPELINE_STEPS: { label: string; confidence: number }[] = [
  { label: "Image capture & wound segmentation (stereo)", confidence: 99.1 },
  { label: "Needle entry / exit landmark identification", confidence: 97.8 },
  { label: "Trajectory path generation · dual arm", confidence: 96.4 },
  { label: "Needle grasping · right arm", confidence: 98.2 },
  { label: "Tissue holding & lifting · left arm", confidence: 94.6 },
  { label: "Needle insertion · rolling wrist motion", confidence: 92.3 },
  { label: "Needle extraction at exit point", confidence: 93.7 },
  { label: "Thread pulling · short tail retained", confidence: 91.5 },
  { label: "Thread looping around instrument", confidence: 88.9 },
  { label: "Grasping short tail with instrument", confidence: 90.2 },
  { label: "Opposite-direction pull · knot tying", confidence: 86.4 },
  { label: "Repeat loops & tighten knot", confidence: 84.1 },
  { label: "Cutting excess thread", confidence: 95.3 },
  { label: "Final visual check · closed wound", confidence: 97.2 },
];

function tone(v: number) {
  if (v >= 90) return "var(--safe)";
  if (v >= 75) return "var(--warning)";
  return "var(--critical)";
}

export function StepConfidence({ activeStep }: { activeStep: number }) {
  return (
    <div className="h-full overflow-auto px-2 py-1.5">
      <ol className="space-y-1">
        {PIPELINE_STEPS.map((s, i) => {
          const color = tone(s.confidence);
          const isActive = i === activeStep;
          const done = i < activeStep;
          return (
            <li
              key={s.label}
              className="rounded-sm border px-2 py-1.5"
              style={{
                borderColor: isActive ? color : "var(--border)",
                backgroundColor: isActive ? "var(--panel-raised)" : "transparent",
                opacity: done ? 0.55 : 1,
              }}
            >
              <div className="flex items-start justify-between gap-2">
                <span className="readout text-[9px] text-muted-foreground">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="min-w-0 flex-1 text-[10px] leading-tight text-foreground">{s.label}</span>
                <span className="readout shrink-0 text-[10px] font-bold" style={{ color }}>
                  {s.confidence.toFixed(1)}%
                </span>
              </div>
              <div className="mt-1 h-1 w-full overflow-hidden rounded-full bg-background">
                <div
                  className="h-full rounded-full"
                  style={{ width: `${s.confidence}%`, backgroundColor: color }}
                />
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
