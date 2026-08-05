import { motion } from "framer-motion";
import { Section } from "@/components/Section";
import { GlassCard } from "@/components/GlassCard";
import { ParallaxBackdrop } from "@/components/ParallaxBackdrop";
import { Reveal, RevealItem } from "@/components/Reveal";

const STEPS = [
  { year: "2019", title: "Signal", body: "Studio founded by three engineers who kept getting hired to fix design systems." },
  { year: "2021", title: "Realtime", body: "First WebGL configurator ships — 42% lift in product page conversion." },
  { year: "2023", title: "Scale", body: "Motion + token system adopted across a 60-person product org." },
  { year: "2024", title: "Awards", body: "Three Awwwards Site of the Day and an FWA for the Kinetic launch." },
  { year: "2026", title: "NEO//GRID v2", body: "Edge-rendered realtime stack, open-sourced primitives, global team of nine." },
];

export function Timeline() {
  return (
    <Section
      id="timeline"
      eyebrow="Timeline"
      title="Signal over time"
      description="A short history of the studio, from three engineers to a realtime practice."
      className="overflow-hidden"
    >
      <ParallaxBackdrop align="left" />

      <div className="relative">
        {/* spine */}
        <motion.span
          aria-hidden
          initial={{ scaleY: 0 }}
          whileInView={{ scaleY: 1 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="absolute left-[15px] top-2 h-full w-px origin-top bg-gradient-to-b from-primary via-secondary to-transparent md:left-1/2"
        />

        <Reveal className="space-y-8" delay={0.14}>
          {STEPS.map((s, i) => (
            <RevealItem key={s.year}>
              <div
                className={`relative grid grid-cols-[32px_minmax(0,1fr)] gap-5 md:grid-cols-2 md:gap-12 ${
                  i % 2 ? "md:[&>*:first-child]:order-2" : ""
                }`}
              >
                <div className={`md:contents ${i % 2 ? "" : ""}`}>
                  <span className="relative z-10 mt-4 grid h-8 w-8 place-items-center rounded-full border border-primary/40 bg-background md:absolute md:left-1/2 md:-translate-x-1/2">
                    <motion.span
                      className="h-2 w-2 rounded-full bg-primary"
                      animate={{ scale: [1, 1.5, 1], opacity: [1, 0.4, 1] }}
                      transition={{ duration: 2.4, repeat: Infinity, delay: i * 0.3 }}
                    />
                  </span>
                </div>

                <div className={i % 2 ? "md:col-start-2" : "md:col-start-1 md:text-right"}>
                  <GlassCard tone={i % 2 ? "secondary" : "primary"}>
                    <span className="font-display text-2xl font-bold text-gradient-neon">
                      {s.year}
                    </span>
                    <h3 className="mt-2 font-display text-lg font-semibold tracking-wide text-foreground">
                      {s.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
                  </GlassCard>
                </div>
              </div>
            </RevealItem>
          ))}
        </Reveal>
      </div>
    </Section>
  );
}

export default Timeline;
