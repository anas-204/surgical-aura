import { useEffect, useRef, useState } from "react";

const LINES = [
  "[SYS] Segmentation active · model casa-seg-v4.2",
  "[CV ] Wound ROI locked · IoU 0.971",
  "[CV ] 128 landmark vertices resolved",
  "[KIN] ARM-A joint envelope nominal",
  "[SYS] Tool proximity warning · 3.2 mm to vertex V-041",
  "[NET] 5G uplink RTT 4.2 ms · jitter 0.4 ms",
  "[AI ] Trajectory candidate 07 · confidence 0.985",
  "[SEC] Admin key attested · HSM slot 2",
  "[KIN] Tip force 0.41 N within limit",
  "[SYS] Needle allowable area recomputed",
  "[CV ] Stereo disparity converged · RMS 0.31 mm",
  "[AI ] Awaiting operator approval gate",
];

function ts(d: Date) {
  return d.toISOString().slice(11, 23);
}

export function TerminalLog() {
  const [rows, setRows] = useState<string[]>([]);
  const boxRef = useRef<HTMLDivElement | null>(null);
  const i = useRef(0);

  useEffect(() => {
    setRows(
      Array.from({ length: 10 }, (_, k) => `${ts(new Date(Date.now() - (10 - k) * 1400))}  ${LINES[k % LINES.length]}`),
    );
    const id = setInterval(() => {
      i.current += 1;
      setRows((prev) =>
        [...prev, `${ts(new Date())}  ${LINES[(i.current + 5) % LINES.length]}`].slice(-80),
      );
    }, 1600);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const el = boxRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [rows]);

  return (
    <div ref={boxRef} className="h-full overflow-auto bg-black px-3 py-2">
      {rows.map((r, k) => (
        <p
          key={`${r}-${k}`}
          className="readout whitespace-pre text-[10.5px] leading-[1.55]"
          style={{
            color: r.includes("warning")
              ? "var(--warning)"
              : r.includes("[SEC]")
                ? "var(--primary)"
                : "var(--safe)",
          }}
        >
          {r}
        </p>
      ))}
      <p className="readout text-[10.5px] leading-[1.55] text-safe">
        <span className="status-pulse">█</span>
      </p>
    </div>
  );
}
