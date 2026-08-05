import { Suspense, lazy } from "react";
import { useHydrated } from "@/hooks/useHydrated";

/** WebGL is browser-only: import the scene module after hydration. */
const HeroScene = lazy(() =>
  import("./HeroScene").then((m) => ({ default: m.HeroScene })),
);

function SceneFallback() {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="h-40 w-40 animate-pulse rounded-full bg-primary/10 blur-3xl" />
    </div>
  );
}

export function LazyHeroScene({
  className,
  style,
}: {
  className?: string;
  style?: React.CSSProperties;
}) {
  const hydrated = useHydrated();
  if (!hydrated) return <SceneFallback />;

  return (
    <Suspense fallback={<SceneFallback />}>
      <HeroScene className={className ?? ""} style={style ?? {}} />
    </Suspense>
  );
}

export default LazyHeroScene;
