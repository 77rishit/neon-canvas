import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring, AnimatePresence } from "framer-motion";
import { useIsMobile } from "@/hooks/use-mobile";

/**
 * Two-part custom cursor: a crisp dot plus a lagging ring that expands over
 * interactive elements. Disabled on touch devices.
 */
export function CustomCursor() {
  const isMobile = useIsMobile();
  const [visible, setVisible] = useState(false);
  const [active, setActive] = useState(false);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const ringX = useSpring(x, { stiffness: 260, damping: 26, mass: 0.5 });
  const ringY = useSpring(y, { stiffness: 260, damping: 26, mass: 0.5 });

  useEffect(() => {
    if (isMobile) return;

    const move = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      setVisible(true);
      const target = e.target as HTMLElement | null;
      setActive(Boolean(target?.closest("a, button, [data-cursor='hover']")));
    };
    const leave = () => setVisible(false);

    window.addEventListener("pointermove", move);
    window.addEventListener("pointerdown", move);
    document.addEventListener("pointerleave", leave);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerdown", move);
      document.removeEventListener("pointerleave", leave);
    };
  }, [isMobile, x, y]);

  if (isMobile) return null;

  return (
    <AnimatePresence>
      {visible && (
        <>
          <motion.div
            key="dot"
            aria-hidden
            className="pointer-events-none fixed left-0 top-0 z-[100] h-1.5 w-1.5 rounded-full bg-primary mix-blend-screen"
            style={{ x, y, translateX: "-50%", translateY: "-50%" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
          <motion.div
            key="ring"
            aria-hidden
            className="pointer-events-none fixed left-0 top-0 z-[100] rounded-full border border-primary/60 mix-blend-screen"
            style={{ x: ringX, y: ringY, translateX: "-50%", translateY: "-50%" }}
            initial={{ opacity: 0, width: 32, height: 32 }}
            animate={{
              opacity: active ? 1 : 0.6,
              width: active ? 56 : 30,
              height: active ? 56 : 30,
              borderColor: active ? "var(--secondary)" : "var(--primary)",
            }}
            exit={{ opacity: 0 }}
            transition={{ type: "spring", stiffness: 320, damping: 24 }}
          />
        </>
      )}
    </AnimatePresence>
  );
}

export default CustomCursor;
