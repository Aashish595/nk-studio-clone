"use client";

import { useRef, useMemo } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

/**
 * FloatingNodes – Data-node spheres connected by faint lines.
 * Resembles a neural network / blockchain visualization orbiting slowly.
 */
export default function FloatingNodes({
  count = 24,
  radius = 8,
  color = "#2fffe0",
}: {
  count?: number;
  radius?: number;
  color?: string;
}) {
  const groupRef = useRef<THREE.Group>(null!);

  const nodes = useMemo(() => {
    const arr = [];
    for (let i = 0; i < count; i++) {
      const theta = (i / count) * Math.PI * 2 + Math.random() * 0.5;
      const phi = Math.random() * Math.PI * 0.6 + Math.PI * 0.2;
      const r = radius * (0.5 + Math.random() * 0.5);
      arr.push({
        pos: new THREE.Vector3(
          r * Math.sin(phi) * Math.cos(theta),
          r * Math.cos(phi) * 0.4 + (Math.random() - 0.5) * 2,
          r * Math.sin(phi) * Math.sin(theta)
        ),
        size: 0.03 + Math.random() * 0.06,
        speed: 0.2 + Math.random() * 0.3,
        phase: Math.random() * Math.PI * 2,
      });
    }
    return arr;
  }, [count, radius]);

  // Build connection lines (connect nearby nodes)
  const lineGeometry = useMemo(() => {
    const positions: number[] = [];
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dist = nodes[i].pos.distanceTo(nodes[j].pos);
        if (dist < radius * 0.55) {
          positions.push(
            nodes[i].pos.x, nodes[i].pos.y, nodes[i].pos.z,
            nodes[j].pos.x, nodes[j].pos.y, nodes[j].pos.z
          );
        }
      }
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
    return geo;
  }, [nodes, radius]);

  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = clock.getElapsedTime() * 0.03;
    }
  });

  return (
    <group ref={groupRef} position={[0, 1.5, -2]}>
      {/* Connection lines */}
      <lineSegments geometry={lineGeometry}>
        <lineBasicMaterial color={color} transparent opacity={0.08} depthWrite={false} />
      </lineSegments>

      {/* Node spheres */}
      {nodes.map((node, i) => (
        <mesh key={i} position={node.pos}>
          <sphereGeometry args={[node.size, 8, 8]} />
          <meshBasicMaterial color={color} transparent opacity={0.6} />
        </mesh>
      ))}
    </group>
  );
}
