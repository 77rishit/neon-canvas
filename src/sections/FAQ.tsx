import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiPlus } from "react-icons/fi";
import { Section } from "@/components/Section";
import { GlassCard } from "@/components/GlassCard";
import { ParallaxBackdrop } from "@/components/ParallaxBackdrop";
import { Reveal, RevealItem } from "@/components/Reveal";

const FAQS = [
  {
    q: "How long does a typical engagement run?",
    a: "Most launches land between six and twelve weeks. Realtime 3D builds and full design systems usually sit at the upper end, with weekly demos throughout.",
  },
  {
    q: "Do you work with in-house engineering teams?",
    a: "Constantly. We pair with your engineers, work inside your repo and leave documented primitives so the system keeps moving after we hand off.",
  },
  {
    q: "Will heavy 3D hurt performance?",
    a: "Not the way we build it. Scenes are budgeted per device tier, adaptive DPR degrades gracefully, and every build is gated on Core Web Vitals in CI.",
  },
  {
    q: "What do you need to start?",
    a: "A rough brief, a decision maker, and a target date. We run a paid discovery week to turn that into scope, art direction and a fixed plan.",
  },
  {
    q: "Do you offer ongoing support?",
    a: "Yes — retainers cover iteration, experimentation and performance monitoring, typically two to four days a month.",
  },
];

export function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <Section
      id="faq"
      eyebrow="FAQ"
      title="Before you ask"
      description="The questions that come up in almost every first call."
      className="overflow-hidden"
    >
      <ParallaxBackdrop align="left" />

      <Reveal className="mx-auto grid max-w-3xl gap-4" delay={0.1}>
        {FAQS.map((f, i) => {
          const isOpen = open === i;
          return (
            <RevealItem key={f.q}>
              <GlassCard still tone={isOpen ? "secondary" : "primary"} className="p-0">
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  className="grid w-full grid-cols-[minmax(0,1fr)_auto] items-center gap-4 p-6 text-left"
                >
                  <span className="min-w-0 font-display text-base font-semibold tracking-wide text-foreground">
                    {f.q}
                  </span>
                  <motion.span
                    animate={{ rotate: isOpen ? 45 : 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 22 }}
                    className="grid h-8 w-8 shrink-0 place-items-center rounded-lg border border-primary/30 bg-primary/10 text-primary"
                  >
                    <FiPlus size={16} />
                  </motion.span>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <p className="px-6 pb-6 text-sm leading-relaxed text-muted-foreground">
                        {f.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </GlassCard>
            </RevealItem>
          );
        })}
      </Reveal>
    </Section>
  );
}

export default FAQ;
