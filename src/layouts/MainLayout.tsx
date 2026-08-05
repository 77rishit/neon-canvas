import { useEffect, type ReactNode } from "react";
import { Navbar } from "@/components/Navbar";
import { CustomCursor } from "@/components/CustomCursor";
import { MouseGlow } from "@/components/MouseGlow";
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
    <div className="relative min-h-screen bg-background text-foreground">
      <MouseGlow />
      <CustomCursor />
      <Navbar />
      <main className="relative z-10">{children}</main>
    </div>
  );
}

export default MainLayout;
