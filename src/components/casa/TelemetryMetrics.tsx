type Row = {
  label: string;
  value: string;
  unit?: string;
  level: "safe" | "warning" | "critical" | "info";
  pct: number;
};

const LEVEL_COLOR: Record<Row["level"], string> = {
  safe: "var(--safe)",
  warning: "var(--warning)",
  critical: "var(--critical)",
  info: "var(--info)",
};

const VITALS: Row[] = [
  { label: "Heart rate", value: "128", unit: "bpm", level: "warning", pct: 72 },
  { label: "SpO₂", value: "94", unit: "%", level: "warning", pct: 94 },
  { label: "MAP", value: "61", unit: "mmHg", level: "critical", pct: 41 },
  { label: "EtCO₂", value: "34", unit: "mmHg", level: "safe", pct: 68 },
  { label: "Core temp", value: "35.6", unit: "°C", level: "warning", pct: 55 },
];

const KINEMATICS: Row[] = [
  { label: "J1 torque", value: "1.84", unit: "N·m", level: "safe", pct: 38 },
  { label: "J2 torque", value: "2.96", unit: "N·m", level: "warning", pct: 66 },
  { label: "J3 torque", value: "0.72", unit: "N·m", level: "safe", pct: 18 },
  { label: "J4 stress", value: "4.11", unit: "MPa", level: "critical", pct: 88 },
  { label: "J5 stress", value: "1.29", unit: "MPa", level: "safe", pct: 27 },
  { label: "Tip force", value: "0.41", unit: "N", level: "info", pct: 33 },
];

function MetricRow({ row }: { row: Row }) {
  const color = LEVEL_COLOR[row.level];
  return (
    <div className="grid grid-cols-[1fr_auto] items-center gap-x-3 gap-y-1 px-3 py-1.5">
      <span className="truncate text-xs text-muted-foreground">{row.label}</span>
      <span className="readout text-xs" style={{ color }}>
        {row.value}
        {row.unit ? <span className="ml-1 text-[10px] opacity-70">{row.unit}</span> : null}
      </span>
      <div className="col-span-2 h-[3px] w-full overflow-hidden rounded-full bg-panel-raised">
        <div
          className="h-full rounded-full"
          style={{ width: `${row.pct}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
}

export function TelemetryMetrics() {
  return (
    <div className="flex h-full flex-col divide-y divide-border overflow-auto">
      <div>
        <div className="panel-label px-3 pb-1 pt-2">Synthetic vitals</div>
        {VITALS.map((r) => (
          <MetricRow key={r.label} row={r} />
        ))}
      </div>
      <div>
        <div className="panel-label px-3 pb-1 pt-2">Kinematic stress / torque</div>
        {KINEMATICS.map((r) => (
          <MetricRow key={r.label} row={r} />
        ))}
      </div>
    </div>
  );
}
