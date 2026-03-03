"use client";

import { useRef, useMemo } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

/**
 * TechGrid – A flat, glowing grid on the ground plane that pulses with cyan light.
 * Resembles a futuristic tech floor / tron-style grid.
 */
export default function TechGrid({
  size = 80,
  divisions = 40,
  color = "#0ff4c6",
  pulseSpeed = 0.8,
}: {
  size?: number;
  divisions?: number;
  color?: string;
  pulseSpeed?: number;
}) {
  const gridRef = useRef<THREE.GridHelper>(null!);
  const glowRef = useRef<THREE.Mesh>(null!);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();

    // Pulse grid opacity
    if (gridRef.current) {
      const mat = gridRef.current.material as THREE.Material;
      mat.opacity = 0.12 + Math.sin(t * pulseSpeed) * 0.06;
    }

    // Glow plane pulse
    if (glowRef.current) {
      const mat = glowRef.current.material as THREE.MeshBasicMaterial;
      mat.opacity = 0.04 + Math.sin(t * pulseSpeed * 0.6) * 0.02;
    }
  });

  return (
    <group position={[0, -0.55, 0]}>
      {/* Grid helper */}
      <gridHelper
        ref={gridRef}
        args={[size, divisions, color, color]}
        rotation={[0, 0, 0]}
      >
        <meshBasicMaterial
          attach="material"
          color={color}
          transparent
          opacity={0.12}
          depthWrite={false}
        />
      </gridHelper>

      {/* Subtle glow plane underneath */}
      <mesh ref={glowRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
        <planeGeometry args={[size, size]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.04}
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}
