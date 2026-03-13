"use client";

import * as THREE from "three";
import React, { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";

type Props = {
  position?: [number, number, number];
  scale?: number;
};

export default function TechDataCore({
  position = [-9.8, 0.55, -1.8],
  scale = 1.7,
}: Props) {
  const root = useRef<THREE.Group>(null!);
  const frame1 = useRef<THREE.LineSegments>(null!);
  const frame2 = useRef<THREE.LineSegments>(null!);
  const ring = useRef<THREE.Mesh>(null!);
  const core = useRef<THREE.Mesh>(null!);
  const nodeGroup = useRef<THREE.Group>(null!);
  const linkLines = useRef<THREE.LineSegments>(null!);

  const targetRot = useRef({ x: 0, y: 0 });

  const nodes = useMemo(() => {
    const pts: THREE.Vector3[] = [];
    const count = 12;

    for (let i = 0; i < count; i++) {
      pts.push(
        new THREE.Vector3(
          THREE.MathUtils.randFloatSpread(1.4),
          THREE.MathUtils.randFloatSpread(1.4),
          THREE.MathUtils.randFloatSpread(1.4)
        )
      );
    }

    return pts;
  }, []);

  const linePositions = useMemo(() => {
    const arr: number[] = [];

    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const a = nodes[i];
        const b = nodes[j];
        const d = a.distanceTo(b);

        if (d < 0.95) {
          arr.push(a.x, a.y, a.z, b.x, b.y, b.z);
        }
      }
    }

    return new Float32Array(arr);
  }, [nodes]);

  const boxEdges1 = useMemo(() => {
    const g = new THREE.BoxGeometry(1.9, 1.9, 1.9);
    const e = new THREE.EdgesGeometry(g);
    g.dispose();
    return e;
  }, []);

  const boxEdges2 = useMemo(() => {
    const g = new THREE.BoxGeometry(1.25, 1.25, 1.25);
    const e = new THREE.EdgesGeometry(g);
    g.dispose();
    return e;
  }, []);

  useFrame((state, dt) => {
    const t = state.clock.elapsedTime;
    const mx = state.pointer.x;
    const my = state.pointer.y;

    if (root.current) {
      root.current.position.y = position[1] + Math.sin(t * 0.9) * 0.06;

      targetRot.current.y = 0.45 + mx * 0.22;
      targetRot.current.x = my * 0.12;

      root.current.rotation.y = THREE.MathUtils.lerp(
        root.current.rotation.y,
        targetRot.current.y,
        1 - Math.pow(0.01, dt)
      );

      root.current.rotation.x = THREE.MathUtils.lerp(
        root.current.rotation.x,
        targetRot.current.x,
        1 - Math.pow(0.01, dt)
      );
    }

    if (frame1.current) frame1.current.rotation.y += dt * 0.18;
    if (frame2.current) frame2.current.rotation.x -= dt * 0.22;

    if (ring.current) {
      ring.current.rotation.x = Math.PI / 2;
      ring.current.rotation.z += dt * 0.65;
    }

    if (core.current) {
      const s = 1 + Math.sin(t * 2.2) * 0.08;
      core.current.scale.setScalar(s);
    }

    if (nodeGroup.current) {
      nodeGroup.current.rotation.y += dt * 0.14;
      nodeGroup.current.rotation.x += dt * 0.06;
    }

    if (linkLines.current) {
      linkLines.current.rotation.y -= dt * 0.08;
    }
  });

  return (
    <group ref={root} position={position} scale={scale}>
      {/* outer wire cube */}
      <lineSegments ref={frame1} geometry={boxEdges1}>
        <lineBasicMaterial
          color="#2fffe0"
          transparent
          opacity={0.9}
          depthWrite={false}
        />
      </lineSegments>

      {/* inner wire cube */}
      <lineSegments ref={frame2} geometry={boxEdges2}>
        <lineBasicMaterial
          color="#1cc8ff"
          transparent
          opacity={0.7}
          depthWrite={false}
        />
      </lineSegments>

      {/* soft glass shell */}
      <mesh>
        <boxGeometry args={[1.45, 1.45, 1.45]} />
        <meshPhysicalMaterial
          color="#2fffe0"
          emissive="#2fffe0"
          emissiveIntensity={0.55}
          transparent
          opacity={0.05}
          roughness={0.1}
          metalness={0.02}
          transmission={0.4}
          thickness={0.7}
          depthWrite={false}
        />
      </mesh>

      {/* central glowing core */}
      <mesh ref={core}>
        <octahedronGeometry args={[0.24, 0]} />
        <meshBasicMaterial
          color="#2fffe0"
          transparent
          opacity={0.95}
        />
      </mesh>

      {/* scan ring */}
      <mesh ref={ring}>
        <torusGeometry args={[0.72, 0.012, 16, 160]} />
        <meshBasicMaterial
          color="#2fffe0"
          transparent
          opacity={0.85}
        />
      </mesh>

      {/* data links */}
      <lineSegments ref={linkLines}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            array={linePositions}
            count={linePositions.length / 3}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial
          color="#2fffe0"
          transparent
          opacity={0.28}
          depthWrite={false}
        />
      </lineSegments>

      {/* data nodes */}
      <group ref={nodeGroup}>
        {nodes.map((p, i) => (
          <mesh key={i} position={[p.x, p.y, p.z]}>
            <sphereGeometry args={[0.035, 12, 12]} />
            <meshBasicMaterial color={i % 2 === 0 ? "#2fffe0" : "#1cc8ff"} />
          </mesh>
        ))}
      </group>
    </group>
  );
}