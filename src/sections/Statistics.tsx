import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Section } from "@/components/Section";
import { STATS } from "@/data/fest";

/** Count-up number that starts when it scrolls into view. */
function Counter({ value, suffix }: { value: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const duration = 1600;
    const start = performance.now();
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / duration);
      // easeOutExpo for a snappy finish
      const eased = p === 1 ? 1 : 1 - Math.pow(2, -10 * p);
      setDisplay(Math.round(value * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, value]);

  return (
    <span ref={ref} className="tabular-nums">
      {display.toLocaleString("en-IN")}
      {suffix}
    </span>
  );
}

export function Statistics() {
  return (
    <Section
      id="statistics"
      eyebrow="By the numbers"
      title="The scale of the grid"
      description="Figures from the 2025 edition. This year's targets are already tracking twenty percent ahead."
    >
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {STATS.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 40, rotateZ: -3 }}
            whileInView={{ opacity: 1, y: 0, rotateZ: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.7, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
            className="glass-panel relative overflow-hidden rounded-2xl p-7 text-center"
          >
            <span
              aria-hidden
              className="pointer-events-none absolute inset-0 animate-pulse bg-[radial-gradient(circle_at_50%_120%,color-mix(in_srgb,var(--primary)_16%,transparent),transparent_65%)]"
            />
            <p className="relative font-display text-[clamp(2.2rem,5vw,3.2rem)] font-bold leading-none text-gradient-neon">
              <Counter value={stat.value} suffix={stat.suffix} />
            </p>
            <p className="relative mt-4 font-display text-[0.55rem] uppercase tracking-[0.3em] text-muted-foreground">
              {stat.label}
            </p>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}

export default Statistics;
