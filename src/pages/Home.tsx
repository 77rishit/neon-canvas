import { MainLayout } from "@/layouts/MainLayout";
import { RegistrationProvider } from "@/context/RegistrationContext";
import { SectionSeam } from "@/components/SectionSeam";
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
 * THE DIGITAL SINGULARITY — one continuous journey through an unstable world.
 *
 * The page is not a stack of sections but eight acts of the same reality:
 * stable, breaking, fragmenting, bending, weightless, holographic,
 * reconstructing and stable again. The WebGL universe behind the document
 * reads the same scroll position (see `@/utils/quantum`), so what the copy
 * says and what the world does are always the same beat.
 *
 * Each wrapper declares a UNIQUE transition — see useScrollFx — and no two
 * repeat: reality dissolves, fragments digitally, rides an energy wave, bends
 * light, loses gravity, reconstructs holographically, morphs like liquid and
 * finally collapses into place. Nothing here fades or slides.
 */
export function Home() {
  return (
    <RegistrationProvider>
      <MainLayout>
        <Hero />
        {/* act 1 — reality is stable */}
        <div data-fx="dissolve">
          <About />
        </div>
        <SectionSeam align="left" />
        {/* act 2 — the world starts breaking */}
        <div data-fx="digital-fragment">
          <Events />
        </div>
        <div data-fx="energy-wave">
          <Registration />
        </div>
        <SectionSeam align="right" />
        {/* act 3 — fragments float free */}
        <div data-fx="particle-assembly">
          <Competitions />
        </div>
        <div data-fx="signal-sweep">
          <Sponsors />
        </div>
        <SectionSeam />
        {/* act 4 — reality bends */}
        <div data-fx="light-distortion">
          <Gallery />
        </div>
        <Statistics />
        <div data-fx="reality-bend">
          <Timeline />
        </div>
        <SectionSeam align="left" />
        {/* act 5 — gravity disappears */}
        <div data-fx="gravity-lift">
          <Team />
        </div>
        {/* act 6 — everything becomes holographic */}
        <div data-fx="holo-reconstruct">
          <Testimonials />
        </div>
        <SectionSeam align="right" />
        {/* act 7 — the world reconstructs itself */}
        <div data-fx="liquid-morph">
          <FAQ />
        </div>
        {/* final — reality stabilises */}
        <div data-fx="quantum-collapse">
          <Contact />
        </div>
      </MainLayout>
    </RegistrationProvider>
  );
}


export default Home;
