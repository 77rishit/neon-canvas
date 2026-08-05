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
 * (SEO + no hydration flash); the heavy WebGL hero is the one lazy boundary.
 * Each wrapper declares a UNIQUE GSAP entrance signature — see useScrollFx —
 * so no two sections share the same choreography. Statistics owns the page's
 * single pinned beat and drives its own timeline.
 */
export function Home() {
  return (
    <RegistrationProvider>
      <MainLayout>
        <Hero />
        <div data-fx="blur-focus">
          <About />
        </div>
        <div data-fx="slide-skew-left">
          <Events />
        </div>
        <div data-fx="curtain">
          <Registration />
        </div>
        <div data-fx="slide-skew-right">
          <Competitions />
        </div>
        <div data-fx="wipe-right">
          <Sponsors />
        </div>
        <div data-fx="mask-up">
          <Gallery />
        </div>
        <Statistics />
        <div data-fx="telescope">
          <Timeline />
        </div>
        <div data-fx="flip">
          <Team />
        </div>
        <div data-fx="zoom-out">
          <Testimonials />
        </div>
        <div data-fx="wipe-down">
          <FAQ />
        </div>
        <div data-fx="rise-rotate">
          <Contact />
        </div>
      </MainLayout>
    </RegistrationProvider>
  );
}

export default Home;
