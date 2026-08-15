export type LogEntry = { t: string; text: string; level: "safe" | "warning" | "critical" | "info" };

const LEVEL_COLOR: Record<LogEntry["level"], string> = {
  safe: "var(--safe)",
  warning: "var(--warning)",
  critical: "var(--critical)",
  info: "var(--info)",
};

export function ExecutionLog({ entries }: { entries: LogEntry[] }) {
  return (
    <div className="h-full overflow-auto px-3 py-2">
      {entries.length === 0 ? (
        <p className="readout text-[11px] text-muted-foreground">
          No command events. Awaiting operator approval…
        </p>
      ) : (
        <ul className="space-y-1">
          {entries.map((e, i) => (
            <li key={`${e.t}-${i}`} className="readout flex gap-3 text-[11px] leading-relaxed">
              <span className="shrink-0 text-muted-foreground">{e.t}</span>
              <span
                className="h-1.5 w-1.5 shrink-0 translate-y-[5px] rounded-full"
                style={{ backgroundColor: LEVEL_COLOR[e.level] }}
              />
              <span style={{ color: LEVEL_COLOR[e.level] }}>{e.text}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
