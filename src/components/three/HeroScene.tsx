import { Suspense, useEffect, useRef, type MutableRefObject } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  AdaptiveDpr,
  AdaptiveEvents,
  BakeShadows,
  ContactShadows,
  Environment,
  PerformanceMonitor,
  Preload,
} from "@react-three/drei";
import { Bloom, EffectComposer, Vignette } from "@react-three/postprocessing";
import { useState } from "react";
import { MathUtils } from "three";
import type { PointLight, SpotLight } from "three";

import { Robot } from "./Robot";
import { HoloRings } from "./HoloRings";
import { Particles } from "./Particles";
import { FloatingCubes } from "./FloatingCubes";
import { AnimatedLines } from "./AnimatedLines";

/** Normalised hero scroll progress (0 at top, 1 once the hero has passed). */
function useScrollProgress() {
  const progress = useRef(0);
  useEffect(() => {
    const read = () => {
      progress.current = Math.min(1, window.scrollY / Math.max(1, window.innerHeight));
    };
    read();
    window.addEventListener("scroll", read, { passive: true });
    window.addEventListener("resize", read);
    return () => {
      window.removeEventListener("scroll", read);
      window.removeEventListener("resize", read);
    };
  }, []);
  return progress;
}

/**
 * Parallax camera driven by pointer + a slow idle orbit, pushed further back and
 * lower as the page scrolls so the scene reads cinematically on the way out.
 */
function CameraRig({ progress }: { progress: MutableRefObject<number> }) {
  const { camera } = useThree();
  const target = useRef({ x: 0, y: 0 });

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    const p = progress.current;
    target.current.x = state.pointer.x * 1.1 + Math.sin(t * 0.15) * 0.3;
    target.current.y = state.pointer.y * 0.6 + Math.cos(t * 0.12) * 0.2;

    camera.position.x = MathUtils.damp(camera.position.x, target.current.x, 1.6, delta);
    camera.position.y = MathUtils.damp(
      camera.position.y,
      0.35 + target.current.y - p * 1.4,
      1.6,
      delta,
    );
    camera.position.z = MathUtils.damp(camera.position.z, 11 + p * 4.5, 1.6, delta);
    camera.lookAt(0, 0.25 - p * 0.5, 0);
  });

  return null;
}

/** Key light gently cools and dims as the hero scrolls away. */
function ScrollLights({ progress }: { progress: MutableRefObject<number> }) {
  const spot = useRef<SpotLight>(null);
  const fill = useRef<PointLight>(null);

  useFrame((_, delta) => {
    const p = progress.current;
    if (spot.current) {
      spot.current.intensity = MathUtils.damp(spot.current.intensity, 90 - p * 55, 2, delta);
    }
    if (fill.current) {
      fill.current.intensity = MathUtils.damp(fill.current.intensity, 40 + p * 45, 2, delta);
    }
  });

  return (
    <>
      <spotLight
        ref={spot}
        position={[5, 6, 5]}
        angle={0.5}
        penumbra={1}
        intensity={90}
        color="#00F5FF"
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-bias={-0.0004}
      />
      <pointLight ref={fill} position={[-5, -2, 3]} intensity={40} color="#7B2EFF" />
    </>
  );
}

export function HeroScene({ className }: { className?: string }) {
  const [degraded, setDegraded] = useState(false);
  const progress = useScrollProgress();

  return (
    <div className={className}>
      <Canvas
        shadows="soft"
        dpr={degraded ? [1, 1] : [1, 1.75]}
        gl={{ antialias: !degraded, alpha: true, powerPreference: "high-performance" }}
        camera={{ position: [0, 0.35, 11], fov: 38 }}
      >
        <PerformanceMonitor onDecline={() => setDegraded(true)} />

        <Suspense fallback={null}>
          <ambientLight intensity={0.35} />
          <hemisphereLight args={["#00F5FF", "#7B2EFF", 0.18]} />
          <ScrollLights progress={progress} />
          <Environment preset="night" />

          <Robot />
          <HoloRings />
          <FloatingCubes count={degraded ? 10 : 22} />
          <AnimatedLines count={degraded ? 4 : 7} />
          <Particles count={degraded ? 250 : 600} />

          <ContactShadows
            position={[0, -1.35, 0]}
            opacity={0.4}
            scale={9}
            blur={2.8}
            far={4}
            color="#062a33"
          />

          <CameraRig progress={progress} />

          {!degraded && (
            <EffectComposer enableNormalPass={false}>
              <Bloom
                intensity={0.62}
                luminanceThreshold={0.3}
                luminanceSmoothing={0.5}
                mipmapBlur
              />
              <Vignette eskil={false} offset={0.35} darkness={0.6} />
            </EffectComposer>
          )}

          <BakeShadows />
          <Preload all />
        </Suspense>

        <AdaptiveDpr pixelated />
        <AdaptiveEvents />
      </Canvas>
    </div>
  );
}

export default HeroScene;
