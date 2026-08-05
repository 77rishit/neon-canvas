import { memo, type ReactNode } from "react";
import { motion } from "framer-motion";
import { fadeUp, stagger, viewportOnce } from "@/utils/motion";
import { cn } from "@/utils/cn";

/** Scroll-reveal wrapper: staggers direct children that use <RevealItem>. */
function RevealBase({
  children,
  className,
  delay = 0.08,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      variants={stagger(delay)}
      initial="hidden"
      whileInView="show"
      viewport={viewportOnce}
      className={cn(className)}
    >
      {children}
    </motion.div>
  );
}

function RevealItemBase({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div variants={fadeUp} className={cn(className)}>
      {children}
    </motion.div>
  );
}

/** Memoized: these wrappers re-render only when their own props change. */
export const Reveal = memo(RevealBase);
export const RevealItem = memo(RevealItemBase);

export default Reveal;
