import { useEffect, useRef } from "react";

const TRACES = [
  { key: "X", token: "--trace-x", freq: 1.7, amp: 0.32, phase: 0 },
  { key: "Y", token: "--trace-y", freq: 2.3, amp: 0.26, phase: 1.1 },
  { key: "Z", token: "--trace-z", freq: 1.1, amp: 0.38, phase: 2.2 },
  { key: "RX", token: "--trace-rx", freq: 3.4, amp: 0.18, phase: 0.6 },
  { key: "RY", token: "--trace-ry", freq: 4.6, amp: 0.14, phase: 3.0 },
  { key: "RZ", token: "--trace-rz", freq: 2.9, amp: 0.22, phase: 1.8 },
];

const N = 340;

export function DofPlot() {
  const ref = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const series: number[][] = TRACES.map(() => new Array(N).fill(0));
    let t = 0;
    let raf = 0;

    const step = () => {
      t += 0.055;
      TRACES.forEach((tr, i) => {
        const noise = (Math.sin(t * 17.3 + i) + Math.sin(t * 29.1 + i * 2)) * 0.02;
        const v = Math.sin(t * tr.freq + tr.phase) * tr.amp + noise;
        series[i]!.push(v);
        series[i]!.shift();
      });

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      if (canvas.width !== w * dpr || canvas.height !== h * dpr) {
        canvas.width = w * dpr;
        canvas.height = h * dpr;
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);

      const styles = getComputedStyle(canvas);
      ctx.strokeStyle = styles.getPropertyValue("--grid-line").trim() || "#333";
      ctx.globalAlpha = 0.35;
      ctx.lineWidth = 1;
      for (let g = 1; g < 6; g++) {
        const y = (h / 6) * g;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }
      for (let g = 1; g < 12; g++) {
        const x = (w / 12) * g;
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }
      ctx.globalAlpha = 1;

      TRACES.forEach((tr, i) => {
        const color = styles.getPropertyValue(tr.token).trim();
        ctx.strokeStyle = color;
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        series[i]!.forEach((v, k) => {
          const x = (k / (N - 1)) * w;
          const y = h / 2 - v * (h * 0.42);
          if (k === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        });
        ctx.stroke();
      });

      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div className="flex h-full flex-col">
      <div className="flex flex-wrap items-center gap-3 px-3 py-1.5">
        {TRACES.map((tr) => (
          <span key={tr.key} className="readout flex items-center gap-1.5 text-[10px]">
            <span
              className="inline-block h-0.5 w-4"
              style={{ backgroundColor: `var(${tr.token})` }}
            />
            <span className="text-muted-foreground">{tr.key}</span>
          </span>
        ))}
        <span className="readout ml-auto text-[10px] text-muted-foreground">1 kHz · 4 s WINDOW</span>
      </div>
      <canvas ref={ref} className="min-h-0 w-full flex-1" />
    </div>
  );
}
