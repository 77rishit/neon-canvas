import { memo } from "react";

/**
 * Slow diagonal light beams sweeping the page.
 *
 * Pure CSS transforms (translate3d only) so the sweep stays on the compositor
 * and never triggers layout. Decorative — hidden from assistive tech.
 */
function LightBeamsBase() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <span className="light-beam light-beam--a" />
      <span className="light-beam light-beam--b" />
      <span className="light-beam light-beam--c" />
    </div>
  );
}

export const LightBeams = memo(LightBeamsBase);
export default LightBeams;
