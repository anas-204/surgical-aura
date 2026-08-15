import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { Panel } from "@/components/casa/Panel";
import { EndoscopeFeed } from "@/components/casa/EndoscopeFeed";
import { TelemetryMetrics } from "@/components/casa/TelemetryMetrics";
import { ControlPanel } from "@/components/casa/ControlPanel";
import { ExecutionLog, type LogEntry } from "@/components/casa/ExecutionLog";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "C.A.S.A. — Surgical Robotics Telemetry Console" },
      {
        name: "description",
        content:
          "Real-time telemetry console for C.A.S.A. compact autonomous surgical arms: stereoscopic feed, AI trajectory approval and kinematic telemetry.",
      },
      { property: "og:title", content: "C.A.S.A. — Surgical Robotics Telemetry Console" },
      {
        property: "og:description",
        content:
          "Supervised-autonomy console for pre-hospital trauma intervention: stereo endoscopy, kinematic stress telemetry and command release control.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Console,
});

type State = "awaiting" | "approved" | "halted" | "complete";

const STEPS: { at: number; text: string; level: LogEntry["level"] }[] = [
  { at: 0, text: "Operator approval recorded · command released to ARM-A / ARM-B", level: "safe" },
  { at: 12, text: "Trajectory uploaded · 6-DOF waypoints locked", level: "info" },
  { at: 30, text: "Arms in motion · dead-man switch armed", level: "info" },
  { at: 52, text: "Tip force 0.41 N within envelope", level: "safe" },
  { at: 74, text: "Haemostasis margin holding · no collision events", level: "safe" },
  { at: 92, text: "Retracting to safe pose", level: "info" },
  { at: 100, text: "Command executed successfully · awaiting next proposal", level: "safe" },
];

function stamp() {
  return new Date().toISOString().slice(11, 19);
}

function Console() {
  const [state, setState] = useState<State>("awaiting");
  const [progress, setProgress] = useState(0);
  const [log, setLog] = useState<LogEntry[]>([]);
  const [clock, setClock] = useState("--:--:--");
  const emitted = useRef<Set<number>>(new Set());

  useEffect(() => {
    const id = setInterval(() => setClock(stamp()), 1000);
    return () => clearInterval(id);
  }, []);

  const append = useCallback((text: string, level: LogEntry["level"]) => {
    setLog((l) => [...l, { t: stamp(), text, level }]);
  }, []);

  useEffect(() => {
    if (state !== "approved") return;
    const id = setInterval(() => {
      setProgress((p) => {
        const next = Math.min(100, p + 2);
        const step = STEPS.find((s) => s.at > p && s.at <= next);
        if (step && !emitted.current.has(step.at)) {
          emitted.current.add(step.at);
          append(step.text, step.level);
        }
        if (next >= 100) setState("complete");
        return next;
      });
    }, 180);
    return () => clearInterval(id);
  }, [state, append]);

  const onApprove = useCallback(() => {
    emitted.current = new Set([0]);
    setProgress(0);
    setState("approved");
    append(STEPS[0]!.text, STEPS[0]!.level);
  }, [append]);

  const onHalt = useCallback(() => {
    setState("halted");
    append("SAFETY HALT engaged · motion stopped, brakes locked", "critical");
  }, [append]);

  const onOverride = useCallback(() => {
    setState("awaiting");
    setProgress(0);
    emitted.current = new Set();
    append("Manual override · control returned to operator", "warning");
  }, [append]);

  return (
    <main className="grid h-screen grid-rows-[auto_minmax(0,1fr)_168px] gap-2 overflow-hidden bg-background p-2">
      <header className="panel-frame flex items-center gap-4 px-3 py-2">
        <div className="flex items-center gap-2.5">
          <span className="flex h-6 w-6 items-center justify-center rounded-sm border border-primary/60 text-[10px] font-bold text-primary">
            CA
          </span>
          <h1 className="readout text-sm font-semibold tracking-[0.22em] text-foreground">
            C.A.S.A.
          </h1>
          <span className="panel-label hidden sm:inline">Compact Autonomous Surgical Arms</span>
        </div>
        <div className="readout ml-auto flex items-center gap-4 text-[10px] text-muted-foreground">
          <span>LINK 5G · RTT 4.2 ms</span>
          <span className="hidden md:inline">ARM-A ONLINE · ARM-B ONLINE</span>
          <span className="text-primary">UTC {clock}</span>
        </div>
      </header>

      <div className="grid min-h-0 grid-cols-1 gap-2 lg:grid-cols-[300px_minmax(0,1fr)_308px]">
        <Panel label="Telemetry metrics" bodyClassName="p-0">
          <TelemetryMetrics />
        </Panel>

        <Panel
          label="Stereoscopic endoscopic feed"
          right={
            <span
              className="readout text-[10px]"
              style={{
                color:
                  state === "halted"
                    ? "var(--critical)"
                    : state === "awaiting"
                      ? "var(--warning)"
                      : "var(--safe)",
              }}
            >
              {state === "awaiting"
                ? "AI TRAJECTORY · PROPOSED"
                : state === "approved"
                  ? `AI TRAJECTORY · EXECUTING ${progress}%`
                  : state === "complete"
                    ? "AI TRAJECTORY · COMPLETE"
                    : "MOTION HALTED"}
            </span>
          }
          bodyClassName="p-0"
        >
          <EndoscopeFeed />
        </Panel>

        <Panel label="Control & state" bodyClassName="p-0">
          <ControlPanel
            state={state}
            progress={progress}
            onApprove={onApprove}
            onHalt={onHalt}
            onOverride={onOverride}
          />
        </Panel>
      </div>

      <Panel label="Command & event log" bodyClassName="p-0">
        <ExecutionLog entries={log} />
      </Panel>
    </main>
  );
}
