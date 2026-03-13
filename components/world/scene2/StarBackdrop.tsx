"use client";

import * as THREE from "three";
import React, { useEffect, useMemo, useRef } from "react";
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
  const positionsRef = useRef<Float32Array>(new Float32Array(count * 3));
  const seedRef = useRef(1357911);

  const rand = (a: number, b: number) => {
    seedRef.current = (1664525 * seedRef.current + 1013904223) % 4294967296;
    const r = seedRef.current / 4294967296;
    return a + r * (b - a);
  };

  const initialPositions = useMemo(() => new Float32Array(count * 3), [count]);

  useEffect(() => {
    const positions = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const a = i * 3;
      positions[a + 0] = rand(-radius, radius);
      positions[a + 1] = rand(-radius * 0.55, radius * 0.55);
      positions[a + 2] = rand(zMin, zMax);
    }

    positionsRef.current = positions;

    const points = ref.current;
    if (!points) return;

    const attr = points.geometry.getAttribute("position") as THREE.BufferAttribute;
    attr.array = positionsRef.current;
    attr.needsUpdate = true;
  }, [count, radius, zMin, zMax]);

  useFrame((state, dt) => {
    if (!ref.current) return;

    ref.current.rotation.y += dt * 0.01;

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
        <bufferAttribute
          attach="attributes-position"
          args={[initialPositions, 3]}
        />
      </bufferGeometry>

      <pointsMaterial
        color="#2fffe0"
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