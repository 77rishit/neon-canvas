import { motion } from "framer-motion";

/**
 * Slow-drifting aurora blobs + scanline veil behind the hero.
 */
export function AnimatedBackground() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <motion.div
        className="absolute -left-40 -top-40 h-[38rem] w-[38rem] rounded-full blur-[140px]"
        style={{ background: "color-mix(in srgb, var(--primary) 26%, transparent)" }}
        animate={{ x: [0, 90, -30, 0], y: [0, 60, 120, 0], scale: [1, 1.15, 0.95, 1] }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -right-52 top-10 h-[34rem] w-[34rem] rounded-full blur-[150px]"
        style={{ background: "color-mix(in srgb, var(--secondary) 32%, transparent)" }}
        animate={{ x: [0, -80, 20, 0], y: [0, 100, 40, 0], scale: [1, 0.9, 1.1, 1] }}
        transition={{ duration: 26, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-[-18rem] left-1/3 h-[30rem] w-[30rem] rounded-full blur-[160px]"
        style={{ background: "color-mix(in srgb, var(--primary) 18%, transparent)" }}
        animate={{ x: [0, 60, -60, 0], scale: [1, 1.2, 1, 1] }}
        transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }}
      />
      <div className="absolute inset-0 grid-lines opacity-30" />
      <div className="scanlines absolute inset-0" />
      <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-b from-transparent to-background" />
    </div>
  );
}

export default AnimatedBackground;
