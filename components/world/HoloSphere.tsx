"use client";

import { useRef, useMemo } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

/**
 * HoloSphere – Central wireframe sphere with holographic scan-line effect.
 * Replaces the obelisk as the main focal 3D object.
 */
export default function HoloSphere({
  position = [0, 1.2, -1] as [number, number, number],
  radius = 1.6,
  color = "#2fffe0",
  rotationSpeed = 0.15,
}: {
  position?: [number, number, number];
  radius?: number;
  color?: string;
  rotationSpeed?: number;
}) {
  const wireRef = useRef<THREE.Mesh>(null!);
  const scanRef = useRef<THREE.Mesh>(null!);
  const ringRef = useRef<THREE.Mesh>(null!);
  const ring2Ref = useRef<THREE.Mesh>(null!);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();

    // Rotate wireframe
    if (wireRef.current) {
      wireRef.current.rotation.y = t * rotationSpeed;
      wireRef.current.rotation.x = Math.sin(t * 0.1) * 0.15;
    }

    // Scan line plane moves up and down
    if (scanRef.current) {
      scanRef.current.position.y = position[1] + Math.sin(t * 0.6) * radius * 0.9;
      const mat = scanRef.current.material as THREE.MeshBasicMaterial;
      mat.opacity = 0.15 + Math.sin(t * 1.2) * 0.08;
    }

    // Orbit rings
    if (ringRef.current) {
      ringRef.current.rotation.z = t * 0.2;
      ringRef.current.rotation.x = Math.PI * 0.35 + Math.sin(t * 0.15) * 0.1;
    }
    if (ring2Ref.current) {
      ring2Ref.current.rotation.z = -t * 0.15;
      ring2Ref.current.rotation.x = Math.PI * 0.55 + Math.cos(t * 0.12) * 0.1;
    }
  });

  return (
    <group position={position}>
      {/* Main wireframe sphere */}
      <mesh ref={wireRef}>
        <icosahedronGeometry args={[radius, 2]} />
        <meshBasicMaterial
          color={color}
          wireframe
          transparent
          opacity={0.2}
          depthWrite={false}
        />
      </mesh>

      {/* Inner solid sphere (very faint) */}
      <mesh>
        <sphereGeometry args={[radius * 0.4, 32, 32]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.5}
          transparent
          opacity={0.15}
          depthWrite={false}
        />
      </mesh>

      {/* Horizontal scan line */}
      <mesh ref={scanRef} rotation={[0, 0, 0]}>
        <planeGeometry args={[radius * 3, 0.02]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.2}
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Orbit ring 1 */}
      <mesh ref={ringRef}>
        <torusGeometry args={[radius * 1.3, 0.008, 8, 80]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.25}
          depthWrite={false}
        />
      </mesh>

      {/* Orbit ring 2 */}
      <mesh ref={ring2Ref}>
        <torusGeometry args={[radius * 1.6, 0.005, 8, 80]} />
        <meshBasicMaterial
          color={"#00aaff"}
          transparent
          opacity={0.15}
          depthWrite={false}
        />
      </mesh>

      {/* Point light for glow */}
      <pointLight color={color} intensity={2} distance={8} decay={2} />
    </group>
  );
}
