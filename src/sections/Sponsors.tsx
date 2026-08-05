import { useCallback, useEffect, useRef, useState } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { gsap } from "@/utils/gsap";
import { Section } from "@/components/Section";
import { SPONSORS } from "@/data/fest";
import { useHorizontalScrub } from "@/hooks/animation/useHorizontalScrub";

/**
 * Sponsor rail with horizontal choreography.
 *
 * On desktop the row is scrubbed sideways by the page scroll (GSAP drives the
 * rail's scrollLeft), so the section reads as a horizontal pass inside a
 * vertical page. Narrow screens keep a timed auto-advance and native swipe.
 * Manual controls work in both modes.
 */
export function Sponsors() {
  const railRef = useHorizontalScrub<HTMLDivElement>({ amount: 0.92 });
  const listRef = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);
  const [scrubbed, setScrubbed] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px) and (prefers-reduced-motion: no-preference)");
    const sync = () => setScrubbed(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  // Tiles fan in one after another as the rail arrives.
  useEffect(() => {
    const el = listRef.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        "[data-sponsor]",
        { opacity: 0, x: 60, rotateY: -14 },
        {
          opacity: 1,
          x: 0,
          rotateY: 0,
          duration: 0.8,
          ease: "expo.out",
          stagger: 0.06,
          clearProps: "transform",
          scrollTrigger: { trigger: el, start: "top 88%", once: true },
        },
      );
    }, el);
    return () => ctx.revert();
  }, []);

  const scrollBy = useCallback((dir: 1 | -1) => {
    const rail = railRef.current;
    if (!rail) return;
    const step = rail.clientWidth * 0.7;
    const atEnd = rail.scrollLeft + rail.clientWidth >= rail.scrollWidth - 8;
    if (dir === 1 && atEnd) rail.scrollTo({ left: 0, behavior: "smooth" });
    else if (dir === -1 && rail.scrollLeft <= 8)
      rail.scrollTo({ left: rail.scrollWidth, behavior: "smooth" });
    else rail.scrollBy({ left: step * dir, behavior: "smooth" });
  }, [railRef]);

  useEffect(() => {
    if (paused || scrubbed) return;
    const id = window.setInterval(() => scrollBy(1), 3200);
    return () => window.clearInterval(id);
  }, [paused, scrubbed, scrollBy]);

  return (
    <Section
      id="sponsors"
      eyebrow="Sponsors"
      title="Backed by the industry"
      description="Nine partners fund the prize pool, staff the mentor desks and run the recruiter lounge across all three days."
    >
      <div
        ref={listRef}
        className="relative"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onFocusCapture={() => setPaused(true)}
        onBlurCapture={() => setPaused(false)}
      >
        <div
          ref={railRef}
          className="flex snap-x snap-mandatory gap-5 overflow-x-auto pb-4 [perspective:1000px] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          role="group"
          aria-label="Sponsor logos"
        >
          {SPONSORS.map((sponsor) => (
            <a
              key={sponsor.name}
              data-sponsor
              href={sponsor.url}
              target="_blank"
              rel="noreferrer noopener sponsored"
              aria-label={`${sponsor.name} — ${sponsor.tier} (opens in a new tab)`}
              className="group glass-panel relative flex min-w-[15rem] shrink-0 snap-start flex-col items-center justify-center gap-3 rounded-2xl px-8 py-10 outline-none transition-[transform,border-color,box-shadow] duration-300 hover:-translate-y-2 hover:border-primary/45 hover:shadow-[0_0_40px_-14px_var(--primary)] focus-visible:ring-2 focus-visible:ring-ring"
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
            </a>
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
            {scrubbed ? "Scroll-linked rail" : paused ? "Auto-scroll paused" : "Auto-scrolling"}
          </span>
        </div>
      </div>
    </Section>
  );
}

export default Sponsors;
