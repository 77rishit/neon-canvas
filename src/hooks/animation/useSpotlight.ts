import { useEffect, useRef } from "react";
import { gsap } from "@/utils/gsap";

/**
 * Mouse-following spotlight.
 *
 * Translates the referenced element to the pointer through an eased
 * gsap.quickTo, so the light trails with inertia on a single composited
 * transform — no React state, no per-frame layout.
 */
export function useSpotlight<T extends HTMLElement = HTMLDivElement>({
  duration = 0.9,
  /** Track the pointer within the parent element instead of the viewport. */
  local = false,
} = {}) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(pointer: coarse)").matches) return;

    gsap.set(el, { xPercent: -50, yPercent: -50, opacity: 0 });

    const xTo = gsap.quickTo(el, "x", { duration, ease: "power3.out" });
    const yTo = gsap.quickTo(el, "y", { duration, ease: "power3.out" });
    const fadeTo = gsap.quickTo(el, "opacity", { duration: 0.6, ease: "power2.out" });

    const host: HTMLElement | Window = local ? (el.parentElement ?? el) : window;

    const onMove = (event: Event) => {
      const e = event as PointerEvent;
      if (local) {
        const r = (host as HTMLElement).getBoundingClientRect();
        xTo(e.clientX - r.left);
        yTo(e.clientY - r.top);
      } else {
        xTo(e.clientX);
        yTo(e.clientY);
      }
      fadeTo(1);
    };
    const onLeave = () => fadeTo(0);

    host.addEventListener("pointermove", onMove as EventListener, { passive: true });
    host.addEventListener("pointerleave", onLeave as EventListener);

    return () => {
      host.removeEventListener("pointermove", onMove as EventListener);
      host.removeEventListener("pointerleave", onLeave as EventListener);
      gsap.killTweensOf(el);
    };
  }, [duration, local]);

  return ref;
}

export default useSpotlight;
