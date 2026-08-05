import { useRef } from "react";
import { FiCompass, FiCpu, FiLayers, FiSend } from "react-icons/fi";
import { gsap } from "@/utils/gsap";
import { useGsapContext } from "@/hooks/useGsapContext";

const STEPS = [
  {
    step: "01",
    title: "Signal",
    icon: FiCompass,
    body: "A week of interrogation: goals, constraints, frame budget, and the one thing the site must do.",
  },
  {
    step: "02",
    title: "System",
    icon: FiLayers,
    body: "Tokens, type scale, motion rules and component primitives — designed in code, reviewed in the browser.",
  },
  {
    step: "03",
    title: "Build",
    icon: FiCpu,
    body: "Realtime scenes, shaders and interaction layers assembled behind weekly demos on real devices.",
  },
  {
    step: "04",
    title: "Launch",
    icon: FiSend,
    body: "Performance passes, accessibility sweeps, handover docs — then we stay on for the first month.",
  },
];

/**
 * Pinned, horizontally scrolling process strip driven by GSAP ScrollTrigger.
 */
export function Process() {
  const trackRef = useRef<HTMLDivElement>(null);

  const ref = useGsapContext<HTMLElement>((el) => {
    const track = trackRef.current;
    if (!track) return;

    const mm = gsap.matchMedia();

    mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
      const distance = () => track.scrollWidth - window.innerWidth + 96;

      gsap.to(track, {
        x: () => -distance(),
        ease: "none",
        scrollTrigger: {
          trigger: el,
          start: "top top",
          end: () => `+=${distance()}`,
          pin: true,
          scrub: 0.6,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });
    });

    return () => mm.revert();
  }, []);

  return (
    <section
      id="process"
      ref={ref}
      className="relative w-full overflow-hidden py-24 md:h-dvh md:py-0"
    >
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/4 top-1/3 h-72 w-72 rounded-full bg-primary/10 blur-[120px]" />
        <div className="absolute right-1/4 bottom-1/4 h-72 w-72 rounded-full bg-secondary/10 blur-[130px]" />
      </div>

      <div className="mx-auto flex h-full w-full max-w-6xl flex-col justify-center px-6 md:pt-28">
        <header className="mb-10 max-w-2xl" data-fx="up">
          <span className="font-display text-xs uppercase tracking-[0.35em] text-primary">
            Process
          </span>
          <h2 className="mt-4 text-3xl font-bold text-gradient-neon md:text-5xl">
            Four moves, no theatre
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground">
            Scroll sideways through the way an engagement actually runs.
          </p>
        </header>

        <div
          ref={trackRef}
          className="flex flex-col gap-5 md:w-max md:flex-row md:gap-8 md:will-change-transform"
        >
          {STEPS.map(({ step, title, body, icon: Icon }, i) => (
            <article
              key={step}
              data-fx="up"
              data-fx-delay={i * 0.05}
              className="group glass-panel relative flex flex-col justify-between overflow-hidden rounded-2xl p-8 transition-colors duration-300 hover:border-primary/45 md:h-[22rem] md:w-[24rem]"
            >
              <span
                aria-hidden
                className="pointer-events-none absolute -right-6 -top-10 font-display text-[9rem] leading-none text-foreground/[0.04]"
              >
                {step}
              </span>

              <span className="grid h-12 w-12 place-items-center rounded-xl border border-primary/35 bg-primary/10 text-primary transition-transform duration-300 group-hover:scale-110">
                <Icon size={20} />
              </span>

              <div className="relative">
                <p className="font-display text-xs uppercase tracking-[0.3em] text-secondary">
                  Step {step}
                </p>
                <h3 className="mt-2 font-display text-2xl font-semibold text-foreground">
                  {title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{body}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Process;
