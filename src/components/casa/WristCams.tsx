import feedImage from "@/assets/endoscope-feed.jpg";
import { CameraToolbar } from "./CameraToolbar";

const CAMS = [
  { id: "LEFT WRIST CAM", pos: "20% 35%", hue: "hue-rotate(190deg)" },
  { id: "RIGHT WRIST CAM", pos: "70% 60%", hue: "hue-rotate(150deg)" },
];

export function WristCams({ frozen = false }: { frozen?: boolean }) {
  return (
    <div className="grid h-full grid-cols-2 gap-2 p-2">
      {CAMS.map((cam) => (
        <div key={cam.id} className="relative overflow-hidden rounded-sm border border-border bg-black">
          <img
            src={feedImage}
            alt={`Wrist camera view: ${cam.id}`}
            width={1536}
            height={1024}
            loading="lazy"
            className="h-full w-full object-cover"
            style={{
              objectPosition: cam.pos,
              filter: `grayscale(${frozen ? 0.85 : 0.5}) ${cam.hue} contrast(1.15) brightness(0.45)`,
            }}
          />
          <span className="readout absolute left-1.5 top-1.5 rounded-sm bg-background/70 px-1.5 py-0.5 text-[9px] text-primary">
            {cam.id}
          </span>
          <span className="readout absolute right-1.5 top-1.5 text-[9px] text-muted-foreground">720p30</span>
          <CameraToolbar compact segmentationDisabled />
        </div>
      ))}
    </div>
  );
}
