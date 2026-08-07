import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * Single GSAP entry point. Plugins are registered once, on the client only.
 */
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);

  // Scroll callbacks are batched to the refresh rate instead of firing on
  // every scroll event, and mobile URL-bar resizes no longer trigger a full
  // (layout-thrashing) refresh mid-scroll.
  ScrollTrigger.config({ limitCallbacks: true, ignoreMobileResize: true });

  // Never let GSAP "catch up" after a stall: on high-refresh displays a
  // catch-up frame is what turns one dropped frame into visible stutter.
  gsap.ticker.lagSmoothing(200, 24);
}

export { gsap, ScrollTrigger };
