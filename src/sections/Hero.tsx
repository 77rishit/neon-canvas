import { motion } from "framer-motion";
import { HiArrowNarrowRight } from "react-icons/hi";
import { FiPlay } from "react-icons/fi";
import { Button } from "@/components/Button";
import { AnimatedBackground } from "@/components/AnimatedBackground";
import { LazyHeroScene } from "@/components/three/LazyHeroScene";
import { ScrollIndicator } from "@/components/ScrollIndicator";
import { useTypingText } from "@/hooks/useTypingText";
import { fadeUp, stagger } from "@/utils/motion";

const PHRASES = ["neural interfaces.", "immersive 3D worlds.", "kinetic web systems."];

const HEADING_LINES: { words: string[]; glow: boolean }[] = [
  { words: ["Design", "beyond"], glow: false },
  { words: ["the", "interface"], glow: true },
];

export function Hero() {
  const typed = useTypingText(PHRASES);

  return (
    <section
      id="home"
      className="relative flex min-h-dvh w-full items-center overflow-hidden"
    >
      <AnimatedBackground />

      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0 opacity-60 md:left-auto md:right-0 md:w-[58%] md:opacity-95"
        style={{
          maskImage:
            "radial-gradient(ellipse 72% 68% at 62% 48%, rgba(0,0,0,1) 35%, rgba(0,0,0,0) 88%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 72% 68% at 62% 48%, rgba(0,0,0,1) 35%, rgba(0,0,0,0) 88%)",
        }}
      >
        <LazyHeroScene className="absolute inset-0" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-6xl px-6 pt-32 pb-28 md:pt-36">
        <motion.div variants={stagger(0.12)} initial="hidden" animate="show" className="max-w-4xl md:max-w-xl lg:max-w-2xl">
          <motion.div
            variants={fadeUp}
            className="inline-flex items-center gap-3 rounded-full border border-primary/25 bg-primary/5 px-4 py-1.5"
          >
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-70" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-primary" />
            </span>
            <span className="font-display text-[0.6rem] uppercase tracking-[0.38em] text-primary">
              System online — v2.0
            </span>
          </motion.div>

          {/* Heading reveals line-by-line, word-by-word, from behind a mask. */}
          <h1 className="mt-8 text-[clamp(2.75rem,9vw,7.5rem)] font-bold leading-[0.92] tracking-tight">
            {HEADING_LINES.map((line, li) => (
              <span key={li} className="block overflow-hidden pb-[0.08em]">
                {line.words.map((word, wi) => (
                  <motion.span
                    key={word}
                    initial={{ y: "110%", rotateZ: 4, opacity: 0 }}
                    animate={{ y: "0%", rotateZ: 0, opacity: 1 }}
                    transition={{
                      duration: 0.95,
                      delay: 0.35 + li * 0.14 + wi * 0.09,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    className={`inline-block will-change-transform ${
                      line.glow ? "text-gradient-neon" : "text-foreground"
                    }`}
                  >
                    {word}
                    {wi < line.words.length - 1 && <span>&nbsp;</span>}
                  </motion.span>
                ))}
              </span>
            ))}
          </h1>

          <motion.p
            variants={fadeUp}
            transition={{ delay: 0.9, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="mt-8 h-8 font-display text-lg text-muted-foreground md:text-2xl"
          >
            <span className="text-foreground/70">We build </span>
            <span className="text-primary">{typed}</span>
            <span className="ml-0.5 inline-block h-[1.05em] w-[2px] translate-y-[0.16em] bg-secondary animate-caret" />
          </motion.p>

          <motion.p
            variants={fadeUp}
            transition={{ delay: 1.05, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground"
          >
            A studio operating at the edge of realtime graphics and motion design — crafting
            digital products that feel engineered, not decorated.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.9, filter: "blur(8px)" }}
            animate={{
              opacity: 1,
              scale: 1,
              filter: "blur(0px)",
              boxShadow: "0 0 0 0 transparent",
            }}
            transition={{ delay: 1.2, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="mt-12 flex flex-wrap items-center gap-4"
          >
            <Button size="lg" className="group shadow-[0_0_45px_-14px_var(--primary)]">
              Launch Project
              <HiArrowNarrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
            </Button>
            <Button size="lg" variant="outline" className="group shadow-[0_0_45px_-16px_var(--secondary)]">
              <FiPlay className="transition-transform duration-300 group-hover:scale-110" />
              Showreel
            </Button>
          </motion.div>

          <motion.dl
            variants={fadeUp}
            className="mt-16 flex flex-wrap gap-x-12 gap-y-6 border-t border-border pt-8"
          >
            {[
              { k: "Projects shipped", v: "120+" },
              { k: "Awards", v: "18" },
              { k: "Avg. load", v: "0.9s" },
            ].map((stat) => (
              <div key={stat.k}>
                <dt className="font-display text-[0.6rem] uppercase tracking-[0.3em] text-muted-foreground">
                  {stat.k}
                </dt>
                <dd className="mt-1 font-display text-2xl font-bold text-gradient-neon">
                  {stat.v}
                </dd>
              </div>
            ))}
          </motion.dl>
        </motion.div>
      </div>

      <ScrollIndicator href="#about" />
    </section>
  );
}

export default Hero;
