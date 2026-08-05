import { motion } from "framer-motion";
import { HiArrowNarrowRight } from "react-icons/hi";
import { FiCalendar, FiMapPin } from "react-icons/fi";
import { Button } from "@/components/Button";
import { AnimatedBackground } from "@/components/AnimatedBackground";
import { LazyHeroScene } from "@/components/three/LazyHeroScene";
import { ScrollIndicator } from "@/components/ScrollIndicator";
import { useTypingText } from "@/hooks/useTypingText";
import { scrollToSection } from "@/utils/scroll";
import { FEST } from "@/data/fest";
import { fadeUp, stagger } from "@/utils/motion";

const PHRASES = ["36-hour hackathons.", "combat robotics.", "esports on the main stage."];

const HEADING_LINES: { words: string[]; glow: boolean }[] = [
  { words: ["Enter", "the"], glow: false },
  { words: ["Techfest", "grid"], glow: true },
];

export function Hero() {
  const typed = useTypingText(PHRASES);

  return (
    <section id="home" className="relative flex min-h-dvh w-full items-center overflow-hidden">
      <AnimatedBackground />

      <div
        aria-hidden
        data-depth="mid"
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

      <div
        className="relative z-10 mx-auto w-full max-w-6xl px-6 pt-32 pb-28 md:pt-36"
        data-depth="front"
      >
        <motion.div
          variants={stagger(0.12)}
          initial="hidden"
          animate="show"
          className="max-w-4xl md:max-w-xl lg:max-w-2xl"
        >
          <motion.div
            variants={fadeUp}
            className="inline-flex items-center gap-3 rounded-full border border-primary/25 bg-primary/5 px-4 py-1.5"
          >
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-70" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-primary" />
            </span>
            <span className="font-display text-[0.6rem] uppercase tracking-[0.38em] text-primary">
              Registrations open — {FEST.edition}
            </span>
          </motion.div>

          {/* Heading reveals line-by-line, word-by-word, from behind a mask. */}
          <h1 className="mt-8 text-[clamp(2.75rem,9vw,7rem)] font-bold leading-[0.92] tracking-tight">
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
            className="mt-7 max-w-lg text-pretty text-base leading-relaxed text-muted-foreground md:text-lg"
          >
            Three days of{" "}
            <span className="text-foreground">
              {typed}
              <span className="ml-0.5 inline-block h-[1em] w-[2px] translate-y-[0.14em] bg-primary" />
            </span>
            <br />
            {FEST.name} {FEST.edition} is where the country&apos;s builders collide.
          </motion.p>

          <motion.div
            variants={fadeUp}
            transition={{ delay: 1.05, duration: 0.7 }}
            className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 font-display text-[0.62rem] uppercase tracking-[0.24em] text-muted-foreground"
          >
            <span className="inline-flex items-center gap-2">
              <FiCalendar className="text-primary" /> {FEST.dates}
            </span>
            <span className="inline-flex items-center gap-2">
              <FiMapPin className="text-secondary" /> Bengaluru
            </span>
          </motion.div>

          <motion.div
            variants={fadeUp}
            transition={{ delay: 1.15, duration: 0.7 }}
            className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center"
          >
            <Button size="lg" onClick={() => scrollToSection("#registration")}>
              Register Now
              <HiArrowNarrowRight />
            </Button>
            <Button size="lg" variant="outline" onClick={() => scrollToSection("#events")}>
              Explore Events
            </Button>
          </motion.div>
        </motion.div>
      </div>

      <ScrollIndicator href="#about" />
    </section>
  );
}

export default Hero;
