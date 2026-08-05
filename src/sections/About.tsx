import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FiCpu, FiGlobe, FiUsers, FiChevronDown } from "react-icons/fi";
import { Section } from "@/components/Section";
import { GlassCard } from "@/components/GlassCard";
import { ParallaxBackdrop } from "@/components/ParallaxBackdrop";
import { FEST } from "@/data/fest";

const PILLARS = [
  {
    icon: FiCpu,
    title: "Build in public",
    summary: "Every competitive track ends with a live demo in front of judges and peers.",
    detail:
      "We run the fest like a product studio: sealed briefs, timed sprints, mentor rotations and a public demo at the end. Judges score on shipped functionality first and polish second, so the fastest learners always place well.",
    tone: "primary" as const,
  },
  {
    icon: FiUsers,
    title: "One campus, every discipline",
    summary: "Coders, designers, hardware tinkerers and casters share the same three days.",
    detail:
      "240 colleges send teams across nine states. Cross-disciplinary teams get priority for mentor slots because the strongest submissions historically pair a systems engineer with a designer.",
    tone: "secondary" as const,
  },
  {
    icon: FiGlobe,
    title: "Industry in the room",
    summary: "Partner engineers mentor, judge and recruit throughout the weekend.",
    detail:
      "Our title and platinum partners staff a recruiter lounge for all three days. Last edition, 180 participants left with internship or full-time offers directly from fest interviews.",
    tone: "primary" as const,
  },
];

export function About() {
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <Section
      id="about"
      eyebrow="About the fest"
      title="Where the country's builders collide"
      description={`${FEST.name} ${FEST.edition} runs ${FEST.dates} at the ${FEST.venue}. Three days, forty-eight tracks and a single rule: ship something real.`}
      className="relative"
    >
      <ParallaxBackdrop />

      <div className="grid gap-6 md:grid-cols-3" data-fx="stagger">
        {PILLARS.map((pillar, i) => {
          const open = expanded === pillar.title;
          return (
            <GlassCard key={pillar.title} tone={pillar.tone} floatIndex={i} className="flex flex-col">
              <span className="grid h-12 w-12 place-items-center rounded-xl border border-primary/25 bg-primary/5 text-primary">
                <pillar.icon size={20} />
              </span>
              <h3 className="mt-6 font-display text-lg uppercase tracking-[0.12em] text-foreground">
                {pillar.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{pillar.summary}</p>

              <AnimatePresence initial={false}>
                {open && (
                  <motion.div
                    key="detail"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    className="overflow-hidden"
                  >
                    <p className="mt-4 border-t border-border/60 pt-4 text-sm leading-relaxed text-muted-foreground">
                      {pillar.detail}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              <button
                type="button"
                aria-expanded={open}
                onClick={() => setExpanded(open ? null : pillar.title)}
                className="mt-6 inline-flex items-center gap-2 self-start font-display text-[0.62rem] uppercase tracking-[0.28em] text-primary outline-none transition-colors hover:text-secondary focus-visible:ring-2 focus-visible:ring-ring"
              >
                {open ? "Read less" : "Read more"}
                <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.3 }}>
                  <FiChevronDown />
                </motion.span>
              </button>
            </GlassCard>
          );
        })}
      </div>
    </Section>
  );
}

export default About;
