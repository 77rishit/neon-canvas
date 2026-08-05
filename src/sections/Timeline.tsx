import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FiPlus } from "react-icons/fi";
import { gsap } from "@/utils/gsap";
import { Section } from "@/components/Section";
import { SCHEDULE } from "@/data/fest";

/**
 * Vertical schedule spine: the neon line draws itself on scrub while each
 * milestone slides in from the spine, and any card can expand for detail.
 */
export function Timeline() {
  const listRef = useRef<HTMLOListElement>(null);
  const [open, setOpen] = useState<string | null>(SCHEDULE[1]?.id ?? null);

  useEffect(() => {
    const list = listRef.current;
    if (!list) return;

    const ctx = gsap.context(() => {
      // Spine fill, scrubbed across the list's travel.
      gsap.fromTo(
        "[data-spine]",
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: "none",
          scrollTrigger: {
            trigger: list,
            start: "top 75%",
            end: "bottom 60%",
            scrub: 0.4,
            invalidateOnRefresh: true,
          },
        },
      );

      // Milestones swing in off the spine, with their nodes popping after.
      const items = gsap.utils.toArray<HTMLElement>("[data-milestone]", list);
      items.forEach((item) => {
        gsap
          .timeline({ scrollTrigger: { trigger: item, start: "top 88%", once: true } })
          .fromTo(
            item,
            { opacity: 0, x: 60, transformOrigin: "0% 50%", rotate: 1.5 },
            { opacity: 1, x: 0, rotate: 0, duration: 0.8, ease: "expo.out" },
          )
          .fromTo(
            item.querySelector("[data-node]"),
            { scale: 0 },
            { scale: 1, duration: 0.5, ease: "back.out(2.4)" },
            "-=0.45",
          );
      });
    }, list);

    return () => ctx.revert();
  }, []);

  return (
    <Section
      id="timeline"
      eyebrow="Schedule"
      title="Five days, minute by minute"
      description="Click any milestone to expand the detail. Full session-level timings drop in the fest app one week before doors."
    >
      <ol ref={listRef} className="relative ml-3 space-y-5 pl-8 sm:ml-6 sm:pl-12">
        <span aria-hidden className="absolute left-0 top-2 h-full w-px bg-border" />
        <span
          data-spine
          aria-hidden
          className="absolute left-0 top-2 h-full w-px origin-top scale-y-0 bg-[image:var(--gradient-neon)] shadow-[0_0_12px_var(--primary)]"
        />

        {SCHEDULE.map((item) => {
          const expanded = open === item.id;
          return (
            <li key={item.id} data-milestone className="relative">
              <span
                data-node
                aria-hidden
                className={`absolute -left-8 top-6 h-3 w-3 -translate-x-1/2 rounded-full border transition-colors duration-300 sm:-left-12 ${
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
                      <span className="mt-4 block border-t border-border/60 pt-4">
                        {item.detail}
                      </span>
                    </motion.p>
                  )}
                </AnimatePresence>
              </button>
            </li>
          );
        })}
      </ol>
    </Section>
  );
}

export default Timeline;
