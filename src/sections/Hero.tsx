import { motion } from "framer-motion";
import { Section } from "@/components/Section";
import { Button } from "@/components/Button";
import { fadeUp, stagger, viewportOnce } from "@/utils/motion";

/**
 * Scaffold hero. Replace the copy/visuals when the site build starts.
 */
export function Hero() {
  return (
    <Section id="home" flush className="flex min-h-screen items-center pt-24">
      <motion.div
        variants={stagger(0.12)}
        initial="hidden"
        whileInView="show"
        viewport={viewportOnce}
        className="max-w-3xl"
      >
        <motion.span
          variants={fadeUp}
          className="font-display text-xs uppercase tracking-[0.4em] text-primary animate-flicker"
        >
          System online
        </motion.span>
        <motion.h1
          variants={fadeUp}
          className="mt-6 text-5xl font-bold leading-[1.05] md:text-7xl text-gradient-neon"
        >
          Cyberpunk starter kit
        </motion.h1>
        <motion.p variants={fadeUp} className="mt-6 max-w-xl text-lg text-muted-foreground">
          React 19, Vite, Tailwind, React Three Fiber, Framer Motion, GSAP ScrollTrigger and Lenis —
          wired up and ready for the real build.
        </motion.p>
        <motion.div variants={fadeUp} className="mt-10 flex flex-wrap gap-4">
          <Button size="lg">Get started</Button>
          <Button size="lg" variant="outline">
            Documentation
          </Button>
        </motion.div>
      </motion.div>
    </Section>
  );
}

export default Hero;
