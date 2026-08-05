import { forwardRef, type ReactNode } from "react";
import { motion } from "framer-motion";
import { cn } from "@/utils/cn";
import { fadeUp, viewportOnce } from "@/utils/motion";

export interface SectionProps {
  id?: string;
  eyebrow?: string;
  title?: ReactNode;
  description?: ReactNode;
  children?: ReactNode;
  className?: string;
  containerClassName?: string;
  /** Removes vertical padding for full-bleed sections (e.g. hero). */
  flush?: boolean;
}

export const Section = forwardRef<HTMLElement, SectionProps>(function Section(
  { id, eyebrow, title, description, children, className, containerClassName, flush },
  ref,
) {
  return (
    <section
      id={id}
      ref={ref}
      className={cn(
        "relative w-full scroll-mt-28",
        !flush && "py-20 md:py-28 lg:py-32",
        className,
      )}
    >
      <div className={cn("mx-auto w-full max-w-6xl px-6", containerClassName)}>
        {(eyebrow || title || description) && (
          <motion.header
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={viewportOnce}
            className="mb-10 max-w-2xl md:mb-14"
          >
            {eyebrow && (
              <span className="font-display text-[0.6rem] uppercase tracking-[0.38em] text-primary md:text-xs">
                {eyebrow}
              </span>
            )}
            {title && (
              <h2 className="mt-4 text-balance text-[clamp(2rem,4.6vw,3.5rem)] font-bold leading-[1.05] text-gradient-neon">
                {title}
              </h2>
            )}
            {description && (
              <p className="mt-5 max-w-xl text-pretty text-base leading-relaxed text-muted-foreground md:text-lg">
                {description}
              </p>
            )}
          </motion.header>
        )}
        {children}
      </div>
    </section>
  );
});

export default Section;
