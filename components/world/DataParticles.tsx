"use client";

import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

/**
 * DataParticles – Rising data-particle streams (like data flowing upward).
 * Replaces nature dust/sparks with a tech-themed particle system.
 */
export default function DataParticles({
  count = 200,
  spread = 20,
  height = 12,
  color = "#2fffe0",
  speed = 0.3,
}: {
  count?: number;
  spread?: number;
  height?: number;
  color?: string;
  speed?: number;
}) {
  const pointsRef = useRef<THREE.Points>(null!);

  const positionsRef = useRef<Float32Array>(new Float32Array(count * 3));
  const velocitiesRef = useRef<Float32Array>(new Float32Array(count));
  const sizesRef = useRef<Float32Array>(new Float32Array(count));

  const seedRef = useRef(123456789);

  const rand = (a: number, b: number) => {
    seedRef.current = (1664525 * seedRef.current + 1013904223) % 4294967296;
    const r = seedRef.current / 4294967296;
    return a + r * (b - a);
  };

  useEffect(() => {
    positionsRef.current = new Float32Array(count * 3);
    velocitiesRef.current = new Float32Array(count);
    sizesRef.current = new Float32Array(count);

    const positions = positionsRef.current;
    const velocities = velocitiesRef.current;
    const sizes = sizesRef.current;

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      positions[i3] = rand(-spread / 2, spread / 2);
      positions[i3 + 1] = rand(-1, height);
      positions[i3 + 2] = rand(-spread / 2, spread / 2);
      velocities[i] = rand(0.1, 0.1 + speed);
      sizes[i] = rand(1, 4);
    }

    const pts = pointsRef.current;
    if (!pts) return;

    const positionAttr = pts.geometry.getAttribute("position") as THREE.BufferAttribute;
    positionAttr.array = positionsRef.current;
    positionAttr.needsUpdate = true;

    const sizeAttr = pts.geometry.getAttribute("size") as THREE.BufferAttribute | undefined;
    if (sizeAttr) {
      sizeAttr.array = sizesRef.current;
      sizeAttr.needsUpdate = true;
    }
  }, [count, spread, height, speed]);

  useFrame((_, dt) => {
    const pts = pointsRef.current;
    if (!pts) return;

    const posArr = positionsRef.current;
    const velocities = velocitiesRef.current;

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      posArr[i3 + 1] += velocities[i] * dt * 2;

      if (posArr[i3 + 1] > height) {
        posArr[i3 + 1] = -1;
        posArr[i3] = rand(-spread / 2, spread / 2);
        posArr[i3 + 2] = rand(-spread / 2, spread / 2);
      }
    }

    const positionAttr = pts.geometry.getAttribute("position") as THREE.BufferAttribute;
    positionAttr.needsUpdate = true;
  });

  const initialPositions = useMemo(() => new Float32Array(count * 3), [count]);
  const initialSizes = useMemo(() => new Float32Array(count), [count]);

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[initialPositions, 3]} />
        <bufferAttribute attach="attributes-size" args={[initialSizes, 1]} />
      </bufferGeometry>
      <pointsMaterial
        color={color}
        size={0.04}
        transparent
        opacity={0.5}
        depthWrite={false}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}