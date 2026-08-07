import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  AdditiveBlending,
  BackSide,
  Color,
  MathUtils,
  type Group,
  type Points,
  type ShaderMaterial,
} from "three";
import { quantum } from "@/utils/quantum";

const CYAN = new Color("#00f5ff");
const VIOLET = new Color("#7b2eff");

/* ------------------------------------------------------------------ aurora */
/**
 * Full-screen aurora + energy-wave field. A domain-warped fbm drives the
 * colour ramp; pointer position injects a travelling light bloom so the
 * background reacts to the cursor without any DOM work.
 */
const auroraVert = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.999, 1.0);
  }
`;

const auroraFrag = /* glsl */ `
  precision highp float;
  varying vec2 vUv;
  uniform float uTime;
  uniform float uEnergy;
  uniform float uVel;
  uniform vec2 uPointer;
  uniform vec2 uRes;
  uniform vec3 uCyan;
  uniform vec3 uViolet;

  float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }

  float noise(vec2 p) {
    vec2 i = floor(p), f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
               mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
  }

  float fbm(vec2 p) {
    float v = 0.0, a = 0.5;
    for (int i = 0; i < 5; i++) { v += a * noise(p); p *= 2.02; a *= 0.5; }
    return v;
  }

  void main() {
    vec2 uv = vUv;
    vec2 p = (uv - 0.5) * vec2(uRes.x / max(uRes.y, 1.0), 1.0);

    float t = uTime * 0.045;
    vec2 warp = vec2(fbm(p * 1.4 + t), fbm(p * 1.4 - t + 5.2));
    float f = fbm(p * 1.8 + warp * 1.6 + vec2(0.0, t * 2.0));

    // Slow vertical energy waves rippling through the aurora.
    float waves = sin((p.y * 6.0) - uTime * 0.5 + f * 4.0) * 0.5 + 0.5;

    float band = smoothstep(0.35, 0.95, f) * (0.55 + waves * 0.45);
    vec3 col = mix(uViolet, uCyan, clamp(f * 1.35 + uv.y * 0.35, 0.0, 1.0)) * band;

    // Volumetric shaft sweeping across the field.
    float shaft = exp(-pow(abs(p.x + sin(uTime * 0.12) * 0.9 - p.y * 0.4), 2.0) * 3.5);
    col += uCyan * shaft * 0.06;

    // Mouse-reactive lighting.
    vec2 mp = uPointer * vec2(uRes.x / max(uRes.y, 1.0), 1.0) * 0.5;
    float glow = exp(-length(p - mp) * 2.1);
    col += mix(uCyan, uViolet, 0.35) * glow * 0.28;

    col *= 0.20 + uEnergy * 0.40;
    col += abs(uVel) * uCyan * 0.03;

    // Vignette so the copy layer above always keeps contrast.
    col *= smoothstep(1.35, 0.15, length(p));

    gl_FragColor = vec4(col, 1.0);
  }
`;

function Aurora() {
  const mat = useRef<ShaderMaterial>(null);
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uEnergy: { value: 1 },
      uVel: { value: 0 },
      uPointer: { value: [0, 0] as [number, number] },
      uRes: { value: [1, 1] as [number, number] },
      uCyan: { value: CYAN },
      uViolet: { value: VIOLET },
    }),
    [],
  );

  useFrame((state, delta) => {
    const u = uniforms;
    u.uTime.value += delta;
    u.uEnergy.value = MathUtils.damp(u.uEnergy.value, quantum.energy, 2, delta);
    u.uVel.value = MathUtils.damp(u.uVel.value, quantum.velocity, 4, delta);
    u.uPointer.value[0] = MathUtils.damp(u.uPointer.value[0], quantum.pointerX, 3, delta);
    u.uPointer.value[1] = MathUtils.damp(u.uPointer.value[1], -quantum.pointerY, 3, delta);
    u.uRes.value[0] = state.size.width;
    u.uRes.value[1] = state.size.height;
    if (mat.current) mat.current.uniformsNeedUpdate = true;
  });

  return (
    <mesh frustumCulled={false} renderOrder={-10}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={mat}
        uniforms={uniforms}
        vertexShader={auroraVert}
        fragmentShader={auroraFrag}
        depthWrite={false}
        depthTest={false}
      />
    </mesh>
  );
}

/* ------------------------------------------------------------------- portal */

/**
 * The portal itself: a stack of counter-rotating energy rings inside a
 * volumetric halo. Ring radius, tilt and brightness are all driven by the
 * quantum bus, so the portal expands in the hero, condenses into an energy
 * core through the middle of the page and reforms at the footer.
 */
function PortalRings() {
  const group = useRef<Group>(null);
  const rings = useMemo(
    () => [
      { r: 2.6, w: 0.02, speed: 0.22, color: CYAN, seg: 200 },
      { r: 3.25, w: 0.012, speed: -0.16, color: VIOLET, seg: 180 },
      { r: 4.1, w: 0.008, speed: 0.1, color: CYAN, seg: 160 },
      { r: 5.0, w: 0.005, speed: -0.06, color: VIOLET, seg: 140 },
    ],
    [],
  );

  useFrame((state, delta) => {
    const g = group.current;
    if (!g) return;
    const t = state.clock.elapsedTime;
    const e = quantum.energy;

    g.children.forEach((child, i) => {
      child.rotation.z += delta * (rings[i]?.speed ?? 0.1);
      child.rotation.x = MathUtils.damp(
        child.rotation.x,
        Math.sin(t * 0.2 + i) * 0.18 + (1 - e) * 0.55,
        1.5,
        delta,
      );
    });

    // Idle breathing + scroll-driven collapse/reform.
    const target = 0.42 + e * 0.62 + Math.sin(t * 0.6) * 0.015;
    g.scale.setScalar(MathUtils.damp(g.scale.x, target, 1.8, delta));
    g.position.x = MathUtils.damp(g.position.x, quantum.pointerX * 0.55, 1.4, delta);
    g.position.y = MathUtils.damp(g.position.y, -quantum.pointerY * 0.35, 1.4, delta);
    g.rotation.y = MathUtils.damp(g.rotation.y, quantum.pointerX * 0.25, 1.4, delta);
  });

  return (
    <group ref={group}>
      {rings.map((ring, i) => (
        <mesh key={i}>
          <torusGeometry args={[ring.r, ring.w, 6, ring.seg]} />
          <meshBasicMaterial
            color={ring.color}
            toneMapped={false}
            transparent
            opacity={0.6}
            blending={AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      ))}
    </group>
  );
}

const haloFrag = /* glsl */ `
  precision highp float;
  varying vec2 vUv;
  uniform float uTime;
  uniform float uEnergy;
  uniform vec3 uCyan;
  uniform vec3 uViolet;
  void main() {
    vec2 p = vUv - 0.5;
    float d = length(p) * 2.0;
    float ring = exp(-pow((d - 0.55) * 6.0, 2.0));
    float core = exp(-d * 4.0);
    float pulse = 0.85 + sin(uTime * 1.1) * 0.15;
    vec3 col = mix(uViolet, uCyan, smoothstep(0.0, 0.8, d)) * (ring * 0.8 + core * 0.9);
    float a = (ring * 0.55 + core * 0.5) * pulse * uEnergy;
    gl_FragColor = vec4(col, a);
  }
`;

const haloVert = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

/** Volumetric light bloom the portal casts onto everything in front of it. */
function PortalHalo() {
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uEnergy: { value: 1 },
      uCyan: { value: CYAN },
      uViolet: { value: VIOLET },
    }),
    [],
  );

  useFrame((_, delta) => {
    uniforms.uTime.value += delta;
    uniforms.uEnergy.value = MathUtils.damp(
      uniforms.uEnergy.value,
      0.35 + quantum.energy * 0.65,
      2,
      delta,
    );
  });

  return (
    <mesh position={[0, 0, -1]} renderOrder={-5}>
      <planeGeometry args={[16, 16]} />
      <shaderMaterial
        uniforms={uniforms}
        vertexShader={haloVert}
        fragmentShader={haloFrag}
        transparent
        depthWrite={false}
        blending={AdditiveBlending}
        side={BackSide}
      />
    </mesh>
  );
}

/* ---------------------------------------------------------------- particles */

/** Particles orbiting the portal, pulled inward as the portal condenses. */
function OrbitField({ count = 700 }: { count?: number }) {
  const points = useRef<Points>(null);

  const { positions, seeds } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const seeds = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const radius = 2.2 + Math.random() * 5.5;
      const angle = Math.random() * Math.PI * 2;
      seeds[i * 3] = radius;
      seeds[i * 3 + 1] = angle;
      seeds[i * 3 + 2] = (Math.random() - 0.5) * 3.2;
      positions[i * 3] = Math.cos(angle) * radius;
      positions[i * 3 + 1] = Math.sin(angle) * radius;
      positions[i * 3 + 2] = seeds[i * 3 + 2]!;
    }
    return { positions, seeds };
  }, [count]);

  useFrame((state, delta) => {
    const p = points.current;
    if (!p) return;
    const t = state.clock.elapsedTime;
    const e = quantum.energy;
    const attr = p.geometry.getAttribute("position");
    const arr = attr.array as Float32Array;

    for (let i = 0; i < count; i++) {
      const r0 = seeds[i * 3]!;
      const a0 = seeds[i * 3 + 1]!;
      const z = seeds[i * 3 + 2]!;
      const speed = 0.12 + (1 / r0) * 0.35;
      const a = a0 + t * speed + quantum.velocity * 0.4;
      const r = r0 * (0.45 + e * 0.6) + Math.sin(t * 0.8 + a0 * 3.0) * 0.12;
      arr[i * 3] = Math.cos(a) * r;
      arr[i * 3 + 1] = Math.sin(a) * r * 0.92;
      arr[i * 3 + 2] = z * (0.5 + e * 0.8);
    }
    attr.needsUpdate = true;

    p.rotation.z += delta * 0.02;
    p.position.x = MathUtils.damp(p.position.x, quantum.pointerX * 0.7, 1.2, delta);
    p.position.y = MathUtils.damp(p.position.y, -quantum.pointerY * 0.45, 1.2, delta);
  });

  return (
    <points ref={points} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.035}
        color={CYAN}
        transparent
        opacity={0.75}
        sizeAttenuation
        toneMapped={false}
        blending={AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

/** Slow camera interpolation: the portal is always approached, never static. */
function PortalCamera() {
  useFrame((state, delta) => {
    const { camera } = state;
    const e = quantum.energy;
    camera.position.z = MathUtils.damp(camera.position.z, 9.5 + (1 - e) * 4.5, 1.2, delta);
    camera.position.x = MathUtils.damp(camera.position.x, quantum.pointerX * 0.6, 1.2, delta);
    camera.position.y = MathUtils.damp(camera.position.y, -quantum.pointerY * 0.4, 1.2, delta);
    camera.lookAt(0, 0, 0);
  });
  return null;
}

export function QuantumPortalScene({ reduced = false }: { reduced?: boolean }) {
  return (
    <Canvas
      dpr={[1, reduced ? 1 : 1.5]}
      gl={{ antialias: false, alpha: false, powerPreference: "high-performance" }}
      camera={{ position: [0, 0, 9.5], fov: 45 }}
      frameloop={reduced ? "demand" : "always"}
    >
      <Aurora />
      <PortalHalo />
      <PortalRings />
      <OrbitField count={reduced ? 220 : 700} />
      <PortalCamera />
    </Canvas>
  );
}

export default QuantumPortalScene;
