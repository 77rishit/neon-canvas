import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import type { InstancedMesh } from "three";
import { Object3D } from "three";

interface FloatingCubesProps {
  count?: number;
}

/** Instanced wireframe-ish cubes orbiting slowly around the robot. */
export function FloatingCubes({ count = 22 }: FloatingCubesProps) {
  const ref = useRef<InstancedMesh>(null);
  const dummy = useMemo(() => new Object3D(), []);

  const seeds = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        radius: 2.6 + Math.random() * 3.2,
        angle: (i / count) * Math.PI * 2 + Math.random() * 0.4,
        y: (Math.random() - 0.5) * 4,
        speed: 0.08 + Math.random() * 0.16,
        scale: 0.08 + Math.random() * 0.18,
        spin: Math.random() * 0.8 + 0.2,
      })),
    [count],
  );

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime;
    seeds.forEach((s, i) => {
      const a = s.angle + t * s.speed;
      dummy.position.set(Math.cos(a) * s.radius, s.y + Math.sin(t * 0.6 + i) * 0.25, Math.sin(a) * s.radius * 0.55);
      dummy.rotation.set(t * s.spin, t * s.spin * 0.7, 0);
      dummy.scale.setScalar(s.scale);
      dummy.updateMatrix();
      ref.current!.setMatrixAt(i, dummy.matrix);
    });
    ref.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={ref} args={[undefined, undefined, count]} castShadow>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial
        color="#0f1230"
        emissive="#00F5FF"
        emissiveIntensity={0.55}
        metalness={0.95}
        roughness={0.15}
      />
    </instancedMesh>
  );
}

export default FloatingCubes;
