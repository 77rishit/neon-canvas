import { MainLayout } from "@/layouts/MainLayout";
import { Hero } from "@/sections/Hero";
import { About } from "@/sections/About";
import { Features } from "@/sections/Features";
import { Services } from "@/sections/Services";
import { Process } from "@/sections/Process";
import { Timeline } from "@/sections/Timeline";
import { Statistics } from "@/sections/Statistics";
import { Projects } from "@/sections/Projects";
import { Testimonials } from "@/sections/Testimonials";
import { FAQ } from "@/sections/FAQ";
import { Contact } from "@/sections/Contact";

/**
 * Landing page composition.
 *
 * Sections are imported statically so the whole document is server-rendered in
 * one pass (best for SEO and to avoid hydration flashes). The heavy pieces are
 * split instead where it actually pays off:
 *  - the WebGL hero scene is lazy + Suspense (`LazyHeroScene`)
 *  - route-level chunks are handled by TanStack Router's auto code splitting
 */
export function Home() {
  return (
    <MainLayout>
      <Hero />
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
    </MainLayout>
  );
}

export default Home;
