import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { Section } from "@/components/Section";
import { SPONSORS } from "@/data/fest";

/**
 * Sponsor carousel: an auto-advancing, drag-free rail with working manual
 * controls. Auto-play pauses on hover and focus.
 */
export function Sponsors() {
  const railRef = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);

  const scrollBy = useCallback((dir: 1 | -1) => {
    const rail = railRef.current;
    if (!rail) return;
    const step = rail.clientWidth * 0.7;
    const atEnd = rail.scrollLeft + rail.clientWidth >= rail.scrollWidth - 8;
    if (dir === 1 && atEnd) rail.scrollTo({ left: 0, behavior: "smooth" });
    else if (dir === -1 && rail.scrollLeft <= 8)
      rail.scrollTo({ left: rail.scrollWidth, behavior: "smooth" });
    else rail.scrollBy({ left: step * dir, behavior: "smooth" });
  }, []);

  useEffect(() => {
    if (paused) return;
    const id = window.setInterval(() => scrollBy(1), 3200);
    return () => window.clearInterval(id);
  }, [paused, scrollBy]);

  return (
    <Section
      id="sponsors"
      eyebrow="Sponsors"
      title="Backed by the industry"
      description="Nine partners fund the prize pool, staff the mentor desks and run the recruiter lounge across all three days."
    >
      <div
        className="relative"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onFocusCapture={() => setPaused(true)}
        onBlurCapture={() => setPaused(false)}
      >
        <div
          ref={railRef}
          className="flex snap-x snap-mandatory gap-5 overflow-x-auto pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          role="group"
          aria-label="Sponsor logos"
        >
          {SPONSORS.map((sponsor, i) => (
            <motion.a
              key={sponsor.name}
              href={sponsor.url}
              target="_blank"
              rel="noreferrer noopener sponsored"
              aria-label={`${sponsor.name} — ${sponsor.tier} (opens in a new tab)`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.5, delay: (i % 4) * 0.07 }}
              whileHover={{ y: -8 }}
              className="group glass-panel relative flex min-w-[15rem] shrink-0 snap-start flex-col items-center justify-center gap-3 rounded-2xl px-8 py-10 outline-none transition-colors duration-300 hover:border-primary/45 hover:shadow-[0_0_40px_-14px_var(--primary)] focus-visible:ring-2 focus-visible:ring-ring"
            >
              <span
                aria-hidden
                className="grid h-14 w-14 place-items-center rounded-xl border border-primary/30 bg-primary/5 font-display text-lg text-primary transition-transform duration-500 group-hover:scale-110"
              >
                {sponsor.name.slice(0, 2).toUpperCase()}
              </span>
              <h3 className="font-display text-base uppercase tracking-[0.18em] text-foreground transition-colors group-hover:text-gradient-neon">
                {sponsor.name}
              </h3>
              <p className="font-display text-[0.52rem] uppercase tracking-[0.3em] text-muted-foreground">
                {sponsor.tier}
              </p>
              <span className="pointer-events-none absolute bottom-3 font-display text-[0.5rem] uppercase tracking-[0.28em] text-primary opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                Visit site ↗
              </span>
            </motion.a>
          ))}

        </div>

        <div className="mt-6 flex items-center gap-3">
          <button
            type="button"
            onClick={() => scrollBy(-1)}
            aria-label="Previous sponsors"
            className="grid min-h-11 min-w-11 place-items-center rounded-xl border border-border text-muted-foreground transition-colors hover:border-primary/50 hover:text-primary focus-visible:ring-2 focus-visible:ring-ring"
          >
            <FiChevronLeft size={20} />
          </button>
          <button
            type="button"
            onClick={() => scrollBy(1)}
            aria-label="Next sponsors"
            className="grid min-h-11 min-w-11 place-items-center rounded-xl border border-border text-muted-foreground transition-colors hover:border-primary/50 hover:text-primary focus-visible:ring-2 focus-visible:ring-ring"
          >
            <FiChevronRight size={20} />
          </button>
          <span className="font-display text-[0.52rem] uppercase tracking-[0.28em] text-muted-foreground">
            {paused ? "Auto-scroll paused" : "Auto-scrolling"}
          </span>
        </div>
      </div>
    </Section>
  );
}

export default Sponsors;
