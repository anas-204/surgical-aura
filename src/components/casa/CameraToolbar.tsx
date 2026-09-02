import { Contrast, Focus, Sun, Boxes } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  compact?: boolean;
  segmentationDisabled?: boolean;
  segmentationOn?: boolean;
};

const SLIDERS = [
  { icon: Sun, label: "Brightness", pct: 62 },
  { icon: Contrast, label: "Contrast", pct: 48 },
];

/**
 * Image-adjustment toolbar only. Freeze / record / capture / save now live in
 * the right sidebar recording section.
 */
export function CameraToolbar({
  compact = false,
  segmentationDisabled = false,
  segmentationOn = true,
}: Props) {
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

      <span className="ml-auto flex items-center gap-1.5">
        <Boxes
          className={cn(
            iconSize,
            segmentationDisabled
              ? "text-muted-foreground/35"
              : segmentationOn
                ? "text-safe"
                : "text-muted-foreground",
          )}
        />
        <span
          className={cn(
            "readout text-[9px] uppercase",
            segmentationDisabled
              ? "text-muted-foreground/40"
              : segmentationOn
                ? "text-safe"
                : "text-muted-foreground",
          )}
        >
          {segmentationDisabled ? "SEG N/A" : segmentationOn ? "SEG ON" : "SEG OFF"}
        </span>
      </span>
    </div>
  );
}
