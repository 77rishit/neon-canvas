/**
 * Scrolls to an in-page section id through Lenis when available so programmatic
 * navigation feels identical to clicking an anchor.
 */
export function scrollToSection(id: string) {
  if (typeof document === "undefined") return;
  const target = document.querySelector(id.startsWith("#") ? id : `#${id}`);
  if (!target) return;
  const lenis = window.__lenis;
  if (lenis) lenis.scrollTo(target as HTMLElement, { duration: 1.2 });
  else target.scrollIntoView({ behavior: "smooth", block: "start" });
  history.replaceState(null, "", id.startsWith("#") ? id : `#${id}`);
}

/** Smoothly returns to the very top of the document. */
export function scrollToTop() {
  const lenis = window.__lenis;
  if (lenis) lenis.scrollTo(0, { duration: 1.2 });
  else window.scrollTo({ top: 0, behavior: "smooth" });
}
