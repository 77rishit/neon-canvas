import { MainLayout } from "@/layouts/MainLayout";
import { RegistrationProvider } from "@/context/RegistrationContext";
import { Hero } from "@/sections/Hero";
import { About } from "@/sections/About";
import { Events } from "@/sections/Events";
import { Registration } from "@/sections/Registration";
import { Competitions } from "@/sections/Competitions";
import { Sponsors } from "@/sections/Sponsors";
import { Gallery } from "@/sections/Gallery";
import { Statistics } from "@/sections/Statistics";
import { Timeline } from "@/sections/Timeline";
import { Team } from "@/sections/Team";
import { Testimonials } from "@/sections/Testimonials";
import { FAQ } from "@/sections/FAQ";
import { Contact } from "@/sections/Contact";

/**
 * Techfest landing page composition.
 *
 * Sections are imported statically so the document server-renders in one pass
 * (SEO + no hydration flash). The heavy WebGL hero is the one lazy boundary.
 * Each wrapper assigns a unique GSAP entrance signature (see useScrollFx).
 */
export function Home() {
  return (
    <RegistrationProvider>
      <MainLayout>
        <Hero />
        <div data-fx="fade-scale">
          <About />
        </div>
        <div data-fx="left">
          <Events />
        </div>
        <Registration />
        <div data-fx="right">
          <Competitions />
        </div>
        <div data-fx="clip">
          <Sponsors />
        </div>
        <Gallery />
        <div data-fx="rotate">
          <Statistics />
        </div>
        <Timeline />
        <div data-fx="fade-scale">
          <Team />
        </div>
        <Testimonials />
        <FAQ />
        <Contact />
      </MainLayout>
    </RegistrationProvider>
  );
}

export default Home;
