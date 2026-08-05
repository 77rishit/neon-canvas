import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FiChevronLeft, FiChevronRight, FiPause, FiPlay } from "react-icons/fi";
import { Section } from "@/components/Section";
import { TESTIMONIALS } from "@/data/fest";

const AUTOPLAY_MS = 5200;

/** Auto-playing quote slider with manual controls and dot navigation. */
export function Testimonials() {
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(true);

  const go = useCallback((dir: 1 | -1) => {
    setIndex((i) => (i + dir + TESTIMONIALS.length) % TESTIMONIALS.length);
  }, []);

  useEffect(() => {
    if (!playing) return;
    const id = window.setInterval(() => go(1), AUTOPLAY_MS);
    return () => window.clearInterval(id);
  }, [playing, go, index]);

  const item = TESTIMONIALS[index]!;

  return (
    <Section
      id="testimonials"
      eyebrow="Testimonials"
      title="What last year's grid said"
      description="Unedited feedback from winners, finalists and first-timers."
    >
      <div
        className="glass-panel relative overflow-hidden rounded-3xl p-8 md:p-14"
        onMouseEnter={() => setPlaying(false)}
        onMouseLeave={() => setPlaying(true)}
        aria-roledescription="carousel"
      >
        <span
          aria-hidden
          className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-secondary/10 blur-[90px]"
        />
        <AnimatePresence mode="wait">
          <motion.blockquote
            key={index}
            initial={{ opacity: 0, y: 24, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -18, filter: "blur(6px)" }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="relative min-h-[11rem]"
          >
            <p className="text-pretty text-xl leading-relaxed text-foreground md:text-2xl">
              “{item.quote}”
            </p>
            <footer className="mt-7">
              <p className="font-display text-sm uppercase tracking-[0.16em] text-primary">
                {item.name}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">{item.role}</p>
            </footer>
          </motion.blockquote>
        </AnimatePresence>

        <div className="relative mt-10 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => go(-1)}
            aria-label="Previous testimonial"
            className="grid min-h-11 min-w-11 place-items-center rounded-xl border border-border text-muted-foreground transition-colors hover:border-primary/50 hover:text-primary focus-visible:ring-2 focus-visible:ring-ring"
          >
            <FiChevronLeft size={20} />
          </button>
          <button
            type="button"
            onClick={() => go(1)}
            aria-label="Next testimonial"
            className="grid min-h-11 min-w-11 place-items-center rounded-xl border border-border text-muted-foreground transition-colors hover:border-primary/50 hover:text-primary focus-visible:ring-2 focus-visible:ring-ring"
          >
            <FiChevronRight size={20} />
          </button>
          <button
            type="button"
            onClick={() => setPlaying((p) => !p)}
            aria-label={playing ? "Pause autoplay" : "Resume autoplay"}
            className="grid min-h-11 min-w-11 place-items-center rounded-xl border border-border text-muted-foreground transition-colors hover:border-secondary/50 hover:text-secondary focus-visible:ring-2 focus-visible:ring-ring"
          >
            {playing ? <FiPause size={17} /> : <FiPlay size={17} />}
          </button>

          <div className="ml-auto flex gap-2">
            {TESTIMONIALS.map((t, i) => (
              <button
                key={t.name}
                type="button"
                onClick={() => setIndex(i)}
                aria-label={`Go to testimonial ${i + 1}`}
                aria-current={i === index}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === index ? "w-8 bg-primary shadow-[0_0_10px_var(--primary)]" : "w-3 bg-border"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}

export default Testimonials;
