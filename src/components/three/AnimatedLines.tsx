import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import type { Group } from "three";
import { AdditiveBlending, BufferGeometry, CatmullRomCurve3, Vector3 } from "three";

/** Animated data streams: curved neon lines sweeping around the scene. */
export function AnimatedLines({ count = 7 }: { count?: number }) {
  const group = useRef<Group>(null);

  const lines = useMemo(() => {
    return Array.from({ length: count }, (_, i) => {
      const radius = 2.2 + (i / count) * 3;
      const pts = Array.from({ length: 10 }, (_, j) => {
        const a = (j / 9) * Math.PI * 1.6 + i;
        return new Vector3(
          Math.cos(a) * radius,
          (j / 9 - 0.5) * (2 + i * 0.35),
          Math.sin(a) * radius * 0.5,
        );
      });
      const curve = new CatmullRomCurve3(pts);
      const geometry = new BufferGeometry().setFromPoints(curve.getPoints(90));
      return {
        geometry,
        color: i % 2 === 0 ? "#00F5FF" : "#7B2EFF",
        speed: 0.06 + i * 0.015,
      };
    });
  }, [count]);

  useFrame((state, delta) => {
    if (!group.current) return;
    group.current.rotation.y -= delta * 0.05;
    group.current.children.forEach((child, i) => {
      child.rotation.y += delta * (lines[i]?.speed ?? 0);
      const mat = (child as unknown as { material: { opacity: number } }).material;
      mat.opacity = 0.18 + Math.abs(Math.sin(state.clock.elapsedTime * 0.5 + i)) * 0.32;
    });
  });

  return (
    <group ref={group}>
      {lines.map((line, i) => (
        <line key={i}>
          <primitive object={line.geometry} attach="geometry" />
          <lineBasicMaterial
            color={line.color}
            transparent
            opacity={0.3}
            toneMapped={false}
            blending={AdditiveBlending}
          />
        </line>
      ))}
    </group>
  );
}

export default AnimatedLines;
