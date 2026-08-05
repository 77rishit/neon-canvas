import { useEffect, type ReactNode } from "react";
import { Navbar } from "@/components/Navbar";
import { CustomCursor } from "@/components/CustomCursor";
import { MouseGlow } from "@/components/MouseGlow";
import { NoiseOverlay } from "@/components/NoiseOverlay";
import { ParticleField } from "@/components/ParticleField";
import { LoadingScreen } from "@/components/LoadingScreen";
import { PageTransition } from "@/components/PageTransition";
import { useLenis } from "@/hooks/useLenis";
import { useScrollFx } from "@/hooks/useScrollFx";

/**
 * App shell: smooth scroll, custom cursor, pointer glow and navigation.
 */
export function MainLayout({ children }: { children: ReactNode }) {
  useLenis();
  useScrollFx();

  useEffect(() => {
    const root = document.documentElement;
    root.classList.add("custom-cursor");
    return () => root.classList.remove("custom-cursor");
  }, []);

  return (
    <div className="relative min-h-dvh bg-background text-foreground">
      <LoadingScreen />
      <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <ParticleField />
        <span className="absolute -left-32 top-[12%] h-[26rem] w-[26rem] rounded-full bg-primary/10 blur-[120px] animate-blob" />
        <span className="absolute -right-24 top-[48%] h-[30rem] w-[30rem] rounded-full bg-secondary/10 blur-[140px] animate-blob [animation-delay:-6s]" />
        <span className="absolute left-1/3 bottom-[-10%] h-[24rem] w-[24rem] rounded-full bg-primary/[0.07] blur-[130px] animate-blob [animation-delay:-12s]" />
      </div>
      <NoiseOverlay />
      <MouseGlow />
      <CustomCursor />
      <Navbar />
      <main className="relative z-10">
        <PageTransition>{children}</PageTransition>
      </main>
    </div>
  );
}

export default MainLayout;
