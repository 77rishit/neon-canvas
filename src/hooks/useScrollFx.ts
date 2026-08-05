import { useEffect } from "react";
import { gsap, ScrollTrigger } from "@/utils/gsap";

/**
 * Global scroll choreography.
 *
 * Every entrance in the page is declared with a `data-fx` attribute and played
 * by a GSAP timeline inside `gsap.matchMedia`, so desktop gets the full travel,
 * small screens get a reduced version, and reduced-motion users get nothing.
 *
 *   data-fx="<signature>"     one of the SIGNATURES below (each used once)
 *   data-fx-children="sel"    also staggers matching descendants after the
 *                             section itself lands
 *   data-fx-delay="0.2"       lead-in, in seconds
 *   data-parallax="-40"       scrubbed drift, in px
 *   data-depth="back|mid|front"  three-layer depth parallax
 *
 * Mount once, from the app layout.
 */

type Signature = {
  from: gsap.TweenVars;
  to: gsap.TweenVars;
  duration?: number;
  ease?: string;
};

/** One distinct entrance per section — no repeated fade-ups. */
const SIGNATURES: Record<string, (amp: number) => Signature> = {
  // About — depth-of-field pull: blurred and oversized, snapping into focus.
  "blur-focus": (a) => ({
    from: { opacity: 0, scale: 1.06, filter: `blur(${14 * a}px)` },
    to: { opacity: 1, scale: 1, filter: "blur(0px)" },
    duration: 1.1,
  }),
  // Events — glides in from the left with a counter-skew that settles.
  "slide-skew-left": (a) => ({
    from: { opacity: 0, x: -120 * a, skewY: 3 * a },
    to: { opacity: 1, x: 0, skewY: 0 },
    duration: 1,
  }),
  // Registration — curtain opening from the horizontal centre line.
  curtain: () => ({
    from: { clipPath: "inset(48% 0% 48% 0%)", opacity: 0.4 },
    to: { clipPath: "inset(0% 0% 0% 0%)", opacity: 1 },
    duration: 1.2,
  }),
  // Competitions — mirrored counterpart to Events.
  "slide-skew-right": (a) => ({
    from: { opacity: 0, x: 120 * a, skewY: -3 * a },
    to: { opacity: 1, x: 0, skewY: 0 },
    duration: 1,
  }),
  // Sponsors — a wipe that unmasks left to right.
  "wipe-right": () => ({
    from: { clipPath: "inset(0% 100% 0% 0%)" },
    to: { clipPath: "inset(0% 0% 0% 0%)" },
    duration: 1.15,
  }),
  // Gallery — bottom-up mask paired with a slight zoom-out.
  "mask-up": (a) => ({
    from: { clipPath: "inset(0% 0% 100% 0%)", scale: 1.05, y: 30 * a },
    to: { clipPath: "inset(0% 0% 0% 0%)", scale: 1, y: 0 },
    duration: 1.2,
  }),
  // Team — 3D card flip along the X axis.
  flip: (a) => ({
    from: { opacity: 0, rotateX: 26 * a, y: 60 * a, transformOrigin: "50% 0%" },
    to: { opacity: 1, rotateX: 0, y: 0 },
    duration: 1,
  }),
  // Testimonials — a lens pulling back from a blurred close-up.
  "zoom-out": (a) => ({
    from: { opacity: 0, scale: 0.88, filter: `blur(${8 * a}px)` },
    to: { opacity: 1, scale: 1, filter: "blur(0px)" },
    duration: 1,
  }),
  // FAQ — vertical curtain drop from the top edge.
  "wipe-down": () => ({
    from: { clipPath: "inset(0% 0% 100% 0%)", opacity: 0.6 },
    to: { clipPath: "inset(0% 0% 0% 0%)", opacity: 1 },
    duration: 1.1,
  }),
  // Contact — rises with a slight rotation, pivoting off its base line.
  "rise-rotate": (a) => ({
    from: { opacity: 0, y: 70 * a, rotate: -2.5 * a, transformOrigin: "0% 100%" },
    to: { opacity: 1, y: 0, rotate: 0 },
    duration: 1,
  }),
  // Timeline — telescopes out of the page.
  telescope: (a) => ({
    from: { opacity: 0, scaleY: 0.86, y: 50 * a, transformOrigin: "50% 0%" },
    to: { opacity: 1, scaleY: 1, y: 0 },
    duration: 1,
  }),
  // Generic staggered grid, used by inner card grids.
  stagger: (a) => ({
    from: { opacity: 0, y: 56 * a, scale: 0.97 },
    to: { opacity: 1, y: 0, scale: 1 },
    duration: 0.8,
  }),
};

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
        const amp = ctx.conditions?.["desktop"] ? 1 : 0.55;

        // --- section entrances ------------------------------------------------
        gsap.utils.toArray<HTMLElement>("[data-fx]").forEach((el) => {
          const kind = el.dataset["fx"] ?? "stagger";
          const build = SIGNATURES[kind] ?? SIGNATURES["stagger"]!;
          const sig = build(amp);
          const delay = Number(el.dataset["fxDelay"] ?? 0);
          const childSelector = el.dataset["fxChildren"];

          const tl = gsap.timeline({
            defaults: { ease: sig.ease ?? "expo.out" },
            delay,
            scrollTrigger: { trigger: el, start: "top 86%", once: true },
          });

          if (kind === "stagger" && !childSelector) {
            // The element itself is the grid: animate its direct children.
            const items = Array.from(el.children) as HTMLElement[];
            if (!items.length) return;
            tl.fromTo(items, sig.from, {
              ...sig.to,
              duration: sig.duration ?? 0.9,
              stagger: 0.08,
              clearProps: "filter,clipPath,transform",
            });
            return;
          }

          tl.fromTo(el, sig.from, {
            ...sig.to,
            duration: sig.duration ?? 0.9,
            clearProps: "filter,clipPath",
          });

          if (childSelector) {
            const items = gsap.utils.toArray<HTMLElement>(childSelector, el);
            if (items.length) {
              tl.fromTo(
                items,
                { opacity: 0, y: 42 * amp, scale: 0.98 },
                {
                  opacity: 1,
                  y: 0,
                  scale: 1,
                  duration: 0.7,
                  stagger: 0.07,
                  clearProps: "transform",
                },
                "-=0.55",
              );
            }
          }
        });

        // --- layered parallax --------------------------------------------------
        const DEPTH: Record<string, number> = { back: -150, mid: -80, front: 45 };

        gsap.utils.toArray<HTMLElement>("[data-parallax], [data-depth]").forEach((el) => {
          const depth = el.dataset["depth"];
          const distance =
            (depth ? (DEPTH[depth] ?? -80) : Number(el.dataset["parallax"] ?? -60)) * amp;
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
