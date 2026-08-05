import { motion } from "framer-motion";
import { cn } from "@/utils/cn";

/**
 * Animated wordmark: drawn bracket glyph + character-staggered lettering.
 */
export function Logo({ className }: { className?: string }) {
  const letters = "NEOGRID".split("");

  return (
    <motion.span
      initial="rest"
      whileHover="hover"
      className={cn("group inline-flex items-center gap-2", className)}
    >
      <motion.svg
        viewBox="0 0 32 32"
        className="h-7 w-7 text-primary"
        fill="none"
        aria-hidden
        variants={{ rest: { rotate: 0 }, hover: { rotate: 90 } }}
        transition={{ type: "spring", stiffness: 200, damping: 16 }}
      >
        <motion.rect
          x="4"
          y="4"
          width="24"
          height="24"
          rx="6"
          stroke="currentColor"
          strokeWidth="2"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 1.4, ease: "easeInOut" }}
        />
        <motion.path
          d="M11 21V11l10 10V11"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.1, delay: 0.5, ease: "easeInOut" }}
        />
      </motion.svg>

      <span className="flex font-display text-base font-bold tracking-[0.22em]">
        {letters.map((char, i) => (
          <motion.span
            key={`${char}-${i}`}
            className="text-gradient-neon"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + i * 0.05, duration: 0.4 }}
            variants={{ rest: { y: 0 }, hover: { y: [-1, -5, 0] } }}
          >
            {char}
          </motion.span>
        ))}
      </span>
    </motion.span>
  );
}

export default Logo;
