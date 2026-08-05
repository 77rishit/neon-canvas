import type { ReactNode } from "react";
import { motion, type HTMLMotionProps } from "framer-motion";
import { cn } from "@/utils/cn";

export interface GlassCardProps extends Omit<HTMLMotionProps<"div">, "children"> {
  children?: ReactNode;
  /** Adds a violet neon edge instead of the default cyan. */
  tone?: "primary" | "secondary";
  /** Disables the hover lift (for static panels). */
  still?: boolean;
}

/**
 * Glass surface with an animated neon border + hover lift.
 * The border is a masked gradient ring that brightens on hover.
 */
export function GlassCard({
  className,
  children,
  tone = "primary",
  still = false,
  ...props
}: GlassCardProps) {
  return (
    <motion.div
      {...(still ? {} : { whileHover: { y: -6 } })}
      onPointerMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
        e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
      }}
      transition={{ type: "spring", stiffness: 260, damping: 22 }}
      className={cn(
        "group/card glass-panel neon-border-anim hover-light relative h-full overflow-hidden rounded-2xl transition-colors duration-300",
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

    </motion.div>
  );
}

export default GlassCard;
