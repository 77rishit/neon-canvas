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

/** One distinct entrance per section — no repeated fade-ups. */
const SIGNATURES: Record<string, Signature> = {
  // About — depth-of-field pull. Drifts a touch further out of focus before
  // the lens snaps, then breathes past 1:1 and settles back.
  "blur-focus": (a) => [
    {
      from: { opacity: 0, scale: 1.05, filter: `blur(${10 * a}px)`, y: -8 * a },
      to: { opacity: 0.35, scale: 1.08, filter: `blur(${16 * a}px)`, y: 0 },
      duration: 0.28,
      ease: "power1.inOut",
    },
    {
      to: { opacity: 1, scale: 0.995, filter: "blur(0px)" },
      duration: 1.05,
      ease: "expo.out",
    },
    { to: { scale: 1 }, duration: 0.55, ease: "power2.inOut", at: "-=0.12" },
  ],

  // Events — pulls back to the left before gliding in, skew unwinding late.
  "slide-skew-left": (a) => [
    {
      from: { opacity: 0, x: -100 * a, skewY: 2.5 * a },
      to: { x: -130 * a, skewY: 4 * a, opacity: 0.2 },
      duration: 0.26,
      ease: "power2.in",
    },
    { to: { opacity: 1, x: 10 * a, skewY: -0.8 * a }, duration: 1, ease: "expo.out" },
    { to: { x: 0, skewY: 0 }, duration: 0.6, ease: "power2.out", at: "-=0.18" },
  ],

  // Registration — curtain from the centre line, easing wide then breathing in.
  curtain: (a) => [
    {
      from: { clipPath: "inset(46% 0% 46% 0%)", opacity: 0.35, scaleY: 0.98 },
      to: { clipPath: "inset(49% 0% 49% 0%)", opacity: 0.45 },
      duration: 0.24,
      ease: "power1.in",
    },
    {
      to: { clipPath: "inset(0% 0% 0% 0%)", opacity: 1, scaleY: 1.01 },
      duration: 1.15,
      ease: "expo.out",
    },
    { to: { scaleY: 1 }, duration: 0.5, ease: "power2.inOut", at: "-=0.1" },
    ...(a > 0.8 ? [] : []),
  ],

  // Competitions — mirrored counterpart to Events.
  "slide-skew-right": (a) => [
    {
      from: { opacity: 0, x: 100 * a, skewY: -2.5 * a },
      to: { x: 130 * a, skewY: -4 * a, opacity: 0.2 },
      duration: 0.26,
      ease: "power2.in",
    },
    { to: { opacity: 1, x: -10 * a, skewY: 0.8 * a }, duration: 1, ease: "expo.out" },
    { to: { x: 0, skewY: 0 }, duration: 0.6, ease: "power2.out", at: "-=0.18" },
  ],

  // Sponsors — a wipe that unmasks left to right, the panel drifting with it.
  "wipe-right": (a) => [
    {
      from: { clipPath: "inset(0% 100% 0% 0%)", x: -24 * a },
      to: { x: -34 * a },
      duration: 0.2,
      ease: "power1.in",
    },
    {
      to: { clipPath: "inset(0% 0% 0% 0%)", x: 6 * a },
      duration: 1.15,
      ease: "expo.out",
    },
    { to: { x: 0 }, duration: 0.55, ease: "power2.out", at: "-=0.2" },
  ],

  // Gallery — bottom-up mask, the frame sinking before it rises and overshoots.
  "mask-up": (a) => [
    {
      from: { clipPath: "inset(0% 0% 100% 0%)", scale: 1.04, y: 26 * a },
      to: { y: 38 * a, scale: 1.06 },
      duration: 0.26,
      ease: "power2.in",
    },
    {
      to: { clipPath: "inset(0% 0% 0% 0%)", y: -6 * a, scale: 0.998 },
      duration: 1.15,
      ease: "expo.out",
    },
    { to: { y: 0, scale: 1 }, duration: 0.6, ease: "power2.inOut", at: "-=0.15" },
  ],

  // Team — 3D flip that tips further back before swinging past flat.
  flip: (a) => [
    {
      from: { opacity: 0, rotateX: 22 * a, y: 48 * a, transformOrigin: "50% 0%" },
      to: { rotateX: 30 * a, y: 62 * a, opacity: 0.15 },
      duration: 0.26,
      ease: "power2.in",
    },
    { to: { opacity: 1, rotateX: -4 * a, y: 0 }, duration: 0.95, ease: "expo.out" },
    { to: { rotateX: 0 }, duration: 0.55, ease: "power2.inOut", at: "-=0.15" },
  ],

  // Testimonials — a lens pulling back from a blurred close-up, past focus.
  "zoom-out": (a) => [
    {
      from: { opacity: 0, scale: 0.9, filter: `blur(${7 * a}px)` },
      to: { scale: 0.87, opacity: 0.2, filter: `blur(${10 * a}px)` },
      duration: 0.26,
      ease: "power2.in",
    },
    { to: { opacity: 1, scale: 1.015, filter: "blur(0px)" }, duration: 0.95, ease: "expo.out" },
    { to: { scale: 1 }, duration: 0.5, ease: "power2.inOut", at: "-=0.12" },
  ],

  // FAQ — vertical curtain dropping from the top edge with a rebound.
  "wipe-down": (a) => [
    {
      from: { clipPath: "inset(0% 0% 100% 0%)", opacity: 0.5, y: -14 * a },
      to: { y: -22 * a },
      duration: 0.22,
      ease: "power1.in",
    },
    { to: { clipPath: "inset(0% 0% 0% 0%)", opacity: 1, y: 5 * a }, duration: 1.05, ease: "expo.out" },
    { to: { y: 0 }, duration: 0.5, ease: "power2.out", at: "-=0.18" },
  ],

  // Contact — pivots off its base line, dipping before it swings up level.
  "rise-rotate": (a) => [
    {
      from: { opacity: 0, y: 60 * a, rotate: -2.2 * a, transformOrigin: "0% 100%" },
      to: { y: 76 * a, rotate: -3.2 * a, opacity: 0.15 },
      duration: 0.26,
      ease: "power2.in",
    },
    { to: { opacity: 1, y: 0, rotate: 0.6 * a }, duration: 1, ease: "expo.out" },
    { to: { rotate: 0 }, duration: 0.55, ease: "power2.inOut", at: "-=0.15" },
  ],

  // Timeline — telescopes out of the page, compressing first.
  telescope: (a) => [
    {
      from: { opacity: 0, scaleY: 0.88, y: 42 * a, transformOrigin: "50% 0%" },
      to: { scaleY: 0.82, y: 54 * a, opacity: 0.2 },
      duration: 0.26,
      ease: "power2.in",
    },
    { to: { opacity: 1, scaleY: 1.02, y: 0 }, duration: 0.95, ease: "expo.out" },
    { to: { scaleY: 1 }, duration: 0.5, ease: "power2.inOut", at: "-=0.12" },
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
