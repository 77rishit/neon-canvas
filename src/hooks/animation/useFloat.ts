import { useEffect, useRef } from "react";
import { gsap } from "@/utils/gsap";

/**
 * Continuous idle float. One GSAP tween per element (no React state), phase
 * shifted by `index` so grids never bob in unison.
 */
export function useFloat<T extends HTMLElement = HTMLDivElement>(
  { index = 0, distance = 6, disabled = false } = {},
) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || disabled) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const tween = gsap.to(el, {
      y: -distance,
      duration: 3 + (index % 4) * 0.35,
      delay: (index % 5) * 0.4,
      ease: "sine.inOut",
      repeat: -1,
      yoyo: true,
    });

    return () => {
      tween.kill();
      gsap.set(el, { y: 0 });
    };
  }, [index, distance, disabled]);

  return ref;
}

export default useFloat;
