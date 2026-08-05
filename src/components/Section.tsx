import { forwardRef, useEffect, useRef, type ReactNode } from "react";
import { gsap } from "@/utils/gsap";
import { cn } from "@/utils/cn";
import { useTextReveal } from "@/hooks/animation/useTextReveal";

export interface SectionProps {
  id?: string;
  eyebrow?: string;
  title?: ReactNode;
  description?: ReactNode;
  children?: ReactNode;
  className?: string;
  containerClassName?: string;
  /** Removes vertical padding for full-bleed sections (e.g. hero). */
  flush?: boolean;
}

/**
 * Shared section shell. The heading runs a SplitText-style masked line reveal;
 * the eyebrow and description follow on the same GSAP timeline.
 */
export const Section = forwardRef<HTMLElement, SectionProps>(function Section(
  { id, eyebrow, title, description, children, className, containerClassName, flush },
  ref,
) {
  const headingRef = useTextReveal<HTMLHeadingElement>({ mode: "line", start: "top 88%" });
  const asideRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = asideRef.current;
    if (!el) return;
    const items = Array.from(el.querySelectorAll<HTMLElement>("[data-head-item]"));
    if (!items.length) return;

    const ctx = gsap.context(() => {
      gsap
        .timeline({ scrollTrigger: { trigger: el, start: "top 90%", once: true }, delay: 0.15 })
        // Anticipation, then a back-eased landing with a soft blur burn-off.
        .fromTo(
          items,
          { opacity: 0, y: 26, filter: "blur(6px)" },
          {
            opacity: 1,
            y: -3,
            filter: "blur(0px)",
            duration: 0.85,
            ease: "expo.out",
            stagger: 0.12,
          },
        )
        .to(
          items,
          { y: 0, duration: 0.45, ease: "power2.inOut", stagger: 0.12, clearProps: "filter,transform" },
          "-=0.5",
        );

    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id={id}
      ref={ref}
      className={cn(
        "relative w-full scroll-mt-28",
        !flush && "py-20 md:py-28 lg:py-32",
        className,
      )}
    >
      <div className={cn("mx-auto w-full max-w-6xl px-6", containerClassName)}>
        {(eyebrow || title || description) && (
          <header ref={asideRef} className="mb-10 max-w-2xl md:mb-14">
            {eyebrow && (
              <span
                data-head-item
                className="block font-display text-[0.6rem] uppercase tracking-[0.38em] text-primary md:text-xs"
              >
                {eyebrow}
              </span>
            )}
            {title && (
              <h2
                ref={headingRef}
                className="mt-4 text-balance text-[clamp(2rem,4.6vw,3.5rem)] font-bold leading-[1.05] text-gradient-neon"
              >
                {title}
              </h2>
            )}
            {description && (
              <p
                data-head-item
                className="mt-5 max-w-xl text-pretty text-base leading-relaxed text-muted-foreground md:text-lg"
              >
                {description}
              </p>
            )}
          </header>
        )}
        {children}
      </div>
    </section>
  );
});

export default Section;
