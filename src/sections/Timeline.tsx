import { useState } from "react";
import { AnimatePresence, motion, useScroll, useSpring } from "framer-motion";
import { useRef } from "react";
import { FiPlus } from "react-icons/fi";
import { Section } from "@/components/Section";
import { SCHEDULE } from "@/data/fest";

/** Vertical schedule spine with a scroll-tracked fill and expandable milestones. */
export function Timeline() {
  const listRef = useRef<HTMLOListElement>(null);
  const [open, setOpen] = useState<string | null>(SCHEDULE[1]?.id ?? null);

  const { scrollYProgress } = useScroll({
    target: listRef,
    offset: ["start 75%", "end 60%"],
  });
  const scaleY = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.4 });

  return (
    <Section
      id="timeline"
      eyebrow="Schedule"
      title="Three days, minute by minute"
      description="Click any milestone to expand the detail. Full session-level timings drop in the fest app one week before doors."
    >
      <ol ref={listRef} className="relative ml-3 space-y-5 pl-8 sm:ml-6 sm:pl-12">
        <span aria-hidden className="absolute left-0 top-2 h-full w-px bg-border" />
        <motion.span
          aria-hidden
          style={{ scaleY }}
          className="absolute left-0 top-2 h-full w-px origin-top bg-[image:var(--gradient-neon)] shadow-[0_0_12px_var(--primary)]"
        />

        {SCHEDULE.map((item, i) => {
          const expanded = open === item.id;
          return (
            <motion.li
              key={item.id}
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.6, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
              className="relative"
            >
              <span
                aria-hidden
                className={`absolute -left-8 top-6 h-3 w-3 -translate-x-1/2 rounded-full border transition-all duration-300 sm:-left-12 ${
                  expanded
                    ? "border-primary bg-primary shadow-[0_0_16px_var(--primary)]"
                    : "border-primary/50 bg-background"
                }`}
              />
              <button
                type="button"
                aria-expanded={expanded}
                onClick={() => setOpen(expanded ? null : item.id)}
                className="glass-panel block w-full rounded-2xl p-6 text-left outline-none transition-colors duration-300 hover:border-primary/40 focus-visible:ring-2 focus-visible:ring-ring"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <span className="font-display text-[0.55rem] uppercase tracking-[0.3em] text-primary">
                      {item.day} — {item.date}
                    </span>
                    <h3 className="mt-2 font-display text-lg uppercase tracking-[0.06em] text-foreground">
                      {item.title}
                    </h3>
                  </div>
                  <motion.span
                    animate={{ rotate: expanded ? 45 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="mt-1 shrink-0 text-secondary"
                  >
                    <FiPlus size={20} />
                  </motion.span>
                </div>

                <AnimatePresence initial={false}>
                  {expanded && (
                    <motion.p
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden text-sm leading-relaxed text-muted-foreground"
                    >
                      <span className="mt-4 block border-t border-border/60 pt-4">{item.detail}</span>
                    </motion.p>
                  )}
                </AnimatePresence>
              </button>
            </motion.li>
          );
        })}
      </ol>
    </Section>
  );
}

export default Timeline;
