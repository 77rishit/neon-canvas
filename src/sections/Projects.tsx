import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HiArrowNarrowRight } from "react-icons/hi";
import { Section } from "@/components/Section";
import { GlassCard } from "@/components/GlassCard";
import { ParallaxBackdrop } from "@/components/ParallaxBackdrop";
import { Reveal, RevealItem } from "@/components/Reveal";

const FILTERS = ["All", "Realtime", "Product", "Brand"] as const;
type Filter = (typeof FILTERS)[number];

const PROJECTS = [
  { name: "Kinetic", tag: "Realtime", year: "2026", body: "A WebGL configurator for a modular audio system.", tint: "from-primary/25 to-secondary/10" },
  { name: "Halo OS", tag: "Product", year: "2025", body: "Design system and dashboard shell for a fintech platform.", tint: "from-secondary/25 to-primary/10" },
  { name: "Nocturne", tag: "Brand", year: "2025", body: "Immersive launch world for a fragrance house.", tint: "from-primary/20 to-primary/5" },
  { name: "Vector Lab", tag: "Realtime", year: "2024", body: "Physics playground powering an engineering brand site.", tint: "from-secondary/20 to-secondary/5" },
  { name: "Meridian", tag: "Product", year: "2024", body: "Analytics surface with streaming charts at 60fps.", tint: "from-primary/25 to-secondary/15" },
  { name: "Aurora Type", tag: "Brand", year: "2023", body: "Variable type specimen with scroll-driven morphing.", tint: "from-secondary/25 to-primary/15" },
];

export function Projects() {
  const [filter, setFilter] = useState<Filter>("All");
  const visible = PROJECTS.filter((p) => filter === "All" || p.tag === filter);

  return (
    <Section
      id="work"
      eyebrow="Showcase"
      title="Selected transmissions"
      description="A cross-section of realtime, product and brand work from the last three years."
      className="overflow-hidden"
    >
      <ParallaxBackdrop align="left" />

      <div className="mb-8 flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            className={`relative rounded-full border px-4 py-1.5 font-display text-[0.6rem] uppercase tracking-[0.28em] transition-colors duration-300 ${
              filter === f
                ? "border-primary/60 text-primary"
                : "border-border text-muted-foreground hover:border-primary/40 hover:text-foreground"
            }`}
          >
            {filter === f && (
              <motion.span
                layoutId="filter-pill"
                className="absolute inset-0 -z-10 rounded-full bg-primary/10"
                transition={{ type: "spring", stiffness: 320, damping: 30 }}
              />
            )}
            {f}
          </button>
        ))}
      </div>

      <Reveal className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {visible.map((p) => (
            <RevealItem key={p.name}>
              <motion.div layout exit={{ opacity: 0, scale: 0.96 }}>
                <GlassCard className="h-full overflow-hidden p-0">
                  <div
                    className={`relative h-44 overflow-hidden bg-gradient-to-br ${p.tint}`}
                  >
                    <div className="grid-lines absolute inset-0 opacity-70 transition-transform duration-700 group-hover/card:scale-110" />
                    <span className="absolute right-4 top-4 rounded-full border border-primary/30 bg-background/50 px-3 py-1 font-display text-[0.55rem] uppercase tracking-[0.26em] text-primary">
                      {p.tag}
                    </span>
                  </div>
                  <div className="p-6">
                    <div className="flex items-baseline justify-between gap-3">
                      <h3 className="truncate font-display text-lg font-semibold tracking-wide text-foreground">
                        {p.name}
                      </h3>
                      <span className="shrink-0 font-display text-[0.6rem] tracking-[0.24em] text-muted-foreground">
                        {p.year}
                      </span>
                    </div>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{p.body}</p>
                    <span className="mt-5 inline-flex items-center gap-2 font-display text-[0.6rem] uppercase tracking-[0.28em] text-primary">
                      View case
                      <HiArrowNarrowRight className="transition-transform duration-300 group-hover/card:translate-x-1.5" />
                    </span>
                  </div>
                </GlassCard>
              </motion.div>
            </RevealItem>
          ))}
        </AnimatePresence>
      </Reveal>
    </Section>
  );
}

export default Projects;
