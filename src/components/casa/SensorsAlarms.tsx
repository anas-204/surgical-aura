import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

type Sensor = {
  id: string;
  label: string;
  unit: string;
  base: number;
  jitter: number;
  limit: number;
};

const SENSORS: Sensor[] = [
  { id: "force", label: "Force sensor · TOOL-A", unit: "N", base: 0.42, jitter: 0.12, limit: 0.7 },
  { id: "pressure", label: "Pressure sensor · line 1", unit: "kPa", base: 118, jitter: 26, limit: 140 },
  { id: "power", label: "Power rail · 48 V bus", unit: "V", base: 47.6, jitter: 1.8, limit: 49.2 },
];

function Lamp({ on }: { on: boolean }) {
  return (
    <span
      className={cn("h-2.5 w-2.5 shrink-0 rounded-full", on && "status-pulse")}
      style={{
        backgroundColor: on ? "var(--critical)" : "var(--panel-raised)",
        border: `1px solid ${on ? "var(--critical)" : "var(--border)"}`,
        boxShadow: on ? "0 0 10px var(--critical)" : "none",
      }}
    />
  );
}

export function SensorsAlarms() {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 900);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="space-y-2.5">
      {SENSORS.map((s, i) => {
        const value = s.base + Math.sin(tick * 0.7 + i * 1.9) * s.jitter;
        const alarm = value > s.limit;
        const pct = Math.min(100, (value / (s.limit * 1.2)) * 100);
        const color = alarm ? "var(--critical)" : "var(--safe)";
        return (
          <div key={s.id} className="rounded-sm border border-border bg-panel-raised/60 px-2 py-1.5">
            <div className="flex items-center gap-2">
              <Lamp on={alarm} />
              <span className="truncate text-[11px] text-muted-foreground">{s.label}</span>
              <span className="readout ml-auto text-[11px]" style={{ color }}>
                {value.toFixed(s.unit === "N" ? 2 : 1)}
                <span className="ml-1 text-[9px] opacity-70">{s.unit}</span>
              </span>
            </div>
            <div className="mt-1.5 h-[3px] overflow-hidden rounded-full bg-background">
              <div
                className="h-full rounded-full transition-all"
                style={{ width: `${pct}%`, backgroundColor: color }}
              />
            </div>
            <div className="readout mt-1 flex justify-between text-[9px]">
              <span className="text-muted-foreground">
                LIMIT {s.limit} {s.unit}
              </span>
              <span style={{ color }}>{alarm ? "ALARM ACTIVE" : "NOMINAL"}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
