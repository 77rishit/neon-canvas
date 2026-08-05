import { memo, useEffect, useRef } from "react";
import { gsap } from "@/utils/gsap";

/** Thin neon reading-progress bar, scrubbed by ScrollTrigger over the page. */
export const ScrollProgress = memo(function ScrollProgress() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { scaleX: 0 },
        {
          scaleX: 1,
          ease: "none",
          scrollTrigger: {
            trigger: document.documentElement,
            start: "top top",
            end: "bottom bottom",
            scrub: 0.3,
            invalidateOnRefresh: true,
          },
        },
      );
    });

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden
      className="fixed inset-x-0 top-0 z-[70] h-[2px] origin-left scale-x-0 bg-linear-to-r from-primary via-secondary to-primary"
    />
  );
});

export default ScrollProgress;
