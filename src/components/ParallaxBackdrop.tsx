import { memo, useRef, type ReactNode } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { cn } from "@/utils/cn";

/**
 * Parallax decorative backdrop for content sections: two drifting neon blobs,
 * a grid plane and a scanline veil, all driven by section scroll progress.
 */
function ParallaxBackdropBase({
  className,
  align = "right",
  children,
}: {
  className?: string;
  align?: "left" | "right";
  children?: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const slow = useTransform(scrollYProgress, [0, 1], ["-12%", "12%"]);
  const fast = useTransform(scrollYProgress, [0, 1], ["18%", "-18%"]);
  const grid = useTransform(scrollYProgress, [0, 1], ["0%", "-6%"]);
  const fade = useTransform(scrollYProgress, [0, 0.5, 1], [0.25, 0.6, 0.25]);

  return (
    <div
      ref={ref}
      aria-hidden
      className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
    >
      <motion.div style={{ y: grid, opacity: fade }} className="grid-lines absolute inset-0" />
      <motion.div
        style={{ y: slow }}
        className={cn(
          "absolute top-0 h-[30rem] w-[30rem] rounded-full blur-[150px]",
          align === "right" ? "-right-40" : "-left-40",
        )}
      >
        <div className="h-full w-full rounded-full bg-primary/20" />
      </motion.div>
      <motion.div
        style={{ y: fast }}
        className={cn(
          "absolute bottom-0 h-[26rem] w-[26rem] rounded-full blur-[160px]",
          align === "right" ? "-left-32" : "-right-32",
        )}
      >
        <div className="h-full w-full rounded-full bg-secondary/20" />
      </motion.div>
      <div className="scanlines absolute inset-0 opacity-40" />
      {children}
    </div>
  );
}

export const ParallaxBackdrop = memo(ParallaxBackdropBase);

export default ParallaxBackdrop;
