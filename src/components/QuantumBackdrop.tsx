import { Suspense, lazy, useEffect, useState } from "react";
import { useHydrated } from "@/hooks/useHydrated";
import { startQuantumBus } from "@/utils/quantum";

/** WebGL is browser-only: the portal module loads after hydration. */
const QuantumPortalScene = lazy(() =>
  import("./three/QuantumPortalScene").then((m) => ({ default: m.QuantumPortalScene })),
);

/**
 * Persistent Quantum Portal backdrop.
 *
 * One fixed WebGL layer behind the entire document — aurora, energy waves,
 * volumetric halo, orbiting particles and the portal rings. It never stops
 * moving, and its state is driven by the shared quantum bus (scroll, velocity,
 * pointer) so every section reads as a different moment of one continuous
 * journey rather than an isolated block.
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
          <div className="absolute inset-0 opacity-80">
            <QuantumPortalScene reduced={reduced} />
          </div>
        </Suspense>
      )}
    </div>
  );
}

export default QuantumBackdrop;
