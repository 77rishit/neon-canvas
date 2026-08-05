import { Suspense, type ReactNode } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment, OrbitControls, Preload } from "@react-three/drei";

interface SceneProps {
  children?: ReactNode;
  className?: string;
  controls?: boolean;
}

/**
 * Base React Three Fiber canvas. Render inside <ClientOnly> or a
 * client-mounted component: WebGL is browser-only.
 */
export function Scene({ children, className, controls = false }: SceneProps) {
  return (
    <div className={className}>
      <Canvas
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
        camera={{ position: [0, 0, 6], fov: 45 }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.4} />
          <pointLight position={[6, 6, 6]} intensity={40} color="#00F5FF" />
          <pointLight position={[-6, -4, 2]} intensity={30} color="#7B2EFF" />
          <Environment preset="night" />
          {children}
          {controls && <OrbitControls enablePan={false} enableZoom={false} />}
          <Preload all />
        </Suspense>
      </Canvas>
    </div>
  );
}

export default Scene;
