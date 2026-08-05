import { useSpotlight } from "@/hooks/animation/useSpotlight";
import { useIsMobile } from "@/hooks/use-mobile";

/**
 * Mouse-following spotlight: a soft neon light that trails the pointer across
 * the viewport with GSAP inertia.
 */
export function MouseGlow() {
  const isMobile = useIsMobile();
  const ref = useSpotlight<HTMLDivElement>({ duration: 1.1 });

  if (isMobile) return null;

  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-0 h-[44rem] w-[44rem] rounded-full opacity-0 [background:radial-gradient(circle,color-mix(in_srgb,var(--primary)_15%,transparent),transparent_68%)]"
    />
  );
}

export default MouseGlow;
