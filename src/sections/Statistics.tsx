import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { FiAward, FiClock, FiUsers, FiZap } from "react-icons/fi";
import { Section } from "@/components/Section";
import { GlassCard } from "@/components/GlassCard";
import { ParallaxBackdrop } from "@/components/ParallaxBackdrop";
import { Reveal, RevealItem } from "@/components/Reveal";

const STATS = [
  { icon: FiZap, value: 128, suffix: "+", label: "Projects shipped" },
  { icon: FiAward, value: 18, suffix: "", label: "Industry awards" },
  { icon: FiUsers, value: 46, suffix: "M", label: "Sessions served" },
  { icon: FiClock, value: 0.9, suffix: "s", label: "Median load time" },
];

function Counter({ to, suffix }: { to: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const [value, setValue] = useState(0);
  const decimals = to % 1 !== 0 ? 1 : 0;

  useEffect(() => {
    if (!inView) return;
    let raf = 0;
    const start = performance.now();
    const duration = 1600;
    const tick = (now: number) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setValue(to * eased);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, to]);

  return (
    <span ref={ref} className="font-display text-4xl font-bold text-gradient-neon md:text-5xl">
      {value.toFixed(decimals)}
      {suffix}
    </span>
  );
}

export function Statistics() {
  return (
    <Section
      id="stats"
      eyebrow="Statistics"
      title="Numbers that hold up"
      description="Measured across the last five years of shipped work, not rounded up for the deck."
      className="overflow-hidden"
    >
      <ParallaxBackdrop align="right" />

      <Reveal className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {STATS.map(({ icon: Icon, value, suffix, label }, i) => (
          <RevealItem key={label}>
            <GlassCard tone={i % 2 ? "secondary" : "primary"} className="h-full text-center">
              <motion.span
                whileHover={{ rotate: -8, scale: 1.1 }}
                className="mx-auto grid h-12 w-12 place-items-center rounded-xl border border-primary/30 bg-primary/10 text-primary"
              >
                <Icon size={22} />
              </motion.span>
              <div className="mt-5">
                <Counter to={value} suffix={suffix} />
              </div>
              <p className="mt-2 font-display text-[0.6rem] uppercase tracking-[0.3em] text-muted-foreground">
                {label}
              </p>
            </GlassCard>
          </RevealItem>
        ))}
      </Reveal>
    </Section>
  );
}

export default Statistics;
