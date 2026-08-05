import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/utils/gsap";

/**
 * Scrub-driven horizontal drift for an overflow rail.
 *
 * Instead of pinning (which would change the page rhythm), the rail's own
 * scrollLeft is tweened from the section's scroll progress, so the row glides
 * sideways as you travel past it. Desktop only; native swipe stays available.
 */
export function useHorizontalScrub<T extends HTMLElement = HTMLDivElement>({
  amount = 0.9,
  enabled = true,
} = {}) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const rail = ref.current;
    if (!rail || !enabled) return;

    const mm = gsap.matchMedia();
    mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
      const distance = () => (rail.scrollWidth - rail.clientWidth) * amount;
      if (distance() <= 0) return;

      const tween = gsap.fromTo(
        rail,
        { scrollLeft: 0 },
        {
          scrollLeft: distance,
          ease: "none",
          scrollTrigger: {
            trigger: rail,
            start: "top 85%",
            end: "bottom 25%",
            scrub: 1,
            invalidateOnRefresh: true,
          },
        },
      );

      return () => tween.kill();
    });

    ScrollTrigger.refresh();
    return () => mm.revert();
  }, [amount, enabled]);

  return ref;
}

export default useHorizontalScrub;
