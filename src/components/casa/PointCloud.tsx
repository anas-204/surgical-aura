import { useEffect, useRef } from "react";

type Pt = { x: number; y: number; z: number };

function buildField(): Pt[] {
  const pts: Pt[] = [];
  let seed = 21;
  const rand = () => {
    seed = (seed * 1103515245 + 12345) % 2147483648;
    return seed / 2147483648;
  };
  for (let i = 0; i < 1500; i++) {
    const u = rand() * 2 - 1;
    const v = rand() * 2 - 1;
    const r = Math.sqrt(u * u + v * v);
    if (r > 1) continue;
    const z =
      Math.sin(u * 3.1) * 0.22 + Math.cos(v * 2.4) * 0.18 + (rand() - 0.5) * 0.05 - r * 0.25;
    pts.push({ x: u, y: v, z });
  }
  return pts;
}

export function PointCloud() {
  const ref = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const pts = buildField();
    let raf = 0;
    let t = 0;

    const draw = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      if (canvas.width !== w * dpr || canvas.height !== h * dpr) {
        canvas.width = w * dpr;
        canvas.height = h * dpr;
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);

      t += 0.004;
      const yaw = Math.sin(t) * 0.5 + 0.6;
      const cos = Math.cos(yaw);
      const sin = Math.sin(yaw);
      const tilt = 0.55;
      const scale = Math.min(w, h) * 0.42;

      for (const p of pts) {
        const rx = p.x * cos - p.y * sin;
        const ry = p.x * sin + p.y * cos;
        const sx = w / 2 + rx * scale;
        const sy = h / 2 + (ry * tilt - p.z * 1.2) * scale;
        const depth = (p.z + 0.5) / 1.0;
        const alpha = 0.25 + Math.max(0, Math.min(1, depth)) * 0.7;
        const hueSafe = p.z > 0.12;
        ctx.fillStyle = hueSafe
          ? `oklch(0.8 0.19 150 / ${alpha})`
          : `oklch(0.75 0.15 200 / ${alpha * 0.75})`;
        ctx.fillRect(sx, sy, 1.6, 1.6);
      }
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div className="relative h-full w-full">
      <div className="grid-backdrop absolute inset-0" />
      <canvas ref={ref} className="relative h-full w-full" />
      <div className="readout pointer-events-none absolute bottom-2 left-2 flex gap-3 text-[10px] text-muted-foreground">
        <span>PTS 1.42k</span>
        <span>RMS 0.31 mm</span>
        <span>REG LOCKED</span>
      </div>
    </div>
  );
}
