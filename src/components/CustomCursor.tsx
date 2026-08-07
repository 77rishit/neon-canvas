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
  const trailRef = useRef<HTMLCanvasElement>(null);

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

  /**
   * Energy trail: a chain of springy followers painted on one canvas, so the
   * cursor leaves a decaying comet of portal light behind it.
   */
  useEffect(() => {
    const canvas = trailRef.current;
    if (isMobile || !canvas) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let dpr = 1;
    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.floor(window.innerWidth * dpr);
      canvas.height = Math.floor(window.innerHeight * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    const COUNT = 16;
    const nodes = Array.from({ length: COUNT }, () => ({ x: -100, y: -100 }));
    let mx = -100;
    let my = -100;
    let alive = 0;
    let raf = 0;

    // The trail only costs frames while the pointer is actually moving: the
    // loop parks itself once the comet has faded and restarts on the next move.
    let idle = 0;
    let running = false;
    const start = () => {
      if (running) return;
      running = true;
      raf = requestAnimationFrame(draw);
    };
    const onMove = (e: PointerEvent) => {
      mx = e.clientX;
      my = e.clientY;
      alive = 1;
      idle = 0;
      start();
    };
    const onLeave = () => {
      alive = 0;
    };

    const draw = () => {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      let px = mx;
      let py = my;
      for (let i = 0; i < COUNT; i++) {
        const n = nodes[i]!;
        n.x += (px - n.x) * 0.32;
        n.y += (py - n.y) * 0.32;
        px = n.x;
        py = n.y;

        const t = 1 - i / COUNT;
        ctx.beginPath();
        ctx.arc(n.x, n.y, t * 5 + 0.6, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${186 + (1 - t) * 70}, 100%, 62%, ${0.16 * t * alive})`;
        ctx.fill();
      }
      idle += 1;
      if (idle > 90) {
        // Nothing has moved for ~1.5s — clear once and stop burning frames.
        ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
        running = false;
        return;
      }
      raf = requestAnimationFrame(draw);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    window.addEventListener("resize", resize);
    start();

    return () => {
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("resize", resize);
      running = false;
      cancelAnimationFrame(raf);
    };
  }, [isMobile]);

  if (isMobile) return null;

  return (
    <>
      <canvas
        ref={trailRef}
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[99] h-full w-full mix-blend-screen"
      />
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
