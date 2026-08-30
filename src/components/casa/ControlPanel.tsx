import { AlertTriangle, Check, Hand, Loader2, OctagonX, ShieldAlert } from "lucide-react";

type State = "awaiting" | "approved" | "halted" | "complete";

export function ControlPanel({
  state,
  progress,
  onApprove,
  onHalt,
  onOverride,
}: {
  state: State;
  progress: number;
  onApprove: () => void;
  onHalt: () => void;
  onOverride: () => void;
}) {
  const meta =
    state === "awaiting"
      ? { text: "Awaiting Operator Approval...", color: "var(--warning)", tag: "S3 · SUPERVISED" }
      : state === "approved"
        ? { text: "Command Released — Executing", color: "var(--safe)", tag: "S4 · AUTONOMOUS" }
        : state === "complete"
          ? { text: "Command Executed — Idle", color: "var(--safe)", tag: "S2 · IDLE" }
          : { text: "Safety Halt Engaged", color: "var(--critical)", tag: "S0 · HALTED" };

  return (
    <div className="flex h-full flex-col gap-3 p-3">
      <div
        className="rounded-sm border p-3"
        style={{
          borderColor: meta.color,
          backgroundColor: "var(--panel-raised)",
          boxShadow: `inset 0 0 24px ${meta.color}22`,
        }}
      >
        <div className="flex items-center justify-between">
          <span className="panel-label">State machine</span>
          <span className="readout text-[10px]" style={{ color: meta.color }}>
            {meta.tag}
          </span>
        </div>
        <div className="mt-2 flex items-start gap-2">
          <span
            className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full status-pulse"
            style={{ backgroundColor: meta.color }}
          />
          <p className="readout text-base leading-snug" style={{ color: meta.color }}>
            {meta.text}
          </p>
        </div>
        {state === "approved" || state === "complete" ? (
          <div className="mt-3">
            <div className="readout flex justify-between text-[10px] text-muted-foreground">
              <span>Execution</span>
              <span style={{ color: meta.color }}>{progress}%</span>
            </div>
            <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-background">
              <div
                className="h-full rounded-full transition-all duration-200"
                style={{ width: `${progress}%`, backgroundColor: meta.color }}
              />
            </div>
          </div>
        ) : null}
      </div>

      <button
        type="button"
        onClick={onApprove}
        disabled={state === "halted" || state === "approved"}
        className="group flex w-full items-center justify-center gap-2 rounded-sm border border-safe/60 bg-safe/10 px-4 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-safe transition-all hover:bg-safe/20 hover:glow-safe disabled:cursor-not-allowed disabled:opacity-35"
      >
        {state === "approved" ? (
          <Loader2 className="h-4 w-4 animate-spin" strokeWidth={2.5} />
        ) : (
          <Check className="h-4 w-4" strokeWidth={2.5} />
        )}
        {state === "approved" ? "Executing" : state === "complete" ? "Approve next" : "Approve next"}
      </button>
      <p className="readout px-1 text-[10px] leading-snug text-muted-foreground">
        Releases the proposed trajectory to both arms.
      </p>






      <div className="mt-auto space-y-2 rounded-sm border border-critical/40 bg-critical/5 p-3">
        <div className="flex items-center gap-2">
          <ShieldAlert className="h-3.5 w-3.5 text-critical" />
          <span className="panel-label" style={{ color: "var(--critical)" }}>
            Manual override
          </span>
        </div>
        <button
          type="button"
          onClick={onHalt}
          className="flex w-full items-center justify-center gap-2 rounded-sm border border-critical bg-critical/15 px-3 py-3.5 text-sm font-semibold uppercase tracking-[0.18em] text-critical transition-all hover:bg-critical/30 hover:glow-critical"
        >
          <OctagonX className="h-4 w-4" strokeWidth={2.5} />
          Safety halt
        </button>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={onOverride}
            className="flex items-center justify-center gap-1.5 rounded-sm border border-critical/50 px-2 py-2.5 text-[11px] font-medium uppercase tracking-[0.12em] text-critical transition-colors hover:bg-critical/15"
          >
            <Hand className="h-3.5 w-3.5" />
            Take control
          </button>
          <button
            type="button"
            onClick={onOverride}
            className="flex items-center justify-center gap-1.5 rounded-sm border border-warning/50 px-2 py-2.5 text-[11px] font-medium uppercase tracking-[0.12em] text-warning transition-colors hover:bg-warning/15"
          >
            <AlertTriangle className="h-3.5 w-3.5" />
            Retract
          </button>
        </div>
      </div>
    </div>
  );
}
