/**
 * Quantum state bus.
 *
 * A single mutable store shared by the WebGL portal, the cursor and any DOM
 * layer that needs per-frame scroll/pointer data. Deliberately outside React:
 * these values change every frame and must never trigger a re-render.
 */
export type QuantumState = {
  /** 0 at the top of the document, 1 at the bottom. */
  scroll: number;
  /** Normalised pointer position, -1..1 on both axes. */
  pointerX: number;
  pointerY: number;
  /** Instantaneous scroll velocity, roughly -1..1. */
  velocity: number;
  /** Portal energy: 1 in the hero, dips mid-page, reforms at the footer. */
  energy: number;
};

export const quantum: QuantumState = {
  scroll: 0,
  pointerX: 0,
  pointerY: 0,
  velocity: 0,
  energy: 1,
};

/** Portal life-cycle across the page: expand -> core -> fragments -> reform. */
export function energyForScroll(p: number) {
  // Hero (full portal) -> energy core -> fragmented mid-page -> reformed footer.
  const core = 1 - Math.min(1, p / 0.18) * 0.45; // 1 -> 0.55
  const fragment = 0.55 - Math.max(0, Math.min(1, (p - 0.25) / 0.35)) * 0.3; // 0.55 -> 0.25
  const reform = 0.25 + Math.max(0, Math.min(1, (p - 0.78) / 0.22)) * 0.85; // 0.25 -> 1.1
  if (p < 0.18) return core;
  if (p < 0.78) return Math.min(core, fragment);
  return reform;
}

let started = false;

/** Starts the global listeners once. Returns a disposer. */
export function startQuantumBus() {
  if (typeof window === "undefined" || started) return () => {};
  started = true;

  let last = window.scrollY;
  const onScroll = () => {
    const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    const y = window.scrollY;
    quantum.scroll = Math.min(1, Math.max(0, y / max));
    quantum.velocity = Math.max(-1, Math.min(1, (y - last) / 60));
    quantum.energy = energyForScroll(quantum.scroll);
    last = y;
  };
  const onMove = (e: PointerEvent) => {
    quantum.pointerX = (e.clientX / window.innerWidth) * 2 - 1;
    quantum.pointerY = (e.clientY / window.innerHeight) * 2 - 1;
  };

  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
  window.addEventListener("pointermove", onMove, { passive: true });

  return () => {
    started = false;
    window.removeEventListener("scroll", onScroll);
    window.removeEventListener("resize", onScroll);
    window.removeEventListener("pointermove", onMove);
  };
}
