import { Suspense, lazy, useEffect, useState } from "react";
import { useHydrated } from "@/hooks/useHydrated";
import { startQuantumBus } from "@/utils/quantum";

/** WebGL is browser-only: the universe module loads after hydration. */
const SingularityScene = lazy(() =>
  import("./three/SingularityScene").then((m) => ({ default: m.SingularityScene })),
);

/**
 * Persistent backdrop for THE DIGITAL SINGULARITY.
 *
 * One fixed WebGL layer behind the entire document — infinite void, volumetric
 * fog, liquid light, neural signals, a morphing energy body and quantum
 * fragments. It never stops evolving: scroll drives the eight acts of the
 * story, the pointer bends the light, and every ~30 seconds the environment
 * itself mutates (seed, hue, glow, light direction, particle pattern) so the
 * world is never twice the same.
 */
export function QuantumBackdrop() {
  const hydrated = useHydrated();
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    return startQuantumBus();
  }, []);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {/* Static base so there is never a flash of empty canvas. */}
      <div className="absolute inset-0 bg-background" />
      {hydrated && (
        <Suspense fallback={null}>
          <div className="absolute inset-0 opacity-70">
            <SingularityScene reduced={reduced} />
          </div>
        </Suspense>
      )}
    </div>
  );
}

export default QuantumBackdrop;
