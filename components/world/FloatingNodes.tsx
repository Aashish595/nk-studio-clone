"use client";

import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

type NodeData = {
  pos: THREE.Vector3;
  size: number;
};

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
  const nodesGroupRef = useRef<THREE.Group>(null!);
  const lineRef = useRef<THREE.LineSegments>(null!);

  const nodesRef = useRef<NodeData[]>([]);
  const seedRef = useRef(987654321);

  const nodeMaterial = useMemo(() => {
    return new THREE.MeshBasicMaterial({
      color,
      transparent: true,
      opacity: 0.6,
    });
  }, [color]);

  const lineMaterial = useMemo(() => {
    return new THREE.LineBasicMaterial({
      color,
      transparent: true,
      opacity: 0.08,
      depthWrite: false,
    });
  }, [color]);

  const rand = (a: number, b: number) => {
    seedRef.current = (1664525 * seedRef.current + 1013904223) % 4294967296;
    const r = seedRef.current / 4294967296;
    return a + r * (b - a);
  };

  useEffect(() => {
    const nodesGroup = nodesGroupRef.current;
    const line = lineRef.current;

    if (!nodesGroup || !line) return;

    nodesRef.current = [];

    while (nodesGroup.children.length > 0) {
      const child = nodesGroup.children[0];
      nodesGroup.remove(child);

      if (child instanceof THREE.Mesh) {
        child.geometry.dispose();
      }
    }

    const arr: NodeData[] = [];

    for (let i = 0; i < count; i++) {
      const theta = (i / count) * Math.PI * 2 + rand(0, 0.5);
      const phi = rand(Math.PI * 0.2, Math.PI * 0.8);
      const r = radius * rand(0.5, 1);

      const pos = new THREE.Vector3(
        r * Math.sin(phi) * Math.cos(theta),
        r * Math.cos(phi) * 0.4 + rand(-1, 1),
        r * Math.sin(phi) * Math.sin(theta)
      );

      const size = rand(0.03, 0.09);

      arr.push({ pos, size });

      const mesh = new THREE.Mesh(
        new THREE.SphereGeometry(size, 8, 8),
        nodeMaterial
      );
      mesh.position.copy(pos);
      nodesGroup.add(mesh);
    }

    nodesRef.current = arr;

    const positions: number[] = [];

    for (let i = 0; i < arr.length; i++) {
      for (let j = i + 1; j < arr.length; j++) {
        const dist = arr[i].pos.distanceTo(arr[j].pos);

        if (dist < radius * 0.55) {
          positions.push(
            arr[i].pos.x,
            arr[i].pos.y,
            arr[i].pos.z,
            arr[j].pos.x,
            arr[j].pos.y,
            arr[j].pos.z
          );
        }
      }
    }

    const newGeometry = new THREE.BufferGeometry();
    newGeometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(positions, 3)
    );

    if (line.geometry) {
      line.geometry.dispose();
    }

    line.geometry = newGeometry;

    return () => {
      while (nodesGroup.children.length > 0) {
        const child = nodesGroup.children[0];
        nodesGroup.remove(child);

        if (child instanceof THREE.Mesh) {
          child.geometry.dispose();
        }
      }

      if (line.geometry) {
        line.geometry.dispose();
      }
    };
  }, [count, radius, nodeMaterial]);

  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = clock.getElapsedTime() * 0.03;
    }
  });

  return (
    <group ref={groupRef} position={[0, 1.5, -2]}>
      <lineSegments ref={lineRef} material={lineMaterial} />
      <group ref={nodesGroupRef} />
    </group>
  );
}