import { useEffect, useRef } from "react";
import { HiArrowNarrowRight } from "react-icons/hi";
import { FiCalendar, FiMapPin } from "react-icons/fi";
import { gsap } from "@/utils/gsap";
import { Button } from "@/components/Button";
import { AnimatedBackground } from "@/components/AnimatedBackground";
import { LazyHeroScene } from "@/components/three/LazyHeroScene";
import { ScrollIndicator } from "@/components/ScrollIndicator";
import { useTypingText } from "@/hooks/useTypingText";
import { scrollToSection } from "@/utils/scroll";
import { FEST } from "@/data/fest";

const PHRASES = ["36-hour hackathons.", "combat robotics.", "esports on the main stage."];

const HEADING_LINES: { words: string[]; glow: boolean }[] = [
  { words: ["Enter", "the"], glow: false },
  { words: ["Techfest", "grid"], glow: true },
];

/**
 * Hero — the opening GSAP timeline. Words rise word-by-word from behind their
 * line masks, the supporting copy follows, and the whole column drifts on a
 * scrubbed parallax layer as you leave.
 */
export function Hero() {
  const typed = useTypingText(PHRASES);
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const ctx = gsap.context(() => {
        const tl = gsap.timeline({ defaults: { ease: "expo.out" }, delay: 0.25 });

        tl.fromTo(
          "[data-hero-badge]",
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.8 },
        )
          .fromTo(
            "[data-hero-word]",
            { yPercent: 115, rotate: 4, opacity: 0 },
            { yPercent: 0, rotate: 0, opacity: 1, duration: 1.1, stagger: 0.08 },
            "-=0.5",
          )
          .fromTo(
            "[data-hero-item]",
            { opacity: 0, y: 26 },
            { opacity: 1, y: 0, duration: 0.8, stagger: 0.1, clearProps: "transform" },
            "-=0.7",
          );

        // Content sinks and fades as the hero exits — the front parallax layer.
        gsap.to("[data-hero-content]", {
          yPercent: 14,
          opacity: 0.25,
          ease: "none",
          scrollTrigger: {
            trigger: root,
            start: "top top",
            end: "bottom top",
            scrub: 0.5,
          },
        });
      }, root);

      return () => ctx.revert();
    });

    return () => mm.revert();
  }, []);

  return (
    <section
      id="home"
      ref={rootRef}
      className="relative flex min-h-dvh w-full items-center overflow-hidden"
    >
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
        data-hero-content
        className="relative z-10 mx-auto w-full max-w-6xl px-6 pt-32 pb-28 md:pt-36"
      >
        <div className="max-w-4xl md:max-w-xl lg:max-w-2xl">
          <div
            data-hero-badge
            className="inline-flex items-center gap-3 rounded-full border border-primary/25 bg-primary/5 px-4 py-1.5 opacity-0"
          >
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-70" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-primary" />
            </span>
            <span className="font-display text-[0.6rem] uppercase tracking-[0.38em] text-primary">
              Registrations open — {FEST.edition}
            </span>
          </div>

          {/* Heading reveals line-by-line, word-by-word, from behind a mask. */}
          <h1 className="mt-8 text-[clamp(2.75rem,9vw,7rem)] font-bold leading-[0.92] tracking-tight">
            {HEADING_LINES.map((line, li) => (
              <span key={li} className="block overflow-hidden pb-[0.08em]">
                {line.words.map((word, wi) => (
                  <span
                    key={word}
                    data-hero-word
                    className={`inline-block opacity-0 will-change-transform ${
                      line.glow ? "text-gradient-neon" : "text-foreground"
                    }`}
                  >
                    {word}
                    {wi < line.words.length - 1 && <span>&nbsp;</span>}
                  </span>
                ))}
              </span>
            ))}
          </h1>

          <p
            data-hero-item
            className="mt-7 max-w-lg text-pretty text-base leading-relaxed text-muted-foreground opacity-0 md:text-lg"
          >
            Five days of{" "}
            <span className="text-foreground">
              {typed}
              <span className="ml-0.5 inline-block h-[1em] w-[2px] translate-y-[0.14em] bg-primary" />
            </span>
            <br />
            {FEST.name} {FEST.edition} is where the country&apos;s builders collide.
          </p>

          <div
            data-hero-item
            className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 font-display text-[0.62rem] uppercase tracking-[0.24em] text-muted-foreground opacity-0"
          >
            <span className="inline-flex items-center gap-2">
              <FiCalendar className="text-primary" /> {FEST.dates}
            </span>
            <span className="inline-flex items-center gap-2">
              <FiMapPin className="text-secondary" /> Bengaluru
            </span>
          </div>

          <div
            data-hero-item
            className="mt-10 flex flex-col gap-4 opacity-0 sm:flex-row sm:items-center"
          >
            <Button size="lg" onClick={() => scrollToSection("#registration")}>
              Register Now
              <HiArrowNarrowRight />
            </Button>
            <Button size="lg" variant="outline" onClick={() => scrollToSection("#events")}>
              Explore Events
            </Button>
          </div>
        </div>
      </div>

      <ScrollIndicator href="#about" />
    </section>
  );
}

export default Hero;
