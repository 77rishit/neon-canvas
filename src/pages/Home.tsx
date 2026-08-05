import { lazy, Suspense } from "react";
import { MainLayout } from "@/layouts/MainLayout";
import { Hero } from "@/sections/Hero";

/**
 * Below-the-fold sections are code-split so the initial bundle only carries
 * the shell + hero. They still stream during SSR, so crawlers receive the
 * full document.
 */
const About = lazy(() => import("@/sections/About"));
const Features = lazy(() => import("@/sections/Features"));
const Services = lazy(() => import("@/sections/Services"));
const Process = lazy(() => import("@/sections/Process"));
const Timeline = lazy(() => import("@/sections/Timeline"));
const Statistics = lazy(() => import("@/sections/Statistics"));
const Projects = lazy(() => import("@/sections/Projects"));
const Testimonials = lazy(() => import("@/sections/Testimonials"));
const FAQ = lazy(() => import("@/sections/FAQ"));
const Contact = lazy(() => import("@/sections/Contact"));

/** Neutral placeholder that reserves height while a section chunk resolves. */
function SectionFallback() {
  return <div aria-hidden className="min-h-[60vh] w-full" />;
}

export function Home() {
  return (
    <MainLayout>
      <Hero />
      <Suspense fallback={<SectionFallback />}>
        <About />
        <Features />
        <Services />
        <Process />
        <Timeline />
        <Statistics />
        <Projects />
        <Testimonials />
        <FAQ />
        <Contact />
      </Suspense>
    </MainLayout>
  );
}

export default Home;
