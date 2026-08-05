import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import type { Group } from "three";
import { AdditiveBlending } from "three";

/** Concentric holographic rings orbiting the robot. */
export function HoloRings() {
  const group = useRef<Group>(null);

  const rings = useMemo(
    () => [
      { r: 1.75, tilt: [1.35, 0, 0.2], color: "#00F5FF", speed: 0.35, w: 0.012 },
      { r: 2.25, tilt: [1.1, 0.35, -0.15], color: "#7B2EFF", speed: -0.24, w: 0.008 },
      { r: 2.75, tilt: [1.5, -0.2, 0.4], color: "#00F5FF", speed: 0.16, w: 0.006 },
    ],
    [],
  );

  useFrame((state, delta) => {
    if (!group.current) return;
    group.current.children.forEach((child, i) => {
      child.rotation.z += delta * (rings[i]?.speed ?? 0);
    });
    group.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.2) * 0.15;
  });

  return (
    <group ref={group}>
      {rings.map((ring, i) => (
        <mesh key={i} rotation={ring.tilt as [number, number, number]}>
          <torusGeometry args={[ring.r, ring.w, 8, 128]} />
          <meshBasicMaterial
            color={ring.color}
            toneMapped={false}
            transparent
            opacity={0.75}
            blending={AdditiveBlending}
          />
        </mesh>
      ))}
    </group>
  );
}

export default HoloRings;
