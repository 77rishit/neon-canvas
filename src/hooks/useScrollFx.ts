import { useEffect } from "react";
import { gsap, ScrollTrigger } from "@/utils/gsap";

/**
 * Declarative, data-attribute driven GSAP ScrollTrigger effects.
 *
 * Reveals — add `data-fx` to any element:
 *   fade | up | scale | rotate | mask | fade-scale | left | right | clip | stagger
 *   `data-fx-delay="0.2"` offsets the start.
 *   `data-fx="stagger"` animates its direct children one after another.
 *
 * Depth parallax — `data-parallax="-40"` (px of drift across the viewport pass)
 * or `data-depth="back | mid | front"` for the three-layer depth system.
 *
 * Everything is scrubbed or one-shot, honours prefers-reduced-motion, is wrapped
 * in gsap.matchMedia (desktop gets the full travel, mobile a reduced version)
 * and is cleaned up on unmount. Mount once, from the app layout.
 */
export function useScrollFx() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const mm = gsap.matchMedia();

    mm.add(
      {
        desktop: "(min-width: 768px) and (prefers-reduced-motion: no-preference)",
        mobile: "(max-width: 767px) and (prefers-reduced-motion: no-preference)",
      },
      (ctx) => {
        const isDesktop = Boolean(ctx.conditions?.["desktop"]);
        const amp = isDesktop ? 1 : 0.55;

        // --- one-shot reveals -------------------------------------------------
        gsap.utils.toArray<HTMLElement>("[data-fx]").forEach((el) => {
          const kind = el.dataset["fx"];
          const delay = Number(el.dataset["fxDelay"] ?? 0);

          if (kind === "stagger") {
            const items = Array.from(el.children) as HTMLElement[];
            if (!items.length) return;
            gsap.fromTo(
              items,
              { opacity: 0, y: 64 * amp, scale: 0.97 },
              {
                opacity: 1,
                y: 0,
                scale: 1,
                duration: 0.8,
                delay,
                ease: "power3.out",
                stagger: { each: 0.09, from: "start" },
                clearProps: "transform",
                scrollTrigger: { trigger: el, start: "top 85%", once: true },
              },
            );
            return;
          }

          const from: gsap.TweenVars =
            kind === "scale"
              ? { opacity: 0, scale: 0.92 }
              : kind === "fade-scale"
                ? { opacity: 0, scale: 0.9, filter: "blur(10px)" }
                : kind === "left"
                  ? { opacity: 0, x: -110 * amp }
                  : kind === "right"
                    ? { opacity: 0, x: 110 * amp }
                    : kind === "clip"
                      ? { clipPath: "inset(0% 0% 100% 0%)", opacity: 1, y: 40 * amp }
                      : kind === "rotate"
                        ? { opacity: 0, rotateZ: -4, y: 30 * amp, transformOrigin: "50% 100%" }
                        : kind === "mask"
                          ? { clipPath: "inset(0% 0% 100% 0%)", scale: 1.08 }
                          : kind === "fade"
                            ? { opacity: 0 }
                            : { opacity: 0, y: 40 * amp };

          const to: gsap.TweenVars =
            kind === "mask" || kind === "clip"
              ? { clipPath: "inset(0% 0% 0% 0%)", scale: 1, y: 0, opacity: 1 }
              : kind === "fade-scale"
                ? { opacity: 1, scale: 1, filter: "blur(0px)" }
                : { opacity: 1, x: 0, y: 0, scale: 1, rotateZ: 0 };

          gsap.fromTo(el, from, {
            ...to,
            duration: kind === "mask" || kind === "clip" ? 1.1 : 0.9,
            delay,
            ease: "power3.out",
            clearProps: "filter",
            scrollTrigger: { trigger: el, start: "top 88%", once: true },
          });
        });

        // --- scrubbed parallax ------------------------------------------------
        const DEPTH: Record<string, number> = { back: -140, mid: -70, front: 45 };

        gsap.utils.toArray<HTMLElement>("[data-parallax], [data-depth]").forEach((el) => {
          const depth = el.dataset["depth"];
          const distance =
            (depth ? (DEPTH[depth] ?? -70) : Number(el.dataset["parallax"] ?? -60)) * amp;
          gsap.fromTo(
            el,
            { y: 0 },
            {
              y: distance,
              ease: "none",
              scrollTrigger: {
                trigger: el,
                start: "top bottom",
                end: "bottom top",
                scrub: true,
                invalidateOnRefresh: true,
              },
            },
          );
        });
      },
    );

    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener("load", refresh);
    const t = window.setTimeout(refresh, 400);

    return () => {
      window.removeEventListener("load", refresh);
      window.clearTimeout(t);
      mm.revert();
    };
  }, []);
}

export default useScrollFx;
