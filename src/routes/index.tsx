import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { Code2, Stethoscope } from "lucide-react";
import { cn } from "@/lib/utils";
import { Panel } from "@/components/casa/Panel";
import { EndoscopeFeed, type MainView } from "@/components/casa/EndoscopeFeed";
import { WristCams } from "@/components/casa/WristCams";
import { TelemetryMetrics } from "@/components/casa/TelemetryMetrics";
import { ControlPanel } from "@/components/casa/ControlPanel";
import { DofPlot } from "@/components/casa/DofPlot";
import { ConfidenceGauge } from "@/components/casa/ConfidenceGauge";
import { PointCloud } from "@/components/casa/PointCloud";
import { LandmarkGraph } from "@/components/casa/LandmarkGraph";
import { TerminalLog } from "@/components/casa/TerminalLog";
import { ViewSelectors, type OpMode } from "@/components/casa/ViewSelectors";
import { SensorsAlarms } from "@/components/casa/SensorsAlarms";
import { RecordControls } from "@/components/casa/RecordControls";
import { StepConfidence, PIPELINE_STEPS } from "@/components/casa/StepConfidence";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "C.A.S.A. — Surgical Robotics Telemetry Console" },
      {
        name: "description",
        content:
          "Dual-role console for C.A.S.A. compact autonomous surgical arms: a clinical view for surgeons and a developer view with perception diagnostics.",
      },
      { property: "og:title", content: "C.A.S.A. — Surgical Robotics Telemetry Console" },
      {
        property: "og:description",
        content:
          "Clinician and developer views: stereo endoscopy, sensor alarms, recording controls, 6-DOF kinematics and AI confidence diagnostics.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Console,
});

type State = "awaiting" | "approved" | "halted" | "complete";
type TabId = "clinical" | "developer";

function stamp() {
  return new Date().toISOString().slice(11, 19);
}

function Console() {
  const [tab, setTab] = useState<TabId>("clinical");
  const [state, setState] = useState<State>("awaiting");
  const [progress, setProgress] = useState(0);
  const [clock, setClock] = useState("--:--:--");

  const [view, setView] = useState<MainView>("stereo");
  const [showLandmarks, setShowLandmarks] = useState(true);
  const [showSegmentation, setShowSegmentation] = useState(true);
  const [mode, setMode] = useState<OpMode>("Autonomous");
  const [frozen, setFrozen] = useState(false);
  const [events, setEvents] = useState<string[]>([]);

  useEffect(() => {
    const id = setInterval(() => setClock(stamp()), 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (state !== "approved") return;
    const id = setInterval(() => {
      setProgress((p) => {
        const next = Math.min(100, p + 2);
        if (next >= 100) setState("complete");
        return next;
      });
    }, 180);
    return () => clearInterval(id);
  }, [state]);

  const onEvent = useCallback((msg: string) => {
    setEvents((e) => [...e, `${stamp()}  ${msg}`].slice(-6));
  }, []);

  const onApprove = useCallback(() => {
    setProgress(0);
    setState("approved");
  }, []);
  const onDecline = useCallback(() => {
    setState("halted");
    setProgress(0);
  }, []);

  const teleop = mode === "Teleoperation";
  const confidence = state === "halted" ? 61.2 : 98.5;
  const segConfidence = state === "halted" ? 72.4 : 96.7;
  const activeStep = Math.min(
    PIPELINE_STEPS.length - 1,
    Math.floor((progress / 100) * PIPELINE_STEPS.length),
  );


  return (
    <main className="flex h-screen flex-col gap-2 overflow-hidden bg-background p-2">
      <header className="panel-frame flex items-center gap-4 px-3 py-2">
        <div className="flex items-center gap-2.5">
          <span className="flex h-6 w-6 items-center justify-center rounded-sm border border-primary/60 text-[10px] font-bold text-primary">
            CA
          </span>
          <h1 className="readout text-sm font-semibold tracking-[0.22em] text-foreground">C.A.S.A.</h1>
          <span className="panel-label hidden sm:inline">Compact Autonomous Surgical Arms</span>
        </div>

        <nav className="ml-4 flex items-center gap-1" aria-label="Console views">
          {(
            [
              { id: "clinical" as TabId, label: "Clinical", icon: Stethoscope },
              { id: "developer" as TabId, label: "Developer", icon: Code2 },
            ]
          ).map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => setTab(id)}
              aria-current={tab === id}
              className={cn(
                "readout flex items-center gap-1.5 rounded-sm border px-3 py-1.5 text-[10px] uppercase tracking-[0.14em] transition-colors",
                tab === id
                  ? "border-primary bg-primary/15 text-primary"
                  : "border-border text-muted-foreground hover:bg-panel-raised hover:text-foreground",
              )}
            >
              <Icon className="h-3.5 w-3.5" />
              {label}
            </button>
          ))}
        </nav>

        <div className="readout ml-auto flex items-center gap-4 text-[10px] text-muted-foreground">
          <span>LINK 5G · RTT 4.2 ms</span>
          <span className="hidden md:inline">ARM-A ONLINE · ARM-B ONLINE</span>
          <span className="text-primary">UTC {clock}</span>
        </div>
      </header>

      {tab === "clinical" ? (
        <div className="grid min-h-0 flex-1 grid-cols-1 gap-2 lg:grid-cols-[minmax(0,1fr)_340px]">
          <div className="grid min-h-0 grid-rows-[minmax(0,1fr)_190px] gap-2">
            <Panel
              label="Main view · left cam / right cam / 3D reconstruction"
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
              <EndoscopeFeed
                view={view}
                showLandmarks={showLandmarks}
                showSegmentation={showSegmentation}
                frozen={frozen}
              />
            </Panel>

            <Panel
              label="Wrist cameras · left & right"
              right={<span className="readout text-[10px] text-muted-foreground">SEGMENTATION DISABLED</span>}
              bodyClassName="p-0"
            >
              <WristCams frozen={frozen} />
            </Panel>
          </div>

          <aside className="grid min-h-0 grid-rows-[auto_minmax(0,1fr)] gap-2">
            <Panel
              label="Human-in-the-loop control"
              right={
                <span
                  className="readout text-[10px]"
                  style={{
                    color: teleop
                      ? "var(--muted-foreground)"
                      : state === "halted"
                        ? "var(--critical)"
                        : "var(--safe)",
                  }}
                >
                  {teleop ? "DISABLED · TELEOP" : `CONF ${confidence.toFixed(1)}%`}
                </span>
              }
              bodyClassName="p-0"
            >
              <ControlPanel
                state={state}
                progress={progress}
                disabled={teleop}
                onApprove={onApprove}
                onDecline={onDecline}
              />
            </Panel>


            <div className="panel-frame min-h-0 space-y-0 overflow-auto">
              <section className="border-b border-border p-3">
                <div className="panel-label mb-2 text-primary">01 · Selectors & overlays</div>
                <ViewSelectors
                  view={view}
                  onView={setView}
                  showLandmarks={showLandmarks}
                  onLandmarks={setShowLandmarks}
                  showSegmentation={showSegmentation}
                  onSegmentation={setShowSegmentation}
                  mode={mode}
                  onMode={setMode}
                />
              </section>

              <section className="border-b border-border p-3">
                <div className="panel-label mb-2 text-primary">02 · Sensors & alarms</div>
                <SensorsAlarms />
              </section>

              <section className="p-3">
                <div className="panel-label mb-2 text-primary">03 · Recording controls</div>
                <RecordControls
                  frozen={frozen}
                  onToggleFreeze={() => setFrozen((f) => !f)}
                  onEvent={onEvent}
                />
                {events.length ? (
                  <div className="mt-2 space-y-0.5 rounded-sm border border-border bg-black px-2 py-1.5">
                    {events.map((e) => (
                      <p key={e} className="readout truncate text-[9px] text-safe">
                        {e}
                      </p>
                    ))}
                  </div>
                ) : null}
              </section>
            </div>
          </aside>
        </div>
      ) : (
        <div className="grid min-h-0 flex-1 grid-cols-1 gap-2 lg:grid-cols-[184px_minmax(0,1fr)_300px]">
          <Panel label="Telemetry metrics" bodyClassName="p-0" className="hidden lg:flex">
            <TelemetryMetrics />
          </Panel>

          <div className="grid min-h-0 grid-rows-[minmax(0,1fr)_minmax(0,1fr)] gap-2">
            <div className="grid min-h-0 grid-cols-1 gap-2 md:grid-cols-2">
              <Panel label="3D point cloud · surgical field" bodyClassName="p-0">
                <PointCloud />
              </Panel>
              <Panel label="Landmark graph · entry → end points" bodyClassName="p-0">
                <LandmarkGraph />
              </Panel>
            </div>
            <div className="grid min-h-0 grid-rows-[minmax(0,1fr)_minmax(0,1fr)] gap-2">
              <Panel label="6-DOF kinematic plotter · dual arm" bodyClassName="p-0">
                <DofPlot />
              </Panel>
              <Panel label="System console · live log" bodyClassName="p-0">
                <TerminalLog />
              </Panel>
            </div>
          </div>

          <div className="grid min-h-0 grid-rows-[auto_auto_minmax(0,1fr)] gap-2">
            <Panel label="AI confidence · full operation" bodyClassName="p-0">
              <ConfidenceGauge value={confidence} title="Operation" />
            </Panel>
            <Panel label="AI confidence · model segmentation" bodyClassName="p-0">
              <ConfidenceGauge value={segConfidence} title="Segmentation" />
            </Panel>
            <Panel
              label="Per-step confidence"
              right={
                <span className="readout text-[10px] text-primary">
                  STEP {String(activeStep + 1).padStart(2, "0")}/{PIPELINE_STEPS.length}
                </span>
              }
              bodyClassName="p-0"
            >
              <StepConfidence activeStep={activeStep} />
            </Panel>
          </div>

        </div>
      )}
    </main>
  );
}
