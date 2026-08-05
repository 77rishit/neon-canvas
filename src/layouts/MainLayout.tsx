import type { ReactNode } from "react";
import { Navbar } from "@/components/Navbar";
import { useLenis } from "@/hooks/useLenis";

/**
 * App shell: smooth scroll + persistent navigation.
 */
export function MainLayout({ children }: { children: ReactNode }) {
  useLenis();

  return (
    <div className="relative min-h-screen bg-background text-foreground">
      <div className="pointer-events-none fixed inset-0 grid-lines opacity-40" aria-hidden />
      <Navbar />
      <main className="relative z-10">{children}</main>
    </div>
  );
}

export default MainLayout;
