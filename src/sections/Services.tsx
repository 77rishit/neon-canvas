import { HiArrowNarrowRight } from "react-icons/hi";
import { FiBox, FiMonitor, FiPenTool, FiTrendingUp } from "react-icons/fi";
import { Section } from "@/components/Section";
import { GlassCard } from "@/components/GlassCard";
import { ParallaxBackdrop } from "@/components/ParallaxBackdrop";
import { Reveal, RevealItem } from "@/components/Reveal";

const SERVICES = [
  {
    icon: FiBox,
    title: "Realtime 3D",
    price: "from $18k",
    body: "WebGL product configurators, immersive scenes and interactive brand worlds.",
    items: ["R3F pipelines", "Shader work", "Asset optimisation"],
  },
  {
    icon: FiPenTool,
    title: "Art direction",
    price: "from $9k",
    body: "Visual identity translated into a motion-first digital language.",
    items: ["Concept boards", "Type & colour", "Motion principles"],
  },
  {
    icon: FiMonitor,
    title: "Design engineering",
    price: "from $22k",
    body: "Component systems and production front-ends built by the designers.",
    items: ["React + TS", "Design tokens", "A11y & perf"],
  },
  {
    icon: FiTrendingUp,
    title: "Growth surfaces",
    price: "from $12k",
    body: "Launch pages and campaign micro-sites engineered to convert.",
    items: ["SEO & schema", "Experimentation", "Analytics wiring"],
  },
];

export function Services() {
  return (
    <Section
      id="services"
      eyebrow="Services"
      title="How we plug in"
      description="Four focused engagements. Combine them into a full launch or take a single track."
      className="overflow-hidden"
    >
      <ParallaxBackdrop align="right" />

      <Reveal className="grid gap-5 md:grid-cols-2">
        {SERVICES.map(({ icon: Icon, title, price, body, items }, i) => (
          <RevealItem key={title}>
            <GlassCard tone={i % 2 ? "secondary" : "primary"} className="h-full p-7">
              <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4">
                <div className="flex min-w-0 items-center gap-3">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-primary/30 bg-primary/10 text-primary">
                    <Icon size={20} />
                  </span>
                  <h3 className="truncate font-display text-xl font-semibold tracking-wide text-foreground">
                    {title}
                  </h3>
                </div>
                <span className="shrink-0 font-display text-[0.6rem] uppercase tracking-[0.24em] text-secondary">
                  {price}
                </span>
              </div>

              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{body}</p>

              <ul className="mt-5 space-y-2">
                {items.map((it) => (
                  <li key={it} className="flex items-center gap-2.5 text-sm text-foreground/75">
                    <span className="h-1.5 w-1.5 rotate-45 bg-primary" />
                    {it}
                  </li>
                ))}
              </ul>

              <a
                href="#contact"
                className="mt-6 inline-flex items-center gap-2 font-display text-[0.62rem] uppercase tracking-[0.28em] text-primary transition-colors hover:text-foreground"
              >
                Start a brief
                <HiArrowNarrowRight className="transition-transform duration-300 group-hover/card:translate-x-1.5" />
              </a>
            </GlassCard>
          </RevealItem>
        ))}
      </Reveal>
    </Section>
  );
}

export default Services;
