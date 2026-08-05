import { useEffect, useRef } from "react";
import { gsap } from "@/utils/gsap";
import { useIsMobile } from "@/hooks/use-mobile";

/**
 * Two-part custom cursor: a crisp dot that tracks the pointer exactly and a
 * lagging ring that expands over interactive elements. Both are driven by
 * gsap.quickTo, so pointer moves never touch React state. Hidden on touch.
 */
export function CustomCursor() {
  const isMobile = useIsMobile();
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (isMobile || !dot || !ring) return;

    gsap.set([dot, ring], { xPercent: -50, yPercent: -50, opacity: 0 });

    const dotX = gsap.quickTo(dot, "x", { duration: 0.12, ease: "power2.out" });
    const dotY = gsap.quickTo(dot, "y", { duration: 0.12, ease: "power2.out" });
    const ringX = gsap.quickTo(ring, "x", { duration: 0.55, ease: "power3.out" });
    const ringY = gsap.quickTo(ring, "y", { duration: 0.55, ease: "power3.out" });

    let hovering = false;

    const move = (e: PointerEvent) => {
      dotX(e.clientX);
      dotY(e.clientY);
      ringX(e.clientX);
      ringY(e.clientY);
      gsap.to([dot, ring], { opacity: 1, duration: 0.25, overwrite: "auto" });

      const target = e.target as HTMLElement | null;
      const next = Boolean(target?.closest("a, button, [data-cursor='hover']"));
      if (next !== hovering) {
        hovering = next;
        gsap.to(ring, {
          scale: next ? 1.9 : 1,
          borderColor: next ? "var(--secondary)" : "var(--primary)",
          duration: 0.4,
          ease: "power3.out",
        });
      }
    };
    const leave = () => gsap.to([dot, ring], { opacity: 0, duration: 0.25 });

    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerdown", move, { passive: true });
    document.addEventListener("pointerleave", leave);

    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerdown", move);
      document.removeEventListener("pointerleave", leave);
      gsap.killTweensOf([dot, ring]);
    };
  }, [isMobile]);

  if (isMobile) return null;

  return (
    <>
      <div
        ref={dotRef}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[100] h-1.5 w-1.5 rounded-full bg-primary opacity-0 mix-blend-screen"
      />
      <div
        ref={ringRef}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[100] h-8 w-8 rounded-full border border-primary/60 opacity-0 mix-blend-screen"
      />
    </>
  );
}

export default CustomCursor;
