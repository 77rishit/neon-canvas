import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

/** Futuristic boot sequence shown once on first mount. */
export function LoadingScreen({ minDuration = 1400 }: { minDuration?: number }) {
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const start = performance.now();
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / minDuration);
      setProgress(Math.round(p * 100));
      if (p < 1) raf = requestAnimationFrame(tick);
      else setTimeout(() => setDone(true), 220);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [minDuration]);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          key="loader"
          exit={{ opacity: 0, filter: "blur(12px)" }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background"
        >
          <div className="scanlines pointer-events-none absolute inset-0 opacity-40" />
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative flex flex-col items-center gap-6"
          >
            <div className="relative h-24 w-24">
              <span className="absolute inset-0 rounded-full border border-primary/30" />
              <motion.span
                className="absolute inset-0 rounded-full border-t-2 border-primary"
                animate={{ rotate: 360 }}
                transition={{ duration: 1.1, repeat: Infinity, ease: "linear" }}
              />
              <motion.span
                className="absolute inset-3 rounded-full border-b-2 border-secondary"
                animate={{ rotate: -360 }}
                transition={{ duration: 1.7, repeat: Infinity, ease: "linear" }}
              />
              <span className="absolute inset-0 grid place-items-center font-display text-sm text-primary">
                {progress}
              </span>
            </div>
            <p className="font-display text-[0.65rem] uppercase tracking-[0.4em] text-foreground/50">
              Initialising interface
            </p>
            <div className="h-px w-56 overflow-hidden bg-foreground/10">
              <div
                className="h-full bg-[image:var(--gradient-neon)] transition-[width] duration-100"
                style={{ width: `${progress}%` }}
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default LoadingScreen;
