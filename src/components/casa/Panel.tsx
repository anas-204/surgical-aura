import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Panel({
  label,
  right,
  children,
  className,
  bodyClassName,
}: {
  label: string;
  right?: ReactNode;
  children: ReactNode;
  className?: string;
  bodyClassName?: string;
}) {
  return (
    <section className={cn("panel-frame flex min-h-0 flex-col", className)}>
      <header className="flex items-center justify-between gap-2 border-b border-border px-3 py-2">
        <span className="panel-label">{label}</span>
        {right}
      </header>
      <div className={cn("min-h-0 flex-1", bodyClassName)}>{children}</div>
    </section>
  );
}
