import {
  Aperture,
  Camera,
  Circle,
  Contrast,
  Focus,
  Save,
  Snowflake,
  Sun,
  Boxes,
} from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  compact?: boolean;
  segmentationDisabled?: boolean;
};

const SLIDERS = [
  { icon: Sun, label: "Brightness", pct: 62 },
  { icon: Contrast, label: "Contrast", pct: 48 },
];

export function CameraToolbar({ compact = false, segmentationDisabled = false }: Props) {
  const iconSize = compact ? "h-3 w-3" : "h-3.5 w-3.5";

  return (
    <div
      className={cn(
        "pointer-events-auto absolute inset-x-2 bottom-2 flex items-center gap-2 rounded-sm border border-border/70 bg-background/45 px-2 backdrop-blur-xl",
        compact ? "gap-1 py-1" : "gap-2 py-1.5",
      )}
    >
      <button
        type="button"
        aria-label="Focus"
        className="rounded-sm p-1 text-muted-foreground transition-colors hover:bg-primary/15 hover:text-primary"
      >
        <Focus className={iconSize} />
      </button>

      {!compact &&
        SLIDERS.map(({ icon: Icon, label, pct }) => (
          <div key={label} className="flex items-center gap-1.5" title={label}>
            <Icon className={cn(iconSize, "text-muted-foreground")} />
            <span className="relative block h-[3px] w-12 overflow-hidden rounded-full bg-panel-raised">
              <span
                className="absolute inset-y-0 left-0 rounded-full bg-primary"
                style={{ width: `${pct}%` }}
              />
            </span>
          </div>
        ))}

      <button
        type="button"
        aria-label="Segmentation"
        disabled={segmentationDisabled}
        className={cn(
          "rounded-sm p-1 transition-colors",
          segmentationDisabled
            ? "cursor-not-allowed text-muted-foreground/35"
            : "text-safe hover:bg-safe/15",
        )}
      >
        <Boxes className={iconSize} />
      </button>

      <span className="ml-auto flex items-center gap-1">
        {[
          { icon: Snowflake, label: "Freeze" },
          { icon: Camera, label: "Capture" },
          { icon: Aperture, label: "Save frame", hideOnCompact: true },
          { icon: Save, label: "Save", hideOnCompact: true },
        ]
          .filter((b) => !(compact && b.hideOnCompact))
          .map(({ icon: Icon, label }) => (
            <button
              key={label}
              type="button"
              aria-label={label}
              className="rounded-sm p-1 text-muted-foreground transition-colors hover:bg-primary/15 hover:text-primary"
            >
              <Icon className={iconSize} />
            </button>
          ))}
        <button
          type="button"
          aria-label="Record"
          className="flex items-center gap-1 rounded-sm px-1 py-1 text-critical transition-colors hover:bg-critical/15"
        >
          <Circle className={cn(iconSize, "fill-current")} />
          {!compact && <span className="readout text-[9px]">REC</span>}
        </button>
      </span>
    </div>
  );
}
