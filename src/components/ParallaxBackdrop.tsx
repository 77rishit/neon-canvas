import { memo, useEffect, useRef, type ReactNode } from "react";
import { gsap } from "@/utils/gsap";
import { cn } from "@/utils/cn";

/**
 * Three-layer parallax backdrop: a grid plane, two neon blobs drifting at
 * opposing speeds and a scanline veil. Everything is scrubbed by one GSAP
 * timeline tied to the container's pass through the viewport.
 */
function ParallaxBackdropBase({
  className,
  align = "right",
  children,
}: {
  className?: string;
  align?: "left" | "right";
  children?: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const ctx = gsap.context(() => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: el.parentElement ?? el,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
            invalidateOnRefresh: true,
          },
          defaults: { ease: "none" },
        });

        tl.fromTo("[data-layer='grid']", { yPercent: -3 }, { yPercent: 3 }, 0)
          .fromTo("[data-layer='slow']", { yPercent: -12 }, { yPercent: 12 }, 0)
          .fromTo("[data-layer='fast']", { yPercent: 18 }, { yPercent: -18 }, 0)
          .fromTo(
            "[data-layer='grid']",
            { opacity: 0.25 },
            { opacity: 0.6, yoyo: true, repeat: 1, duration: 0.5 },
            0,
          );
      }, el);
      return () => ctx.revert();
    });

    return () => mm.revert();
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden
      className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
    >
      <div data-layer="grid" className="grid-lines absolute inset-0" />
      <div
        data-layer="slow"
        className={cn(
          "absolute top-0 h-[30rem] w-[30rem] rounded-full bg-primary/20 blur-[150px]",
          align === "right" ? "-right-40" : "-left-40",
        )}
      />
      <div
        data-layer="fast"
        className={cn(
          "absolute bottom-0 h-[26rem] w-[26rem] rounded-full bg-secondary/20 blur-[160px]",
          align === "right" ? "-left-32" : "-right-32",
        )}
      />
      <div className="scanlines absolute inset-0 opacity-40" />
      {children}
    </div>
  );
}

export const ParallaxBackdrop = memo(ParallaxBackdropBase);

export default ParallaxBackdrop;
