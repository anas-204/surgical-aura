import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { Panel } from "@/components/casa/Panel";
import { EndoscopeFeed } from "@/components/casa/EndoscopeFeed";
import { PointCloud } from "@/components/casa/PointCloud";
import { TelemetryMetrics } from "@/components/casa/TelemetryMetrics";
import { ControlPanel } from "@/components/casa/ControlPanel";
import { DofPlot } from "@/components/casa/DofPlot";
import { ConfidenceGauge } from "@/components/casa/ConfidenceGauge";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "C.A.S.A. — Surgical Robotics Telemetry Console" },
      {
        name: "description",
        content:
          "Real-time telemetry console for C.A.S.A. compact autonomous surgical arms: stereoscopic feed, AI trajectory approval, 6-DOF plotting and confidence scoring.",
      },
      { property: "og:title", content: "C.A.S.A. — Surgical Robotics Telemetry Console" },
      {
        property: "og:description",
        content:
          "Supervised-autonomy console for pre-hospital trauma intervention: stereo endoscopy, 3D point cloud, kinematic stress and 6-DOF live plots.",
      },
    ],
  }),
  component: Console,
});

function Console() {
  const [state, setState] = useState<"awaiting" | "approved" | "halted">("awaiting");
  const [confidence, setConfidence] = useState(98.5);
  const [clock, setClock] = useState("--:--:--");

  useEffect(() => {
    const id = setInterval(() => {
      setClock(new Date().toISOString().slice(11, 19));
      setConfidence((c) => {
        if (state === "halted") return Math.max(48, c - 3.4);
        const target = state === "approved" ? 97.2 : 98.5;
        return Math.min(99.4, Math.max(90, target + (Math.random() - 0.5) * 0.6));
      });
    }, 1000);
    return () => clearInterval(id);
  }, [state]);

  const onApprove = useCallback(() => setState("approved"), []);
  const onHalt = useCallback(() => setState("halted"), []);
  const onOverride = useCallback(() => setState("awaiting"), []);

  return (
    <main className="flex h-screen flex-col gap-2 overflow-hidden bg-background p-2">
      <header className="panel-frame flex shrink-0 items-center gap-4 px-3 py-2">
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

      <div className="grid min-h-0 flex-1 grid-cols-1 gap-2 lg:grid-cols-[300px_minmax(0,1fr)_308px]">
        <div className="grid min-h-0 grid-rows-[minmax(180px,4fr)_minmax(0,6fr)] gap-2">
          <Panel label="3D point cloud · surgical field" bodyClassName="p-0">
            <PointCloud />
          </Panel>
          <Panel label="Telemetry metrics" bodyClassName="p-0">
            <TelemetryMetrics />
          </Panel>
        </div>

        <Panel
          label="Stereoscopic endoscopic feed"
          right={
            <span className="readout text-[10px] text-safe">AI TRAJECTORY · PROPOSED</span>
          }
          bodyClassName="p-0 min-h-[300px]"
        >
          <EndoscopeFeed />
        </Panel>

        <Panel label="Control & state" bodyClassName="p-0">
          <ControlPanel
            state={state}
            onApprove={onApprove}
            onHalt={onHalt}
            onOverride={onOverride}
          />
        </Panel>
      </div>

      <div className="grid shrink-0 grid-cols-1 gap-2 lg:grid-cols-[minmax(0,1fr)_308px]">
        <Panel label="6-DOF live coordinates · dual arms" bodyClassName="h-[188px] p-0">
          <DofPlot />
        </Panel>
        <Panel label="AI confidence" bodyClassName="h-[188px] p-0">
          <ConfidenceGauge value={confidence} />
        </Panel>
      </div>
    </main>
  );
}
