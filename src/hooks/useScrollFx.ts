import { useEffect } from "react";
import { gsap, ScrollTrigger } from "@/utils/gsap";

/**
 * Declarative, data-attribute driven GSAP ScrollTrigger effects.
 *
 * Usage: add `data-fx="fade | up | scale | rotate | mask"` to any element,
 * or `data-parallax="-40"` (pixels of drift across the viewport pass).
 *
 * Everything is scrubbed or one-shot, honours prefers-reduced-motion, and is
 * cleaned up on unmount. Mount once, from the app layout.
 */
export function useScrollFx() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      // --- one-shot reveals -------------------------------------------------
      gsap.utils.toArray<HTMLElement>("[data-fx]").forEach((el) => {
        const kind = el.dataset["fx"];
        const delay = Number(el.dataset["fxDelay"] ?? 0);

        const from: gsap.TweenVars =
          kind === "scale"
            ? { opacity: 0, scale: 0.92 }
            : kind === "rotate"
              ? { opacity: 0, rotateZ: -4, y: 30, transformOrigin: "50% 100%" }
              : kind === "mask"
                ? { clipPath: "inset(0% 0% 100% 0%)", scale: 1.08 }
                : kind === "fade"
                  ? { opacity: 0 }
                  : { opacity: 0, y: 40 };

        const to: gsap.TweenVars =
          kind === "mask"
            ? { clipPath: "inset(0% 0% 0% 0%)", scale: 1 }
            : { opacity: 1, y: 0, scale: 1, rotateZ: 0 };

        gsap.fromTo(el, from, {
          ...to,
          duration: kind === "mask" ? 1.1 : 0.85,
          delay,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 88%", once: true },
        });
      });

      // --- scrubbed parallax ------------------------------------------------
      gsap.utils.toArray<HTMLElement>("[data-parallax]").forEach((el) => {
        const distance = Number(el.dataset["parallax"] ?? -60);
        gsap.fromTo(
          el,
          { yPercent: 0 },
          {
            y: distance,
            ease: "none",
            scrollTrigger: {
              trigger: el,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          },
        );
      });
    });

    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener("load", refresh);
    const t = window.setTimeout(refresh, 400);

    return () => {
      window.removeEventListener("load", refresh);
      window.clearTimeout(t);
      ctx.revert();
    };
  }, []);
}

export default useScrollFx;
