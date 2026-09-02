import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import type { MainView } from "./EndoscopeFeed";

const VIEWS: { id: MainView; label: string }[] = [
  { id: "stereo", label: "Left + Right" },
  { id: "left", label: "Left cam" },
  { id: "right", label: "Right cam" },
  { id: "recon", label: "3D image" },
];

const MODES = ["Autonomous", "Teleoperation"] as const;
export type OpMode = (typeof MODES)[number];

type Props = {
  view: MainView;
  onView: (v: MainView) => void;
  showLandmarks: boolean;
  onLandmarks: (v: boolean) => void;
  showSegmentation: boolean;
  onSegmentation: (v: boolean) => void;
  mode: OpMode;
  onMode: (m: OpMode) => void;
};

function CheckRow({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="flex w-full items-center gap-2 rounded-sm px-1 py-1 text-left text-[11px] text-muted-foreground transition-colors hover:bg-panel-raised hover:text-foreground"
    >
      <span
        className={cn(
          "flex h-3.5 w-3.5 items-center justify-center rounded-[2px] border",
          checked ? "border-safe bg-safe/20 text-safe" : "border-border",
        )}
      >
        {checked ? <Check className="h-2.5 w-2.5" strokeWidth={3.5} /> : null}
      </span>
      {label}
    </button>
  );
}

export function ViewSelectors({
  view,
  onView,
  showLandmarks,
  onLandmarks,
  showSegmentation,
  onSegmentation,
  mode,
  onMode,
}: Props) {
  return (
    <div className="space-y-3">
      <div>
        <span className="panel-label">Main view selector</span>
        <div className="mt-1.5 grid grid-cols-2 gap-1">
          {VIEWS.map((v) => (
            <button
              key={v.id}
              type="button"
              onClick={() => onView(v.id)}
              className={cn(
                "readout rounded-sm border px-2 py-1.5 text-[10px] uppercase tracking-[0.08em] transition-colors",
                v.id === view
                  ? "border-primary bg-primary/15 text-primary"
                  : "border-border text-muted-foreground hover:bg-panel-raised hover:text-foreground",
              )}
            >
              {v.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <span className="panel-label">Overlays</span>
        <div className="mt-1">
          <CheckRow label="Show landmarks" checked={showLandmarks} onChange={onLandmarks} />
          <CheckRow label="Show segmentation" checked={showSegmentation} onChange={onSegmentation} />
        </div>
      </div>

      <div>
        <span className="panel-label">Mode selector</span>
        <div className="mt-1.5 grid grid-cols-2 gap-1">
          {MODES.map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => onMode(m)}
              className={cn(
                "readout rounded-sm border px-2 py-1.5 text-[10px] uppercase tracking-[0.08em] transition-colors",
                m === mode
                  ? "border-safe bg-safe/15 text-safe"
                  : "border-border text-muted-foreground hover:bg-panel-raised hover:text-foreground",
              )}
            >
              {m}
            </button>
          ))}
        </div>
        {mode === "Teleoperation" ? (
          <p className="readout mt-1.5 text-[9px] text-warning">HAND CONTROLLERS ARMED · AI ADVISORY ONLY</p>
        ) : null}
      </div>
    </div>
  );
}
