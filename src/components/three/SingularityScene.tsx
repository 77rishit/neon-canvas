import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { PerformanceMonitor } from "@react-three/drei";
import {
  AdditiveBlending,
  Color,
  DoubleSide,
  MathUtils,
  Matrix4,
  Quaternion,
  Vector3,
  type Group,
  type InstancedMesh,
  type Mesh,
  type Points,
  type ShaderMaterial,
} from "three";
import { quantum } from "@/utils/quantum";

/**
 * THE DIGITAL SINGULARITY — the living universe behind the document.
 *
 * Nothing here is a static backdrop. Five GPU systems share one world state
 * (see `@/utils/quantum`) and evolve continuously with scroll, pointer and a
 * 30-second environment mutation:
 *
 *   VoidField     infinite void: volumetric fog, liquid light, neural signals
 *   EnergySphere  a morphing energy body that fractures and reassembles
 *   Monolith      a slab that rises while reality bends, then dissolves
 *   Fragments     instanced quantum shards that lose gravity mid-journey
 *   NeuralDust    signal motes that switch orbit pattern on every mutation
 *
 * All per-frame work is shader-side or a handful of instanced matrices, so the
 * whole universe costs a couple of draw calls.
 */

const CYAN = new Color("#00f5ff");
const VIOLET = new Color("#7b2eff");

/* ---------------------------------------------------------- shared glsl --- */

const NOISE = /* glsl */ `
  // Sine-free hash: transcendentals are the single most expensive thing a
  // full-screen noise field can do per pixel, and this costs a few mults.
  vec3 hash3(vec3 p) {
    p = fract(p * vec3(0.1031, 0.1030, 0.0973));
    p += dot(p, p.yxz + 33.33);
    return fract((p.xxy + p.yxx) * p.zyx) * 2.0 - 1.0;
  }
  float snoise(vec3 p) {
    vec3 i = floor(p), f = fract(p);
    vec3 u = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(mix(dot(hash3(i + vec3(0,0,0)), f - vec3(0,0,0)),
              dot(hash3(i + vec3(1,0,0)), f - vec3(1,0,0)), u.x),
          mix(dot(hash3(i + vec3(0,1,0)), f - vec3(0,1,0)),
              dot(hash3(i + vec3(1,1,0)), f - vec3(1,1,0)), u.x), u.y),
      mix(mix(dot(hash3(i + vec3(0,0,1)), f - vec3(0,0,1)),
              dot(hash3(i + vec3(1,0,1)), f - vec3(1,0,1)), u.x),
          mix(dot(hash3(i + vec3(0,1,1)), f - vec3(0,1,1)),
              dot(hash3(i + vec3(1,1,1)), f - vec3(1,1,1)), u.x), u.y), u.z);
  }
  // Two octaves: enough for domain warping, where detail is invisible.
  float fbm2(vec3 p) {
    return 0.5 * snoise(p) + 0.25 * snoise(p * 2.03);
  }
  float fbm3(vec3 p) {
    float v = 0.0, a = 0.5;
    for (int i = 0; i < 3; i++) { v += a * snoise(p); p *= 2.03; a *= 0.5; }
    return v;
  }
  vec3 hueShift(vec3 c, float a) {
    const vec3 k = vec3(0.57735);
    float ca = cos(a);
    return c * ca + cross(k, c) * sin(a) + k * dot(k, c) * (1.0 - ca);
  }
`;

/** Uniform block every system shares, kept in sync by `syncWorld`. */
function makeWorldUniforms() {
  return {
    uTime: { value: 0 },
    uEnergy: { value: 1 },
    uChaos: { value: 0 },
    uGravity: { value: 1 },
    uHolo: { value: 0 },
    uFog: { value: 0.4 },
    uVel: { value: 0 },
    uSeed: { value: 0 },
    uHue: { value: 0 },
    uGlow: { value: 1 },
    uLightDir: { value: 0 },
    uPointer: { value: [0, 0] as [number, number] },
    uRes: { value: [1, 1] as [number, number] },
    uCyan: { value: CYAN },
    uViolet: { value: VIOLET },
  };
}

type WorldUniforms = ReturnType<typeof makeWorldUniforms>;

/** Damps every shared uniform toward the live world state. */
function syncWorld(u: WorldUniforms, delta: number, w?: number, h?: number) {
  const d = (cur: number, to: number, lambda = 2) => MathUtils.damp(cur, to, lambda, delta);
  u.uTime.value += delta;
  u.uEnergy.value = d(u.uEnergy.value, quantum.energy);
  u.uChaos.value = d(u.uChaos.value, quantum.chaos, 1.6);
  u.uGravity.value = d(u.uGravity.value, quantum.gravity, 1.4);
  u.uHolo.value = d(u.uHolo.value, quantum.holo, 1.8);
  u.uFog.value = d(u.uFog.value, quantum.fog, 1.2);
  u.uVel.value = d(u.uVel.value, quantum.velocity, 5);
  u.uSeed.value = d(u.uSeed.value, quantum.seed, 0.12);
  u.uHue.value = d(u.uHue.value, quantum.hue, 0.15);
  u.uGlow.value = d(u.uGlow.value, quantum.glow, 0.2);
  u.uLightDir.value = d(u.uLightDir.value, quantum.lightDir, 0.15);
  u.uPointer.value[0] = d(u.uPointer.value[0], quantum.pointerX, 3);
  u.uPointer.value[1] = d(u.uPointer.value[1], -quantum.pointerY, 3);
  if (w) u.uRes.value[0] = w;
  if (h) u.uRes.value[1] = h;
}

/* ------------------------------------------------------------- void field -- */

const fullscreenVert = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.999, 1.0);
  }
`;

/**
 * The infinite void. Layered domain-warped fog, a liquid-light caustic sheet,
 * travelling neural signal filaments and a pointer-driven light distortion.
 * Every constant is modulated by the world state, so the field never loops
 * back onto the same frame.
 */
const voidFrag = /* glsl */ `
  precision highp float;
  varying vec2 vUv;
  uniform float uTime, uEnergy, uChaos, uGravity, uHolo, uFog, uVel, uSeed, uHue, uGlow, uLightDir;
  uniform vec2 uPointer, uRes;
  uniform vec3 uCyan, uViolet;
  ${NOISE}

  // One neural filament: a curved signal line that pulses along its length.
  float filament(vec2 p, float k, float t) {
    float y = sin(p.x * (1.1 + k * 0.5) + t * (0.25 + k * 0.12) + k * 8.0) * (0.34 + k * 0.12);
    float d = abs(p.y - y);
    float line = exp(-d * (58.0 - uChaos * 26.0));
    float head = exp(-pow(p.x - (fract(t * 0.07 + k * 0.37) * 3.4 - 1.7), 2.0) * 22.0);
    return line * (0.28 + head * 1.5);
  }

  void main() {
    float asp = uRes.x / max(uRes.y, 1.0);
    vec2 p = (vUv - 0.5) * vec2(asp, 1.0);
    vec2 mp = uPointer * vec2(asp, 1.0) * 0.5;
    float t = uTime;
    float sd = uSeed * 0.013;

    // Cursor light distortion: space bends toward the pointer.
    float md = length(p - mp);
    p += normalize(p - mp + 1e-4) * exp(-md * 3.2) * (0.055 + uChaos * 0.05);

    // Volumetric fog: two domain-warped fbm layers drifting against each other.
    vec3 q = vec3(p * 1.5, t * 0.035 + sd);
    vec2 w2 = vec2(fbm2(q * 0.9 + 3.1), fbm2(q * 0.9 - 1.7));
    vec3 warp = vec3(w2, w2.x * 0.6);
    float fog = fbm3(q * 1.6 + warp * (1.2 + uChaos * 1.6));
    float fog2 = fbm2(q * 3.1 - warp * 0.8 + vec3(0.0, t * 0.05, 0.0));
    float density = smoothstep(0.05, 0.85, fog * 0.7 + fog2 * 0.45) * (0.35 + uFog);

    // Liquid light: caustic sheets sliding through the fog.
    float caustic = abs(sin(fog * 7.0 + t * 0.35 + fog2 * 3.0));
    caustic = pow(1.0 - caustic, 3.0);

    // Moving light field, direction re-rolled on every world mutation.
    vec2 ld = vec2(cos(uLightDir), sin(uLightDir));
    float shaft = exp(-pow(dot(p, vec2(-ld.y, ld.x)) + sin(t * 0.1) * 0.6, 2.0) * (3.0 + uEnergy));

    vec3 col = mix(uViolet, uCyan, clamp(fog * 1.2 + vUv.y * 0.4, 0.0, 1.0)) * density;
    col += mix(uCyan, uViolet, 0.4) * caustic * (0.10 + uEnergy * 0.14);
    col += uCyan * shaft * 0.05;

    // Neural signals firing across the void.
    float sig = 0.0;
    for (int i = 0; i < 4; i++) {
      float k = float(i) + sd;
      sig += filament(p * vec2(1.0, 1.0 + float(i) * 0.35) + vec2(0.0, float(i) * 0.21 - 0.31), k, t);
    }
    col += mix(uCyan, uViolet, 0.25) * sig * (0.035 + uEnergy * 0.05);

    // Pointer bloom.
    col += mix(uCyan, uViolet, 0.35) * exp(-md * 2.3) * (0.16 + uGlow * 0.12);

    // Holographic act: interference scanlines wash across the field.
    float scan = sin((vUv.y + t * 0.08) * uRes.y * 0.55) * 0.5 + 0.5;
    col = mix(col, col * (0.55 + scan * 0.85) + uCyan * scan * 0.02, uHolo);

    // Instability: the void tears into digital bands while reality breaks.
    float tear = step(0.985 - uChaos * 0.03, fract(sin((floor(vUv.y * 140.0) + floor(t * 3.0)) * 91.7) * 4381.0));
    col += uCyan * tear * uChaos * 0.35;

    col *= (0.09 + uEnergy * 0.20) * uGlow;
    col += abs(uVel) * mix(uCyan, uViolet, 0.5) * 0.035;
    col = hueShift(col, uHue * 0.35);
    col *= smoothstep(1.45, 0.12, length(p));  // vignette keeps copy legible

    gl_FragColor = vec4(col, 1.0);
  }
`;

function VoidField() {
  const uniforms = useMemo(makeWorldUniforms, []);
  const mat = useRef<ShaderMaterial>(null);
  useFrame((state, delta) => {
    syncWorld(uniforms, delta, state.size.width, state.size.height);
    if (mat.current) mat.current.uniformsNeedUpdate = true;
  });
  return (
    <mesh frustumCulled={false} renderOrder={-20}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={mat}
        uniforms={uniforms}
        vertexShader={fullscreenVert}
        fragmentShader={voidFrag}
        depthWrite={false}
        depthTest={false}
      />
    </mesh>
  );
}

/* --------------------------------------------------------- energy sphere -- */

const sphereVert = /* glsl */ `
  uniform float uTime, uChaos, uEnergy, uGravity, uSeed;
  varying vec3 vNormalW;
  varying vec3 vPos;
  varying float vDisp;
  ${NOISE}
  void main() {
    vec3 n = normalize(position);
    float t = uTime * 0.32 + uSeed * 0.01;
    // Two noise octaves morph the body; chaos rips it into spikes.
    float d = fbm3(n * (1.6 + uChaos * 2.2) + vec3(0.0, t, t * 0.6)) * (0.42 + uChaos * 0.85);
    d += snoise(n * 5.5 - t) * 0.12 * (1.0 + uChaos);
    vec3 pos = position + n * d * (0.9 + uEnergy * 0.5);
    // Gravity loss lets the surface drift upward and untether.
    pos.y += (1.0 - uGravity) * (0.5 + d) * 0.9;
    vDisp = d;
    vPos = pos;
    vNormalW = normalize(normalMatrix * n);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

const sphereFrag = /* glsl */ `
  precision highp float;
  uniform float uTime, uChaos, uEnergy, uHolo, uGlow, uHue;
  uniform vec3 uCyan, uViolet;
  varying vec3 vNormalW;
  varying vec3 vPos;
  varying float vDisp;
  ${NOISE}
  void main() {
    float fres = pow(1.0 - abs(dot(normalize(vNormalW), vec3(0.0, 0.0, 1.0))), 2.4);
    vec3 col = mix(uViolet, uCyan, clamp(vDisp * 1.4 + 0.45, 0.0, 1.0));
    // Internal energy veins.
    float veins = smoothstep(0.55, 1.0, abs(sin(vDisp * 9.0 + uTime * 0.8)));
    col += uCyan * veins * 0.6;
    // Holographic slicing.
    float slice = sin(vPos.y * 26.0 - uTime * 2.2) * 0.5 + 0.5;
    col = mix(col, col * (0.4 + slice), uHolo * 0.8);
    float a = (0.02 + fres * 0.34) * (0.3 + uEnergy * 0.5) * uGlow;
    a *= 1.0 - uHolo * 0.25;
    col = hueShift(col, uHue * 0.3);
    gl_FragColor = vec4(col * (0.6 + fres), a);
  }
`;

/** The living energy body at the centre of the universe. */
function EnergySphere() {
  const uniforms = useMemo(makeWorldUniforms, []);
  const mesh = useRef<Mesh>(null);

  useFrame((_, delta) => {
    syncWorld(uniforms, delta);
    const m = mesh.current;
    if (!m) return;
    const t = uniforms.uTime.value;
    m.rotation.y += delta * (0.06 + quantum.chaos * 0.22);
    m.rotation.x = MathUtils.damp(m.rotation.x, Math.sin(t * 0.15) * 0.25, 1.2, delta);
    // Reality bending: the body swings off axis, then rights itself.
    m.rotation.z = MathUtils.damp(m.rotation.z, (1 - quantum.gravity) * 0.6, 1.2, delta);
    const s = 0.62 + quantum.energy * 0.34 - quantum.chaos * 0.12;
    m.scale.setScalar(MathUtils.damp(m.scale.x, s, 1.6, delta));
    m.position.x = MathUtils.damp(m.position.x, quantum.pointerX * 0.7, 1.3, delta);
    m.position.y = MathUtils.damp(
      m.position.y,
      -quantum.pointerY * 0.45 + (1 - quantum.gravity) * 0.8,
      1.3,
      delta,
    );
  });

  return (
    <mesh ref={mesh} position={[0, 0, -3]}>
      <icosahedronGeometry args={[1.6, 24]} />
      <shaderMaterial
        uniforms={uniforms}
        vertexShader={sphereVert}
        fragmentShader={sphereFrag}
        transparent
        depthWrite={false}
        blending={AdditiveBlending}
        side={DoubleSide}
      />
    </mesh>
  );
}

/* -------------------------------------------------------------- monolith -- */

const monolithFrag = /* glsl */ `
  precision highp float;
  uniform float uTime, uChaos, uHolo, uEnergy, uGlow, uHue;
  uniform vec3 uCyan, uViolet;
  varying vec2 vUv;
  ${NOISE}
  void main() {
    vec2 uv = vUv;
    // Data strata crawling up the slab.
    float rows = floor(uv.y * 46.0);
    float flick = fract(sin(rows * 12.9898 + floor(uTime * 2.0 + rows)) * 43758.5453);
    float band = step(0.62, flick) * step(fract(uv.x * 8.0 - uTime * 0.15 + flick), 0.4);
    float edge = smoothstep(0.0, 0.06, uv.x) * smoothstep(1.0, 0.94, uv.x);
    vec3 col = mix(uViolet, uCyan, uv.y) * (0.12 + band * 0.9);
    col += uCyan * smoothstep(0.9, 1.0, 1.0 - abs(uv.x - 0.5) * 2.0) * 0.06;
    float a = (0.04 + band * 0.2) * edge * (0.4 + uEnergy * 0.5) * uGlow;
    a *= 0.35 + uChaos * 0.9 + uHolo * 0.5;   // only present while reality bends
    col = hueShift(col, uHue * 0.3);
    gl_FragColor = vec4(col, a);
  }
`;

const monolithVert = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

/** A slab of compiled data that rises behind the sphere while reality bends. */
function Monolith() {
  const uniforms = useMemo(makeWorldUniforms, []);
  const group = useRef<Group>(null);
  useFrame((_, delta) => {
    syncWorld(uniforms, delta);
    const g = group.current;
    if (!g) return;
    const t = uniforms.uTime.value;
    g.position.y = MathUtils.damp(g.position.y, -6 + quantum.chaos * 7.5, 1.1, delta);
    g.rotation.y = MathUtils.damp(
      g.rotation.y,
      Math.sin(t * 0.1) * 0.4 + quantum.pointerX * 0.3,
      1.1,
      delta,
    );
    g.rotation.z = MathUtils.damp(g.rotation.z, (1 - quantum.gravity) * -0.35, 1.1, delta);
  });
  return (
    <group ref={group} position={[0, -6, -4]}>
      <mesh>
        <planeGeometry args={[1.5, 7]} />
        <shaderMaterial
          uniforms={uniforms}
          vertexShader={monolithVert}
          fragmentShader={monolithFrag}
          transparent
          depthWrite={false}
          blending={AdditiveBlending}
          side={DoubleSide}
        />
      </mesh>
    </group>
  );
}

/* ------------------------------------------------------------- fragments -- */

const FRAGMENTS = 90;

/**
 * Quantum shards. They sit compiled into a shell while reality is stable, tear
 * loose as it breaks, float free once gravity goes, and snap back into
 * formation while the world reconstructs itself.
 */
function Fragments() {
  const mesh = useRef<InstancedMesh>(null);
  const dummy = useMemo(
    () => ({
      m: new Matrix4(),
      q: new Quaternion(),
      p: new Vector3(),
      s: new Vector3(),
      axis: new Vector3(),
    }),
    [],
  );
  const seeds = useMemo(
    () =>
      Array.from({ length: FRAGMENTS }, () => ({
        r: 2.4 + Math.random() * 3.6,
        a: Math.random() * Math.PI * 2,
        y: (Math.random() - 0.5) * 5,
        spin: (Math.random() - 0.5) * 1.2,
        scale: 0.018 + Math.random() * 0.042,
        drift: Math.random() * Math.PI * 2,
      })),
    [],
  );

  useFrame((state, delta) => {
    const m = mesh.current;
    if (!m) return;
    const t = state.clock.elapsedTime;
    const { chaos, gravity, energy, velocity } = quantum;

    for (let i = 0; i < FRAGMENTS; i++) {
      const s = seeds[i]!;
      const a = s.a + t * (0.05 + s.spin * 0.08) + velocity * 0.25;
      // Shell radius breathes with energy and blows apart with chaos.
      const r = s.r * (0.62 + energy * 0.45) + chaos * (2.2 + Math.sin(s.drift + t) * 1.4);
      const lift = (1 - gravity) * (2.6 + Math.sin(t * 0.5 + s.drift) * 1.8);
      dummy.p.set(
        Math.cos(a) * r,
        s.y * (0.7 + chaos * 0.8) + lift + Math.sin(t * 0.4 + s.drift) * 0.25,
        Math.sin(a) * r * 0.7,
      );
      // Reused axis vector: allocating inside the frame loop would hand the
      // GC 90 objects every frame and show up as periodic stutter.
      dummy.axis.set(Math.sin(s.drift), Math.cos(s.drift), 0.4).normalize();
      dummy.q.setFromAxisAngle(dummy.axis, t * s.spin + s.drift);
      const sc = s.scale * (0.6 + energy * 0.8 + chaos * 0.5);
      dummy.s.setScalar(sc);
      dummy.m.compose(dummy.p, dummy.q, dummy.s);
      m.setMatrixAt(i, dummy.m);
    }
    m.instanceMatrix.needsUpdate = true;
    m.rotation.y = MathUtils.damp(m.rotation.y, quantum.pointerX * 0.35, 1.2, delta);
    m.rotation.x = MathUtils.damp(m.rotation.x, -quantum.pointerY * 0.2, 1.2, delta);
  });

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, FRAGMENTS]} frustumCulled={false}>
      <tetrahedronGeometry args={[1, 0]} />
      <meshBasicMaterial
        color={CYAN}
        transparent
        opacity={0.16}
        toneMapped={false}
        blending={AdditiveBlending}
        depthWrite={false}
        side={DoubleSide}
      />
    </instancedMesh>
  );
}

/* ----------------------------------------------------------- neural dust -- */

const dustVert = /* glsl */ `
  uniform float uTime, uEnergy, uChaos, uGravity, uPattern, uVel;
  attribute vec3 aSeed;   // radius, angle, z
  varying float vAlpha;
  void main() {
    float r0 = aSeed.x, a0 = aSeed.y, z0 = aSeed.z;
    float t = uTime;
    float a = a0 + t * (0.08 + 0.3 / r0) + uVel * 0.5;

    // Pattern 0: rings · 1: helix · 2: lattice sheets.
    float r = r0 * (0.5 + uEnergy * 0.7);
    vec3 pos;
    if (uPattern < 0.5) {
      pos = vec3(cos(a) * r, sin(a) * r * 0.85 + z0 * 0.25, z0);
    } else if (uPattern < 1.5) {
      pos = vec3(cos(a) * r, z0 * 1.6 + sin(t * 0.4 + a0) * 0.6, sin(a) * r);
    } else {
      pos = vec3(cos(a0) * r, sin(a0 * 3.0 + t * 0.2) * 2.2, z0 * 1.8 + sin(a) * 0.6);
    }
    pos += vec3(sin(t * 0.6 + a0) , cos(t * 0.5 + z0), sin(t * 0.4 + r0)) * uChaos * 1.4;
    pos.y += (1.0 - uGravity) * (1.5 + fract(a0) * 2.5);

    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = (1.6 + uEnergy * 2.0) * (10.0 / -mv.z);
    vAlpha = 0.14 + uEnergy * 0.3;
  }
`;

const dustFrag = /* glsl */ `
  precision highp float;
  uniform vec3 uCyan, uViolet;
  uniform float uHolo, uGlow, uHue;
  varying float vAlpha;
  vec3 hueShift(vec3 c, float a) {
    const vec3 k = vec3(0.57735);
    float ca = cos(a);
    return c * ca + cross(k, c) * sin(a) + k * dot(k, c) * (1.0 - ca);
  }
  void main() {
    vec2 d = gl_PointCoord - 0.5;
    float m = exp(-dot(d, d) * 12.0);
    vec3 col = hueShift(mix(uCyan, uViolet, 0.25 + uHolo * 0.5), uHue * 0.3);
    gl_FragColor = vec4(col, m * vAlpha * uGlow);
  }
`;

/** Signal motes; their orbit pattern changes on every world mutation. */
function NeuralDust({ count = 900 }: { count?: number }) {
  const points = useRef<Points>(null);
  const uniforms = useMemo(() => ({ ...makeWorldUniforms(), uPattern: { value: 0 } }), []);

  const seeds = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = 1.8 + Math.random() * 6.5;
      arr[i * 3 + 1] = Math.random() * Math.PI * 2;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 4;
    }
    return arr;
  }, [count]);

  useFrame((_, delta) => {
    syncWorld(uniforms, delta);
    uniforms.uPattern.value = MathUtils.damp(
      uniforms.uPattern.value,
      quantum.pattern,
      1.2,
      delta,
    );
    const p = points.current;
    if (!p) return;
    p.rotation.z += delta * 0.015;
    p.position.x = MathUtils.damp(p.position.x, quantum.pointerX * 0.6, 1.2, delta);
    p.position.y = MathUtils.damp(p.position.y, -quantum.pointerY * 0.4, 1.2, delta);
  });

  return (
    <points ref={points} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[seeds, 3]} />
        <bufferAttribute attach="attributes-aSeed" args={[seeds, 3]} />
      </bufferGeometry>
      <shaderMaterial
        uniforms={uniforms}
        vertexShader={dustVert}
        fragmentShader={dustFrag}
        transparent
        depthWrite={false}
        blending={AdditiveBlending}
      />
    </points>
  );
}

/* ----------------------------------------------------------------- camera -- */

/**
 * The camera never sits still: it pulls back as reality fractures, rolls while
 * gravity fails and drifts on the pointer, so each act is framed differently.
 */
function WorldCamera() {
  useFrame((state, delta) => {
    const { camera } = state;
    const { energy, chaos, gravity, phase } = quantum;
    camera.position.z = MathUtils.damp(camera.position.z, 9 + chaos * 3.5 + (1 - energy) * 2, 1.1, delta);
    camera.position.x = MathUtils.damp(
      camera.position.x,
      quantum.pointerX * 0.8 + Math.sin(phase * 0.8) * 0.9,
      1.1,
      delta,
    );
    camera.position.y = MathUtils.damp(
      camera.position.y,
      -quantum.pointerY * 0.5 + (1 - gravity) * 1.2,
      1.1,
      delta,
    );
    camera.rotation.z = MathUtils.damp(camera.rotation.z, (1 - gravity) * 0.12, 1.1, delta);
    camera.lookAt(0, (1 - gravity) * 0.6, 0);
  });
  return null;
}

/**
 * Stops the render loop whenever the tab is hidden. A backgrounded WebGL loop
 * still burns GPU time and delays the first frames when the user returns.
 */
function VisibilityGate() {
  const { invalidate, setFrameloop } = useThree();
  useEffect(() => {
    const sync = () => {
      const hidden = document.visibilityState === "hidden";
      setFrameloop(hidden ? "never" : "always");
      if (!hidden) invalidate();
    };
    document.addEventListener("visibilitychange", sync);
    return () => document.removeEventListener("visibilitychange", sync);
  }, [invalidate, setFrameloop]);
  return null;
}

/**
 * The universe is one full-screen shader stack, so cost scales with pixels
 * rather than with geometry. Resolution is therefore the throttle: we start at
 * a modest device-pixel ratio and let `PerformanceMonitor` walk it down the
 * moment the measured frame rate drops below the refresh budget — which keeps
 * a 60Hz laptop, a 90Hz tablet and a 120Hz phone all pinned to their own
 * ceiling instead of forcing one fixed quality on every device.
 */
export function SingularityScene({ reduced = false }: { reduced?: boolean }) {
  const [dpr, setDpr] = useState(1);

  return (
    <Canvas
      dpr={reduced ? 1 : dpr}
      gl={{
        antialias: false,
        alpha: false,
        powerPreference: "high-performance",
        stencil: false,
        depth: true,
      }}
      camera={{ position: [0, 0, 9], fov: 45 }}
      frameloop={reduced ? "demand" : "always"}
      // Never regress quality mid-interaction: a resolution drop during a
      // scroll burst reads as the particles stalling, which is worse than the
      // frame it saves. Quality is only tuned by the sustained-FPS monitor.
      performance={{ min: 1, max: 1, debounce: 1000 }}
    >
      {/* Only reacts to a *sustained* change in frame rate (flipflops guard
          stops it oscillating), so resolution never churns while scrolling. */}
      <PerformanceMonitor
        factor={1}
        ms={250}
        iterations={8}
        flipflops={3}
        onIncline={() => setDpr((d) => Math.min(1.5, d + 0.25))}
        onDecline={() => setDpr((d) => Math.max(0.75, d - 0.25))}
        onFallback={() => setDpr(0.75)}
      />
      <VisibilityGate />
      <VoidField />
      <Monolith />
      <EnergySphere />
      <Fragments />
      <NeuralDust count={reduced ? 260 : 700} />
      <WorldCamera />
    </Canvas>
  );
}


export default SingularityScene;
