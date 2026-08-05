import { useRef, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useRouterState } from "@tanstack/react-router";
import { useHydrated } from "@/hooks/useHydrated";

/**
 * Neon fade/slide between routes.
 * The very first render matches the server markup exactly (no entry animation)
 * to avoid a hydration mismatch; subsequent navigations animate.
 */
export function PageTransition({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const hydrated = useHydrated();
  const firstPath = useRef(pathname);
  // Before hydration render the plain tree so client markup matches the server.
  if (!hydrated) return <>{children}</>;

  const isFirstRender = pathname === firstPath.current;

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={pathname}
        initial={isFirstRender ? false : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -12 }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

export default PageTransition;
