/**
 * World state bus — "The Digital Singularity".
 *
 * A single mutable store shared by the WebGL universe, the cursor and any DOM
 * layer that needs per-frame scroll/pointer data. Deliberately outside React:
 * these values change every frame and must never trigger a re-render.
 *
 * On top of raw input it exposes the *world state*: which act of the story the
 * viewer is inside (stable -> breaking -> fragments -> bending -> zero-g ->
 * holographic -> reconstruction -> stable) plus a slowly mutating environment
 * so the universe never looks the same twice.
 */

export type QuantumState = {
  /** 0 at the top of the document, 1 at the bottom. */
  scroll: number;
  /** Normalised pointer position, -1..1 on both axes. */
  pointerX: number;
  pointerY: number;
  /** Instantaneous scroll velocity, roughly -1..1. */
  velocity: number;
  /** Core energy: high when reality is stable, low while it breaks apart. */
  energy: number;

  /** Continuous act position, 0..7 (fractional between acts). */
  phase: number;
  /** How broken reality is right now, 0..1. */
  chaos: number;
  /** How much gravity is left, 1 = normal, 0 = free float. */
  gravity: number;
  /** Holographic scanline/refraction weight, 0..1. */
  holo: number;
  /** Volumetric fog density, 0..1. */
  fog: number;

  /** Mutating environment — re-rolled roughly every 30s. */
  seed: number;
  /** Hue rotation applied to the palette, radians. */
  hue: number;
  /** Global glow intensity multiplier. */
  glow: number;
  /** Direction the key light travels from, radians. */
  lightDir: number;
  /** Which particle pattern is active, 0..2. */
  pattern: number;
};

export const quantum: QuantumState = {
  scroll: 0,
  pointerX: 0,
  pointerY: 0,
  velocity: 0,
  energy: 1,
  phase: 0,
  chaos: 0,
  gravity: 1,
  holo: 0,
  fog: 0.4,
  seed: Math.random() * 1000,
  hue: 0,
  glow: 1,
  lightDir: 0,
  pattern: 0,
};

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
/** Smooth ramp between two scroll positions. */
const ramp = (p: number, a: number, b: number) => clamp01((p - a) / (b - a));
const bell = (p: number, c: number, w: number) =>
  Math.exp(-((p - c) * (p - c)) / (2 * w * w));

/**
 * The eight acts of the story, mapped onto document progress.
 *   0 stable · 1 breaking · 2 fragments · 3 bending
 *   4 zero-g · 5 holographic · 6 reconstruction · 7 stable again
 */
export function phaseForScroll(p: number) {
  return clamp01(p) * 7;
}

/** Energy curve: full -> collapsing -> reforged at the end. */
export function energyForScroll(p: number) {
  const collapse = 1 - ramp(p, 0.05, 0.45) * 0.72; // 1 -> 0.28
  const rebuild = ramp(p, 0.72, 0.98); // reconstruction
  return clamp01(Math.max(collapse, 0.28 + rebuild * 0.85));
}

/** Recomputes every derived world value from raw scroll progress. */
export function deriveWorld(p: number) {
  quantum.phase = phaseForScroll(p);
  quantum.energy = energyForScroll(p);
  // Reality is most unstable through the middle acts, healed by the end.
  quantum.chaos = clamp01(bell(p, 0.46, 0.22) * 1.15 - ramp(p, 0.82, 1) * 0.8);
  // Gravity fades out around act 5 and returns as the world reconstructs.
  quantum.gravity = clamp01(1 - bell(p, 0.62, 0.16) * 1.1 + ramp(p, 0.85, 1) * 0.4);
  quantum.holo = clamp01(bell(p, 0.74, 0.12) * 1.3);
  quantum.fog = 0.28 + bell(p, 0.5, 0.3) * 0.5 + ramp(p, 0.9, 1) * 0.1;
}

/* ------------------------------------------------------------- mutation ---- */

/**
 * Every ~30 seconds the environment drifts: new noise seed, a nudge of hue, a
 * different glow level, a new light direction and a different particle
 * pattern. Values are targets — the shaders damp toward them, so the change is
 * felt rather than seen.
 */
export function mutateWorld() {
  quantum.seed = Math.random() * 1000;
  quantum.hue = (quantum.hue + (Math.random() * 0.5 - 0.18)) % (Math.PI * 2);
  quantum.glow = 0.78 + Math.random() * 0.55;
  quantum.lightDir = Math.random() * Math.PI * 2;
  quantum.pattern = Math.floor(Math.random() * 3);
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
    quantum.scroll = clamp01(y / max);
    quantum.velocity = Math.max(-1, Math.min(1, (y - last) / 60));
    deriveWorld(quantum.scroll);
    last = y;
  };
  const onMove = (e: PointerEvent) => {
    quantum.pointerX = (e.clientX / window.innerWidth) * 2 - 1;
    quantum.pointerY = (e.clientY / window.innerHeight) * 2 - 1;
  };

  onScroll();
  mutateWorld();
  const mutation = window.setInterval(mutateWorld, 30000);

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
  window.addEventListener("pointermove", onMove, { passive: true });

  return () => {
    started = false;
    window.clearInterval(mutation);
    window.removeEventListener("scroll", onScroll);
    window.removeEventListener("resize", onScroll);
    window.removeEventListener("pointermove", onMove);
  };
}
