import { Section } from "@/components/Section";
import { STATS } from "@/data/fest";
import { useCountUp } from "@/hooks/animation/useCountUp";
import { usePinnedScrub } from "@/hooks/animation/usePinnedScrub";

/** Count-up number, tweened by GSAP the first time it scrolls into view. */
function Counter({ value, suffix }: { value: number; suffix: string }) {
  const ref = useCountUp<HTMLSpanElement>(value, { suffix });
  return <span ref={ref} className="tabular-nums" />;
}

/**
 * Statistics — the one pinned beat of the page. On desktop the section holds
 * still while the four tiles are scrubbed into place; smaller screens get a
 * plain stagger instead of a hijacked scroll.
 */
export function Statistics() {
  const gridRef = usePinnedScrub<HTMLDivElement>({
    childSelector: "[data-stat]",
    distance: "+=55%",
  });

  return (
    <Section
      id="statistics"
      eyebrow="By the numbers"
      title="The scale of the grid"
      description="Figures from the 2025 edition. This year's targets are already tracking twenty percent ahead."
    >
      <div ref={gridRef} className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {STATS.map((stat) => (
          <div
            key={stat.label}
            data-stat
            className="glass-panel relative overflow-hidden rounded-2xl p-7 text-center"
          >
            <span
              aria-hidden
              className="pointer-events-none absolute inset-0 animate-pulse bg-[radial-gradient(circle_at_50%_120%,color-mix(in_srgb,var(--primary)_16%,transparent),transparent_65%)]"
            />
            <p className="relative font-display text-[clamp(2.2rem,5vw,3.2rem)] font-bold leading-none text-gradient-neon">
              <Counter value={stat.value} suffix={stat.suffix} />
            </p>
            <p className="relative mt-4 font-display text-[0.55rem] uppercase tracking-[0.3em] text-muted-foreground">
              {stat.label}
            </p>
          </div>
        ))}
      </div>
    </Section>
  );
}

export default Statistics;
