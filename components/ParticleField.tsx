'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { useMemo, useRef, type RefObject } from 'react';
import * as THREE from 'three';

/** Soft round sprite so points render as glowing orbs instead of squares. */
function useDotTexture() {
  return useMemo(() => {
    const size = 64;
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = size;
    const ctx = canvas.getContext('2d')!;
    const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
    g.addColorStop(0, 'rgba(255,255,255,1)');
    g.addColorStop(0.35, 'rgba(255,255,255,0.55)');
    g.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, size, size);
    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }, []);
}

function Particles({ count, color, size, spread, speed }: { count: number; color: string; size: number; spread: number; speed: number }) {
  const ref = useRef<THREE.Points>(null);
  const map = useDotTexture();

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      // Distribute in a flattened sphere for depth
      const r = spread * Math.cbrt(Math.random());
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      arr[i * 3] = r * Math.sin(phi) * Math.cos(theta) * 1.6;
      arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta) * 0.9;
      arr[i * 3 + 2] = r * Math.cos(phi);
    }
    return arr;
  }, [count, spread]);

  useFrame((state, delta) => {
    const p = ref.current;
    if (!p) return;
    p.rotation.y += delta * speed;
    // Ease the whole field toward the pointer for a parallax "drift"
    p.rotation.x = THREE.MathUtils.lerp(p.rotation.x, state.pointer.y * 0.18, 0.025);
    p.position.x = THREE.MathUtils.lerp(p.position.x, state.pointer.x * 0.35, 0.025);
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={size}
        map={map}
        color={color}
        transparent
        opacity={0.85}
        depthWrite={false}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

/** Wireframe "glass gem" that floats and tilts toward the cursor. */
function Gem() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state, delta) => {
    const m = ref.current;
    if (!m) return;
    m.rotation.y += delta * 0.15;
    m.rotation.x = THREE.MathUtils.lerp(m.rotation.x, -state.pointer.y * 0.4, 0.04);
    m.position.y = Math.sin(state.clock.elapsedTime * 0.6) * 0.15;
  });
  return (
    <mesh ref={ref} position={[3.4, -0.2, -3]}>
      <icosahedronGeometry args={[1.35, 1]} />
      <meshBasicMaterial color="#34f5a4" wireframe transparent opacity={0.1} />
    </mesh>
  );
}

export default function ParticleField({
  eventSource,
  active = true,
}: {
  eventSource: RefObject<HTMLElement | null>;
  active?: boolean;
}) {
  return (
    <Canvas
      eventSource={eventSource as RefObject<HTMLElement>}
      eventPrefix="client"
      frameloop={active ? 'always' : 'never'}
      dpr={[1, 1.75]}
      camera={{ position: [0, 0, 6], fov: 55 }}
      gl={{ antialias: false, alpha: true, powerPreference: 'high-performance' }}
    >
      <Particles count={1600} color="#34f5a4" size={0.045} spread={6} speed={0.018} />
      <Particles count={600} color="#c4b5fd" size={0.06} spread={5} speed={-0.012} />
      <Particles count={250} color="#f9c6dd" size={0.08} spread={4} speed={0.01} />
      <Gem />
    </Canvas>
  );
}
