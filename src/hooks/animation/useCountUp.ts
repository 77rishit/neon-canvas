import { useEffect, useRef } from "react";
import { gsap } from "@/utils/gsap";

/**
 * Scroll-triggered count-up driven by a single GSAP tween on a proxy object,
 * writing straight to the DOM node (no per-frame React state).
 */
export function useCountUp<T extends HTMLElement = HTMLSpanElement>(
  value: number,
  { suffix = "", duration = 1.8, locale = "en-IN" } = {},
) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const format = (n: number) => `${Math.round(n).toLocaleString(locale)}${suffix}`;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.textContent = format(value);
      return;
    }

    el.textContent = format(0);
    const proxy = { n: 0 };
    const ctx = gsap.context(() => {
      // Anticipation: the numeral compresses, then springs as the count runs.
      gsap.fromTo(
        el,
        { scale: 0.94, opacity: 0.4 },
        {
          scale: 1,
          opacity: 1,
          duration: duration * 0.55,
          ease: "back.out(2)",
          clearProps: "transform",
          scrollTrigger: { trigger: el, start: "top 88%", once: true },
        },
      );

      gsap.to(proxy, {
        n: value,
        duration,
        ease: "expo.out",
        snap: { n: 1 },
        onUpdate: () => {
          el.textContent = format(proxy.n);
        },
        scrollTrigger: { trigger: el, start: "top 88%", once: true },
      });
    }, el);

    return () => ctx.revert();
  }, [value, suffix, duration, locale]);

  return ref;
}

export default useCountUp;
