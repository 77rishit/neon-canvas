import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import type { Group, Mesh } from "three";
import { MathUtils } from "three";

const PRIMARY = "#00F5FF";
const SECONDARY = "#7B2EFF";

/**
 * Futuristic robot built from primitives — cheap to render, no external GLTF.
 * Idle animation: gentle breathing + head tracking toward the pointer.
 */
export function Robot() {
  const group = useRef<Group>(null);
  const head = useRef<Group>(null);
  const core = useRef<Mesh>(null);
  const armL = useRef<Group>(null);
  const armR = useRef<Group>(null);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    const { x, y } = state.pointer;

    if (head.current) {
      head.current.rotation.y = MathUtils.damp(head.current.rotation.y, x * 0.5, 3, delta);
      head.current.rotation.x = MathUtils.damp(head.current.rotation.x, -y * 0.28, 3, delta);
    }
    if (group.current) {
      group.current.rotation.y = MathUtils.damp(group.current.rotation.y, x * 0.25, 2, delta);
      group.current.position.y = Math.sin(t * 1.1) * 0.06;
    }
    if (core.current) {
      const s = 1 + Math.sin(t * 2.4) * 0.06;
      core.current.scale.setScalar(s);
    }
    if (armL.current) armL.current.rotation.z = 0.35 + Math.sin(t * 1.3) * 0.08;
    if (armR.current) armR.current.rotation.z = -0.35 - Math.sin(t * 1.3 + 0.6) * 0.08;
  });

  return (
    <Float speed={1.4} rotationIntensity={0.15} floatIntensity={0.5}>
      <group ref={group} scale={0.66} position={[0, -0.1, 0]}>
        {/* Head */}
        <group ref={head} position={[0, 1.15, 0]}>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[0.92, 0.68, 0.72]} />
            <meshStandardMaterial color="#12142a" metalness={0.9} roughness={0.22} />
          </mesh>
          {/* Visor */}
          <mesh position={[0, 0.02, 0.37]}>
            <boxGeometry args={[0.72, 0.24, 0.06]} />
            <meshStandardMaterial
              color={PRIMARY}
              emissive={PRIMARY}
              emissiveIntensity={3.2}
              toneMapped={false}
            />
          </mesh>
          {/* Antenna */}
          <mesh position={[0, 0.52, 0]}>
            <cylinderGeometry args={[0.02, 0.02, 0.32, 8]} />
            <meshStandardMaterial color="#2a2d44" metalness={0.8} roughness={0.3} />
          </mesh>
          <mesh position={[0, 0.72, 0]}>
            <sphereGeometry args={[0.06, 16, 16]} />
            <meshStandardMaterial
              color={SECONDARY}
              emissive={SECONDARY}
              emissiveIntensity={4}
              toneMapped={false}
            />
          </mesh>
        </group>

        {/* Neck */}
        <mesh position={[0, 0.75, 0]}>
          <cylinderGeometry args={[0.11, 0.13, 0.18, 12]} />
          <meshStandardMaterial color="#1b1e38" metalness={0.9} roughness={0.3} />
        </mesh>

        {/* Torso */}
        <mesh castShadow receiveShadow position={[0, 0.22, 0]}>
          <boxGeometry args={[1.02, 0.94, 0.6]} />
          <meshStandardMaterial color="#101228" metalness={0.85} roughness={0.28} />
        </mesh>
        <mesh position={[0, 0.22, 0.31]}>
          <ringGeometry args={[0.12, 0.17, 32]} />
          <meshStandardMaterial
            color={SECONDARY}
            emissive={SECONDARY}
            emissiveIntensity={2.6}
            toneMapped={false}
          />
        </mesh>
        {/* Core */}
        <mesh ref={core} position={[0, 0.22, 0.33]}>
          <sphereGeometry args={[0.1, 24, 24]} />
          <meshStandardMaterial
            color={PRIMARY}
            emissive={PRIMARY}
            emissiveIntensity={5}
            toneMapped={false}
          />
        </mesh>

        {/* Shoulders + arms */}
        <group ref={armL} position={[-0.62, 0.5, 0]}>
          <mesh castShadow>
            <sphereGeometry args={[0.17, 16, 16]} />
            <meshStandardMaterial color="#1b1e38" metalness={0.9} roughness={0.25} />
          </mesh>
          <mesh castShadow position={[-0.06, -0.42, 0]}>
            <capsuleGeometry args={[0.1, 0.52, 6, 12]} />
            <meshStandardMaterial color="#14162e" metalness={0.85} roughness={0.3} />
          </mesh>
        </group>
        <group ref={armR} position={[0.62, 0.5, 0]}>
          <mesh castShadow>
            <sphereGeometry args={[0.17, 16, 16]} />
            <meshStandardMaterial color="#1b1e38" metalness={0.9} roughness={0.25} />
          </mesh>
          <mesh castShadow position={[0.06, -0.42, 0]}>
            <capsuleGeometry args={[0.1, 0.52, 6, 12]} />
            <meshStandardMaterial color="#14162e" metalness={0.85} roughness={0.3} />
          </mesh>
        </group>

        {/* Hover base instead of legs */}
        <mesh castShadow position={[0, -0.42, 0]}>
          <cylinderGeometry args={[0.42, 0.16, 0.34, 20]} />
          <meshStandardMaterial color="#0d0f22" metalness={0.9} roughness={0.35} />
        </mesh>
        <mesh position={[0, -0.62, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.18, 0.3, 32]} />
          <meshStandardMaterial
            color={PRIMARY}
            emissive={PRIMARY}
            emissiveIntensity={3}
            toneMapped={false}
            transparent
            opacity={0.85}
          />
        </mesh>
      </group>
    </Float>
  );
}

export default Robot;
