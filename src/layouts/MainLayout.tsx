import { useEffect, type ReactNode } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { CustomCursor } from "@/components/CustomCursor";
import { MouseGlow } from "@/components/MouseGlow";
import { NoiseOverlay } from "@/components/NoiseOverlay";
import { LightBeams } from "@/components/LightBeams";
import { QuantumBackdrop } from "@/components/QuantumBackdrop";


import { LoadingScreen } from "@/components/LoadingScreen";
import { PageTransition } from "@/components/PageTransition";
import { ScrollProgress } from "@/components/ScrollProgress";
import { useLenis } from "@/hooks/useLenis";
import { useScrollFx } from "@/hooks/useScrollFx";
import { useSmoothAnchors } from "@/hooks/useSmoothAnchors";

/**
 * App shell: smooth scroll, custom cursor, pointer glow and navigation.
 */
export function MainLayout({ children }: { children: ReactNode }) {
  useLenis();
  useScrollFx();
  useSmoothAnchors();

  useEffect(() => {
    const root = document.documentElement;
    root.classList.add("custom-cursor");
    return () => root.classList.remove("custom-cursor");
  }, []);

  return (
    <div className="relative min-h-dvh bg-background text-foreground">
      {/* Keyboard users can jump past the fixed nav and decorative layers. */}
      <a
        href="#home"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[110] focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:font-display focus:text-sm focus:text-primary-foreground"
      >
        Skip to content
      </a>
      <LoadingScreen />
      <ScrollProgress />
      {/* One living universe behind every section — the portal never stops. */}
      <QuantumBackdrop />
      <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <LightBeams />
      </div>
      <NoiseOverlay />
      <MouseGlow />
      <CustomCursor />

      <Navbar />
      <main className="relative z-10">
        <PageTransition>{children}</PageTransition>
      </main>
      <Footer />
    </div>
  );
}

export default MainLayout;
