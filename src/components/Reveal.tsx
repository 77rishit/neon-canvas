import { memo, useEffect, useRef, type ReactNode } from "react";
import { gsap } from "@/utils/gsap";
import { cn } from "@/utils/cn";

/**
 * GSAP scroll-reveal wrapper: staggers direct <RevealItem> children on a single
 * timeline when the group enters the viewport.
 */
function RevealBase({
  children,
  className,
  delay = 0.08,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const items = Array.from(el.querySelectorAll<HTMLElement>("[data-reveal-item]"));
    if (!items.length) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        items,
        { opacity: 0, y: 38, scale: 0.985 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.85,
          ease: "expo.out",
          stagger: delay,
          clearProps: "transform",
          scrollTrigger: { trigger: el, start: "top 88%", once: true },
        },
      );
    }, el);

    return () => ctx.revert();
  }, [delay]);

  return (
    <div ref={ref} className={cn(className)}>
      {children}
    </div>
  );
}

function RevealItemBase({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div data-reveal-item className={cn(className)}>
      {children}
    </div>
  );
}

/** Memoized: these wrappers re-render only when their own props change. */
export const Reveal = memo(RevealBase);
export const RevealItem = memo(RevealItemBase);

export default Reveal;
