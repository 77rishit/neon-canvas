import { memo, type HTMLAttributes, type ReactNode } from "react";
import { cn } from "@/utils/cn";
import { useTilt } from "@/hooks/animation/useTilt";
import { useFloat } from "@/hooks/animation/useFloat";

export interface GlassCardProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
  /** Adds a violet neon edge instead of the default cyan. */
  tone?: "primary" | "secondary";
  /** Disables the hover tilt + idle float (for static panels). */
  still?: boolean;
  /** Index used to desynchronise the idle float loop across a grid. */
  floatIndex?: number;
}

/**
 * Glass surface with an animated neon border, GSAP pointer tilt, idle float and
 * hover lighting.
 *
 * The outer node stays transform-free so scroll entrances can own it; the inner
 * node carries the continuous float and the quickTo-driven tilt.
 */
function GlassCardBase({
  className,
  children,
  tone = "primary",
  still = false,
  floatIndex = 0,
  ...props
}: GlassCardProps) {
  const floatRef = useFloat<HTMLDivElement>({ index: floatIndex, disabled: still });
  const tiltRef = useTilt<HTMLDivElement>({ disabled: still });

  return (
    <div ref={floatRef} className="h-full [transform-style:preserve-3d]">
      <div
        ref={tiltRef}
        className={cn(
          "group/card glass-panel panel-alive neon-border-anim edge-electric glass-bend hover-light relative h-full overflow-hidden rounded-2xl transition-colors duration-300",
          tone === "primary"
            ? "hover:border-primary/45 hover:shadow-[0_0_38px_-12px_var(--primary)]"
            : "hover:border-secondary/45 hover:shadow-[0_0_38px_-12px_var(--secondary)]",
        )}

        {...props}
      >
        {/* sheen sweep */}
        <span
          aria-hidden
          className="pointer-events-none absolute -inset-x-10 -top-24 h-40 rotate-12 bg-gradient-to-r from-transparent via-primary/10 to-transparent opacity-0 transition-all duration-700 group-hover/card:translate-y-64 group-hover/card:opacity-100"
        />
        {/* corner ticks */}
        <span
          aria-hidden
          className="pointer-events-none absolute left-0 top-0 z-20 h-4 w-4 border-l border-t border-primary/40 transition-colors duration-300 group-hover/card:border-primary"
        />
        <span
          aria-hidden
          className="pointer-events-none absolute bottom-0 right-0 z-20 h-4 w-4 border-b border-r border-secondary/40 transition-colors duration-300 group-hover/card:border-secondary"
        />
        <div className={cn("relative z-10 h-full p-6", className)}>{children}</div>
      </div>
    </div>
  );
}

export const GlassCard = memo(GlassCardBase);

export default GlassCard;
