import { useState } from "react";
import { FiCalendar, FiMapPin, FiAward, FiUsers, FiClock } from "react-icons/fi";
import { Section } from "@/components/Section";
import { GlassCard } from "@/components/GlassCard";
import { Button } from "@/components/Button";
import { Modal } from "@/components/Modal";
import { useRegistration } from "@/context/RegistrationContext";
import { EVENTS, type FestEvent } from "@/data/fest";

const DIFFICULTY_TONE: Record<FestEvent["difficulty"], string> = {
  Beginner: "border-primary/40 text-primary",
  Intermediate: "border-secondary/50 text-secondary",
  Advanced: "border-destructive/50 text-destructive",
};

export function Events() {
  const [active, setActive] = useState<FestEvent | null>(null);
  const { registerFor } = useRegistration();

  return (
    <Section
      id="events"
      eyebrow="Events"
      title="Four flagship tracks"
      description="Pick your arena. Every track has its own brief, judging panel and prize pool — and every one of them is open to first-time participants."
    >
      <div className="grid gap-6 md:grid-cols-2" data-fx="stagger">
        {EVENTS.map((event, i) => (
          <GlassCard
            key={event.id}
            floatIndex={i}
            tone={i % 2 === 0 ? "primary" : "secondary"}
            className="flex h-full flex-col p-0"
          >
            <div className="relative aspect-16/9 overflow-hidden rounded-t-2xl">
              <img
                src={event.image}
                alt={event.title}
                loading="lazy"
                width={1280}
                height={853}
                className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover/card:scale-105"
              />
              <span className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
              <span
                className={`absolute right-4 top-4 rounded-full border bg-background/70 px-3 py-1 font-display text-[0.55rem] uppercase tracking-[0.26em] backdrop-blur-sm ${DIFFICULTY_TONE[event.difficulty]}`}
              >
                {event.difficulty}
              </span>
            </div>

            <div className="flex flex-1 flex-col p-6">
              <span className="font-display text-[0.58rem] uppercase tracking-[0.3em] text-primary">
                {event.tagline}
              </span>
              <h3 className="mt-3 font-display text-xl uppercase tracking-[0.08em] text-foreground">
                {event.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {event.description}
              </p>

              <dl className="mt-6 grid grid-cols-2 gap-3 text-xs text-muted-foreground">
                <div className="flex items-center gap-2">
                  <FiCalendar className="shrink-0 text-primary" />
                  <span>{event.date}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FiMapPin className="shrink-0 text-primary" />
                  <span>{event.venue}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FiAward className="shrink-0 text-secondary" />
                  <span>{event.prize}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FiUsers className="shrink-0 text-secondary" />
                  <span>{event.teamSize}</span>
                </div>
              </dl>

              <div className="mt-7 flex flex-wrap gap-3 pt-1">
                <Button size="sm" variant="outline" onClick={() => setActive(event)}>
                  View Details
                </Button>
                <Button size="sm" onClick={() => registerFor(event.title)}>
                  Register
                </Button>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>

      <Modal open={Boolean(active)} onClose={() => setActive(null)} title={active?.title ?? "Event"}>
        {active && (
          <div>
            <div className="relative aspect-16/9 overflow-hidden rounded-t-2xl">
              <img
                src={active.image}
                alt={active.title}
                loading="lazy"
                width={1280}
                height={853}
                className="h-full w-full object-cover"
              />
              <span className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
            </div>
            <div className="p-6 md:p-8">
              <span className="font-display text-[0.58rem] uppercase tracking-[0.3em] text-primary">
                {active.tagline}
              </span>
              <h3 className="mt-3 font-display text-2xl uppercase tracking-[0.06em] text-gradient-neon">
                {active.title}
              </h3>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                {active.longDescription}
              </p>

              <dl className="mt-6 grid gap-3 sm:grid-cols-2">
                {[
                  { icon: FiCalendar, label: "Date", value: active.date },
                  { icon: FiClock, label: "Start", value: active.time },
                  { icon: FiMapPin, label: "Venue", value: active.venue },
                  { icon: FiAward, label: "Prize pool", value: active.prize },
                  { icon: FiUsers, label: "Team size", value: active.teamSize },
                ].map((row) => (
                  <div
                    key={row.label}
                    className="flex items-center gap-3 rounded-xl border border-border/60 bg-foreground/[0.02] px-4 py-3"
                  >
                    <row.icon className="shrink-0 text-primary" />
                    <div>
                      <dt className="font-display text-[0.52rem] uppercase tracking-[0.26em] text-muted-foreground">
                        {row.label}
                      </dt>
                      <dd className="text-sm text-foreground">{row.value}</dd>
                    </div>
                  </div>
                ))}
              </dl>

              <h4 className="mt-7 font-display text-[0.6rem] uppercase tracking-[0.3em] text-secondary">
                Rules
              </h4>
              <ul className="mt-3 space-y-2">
                {active.rules.map((rule) => (
                  <li key={rule} className="flex gap-3 text-sm text-muted-foreground">
                    <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-primary" />
                    {rule}
                  </li>
                ))}
              </ul>

              <div className="mt-8 flex flex-wrap gap-3">
                <Button
                  onClick={() => {
                    const title = active.title;
                    setActive(null);
                    registerFor(title);
                  }}
                >
                  Register for {active.title}
                </Button>
                <Button variant="ghost" onClick={() => setActive(null)}>
                  Close
                </Button>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </Section>
  );
}

export default Events;
