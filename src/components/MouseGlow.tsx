import { useEffect } from "react";
import { motion, useMotionValue, useSpring, useMotionTemplate } from "framer-motion";
import { useIsMobile } from "@/hooks/use-mobile";

/**
 * Soft radial light that trails the pointer across its container's viewport.
 */
export function MouseGlow() {
  const isMobile = useIsMobile();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 60, damping: 22, mass: 1.1 });
  const sy = useSpring(y, { stiffness: 60, damping: 22, mass: 1.1 });
  const background = useMotionTemplate`radial-gradient(520px circle at ${sx}px ${sy}px, color-mix(in srgb, var(--primary) 16%, transparent), transparent 70%)`;

  useEffect(() => {
    if (isMobile) return;
    const move = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };
    window.addEventListener("pointermove", move);
    return () => window.removeEventListener("pointermove", move);
  }, [isMobile, x, y]);

  if (isMobile) return null;

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0"
      style={{ background }}
    />
  );
}

export default MouseGlow;
