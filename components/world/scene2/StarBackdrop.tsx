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

  useFrame((state, dt) => {
    if (!ref.current) return;

    ref.current.rotation.y += dt * 0.01;

    // subtle parallax on the whole star field
    ref.current.position.x = THREE.MathUtils.lerp(
      ref.current.position.x,
      -state.pointer.x * 1.2,
      1 - Math.pow(0.01, dt)
    );

    ref.current.position.y = THREE.MathUtils.lerp(
      ref.current.position.y,
      -state.pointer.y * 0.6,
      1 - Math.pow(0.01, dt)
    );
  });

  return (
    <points ref={ref} frustumCulled={false} renderOrder={1}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" array={positions} itemSize={3} />
      </bufferGeometry>

      <pointsMaterial
        color={"#2fffe0"}
        size={0.13}
        sizeAttenuation
        transparent
        opacity={0.3}
        depthWrite={false}
        depthTest={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}