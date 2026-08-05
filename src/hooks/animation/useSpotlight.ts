import { useEffect, useRef } from "react";
import { gsap } from "@/utils/gsap";

/**
 * Mouse-following spotlight. Writes `--spot-x` / `--spot-y` on the referenced
 * element through an eased gsap.quickTo, so the gradient trails the pointer
 * with inertia at zero React cost.
 */
export function useSpotlight<T extends HTMLElement = HTMLDivElement>({
  duration = 0.9,
  local = false,
} = {}) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const xTo = gsap.quickTo(el, "--spot-x", { duration, ease: "power3.out" });
    const yTo = gsap.quickTo(el, "--spot-y", { duration, ease: "power3.out" });
    const opacityTo = gsap.quickTo(el, "opacity", { duration: 0.6, ease: "power2.out" });

    const target: HTMLElement | Window = local ? (el.parentElement ?? el) : window;

    const onMove = (event: Event) => {
      const e = event as PointerEvent;
      if (local) {
        const r = (target as HTMLElement).getBoundingClientRect();
        xTo(e.clientX - r.left);
        yTo(e.clientY - r.top);
      } else {
        xTo(e.clientX);
        yTo(e.clientY);
      }
      opacityTo(1);
    };
    const onLeave = () => opacityTo(0);

    target.addEventListener("pointermove", onMove as EventListener, { passive: true });
    target.addEventListener("pointerleave", onLeave as EventListener);

    return () => {
      target.removeEventListener("pointermove", onMove as EventListener);
      target.removeEventListener("pointerleave", onLeave as EventListener);
      gsap.killTweensOf(el);
    };
  }, [duration, local]);

  return ref;
}

export default useSpotlight;
