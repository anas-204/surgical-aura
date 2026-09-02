import { useState } from "react";
import { Camera, Circle, Pause, Play, Save, Snowflake, Square } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  frozen: boolean;
  onToggleFreeze: () => void;
  onEvent: (msg: string) => void;
};

export function RecordControls({ frozen, onToggleFreeze, onEvent }: Props) {
  const [recording, setRecording] = useState(false);
  const [paused, setPaused] = useState(false);
  const [captures, setCaptures] = useState(0);

  const status = !recording ? "IDLE" : paused ? "PAUSED" : "RECORDING";
  const statusColor = !recording
    ? "var(--muted-foreground)"
    : paused
      ? "var(--warning)"
      : "var(--critical)";

  return (
    <div className="space-y-2">
      <div className="readout flex items-center justify-between text-[10px]">
        <span className="flex items-center gap-1.5" style={{ color: statusColor }}>
          <Circle className={cn("h-2.5 w-2.5 fill-current", recording && !paused && "status-pulse")} />
          {status}
        </span>
        <span className="text-muted-foreground">CAPTURES {String(captures).padStart(2, "0")}</span>
      </div>

      <button
        type="button"
        onClick={onToggleFreeze}
        className={cn(
          "flex w-full items-center justify-center gap-2 rounded-sm border px-3 py-2 text-[11px] font-medium uppercase tracking-[0.12em] transition-colors",
          frozen
            ? "border-warning bg-warning/15 text-warning"
            : "border-border text-muted-foreground hover:bg-panel-raised hover:text-foreground",
        )}
      >
        <Snowflake className="h-3.5 w-3.5" />
        {frozen ? "Unfreeze image" : "Freeze image"}
      </button>

      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => {
            setRecording((r) => !r);
            setPaused(false);
            onEvent(recording ? "[REC] Recording stopped" : "[REC] Recording started · 1080p60");
          }}
          className={cn(
            "flex items-center justify-center gap-1.5 rounded-sm border px-2 py-2 text-[11px] font-medium uppercase tracking-[0.1em] transition-colors",
            recording
              ? "border-critical bg-critical/15 text-critical"
              : "border-critical/60 text-critical hover:bg-critical/15",
          )}
        >
          {recording ? <Square className="h-3.5 w-3.5 fill-current" /> : <Circle className="h-3.5 w-3.5 fill-current" />}
          {recording ? "Stop" : "Record"}
        </button>

        <button
          type="button"
          disabled={!recording}
          onClick={() => {
            setPaused((p) => !p);
            onEvent(paused ? "[REC] Recording resumed" : "[REC] Recording paused");
          }}
          className="flex items-center justify-center gap-1.5 rounded-sm border border-border px-2 py-2 text-[11px] font-medium uppercase tracking-[0.1em] text-muted-foreground transition-colors hover:bg-panel-raised hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40"
        >
          {paused ? <Play className="h-3.5 w-3.5" /> : <Pause className="h-3.5 w-3.5" />}
          {paused ? "Resume" : "Pause"}
        </button>

        <button
          type="button"
          onClick={() => {
            setCaptures((c) => c + 1);
            onEvent("[CAP] Still frame captured from live view");
          }}
          className="flex items-center justify-center gap-1.5 rounded-sm border border-primary/60 px-2 py-2 text-[11px] font-medium uppercase tracking-[0.1em] text-primary transition-colors hover:bg-primary/15"
        >
          <Camera className="h-3.5 w-3.5" />
          Capture
        </button>

        <button
          type="button"
          onClick={() => onEvent("[REC] Session written to /media/casa/case-0412")}
          className="flex items-center justify-center gap-1.5 rounded-sm border border-border px-2 py-2 text-[11px] font-medium uppercase tracking-[0.1em] text-muted-foreground transition-colors hover:bg-panel-raised hover:text-foreground"
        >
          <Save className="h-3.5 w-3.5" />
          Save
        </button>
      </div>
    </div>
  );
}
