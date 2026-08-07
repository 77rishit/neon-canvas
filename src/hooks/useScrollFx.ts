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
 * Every signature is a multi-step timeline rather than a single tween, so each
 * entrance carries the three beats that make motion read as handcrafted:
 *
 *   1. ANTICIPATION   a small counter-move against the incoming direction
 *   2. ACTION         the main travel, on a long-tail ease
 *   3. FOLLOW-THROUGH an overshoot that settles a beat after the body lands
 *
 * Mount once, from the app layout.
 */

/** One beat of a signature timeline. */
type Step = {
  from?: gsap.TweenVars;
  to: gsap.TweenVars;
  duration: number;
  ease?: string;
  /** Timeline position; negative overlaps the previous beat. */
  at?: number | string;
};

type Signature = (amp: number) => Step[];

/**
 * One distinct transition per act of THE DIGITAL SINGULARITY.
 *
 * No fades, no slides: every section arrives through a different physical
 * event — reality dissolving, digital fragmentation, an energy wave, light
 * distortion, holographic reconstruction, a liquid morph, quantum collapse or
 * particle assembly — and each is choreographed in three beats.
 */
const SIGNATURES: Record<string, Signature> = {
  // Act 1 — reality dissolves out of the void and resolves into matter.
  dissolve: (a) => [
    {
      from: {
        opacity: 0,
        scale: 1.06,
        filter: `blur(${18 * a}px) brightness(2.2) saturate(2)`,
        clipPath: "polygon(0% 42%, 100% 38%, 100% 62%, 0% 58%)",
      },
      to: { opacity: 0.4, filter: `blur(${22 * a}px) brightness(2.6) saturate(2.4)` },
      duration: 0.3,
      ease: "power1.inOut",
    },
    {
      to: {
        opacity: 1,
        scale: 0.997,
        filter: "blur(0px) brightness(1) saturate(1)",
        clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
      },
      duration: 1.15,
      ease: "expo.out",
    },
    { to: { scale: 1, clearProps: "clipPath" }, duration: 0.5, ease: "power2.inOut", at: "-=0.12" },
  ],

  // Act 2 — the world breaks: the panel tears into digital shards then heals.
  "digital-fragment": (a) => [
    {
      from: {
        opacity: 0,
        x: -46 * a,
        skewX: 6 * a,
        filter: `blur(${9 * a}px) contrast(1.7)`,
        clipPath:
          "polygon(0% 0%,100% 0%,100% 18%,0% 26%,0% 34%,100% 28%,100% 62%,0% 56%,0% 72%,100% 68%,100% 100%,0% 100%)",
      },
      to: { x: 40 * a, skewX: -6 * a, opacity: 0.55 },
      duration: 0.22,
      ease: "steps(4)",
    },
    {
      to: {
        opacity: 1,
        x: -6 * a,
        skewX: 0,
        filter: "blur(0px) contrast(1)",
        clipPath:
          "polygon(0% 0%,100% 0%,100% 100%,0% 100%,0% 100%,100% 100%,100% 100%,0% 100%,0% 100%,100% 100%,100% 100%,0% 100%)",
      },
      duration: 0.95,
      ease: "expo.out",
    },
    { to: { x: 0, clearProps: "clipPath" }, duration: 0.5, ease: "power2.out", at: "-=0.15" },
  ],

  // Act 3 — an energy wave rolls through the surface and leaves it charged.
  "energy-wave": (a) => [
    {
      from: {
        opacity: 0,
        scaleX: 1.08,
        scaleY: 0.72,
        filter: `blur(${12 * a}px) brightness(2.4)`,
        transformOrigin: "50% 50%",
      },
      to: { scaleY: 0.6, opacity: 0.5, filter: `blur(${16 * a}px) brightness(3)` },
      duration: 0.24,
      ease: "power2.in",
    },
    {
      to: { opacity: 1, scaleY: 1.05, scaleX: 0.99, filter: "blur(0px) brightness(1)" },
      duration: 1.05,
      ease: "elastic.out(0.6, 0.55)",
    },
    { to: { scaleX: 1, scaleY: 1 }, duration: 0.45, ease: "power2.inOut", at: "-=0.2" },
  ],

  // Act 4 — reality bends: the panel refracts through distorted light.
  "light-distortion": (a) => [
    {
      from: {
        opacity: 0,
        rotate: 2.4 * a,
        skewY: -4 * a,
        scale: 1.1,
        filter: `blur(${14 * a}px) hue-rotate(70deg) saturate(2.6)`,
      },
      to: { rotate: 3.4 * a, skewY: -5.5 * a, opacity: 0.45 },
      duration: 0.26,
      ease: "power2.in",
    },
    {
      to: {
        opacity: 1,
        rotate: -0.6 * a,
        skewY: 0.8 * a,
        scale: 0.995,
        filter: "blur(0px) hue-rotate(0deg) saturate(1)",
      },
      duration: 1.05,
      ease: "expo.out",
    },
    { to: { rotate: 0, skewY: 0, scale: 1 }, duration: 0.55, ease: "power2.inOut", at: "-=0.16" },
  ],

  // Act 5 — gravity disappears: the panel drifts up and settles weightlessly.
  "gravity-lift": (a) => [
    {
      from: { opacity: 0, y: 70 * a, rotateX: 16 * a, transformOrigin: "50% 120%" },
      to: { y: 88 * a, rotateX: 22 * a, opacity: 0.2 },
      duration: 0.28,
      ease: "power2.in",
    },
    { to: { opacity: 1, y: -14 * a, rotateX: -3 * a }, duration: 1.2, ease: "expo.out" },
    { to: { y: 0, rotateX: 0 }, duration: 0.7, ease: "sine.inOut", at: "-=0.25" },
  ],

  // Act 6 — holographic reconstruction, scanned in from the top edge.
  "holo-reconstruct": (a) => [
    {
      from: {
        opacity: 0,
        clipPath: "inset(0% 0% 100% 0%)",
        filter: `brightness(2.6) saturate(2.2) blur(${6 * a}px)`,
        y: -18 * a,
      },
      to: { opacity: 0.6, y: -26 * a },
      duration: 0.22,
      ease: "steps(5)",
    },
    {
      to: {
        opacity: 1,
        clipPath: "inset(0% 0% 0% 0%)",
        filter: "brightness(1) saturate(1) blur(0px)",
        y: 6 * a,
      },
      duration: 1.1,
      ease: "expo.out",
    },
    { to: { y: 0, clearProps: "clipPath" }, duration: 0.5, ease: "power2.out", at: "-=0.18" },
  ],

  // Act 7 — the world reconstructs: a liquid morph settling into a solid.
  "liquid-morph": (a) => [
    {
      from: {
        opacity: 0,
        scaleX: 0.82,
        scaleY: 1.14,
        borderRadius: "48%",
        filter: `blur(${13 * a}px)`,
      },
      to: { scaleX: 0.76, scaleY: 1.2, opacity: 0.35 },
      duration: 0.26,
      ease: "power2.in",
    },
    {
      to: { opacity: 1, scaleX: 1.03, scaleY: 0.97, borderRadius: "0%", filter: "blur(0px)" },
      duration: 1.1,
      ease: "expo.out",
    },
    { to: { scaleX: 1, scaleY: 1 }, duration: 0.6, ease: "elastic.out(0.5, 0.6)", at: "-=0.2" },
  ],

  // Quantum collapse — space folds inward from all four edges.
  "quantum-collapse": (a) => [
    {
      from: {
        opacity: 0,
        clipPath: "inset(38% 38% 38% 38%)",
        scale: 1.16,
        filter: `blur(${10 * a}px) brightness(2)`,
      },
      to: { clipPath: "inset(46% 46% 46% 46%)", opacity: 0.5, scale: 1.2 },
      duration: 0.24,
      ease: "power2.in",
    },
    {
      to: {
        opacity: 1,
        clipPath: "inset(0% 0% 0% 0%)",
        scale: 0.99,
        filter: "blur(0px) brightness(1)",
      },
      duration: 1.15,
      ease: "expo.out",
    },
    { to: { scale: 1, clearProps: "clipPath" }, duration: 0.5, ease: "power2.inOut", at: "-=0.14" },
  ],

  // Particle assembly — the panel condenses out of scattered light.
  "particle-assembly": (a) => [
    {
      from: {
        opacity: 0,
        scale: 0.88,
        filter: `blur(${20 * a}px) brightness(2.8)`,
        rotate: -1.6 * a,
      },
      to: { scale: 0.84, opacity: 0.4, filter: `blur(${26 * a}px) brightness(3.2)` },
      duration: 0.26,
      ease: "power1.in",
    },
    {
      to: { opacity: 1, scale: 1.02, rotate: 0.4 * a, filter: "blur(0px) brightness(1)" },
      duration: 1.05,
      ease: "expo.out",
    },
    { to: { scale: 1, rotate: 0 }, duration: 0.55, ease: "back.out(1.5)", at: "-=0.18" },
  ],

  // Reality bend — the surface pivots out of a warped plane.
  "reality-bend": (a) => [
    {
      from: { opacity: 0, rotateY: 26 * a, x: 70 * a, transformOrigin: "100% 50%" },
      to: { rotateY: 34 * a, x: 92 * a, opacity: 0.2 },
      duration: 0.26,
      ease: "power2.in",
    },
    { to: { opacity: 1, rotateY: -5 * a, x: -10 * a }, duration: 1.05, ease: "expo.out" },
    { to: { rotateY: 0, x: 0 }, duration: 0.6, ease: "power2.inOut", at: "-=0.18" },
  ],

  // Signal sweep — data scans in from the left through a compressing mask.
  "signal-sweep": (a) => [
    {
      from: { opacity: 0, clipPath: "inset(0% 100% 0% 0%)", x: -26 * a, skewX: 5 * a },
      to: { x: -38 * a, opacity: 0.5 },
      duration: 0.2,
      ease: "steps(4)",
    },
    {
      to: { opacity: 1, clipPath: "inset(0% 0% 0% 0%)", x: 8 * a, skewX: -1 * a },
      duration: 1.1,
      ease: "expo.out",
    },
    { to: { x: 0, skewX: 0, clearProps: "clipPath" }, duration: 0.5, ease: "power2.out", at: "-=0.2" },
  ],

  // Generic staggered grid, used by inner card grids: settles with a soft
  // back-out so each card lands with weight rather than simply appearing.
  stagger: (a) => [
    {
      from: { opacity: 0, y: 52 * a, scale: 0.96, rotate: -0.6 * a },
      to: { opacity: 1, y: 0, scale: 1, rotate: 0 },
      duration: 0.95,
      ease: "back.out(1.35)",
    },
  ],
};


/** Props a signature may touch; cleared once the entrance is done. */
const CLEAR = "filter,clipPath,transform,willChange";

/** Builds one signature timeline onto `tl` for `targets`. */
function playSteps(
  tl: gsap.core.Timeline,
  targets: gsap.TweenTarget,
  steps: Step[],
  extra: gsap.TweenVars = {},
) {
  steps.forEach((step, i) => {
    const last = i === steps.length - 1;
    const vars: gsap.TweenVars = {
      ...step.to,
      ...(last ? extra : {}),
      duration: step.duration,
      ease: step.ease ?? "power2.out",
      ...(last ? { clearProps: CLEAR } : {}),
    };
    if (step.from) {
      tl.fromTo(targets, step.from, vars, step.at ?? (i === 0 ? 0 : undefined));
    } else {
      tl.to(targets, vars, step.at);
    }
  });
}

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
          const steps = build(amp);
          const delay = Number(el.dataset["fxDelay"] ?? 0);
          const childSelector = el.dataset["fxChildren"];

          const tl = gsap.timeline({
            delay,
            scrollTrigger: { trigger: el, start: "top 86%", once: true },
          });

          if (kind === "stagger" && !childSelector) {
            // The element itself is the grid: animate its direct children.
            const items = Array.from(el.children) as HTMLElement[];
            if (!items.length) return;
            playSteps(tl, items, steps, { stagger: { each: 0.08, from: "start" } });
            return;
          }

          // clearProps is essential: a lingering transform/filter/clip-path on a
          // section wrapper would become the containing block for the fixed
          // modals and lightbox rendered inside it.
          playSteps(tl, el, steps);

          if (childSelector) {
            const items = gsap.utils.toArray<HTMLElement>(childSelector, el);
            if (items.length) {
              // Children follow through under the section: a short dip, then a
              // back-eased landing staggered from the centre outward.
              tl.fromTo(
                items,
                { opacity: 0, y: 44 * amp, scale: 0.975, rotate: -0.5 * amp },
                {
                  opacity: 1,
                  y: 0,
                  scale: 1,
                  rotate: 0,
                  duration: 0.85,
                  ease: "back.out(1.4)",
                  stagger: { each: 0.07, from: "start" },
                  clearProps: "transform",
                },
                "-=0.8",
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
                // A touch of scrub lag gives the layers inertia instead of
                // locking them rigidly to the scrollbar.
                scrub: 0.8,
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
