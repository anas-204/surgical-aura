import { Check, Loader2, X } from "lucide-react";

type State = "awaiting" | "approved" | "halted" | "complete";

export function ControlPanel({
  state,
  progress,
  disabled = false,
  onApprove,
  onDecline,
}: {
  state: State;
  progress: number;
  disabled?: boolean;
  onApprove: () => void;
  onDecline: () => void;
}) {
  const meta = disabled
    ? { text: "Teleoperation — Operator In Direct Control", color: "var(--muted-foreground)", tag: "S1 · MANUAL" }
    : state === "awaiting"
      ? { text: "Awaiting Operator Approval...", color: "var(--warning)", tag: "S3 · SUPERVISED" }
      : state === "approved"
        ? { text: "Command Released — Executing", color: "var(--safe)", tag: "S4 · AUTONOMOUS" }
        : state === "complete"
          ? { text: "Command Executed — Idle", color: "var(--safe)", tag: "S2 · IDLE" }
          : { text: "Command Declined — Motion Held", color: "var(--critical)", tag: "S0 · DECLINED" };

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
        {!disabled && (state === "approved" || state === "complete") ? (
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

      <div className="mt-auto grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={onApprove}
          disabled={disabled || state === "approved"}
          className="flex items-center justify-center gap-2 rounded-sm border border-safe px-3 py-4 text-base font-bold uppercase tracking-[0.14em] text-safe-foreground transition-all hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40"
          style={{
            background: "linear-gradient(180deg, var(--safe), color-mix(in oklab, var(--safe) 78%, black))",
            boxShadow: "0 0 22px color-mix(in oklab, var(--safe) 40%, transparent)",
          }}
        >
          {state === "approved" && !disabled ? (
            <Loader2 className="h-5 w-5 animate-spin" strokeWidth={2.5} />
          ) : (
            <Check className="h-5 w-5" strokeWidth={3} />
          )}
          {state === "approved" && !disabled ? "Executing" : "Approve"}
        </button>

        <button
          type="button"
          onClick={onDecline}
          disabled={disabled}
          className="flex items-center justify-center gap-2 rounded-sm border border-critical px-3 py-4 text-base font-bold uppercase tracking-[0.14em] text-critical-foreground transition-all hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40"
          style={{
            background: "linear-gradient(180deg, var(--critical), color-mix(in oklab, var(--critical) 78%, black))",
            boxShadow: "0 0 22px color-mix(in oklab, var(--critical) 40%, transparent)",
          }}
        >
          <X className="h-5 w-5" strokeWidth={3} />
          Decline
        </button>
      </div>
    </div>
  );
}
