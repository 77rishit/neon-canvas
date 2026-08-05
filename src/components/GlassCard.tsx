import { memo, useRef, type ReactNode } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  type HTMLMotionProps,
} from "framer-motion";
import { cn } from "@/utils/cn";

export interface GlassCardProps extends Omit<HTMLMotionProps<"div">, "children"> {
  children?: ReactNode;
  /** Adds a violet neon edge instead of the default cyan. */
  tone?: "primary" | "secondary";
  /** Disables the hover lift + tilt (for static panels). */
  still?: boolean;
  /** Index used to desynchronise the idle float loop across a grid. */
  floatIndex?: number;
}

/**
 * Glass surface with an animated neon border, pointer tilt, idle float and
 * hover lift. The border is a masked gradient ring that brightens on hover.
 */
function GlassCardBase({
  className,
  children,
  tone = "primary",
  still = false,
  floatIndex = 0,
  ...props
}: GlassCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const spring = { stiffness: 180, damping: 18, mass: 0.6 };
  const rotateX = useSpring(useTransform(py, [-0.5, 0.5], [7, -7]), spring);
  const rotateY = useSpring(useTransform(px, [-0.5, 0.5], [-9, 9]), spring);

  return (
    <motion.div
      ref={ref}
      style={still ? undefined : { rotateX, rotateY, transformPerspective: 900 }}
      {...(still
        ? {}
        : {
            animate: { y: [0, -6, 0] },
            transition: {
              duration: 6 + (floatIndex % 4) * 0.7,
              repeat: Infinity,
              ease: "easeInOut",
              delay: (floatIndex % 5) * 0.4,
            },
            whileHover: { y: -10, scale: 1.02, transition: { type: "spring", ...spring } },
          })}
      onPointerMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
        e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
        if (still) return;
        px.set((e.clientX - r.left) / r.width - 0.5);
        py.set((e.clientY - r.top) / r.height - 0.5);
      }}
      onPointerLeave={() => {
        px.set(0);
        py.set(0);
      }}
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

export const GlassCard = memo(GlassCardBase);

export default GlassCard;
