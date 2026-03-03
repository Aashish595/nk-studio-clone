"use client";

import { useRef, useMemo } from "react";
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

  const { positions, velocities, sizes } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const velocities = new Float32Array(count);
    const sizes = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      positions[i3] = (Math.random() - 0.5) * spread;
      positions[i3 + 1] = Math.random() * height - 1;
      positions[i3 + 2] = (Math.random() - 0.5) * spread;
      velocities[i] = 0.1 + Math.random() * speed;
      sizes[i] = 1 + Math.random() * 3;
    }

    return { positions, velocities, sizes };
  }, [count, spread, height, speed]);

  useFrame(({ clock }) => {
    const pts = pointsRef.current;
    if (!pts) return;

    const posArr = pts.geometry.attributes.position.array as Float32Array;
    const dt = clock.getDelta() || 0.016;

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      posArr[i3 + 1] += velocities[i] * dt * 2;

      // Reset when above height
      if (posArr[i3 + 1] > height) {
        posArr[i3 + 1] = -1;
        posArr[i3] = (Math.random() - 0.5) * spread;
        posArr[i3 + 2] = (Math.random() - 0.5) * spread;
      }
    }

    pts.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-size"
          args={[sizes, 1]}
        />
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
