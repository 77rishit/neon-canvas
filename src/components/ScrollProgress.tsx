import { memo } from "react";
import { motion, useScroll, useSpring } from "framer-motion";

/** Thin neon reading-progress bar pinned to the very top of the viewport. */
export const ScrollProgress = memo(function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 26, mass: 0.3 });

  return (
    <motion.div
      aria-hidden
      style={{ scaleX }}
      className="fixed inset-x-0 top-0 z-[70] h-[2px] origin-left bg-linear-to-r from-primary via-secondary to-primary"
    />
  );
});

export default ScrollProgress;
