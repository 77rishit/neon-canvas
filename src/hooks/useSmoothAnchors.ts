import { useEffect } from "react";
import type Lenis from "lenis";

declare global {
  interface Window {
    __lenis?: Lenis;
  }
}

/**
 * Global in-page anchor handling.
 *
 * Native `#hash` jumps land underneath the fixed navbar and bypass Lenis, so
 * every same-page anchor is intercepted once at the document level and routed
 * through Lenis with a navbar-sized offset. Falls back to `scrollIntoView`
 * when Lenis is not mounted (SSR hydration, reduced-motion bail-outs).
 */
export function useSmoothAnchors() {
  useEffect(() => {
    function onClick(event: MouseEvent) {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey) return;

      const anchor = (event.target as HTMLElement | null)?.closest?.("a");
      const href = anchor?.getAttribute("href");
      if (!anchor || !href || !href.startsWith("#") || href === "#") return;

      const target = document.querySelector(href);
      if (!target) return;

      event.preventDefault();
      const lenis = window.__lenis;
      if (lenis) {
        // Sections carry `scroll-mt-28`, which Lenis honours, so no extra offset.
        lenis.scrollTo(target as HTMLElement, { duration: 1.2 });
      } else {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
      history.replaceState(null, "", href);
    }

    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);
}

export default useSmoothAnchors;
