import { useEffect, useRef, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { HiX } from "react-icons/hi";
import { cn } from "@/utils/cn";

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  className?: string;
}

/**
 * Accessible dialog: escape closes, backdrop click closes, focus is moved into
 * the panel on open and body scroll (plus Lenis) is locked while it is up.
 */
export function Modal({ open, onClose, title, children, className }: ModalProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    window.__lenis?.stop();
    const id = window.setTimeout(() => panelRef.current?.focus(), 40);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      window.__lenis?.start();
      window.clearTimeout(id);
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[120] flex items-end justify-center p-4 sm:items-center">
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
            className="absolute inset-0 bg-background/80 backdrop-blur-md"
          />
          <motion.div
            key="panel"
            ref={panelRef}
            tabIndex={-1}
            role="dialog"
            aria-modal="true"
            aria-label={title}
            initial={{ opacity: 0, y: 40, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.97 }}
            transition={{ type: "spring", stiffness: 220, damping: 26 }}
            className={cn(
              "glass-panel relative z-10 max-h-[86dvh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-primary/25 outline-none",
              className,
            )}
          >
            <button
              type="button"
              onClick={onClose}
              aria-label="Close dialog"
              className="absolute right-3 top-3 z-20 grid min-h-11 min-w-11 place-items-center rounded-lg text-muted-foreground transition-colors hover:text-primary focus-visible:ring-2 focus-visible:ring-ring"
            >
              <HiX size={22} />
            </button>
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

export default Modal;
