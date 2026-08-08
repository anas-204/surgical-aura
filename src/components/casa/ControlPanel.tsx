import { AlertTriangle, Check, Hand, OctagonX, ShieldAlert } from "lucide-react";

type State = "awaiting" | "approved" | "halted";

export function ControlPanel({
  state,
  onApprove,
  onHalt,
  onOverride,
}: {
  state: State;
  onApprove: () => void;
  onHalt: () => void;
  onOverride: () => void;
}) {
  const meta =
    state === "awaiting"
      ? { text: "Awaiting Operator Approval...", color: "var(--warning)", tag: "S3 · SUPERVISED" }
      : state === "approved"
        ? { text: "Command Released — Executing", color: "var(--safe)", tag: "S4 · AUTONOMOUS" }
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
      </div>

      <button
        type="button"
        onClick={onApprove}
        disabled={state === "halted"}
        className="group flex w-full items-center justify-center gap-2 rounded-sm border border-safe/60 bg-safe/10 px-4 py-4 text-sm font-semibold uppercase tracking-[0.18em] text-safe transition-all hover:bg-safe/20 hover:glow-safe disabled:cursor-not-allowed disabled:opacity-35"
      >
        <Check className="h-4 w-4" strokeWidth={2.5} />
        Approve
      </button>
      <p className="readout px-1 text-[10px] leading-relaxed text-muted-foreground">
        Releases the proposed trajectory to both arms. Dead-man switch remains active for the full
        execution window.
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
