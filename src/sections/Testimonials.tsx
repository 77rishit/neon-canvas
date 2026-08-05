import { motion } from "framer-motion";
import { FiStar } from "react-icons/fi";
import { Section } from "@/components/Section";
import { GlassCard } from "@/components/GlassCard";
import { ParallaxBackdrop } from "@/components/ParallaxBackdrop";
import { Reveal, RevealItem } from "@/components/Reveal";

const QUOTES = [
  {
    quote:
      "They shipped a realtime configurator in nine weeks that our internal team had scoped at nine months. The frame budget never slipped.",
    name: "Mira Kovács",
    role: "VP Product, Kinetic Audio",
    initials: "MK",
  },
  {
    quote:
      "The motion system they left behind is still the backbone of our product. New engineers pick it up in a day.",
    name: "Daniel Osei",
    role: "Head of Design, Halo",
    initials: "DO",
  },
  {
    quote:
      "Rare studio that argues with you — and is usually right. The launch site pulled 3.1x our previous campaign.",
    name: "Yuki Tanaka",
    role: "Brand Director, Nocturne",
    initials: "YT",
  },
];

export function Testimonials() {
  return (
    <Section
      id="testimonials"
      eyebrow="Testimonials"
      title="Signals from the field"
      description="What partners say once the launch dust settles."
      className="overflow-hidden"
    >
      <ParallaxBackdrop align="right" />

      <Reveal className="grid gap-5 lg:grid-cols-3">
        {QUOTES.map((q, i) => (
          <RevealItem key={q.name}>
            <GlassCard tone={i === 1 ? "secondary" : "primary"} className="flex h-full flex-col p-7">
              <div className="flex gap-1 text-primary">
                {Array.from({ length: 5 }).map((_, s) => (
                  <motion.span
                    key={s}
                    initial={{ opacity: 0, scale: 0.6 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 + s * 0.06 }}
                  >
                    <FiStar size={14} fill="currentColor" />
                  </motion.span>
                ))}
              </div>

              <p className="mt-5 flex-1 text-base leading-relaxed text-foreground/85">
                “{q.quote}”
              </p>

              <div className="mt-7 flex min-w-0 items-center gap-3 border-t border-border pt-5">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-primary/35 bg-primary/10 font-display text-xs tracking-widest text-primary">
                  {q.initials}
                </span>
                <div className="min-w-0">
                  <p className="truncate font-display text-sm font-semibold text-foreground">
                    {q.name}
                  </p>
                  <p className="truncate text-xs text-muted-foreground">{q.role}</p>
                </div>
              </div>
            </GlassCard>
          </RevealItem>
        ))}
      </Reveal>
    </Section>
  );
}

export default Testimonials;
