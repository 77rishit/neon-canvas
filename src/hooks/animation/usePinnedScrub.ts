import { useEffect, useRef } from "react";
import { gsap } from "@/utils/gsap";

/**
 * Pins a section and scrubs its direct children into place while pinned.
 * Desktop only — on small screens the section scrolls normally with a plain
 * stagger, so short viewports never feel hijacked.
 */
export function usePinnedScrub<T extends HTMLElement = HTMLDivElement>({
  childSelector,
  distance = "+=60%",
  enabled = true,
}: { childSelector: string; distance?: string; enabled?: boolean }) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !enabled) return;

    const mm = gsap.matchMedia();

    mm.add(
      {
        desktop: "(min-width: 1024px) and (prefers-reduced-motion: no-preference)",
        compact: "(max-width: 1023px) and (prefers-reduced-motion: no-preference)",
      },
      (ctx) => {
        const items = gsap.utils.toArray<HTMLElement>(childSelector, el);
        if (!items.length) return;

        if (ctx.conditions?.["desktop"]) {
          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: el,
              start: "center center",
              end: distance,
              pin: true,
              pinSpacing: true,
              scrub: 0.6,
              invalidateOnRefresh: true,
            },
          });
          tl.fromTo(
            items,
            { yPercent: 26, opacity: 0, scale: 0.94, rotate: -2 },
            {
              yPercent: 0,
              opacity: 1,
              scale: 1,
              rotate: 0,
              ease: "power2.out",
              stagger: 0.12,
            },
          );
          return;
        }

        gsap.fromTo(
          items,
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.7,
            ease: "power3.out",
            stagger: 0.08,
            scrollTrigger: { trigger: el, start: "top 85%", once: true },
          },
        );
      },
    );

    return () => mm.revert();
  }, [childSelector, distance, enabled]);

  return ref;
}

export default usePinnedScrub;
