import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/utils/gsap";

/**
 * Scrubbed vertical parallax for a single element. `speed` is the fraction of
 * the element's travel applied as drift (negative = moves against the scroll).
 */
export function useParallax<T extends HTMLElement = HTMLDivElement>({
  speed = -0.12,
  enabled = true,
} = {}) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !enabled) return;

    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const tween = gsap.fromTo(
        el,
        { yPercent: -speed * 50 },
        {
          yPercent: speed * 50,
          ease: "none",
          scrollTrigger: {
            trigger: el.parentElement ?? el,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
            invalidateOnRefresh: true,
          },
        },
      );
      return () => tween.kill();
    });

    ScrollTrigger.refresh();
    return () => mm.revert();
  }, [speed, enabled]);

  return ref;
}

export default useParallax;
