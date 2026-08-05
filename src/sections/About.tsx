import { motion } from "framer-motion";
import { FiTarget, FiZap, FiLayers } from "react-icons/fi";
import { Section } from "@/components/Section";
import { GlassCard } from "@/components/GlassCard";
import { ParallaxBackdrop } from "@/components/ParallaxBackdrop";
import { Reveal, RevealItem } from "@/components/Reveal";

const PILLARS = [
  {
    icon: FiTarget,
    title: "Precision first",
    body: "Every pixel is a decision. We design with grids, ratios and intent — never decoration for its own sake.",
  },
  {
    icon: FiZap,
    title: "Realtime craft",
    body: "Shaders, physics and motion systems built to run at 60fps on the devices people actually use.",
  },
  {
    icon: FiLayers,
    title: "Systems, not pages",
    body: "Tokens, primitives and motion rules that scale from a landing page to an entire product surface.",
  },
];

export function About() {
  return (
    <Section
      id="about"
      eyebrow="About"
      title="A studio wired for the next interface"
      description="NEO//GRID is a small, senior team building realtime web experiences for brands that refuse to look like everyone else."
      className="overflow-hidden"
    >
      <ParallaxBackdrop align="right" />

      <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
        <Reveal className="space-y-5">
          <RevealItem>
            <p className="text-lg leading-relaxed text-foreground/80">
              We operate at the intersection of engineering and art direction — prototyping in
              code, iterating in the browser, and shipping interfaces that feel like hardware.
            </p>
          </RevealItem>
          <RevealItem>
            <p className="leading-relaxed text-muted-foreground">
              Founded in 2019, the studio has delivered realtime product launches, immersive
              brand worlds and design systems for teams across Berlin, Tokyo and San Francisco.
              Every engagement is led by the people doing the work — no handoffs, no layers.
            </p>
          </RevealItem>
          <RevealItem className="flex flex-wrap gap-3 pt-2">
            {["Realtime 3D", "Motion systems", "Design engineering", "Brand worlds"].map((t) => (
              <span
                key={t}
                className="rounded-full border border-primary/25 bg-primary/5 px-4 py-1.5 font-display text-[0.6rem] uppercase tracking-[0.28em] text-primary transition-colors hover:border-primary/60 hover:bg-primary/10"
              >
                {t}
              </span>
            ))}
          </RevealItem>
        </Reveal>

        <Reveal className="grid gap-4" delay={0.12}>
          {PILLARS.map(({ icon: Icon, title, body }) => (
            <RevealItem key={title}>
              <GlassCard className="flex gap-4">
                <motion.span
                  whileHover={{ rotate: 8, scale: 1.08 }}
                  className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-primary/30 bg-primary/10 text-primary"
                >
                  <Icon size={20} />
                </motion.span>
                <div className="min-w-0">
                  <h3 className="font-display text-base font-semibold tracking-wide text-foreground">
                    {title}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{body}</p>
                </div>
              </GlassCard>
            </RevealItem>
          ))}
        </Reveal>
      </div>
    </Section>
  );
}

export default About;
