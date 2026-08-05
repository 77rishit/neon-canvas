import { useLayoutEffect, useRef } from "react";
import { gsap } from "@/utils/gsap";

/**
 * Scoped GSAP context helper. The callback receives the container element and
 * runs inside gsap.context(), so every tween/ScrollTrigger is auto-reverted.
 */
export function useGsapContext<T extends HTMLElement = HTMLDivElement>(
  callback: (el: T) => void,
  deps: unknown[] = [],
) {
  const ref = useRef<T>(null);

  useLayoutEffect(() => {
    if (!ref.current) return;
    const el = ref.current;
    const ctx = gsap.context(() => callback(el), el);
    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return ref;
}

export default useGsapContext;
