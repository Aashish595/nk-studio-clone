"use client";

import * as THREE from "three";
import React, { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";

export default function StarBackdrop({
  count = 1800,
  radius = 60,
  zMin = -180,
  zMax = -45,
}: {
  count?: number;
  radius?: number;
  zMin?: number;
  zMax?: number;
}) {
  const ref = useRef<THREE.Points>(null!);

  const positions = useMemo(() => {
    const p = new Float32Array(count * 3);
    const rand = (a: number, b: number) => a + Math.random() * (b - a);

    for (let i = 0; i < count; i++) {
      const a = i * 3;
      p[a + 0] = rand(-radius, radius);
      p[a + 1] = rand(-radius * 0.55, radius * 0.55);
      p[a + 2] = rand(zMin, zMax);
    }
    return p;
  }, [count, radius, zMin, zMax]);

  // very slow movement (almost stuck)
  useFrame((_, dt) => {
    if (!ref.current) return;
    ref.current.rotation.y += dt * 0.01;
  });

  return (
    <points ref={ref} frustumCulled={false} renderOrder={1}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" array={positions} itemSize={3} />
      </bufferGeometry>

      <pointsMaterial
        color={"#2fffe0"}
        size={0.13}          // ✅ bigger so visible
        sizeAttenuation
        transparent
        opacity={0.30}       // ✅ visible
        depthWrite={false}
        depthTest={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}