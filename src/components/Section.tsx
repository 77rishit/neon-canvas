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
      className={cn("relative w-full", !flush && "py-24 md:py-32", className)}
    >
      <div className={cn("mx-auto w-full max-w-6xl px-6", containerClassName)}>
        {(eyebrow || title || description) && (
          <motion.header
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={viewportOnce}
            className="mb-12 max-w-2xl"
          >
            {eyebrow && (
              <span className="font-display text-xs uppercase tracking-[0.35em] text-primary">
                {eyebrow}
              </span>
            )}
            {title && (
              <h2 className="mt-4 text-3xl font-bold md:text-5xl text-gradient-neon">{title}</h2>
            )}
            {description && (
              <p className="mt-4 text-base leading-relaxed text-muted-foreground">{description}</p>
            )}
          </motion.header>
        )}
        {children}
      </div>
    </section>
  );
});

export default Section;
