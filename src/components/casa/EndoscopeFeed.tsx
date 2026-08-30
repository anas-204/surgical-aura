import feedImage from "@/assets/endoscope-feed.jpg";
import { CameraToolbar } from "./CameraToolbar";

const LANDMARKS = [
  { x: 420, y: 190, d: 0.1 },
  { x: 470, y: 175, d: 0.15 },
  { x: 520, y: 205, d: 0.3 },
  { x: 575, y: 195, d: 0.45 },
  { x: 630, y: 215, d: 0.7 },
  { x: 655, y: 260, d: 0.9 },
  { x: 610, y: 300, d: 0.8 },
  { x: 550, y: 315, d: 0.6 },
  { x: 495, y: 300, d: 0.35 },
  { x: 440, y: 275, d: 0.12 },
  { x: 415, y: 235, d: 0.05 },
  { x: 500, y: 250, d: 0.25 },
  { x: 560, y: 255, d: 0.55 },
  { x: 605, y: 240, d: 0.75 },
];

function dotColor(d: number) {
  if (d < 0.25) return "var(--critical)";
  if (d < 0.55) return "var(--warning)";
  return "var(--safe)";
}


export function EndoscopeFeed() {
  return (
    <div className="relative h-full w-full overflow-hidden bg-black">
      <div className="absolute inset-0 grid grid-cols-2 gap-px">
        {["L", "R"].map((eye) => (
          <div key={eye} className="relative overflow-hidden">
            <img
              src={feedImage}
              alt="Stereoscopic endoscopic view of the surgical field"
              width={1536}
              height={1024}
              className="h-full w-full object-cover"
              style={{
                objectPosition: eye === "L" ? "48% 50%" : "52% 50%",
                filter: "contrast(1.2) saturate(0.85) brightness(0.52)",
              }}
            />
            <div
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  "radial-gradient(ellipse at 50% 45%, transparent 38%, oklch(0 0 0 / 0.55) 78%, oklch(0 0 0 / 0.92) 100%)",
              }}
            />
            <span className="readout absolute bottom-11 left-2 rounded-sm bg-background/70 px-1.5 py-0.5 text-[10px] text-primary">
              {eye === "L" ? "OPTIC-L" : "OPTIC-R"} · 1080p60
            </span>
          </div>
        ))}
      </div>

      {/* AI-proposed trajectory overlay */}
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full"
        viewBox="0 0 1000 600"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <g className="status-pulse">
          <rect
            x="380"
            y="150"
            width="300"
            height="200"
            fill="none"
            stroke="var(--safe)"
            strokeWidth="3"
            style={{ filter: "drop-shadow(0 0 6px var(--safe))" }}
          />
          {[
            [380, 150, 1, 1],
            [680, 150, -1, 1],
            [380, 350, 1, -1],
            [680, 350, -1, -1],
          ].map(([x, y, sx, sy]) => (
            <path
              key={`${x}-${y}`}
              d={`M ${x!} ${y! + sy! * 34} L ${x!} ${y!} L ${x! + sx! * 44} ${y!}`}
              fill="none"
              stroke="var(--safe)"
              strokeWidth="6"
            />
          ))}
          <text
            x="380"
            y="140"
            fill="var(--safe)"
            fontSize="16"
            fontFamily="var(--font-mono)"
          >
            TARGET ROI · LESION 02 · CONF 0.98
          </text>
        </g>

        {/* Landmark vertices — colored by proximity to the approaching tool */}
        {LANDMARKS.map((p) => (
          <g key={`${p.x}-${p.y}`}>
            <circle
              cx={p.x}
              cy={p.y}
              r="5"
              fill={dotColor(p.d)}
              style={{ filter: `drop-shadow(0 0 5px ${dotColor(p.d)})` }}
            />
          </g>
        ))}

        {/* Approaching surgical tool */}
        <g>
          <path
            d="M 250 545 L 405 245"
            stroke="oklch(0.72 0.02 250)"
            strokeWidth="13"
            strokeLinecap="round"
          />
          <path
            d="M 250 545 L 405 245"
            stroke="oklch(0.88 0.01 250)"
            strokeWidth="4"
            strokeLinecap="round"
          />
          <circle cx="405" cy="245" r="7" fill="var(--critical)" style={{ filter: "drop-shadow(0 0 8px var(--critical))" }} />
          <text x="262" y="512" fill="var(--muted-foreground)" fontSize="15" fontFamily="var(--font-mono)">
            TOOL-A · 3.2 mm TO V-041
          </text>
        </g>

        <path

          d="M110 470 C 250 380, 320 250, 480 250 S 720 340, 890 190"
          fill="none"
          stroke="var(--safe)"
          strokeWidth="2.5"
          strokeDasharray="14 10"
          className="status-pulse"
        />
        <circle cx="110" cy="470" r="6" fill="var(--safe)" />
        <circle cx="890" cy="190" r="10" fill="none" stroke="var(--safe)" strokeWidth="2.5" />
        <circle cx="890" cy="190" r="3" fill="var(--safe)" />
        <text
          x="872"
          y="164"
          fill="var(--safe)"
          fontSize="16"
          textAnchor="end"
          fontFamily="var(--font-mono)"
        >
          TARGET NODE 04
        </text>
        <text x="126" y="492" fill="var(--safe)" fontSize="16" fontFamily="var(--font-mono)">
          ENTRY
        </text>
      </svg>

      {/* Reticle + HUD */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/2 h-16 w-16 -translate-x-1/2 -translate-y-1/2 rounded-full border border-primary/40" />
        <div className="absolute left-1/2 top-1/2 h-px w-24 -translate-x-1/2 -translate-y-1/2 bg-primary/30" />
        <div className="absolute left-1/2 top-1/2 h-24 w-px -translate-x-1/2 -translate-y-1/2 bg-primary/30" />
      </div>

      <div className="readout absolute right-3 top-3 flex flex-col items-end gap-1 text-[11px] text-primary/90">
        <span>LAT 4.2 ms</span>
        <span>DEPTH 62.4 mm</span>
        <span>IRRIGATION NOMINAL</span>
      </div>
      <div className="readout absolute left-3 top-3 flex items-center gap-2 text-[11px]">
        <span className="h-2 w-2 rounded-full bg-critical status-pulse" />
        <span className="text-critical">REC</span>
        <span className="text-muted-foreground">SESSION 0x7A14 · T+00:14:07</span>
      </div>

      <CameraToolbar />
    </div>
  );
}

