import { motion } from "framer-motion";

export function ScrollIndicator({ href = "#about" }: { href?: string }) {
  return (
    <motion.a
      href={href}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.6, duration: 0.8 }}
      className="group absolute bottom-8 left-1/2 z-20 flex -translate-x-1/2 flex-col items-center gap-3"
      aria-label="Scroll down"
    >
      <span className="font-display text-[0.6rem] uppercase tracking-[0.4em] text-muted-foreground transition-colors group-hover:text-primary">
        Scroll
      </span>
      <span className="relative flex h-10 w-6 justify-center rounded-full border border-primary/40 p-1">
        <motion.span
          className="h-2 w-1 rounded-full bg-primary"
          animate={{ y: [0, 14, 0], opacity: [1, 0.3, 1] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        />
      </span>
    </motion.a>
  );
}

export default ScrollIndicator;
