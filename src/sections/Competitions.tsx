import { useMemo, useState } from "react";
import { AnimatePresence, motion, LayoutGroup } from "framer-motion";
import { FiAward, FiUsers } from "react-icons/fi";
import { Section } from "@/components/Section";
import { GlassCard } from "@/components/GlassCard";
import { Button } from "@/components/Button";
import { useRegistration } from "@/context/RegistrationContext";
import { COMPETITIONS, COMPETITION_CATEGORIES, type CompetitionCategory } from "@/data/fest";

type Filter = "All" | CompetitionCategory;

const FILTERS: Filter[] = ["All", ...COMPETITION_CATEGORIES];

export function Competitions() {
  const [filter, setFilter] = useState<Filter>("All");

  const visible = useMemo(
    () => (filter === "All" ? COMPETITIONS : COMPETITIONS.filter((c) => c.category === filter)),
    [filter],
  );

  const { registerFor } = useRegistration();

  return (
    <Section
      id="competitions"
      eyebrow="Competitions"
      title="Eight brackets, one leaderboard"
      description="Filter by discipline to find your bracket. Every competition feeds the overall college championship standings."
    >
      <LayoutGroup>
        <div role="tablist" aria-label="Competition categories" className="mb-10 flex flex-wrap gap-3">
          {FILTERS.map((f) => {
            const isActive = filter === f;
            return (
              <button
                key={f}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setFilter(f)}
                className={`relative rounded-full border px-5 py-2 font-display text-[0.58rem] uppercase tracking-[0.26em] transition-colors duration-300 outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                  isActive
                    ? "border-primary/60 text-primary"
                    : "border-border text-muted-foreground hover:border-primary/40 hover:text-foreground"
                }`}
              >
                {isActive && (
                  <motion.span
                    layoutId="competition-pill"
                    className="absolute inset-0 -z-10 rounded-full bg-primary/10 shadow-[0_0_26px_-8px_var(--primary)]"
                    transition={{ type: "spring", stiffness: 320, damping: 30 }}
                  />
                )}
                {f}
              </button>
            );
          })}
        </div>

        <motion.div layout className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {visible.map((comp, i) => (
              <motion.div
                key={comp.id}
                layout
                initial={{ opacity: 0, y: 28, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -16, scale: 0.96 }}
                transition={{ duration: 0.45, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] }}
              >
                <GlassCard
                  floatIndex={i}
                  tone={i % 2 === 0 ? "primary" : "secondary"}
                  className="flex h-full flex-col"
                >
                  <span className="font-display text-[0.55rem] uppercase tracking-[0.3em] text-secondary">
                    {comp.category}
                  </span>
                  <h3 className="mt-3 font-display text-lg uppercase tracking-[0.08em] text-foreground">
                    {comp.title}
                  </h3>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">
                    {comp.summary}
                  </p>
                  <div className="mt-6 flex items-center justify-between text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-2">
                      <FiAward className="text-primary" /> {comp.prize}
                    </span>
                    <span className="inline-flex items-center gap-2">
                      <FiUsers className="text-secondary" /> {comp.slots}
                    </span>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="mt-6 w-full"
                    onClick={() => registerFor(comp.title)}
                  >
                    Enter bracket
                  </Button>
                </GlassCard>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </LayoutGroup>
    </Section>
  );
}

export default Competitions;
