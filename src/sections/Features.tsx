import { FiCpu, FiFeather, FiGlobe, FiLock, FiActivity, FiCode } from "react-icons/fi";
import { Section } from "@/components/Section";
import { GlassCard } from "@/components/GlassCard";
import { ParallaxBackdrop } from "@/components/ParallaxBackdrop";
import { Reveal, RevealItem } from "@/components/Reveal";

const FEATURES = [
  { icon: FiCpu, title: "GPU-driven visuals", body: "Custom shaders, instancing and post-processing tuned per device tier." },
  { icon: FiFeather, title: "Motion language", body: "Spring physics and scroll choreography defined once, reused everywhere." },
  { icon: FiGlobe, title: "Edge delivered", body: "SSR at the edge with streaming HTML and sub-second first paint worldwide." },
  { icon: FiLock, title: "Hardened by default", body: "Type-safe boundaries, strict CSP and audited dependencies on every build." },
  { icon: FiActivity, title: "Measured, not guessed", body: "Core Web Vitals budgets enforced in CI — regressions never reach main." },
  { icon: FiCode, title: "Handover ready", body: "Documented tokens, primitives and stories your team can extend on day one." },
];

export function Features() {
  return (
    <Section
      id="features"
      eyebrow="Features"
      title="Engineered advantages"
      description="The building blocks behind every NEO//GRID interface — production-grade, benchmarked, and yours to keep."
      className="overflow-hidden"
    >
      <ParallaxBackdrop align="left" />

      <Reveal className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map(({ icon: Icon, title, body }, i) => (
          <RevealItem key={title}>
            <GlassCard tone={i % 2 ? "secondary" : "primary"} className="h-full">
              <span
                className={`grid h-12 w-12 place-items-center rounded-xl border transition-transform duration-300 group-hover/card:scale-110 ${
                  i % 2
                    ? "border-secondary/30 bg-secondary/10 text-secondary"
                    : "border-primary/30 bg-primary/10 text-primary"
                }`}
              >
                <Icon size={22} />
              </span>
              <h3 className="mt-5 font-display text-lg font-semibold tracking-wide text-foreground">
                {title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{body}</p>
              <span className="mt-5 block h-px w-full origin-left scale-x-0 bg-gradient-to-r from-primary via-secondary to-transparent transition-transform duration-500 group-hover/card:scale-x-100" />
            </GlassCard>
          </RevealItem>
        ))}
      </Reveal>
    </Section>
  );
}

export default Features;
