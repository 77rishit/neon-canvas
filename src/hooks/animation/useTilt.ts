import { useEffect, useRef } from "react";
import { gsap } from "@/utils/gsap";

/**
 * Pointer tilt for cards. Uses gsap.quickTo so pointer moves write straight to
 * the GPU-composited transform without React re-renders. Coarse pointers and
 * reduced-motion users get a static card.
 */
export function useTilt<T extends HTMLElement = HTMLDivElement>(
  { max = 8, scale = 1.015, disabled = false } = {},
) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || disabled) return;
    if (window.matchMedia("(pointer: coarse), (prefers-reduced-motion: reduce)").matches) return;

    const ease = "power3.out";
    const rotX = gsap.quickTo(el, "rotationX", { duration: 0.5, ease });
    const rotY = gsap.quickTo(el, "rotationY", { duration: 0.5, ease });
    const scaleTo = gsap.quickTo(el, "scale", { duration: 0.45, ease });
    gsap.set(el, { transformPerspective: 900, transformOrigin: "center" });

    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      // Feeds the CSS hover-light gradient too.
      el.style.setProperty("--mx", `${e.clientX - r.left}px`);
      el.style.setProperty("--my", `${e.clientY - r.top}px`);
      rotX(-py * max);
      rotY(px * max);
      scaleTo(scale);
    };
    const onLeave = () => {
      rotX(0);
      rotY(0);
      scaleTo(1);
    };

    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
      gsap.killTweensOf(el);
    };
  }, [max, scale, disabled]);

  return ref;
}

export default useTilt;
