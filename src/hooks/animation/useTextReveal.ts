import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/utils/gsap";
import { splitText } from "@/utils/splitText";

export interface TextRevealOptions {
  /** `line` masks whole lines; `word` staggers individual words. */
  mode?: "line" | "word";
  /** Play immediately on mount instead of waiting for the scroll trigger. */
  immediate?: boolean;
  /** Seconds of lead-in before the first line moves. */
  delay?: number;
  /** ScrollTrigger start position. */
  start?: string;
}

/**
 * SplitText-style heading choreography.
 *
 * Splits the referenced element into masked lines (or words), then plays a GSAP
 * timeline that slides them up from behind their mask with a slight rotation.
 * Falls back to a plain fade for rich/markup headings and reduced-motion users.
 */
export function useTextReveal<T extends HTMLElement = HTMLHeadingElement>(
  options: TextRevealOptions = {},
) {
  const { mode = "line", immediate = false, delay = 0, start = "top 85%" } = options;
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof window === "undefined") return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.set(el, { opacity: 1 });
      return;
    }

    const split = splitText(el);
    const targets: HTMLElement[] = split
      ? mode === "word"
        ? split.words
        : split.lines
      : [el];

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: "expo.out" },
        delay,
        ...(immediate
          ? {}
          : { scrollTrigger: { trigger: el, start, once: true } }),
      });


      tl.fromTo(
        targets,
        { yPercent: 110, rotate: mode === "word" ? 3 : 1.5, opacity: 0 },
        {
          yPercent: 0,
          rotate: 0,
          opacity: 1,
          duration: 1,
          stagger: mode === "word" ? 0.05 : 0.11,
        },
      );


    }, el);

    return () => {
      ctx.revert();
      split?.revert();
      ScrollTrigger.refresh();
    };
  }, [mode, immediate, delay, start]);

  return ref;
}

export default useTextReveal;
