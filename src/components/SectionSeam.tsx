import { useEffect, useRef } from "react";
import { gsap } from "@/utils/gsap";

/**
 * Cinematic seam between two sections.
 *
 * A hairline that draws itself from the centre outward while a neon node
 * travels across it, scrubbed to scroll — so the hand-off between sections
 * reads as one continuous shot rather than two separate blocks.
 */
export function SectionSeam({ align = "center" }: { align?: "center" | "left" | "right" }) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const ctx = gsap.context(() => {
        // NOTE: each tween needs its own ScrollTrigger config object —
        // GSAP mutates the vars it is handed, so sharing one breaks refresh().
        const trigger = () => ({
          trigger: root,
          start: "top 92%",
          end: "bottom 42%",
          scrub: 0.6,
        });

        gsap.fromTo(
          "[data-seam-line]",
          { scaleX: 0 },
          { scaleX: 1, ease: "none", scrollTrigger: trigger() },
        );
        gsap.fromTo(
          "[data-seam-node]",
          { xPercent: -50, left: "12%", opacity: 0 },
          {
            left: "88%",
            opacity: 1,
            ease: "none",
            scrollTrigger: trigger(),
          },
        );
      }, root);
      return () => ctx.revert();
    });

    return () => mm.revert();
  }, []);

  const origin =
    align === "left" ? "origin-left" : align === "right" ? "origin-right" : "origin-center";

  return (
    <div
      aria-hidden
      ref={rootRef}
      className="relative mx-auto h-px w-[min(90rem,92vw)]"
    >
      <span
        data-seam-line
        className={`absolute inset-0 ${origin} bg-gradient-to-r from-transparent via-primary/45 to-transparent`}
      />
      <span
        data-seam-node
        className="absolute top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-primary shadow-[0_0_14px_3px_color-mix(in_srgb,var(--primary)_60%,transparent)]"
      />
    </div>
  );
}

export default SectionSeam;
