"use client";

import * as THREE from "three";
import React, { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";

type Props = {
  count?: number;
  areaX?: number;
  areaY?: number;
  depth?: number;
  nearZ?: number;     // when to respawn (near camera)
  minSpeed?: number;
  maxSpeed?: number;
  minScale?: number;
  maxScale?: number;
};

type Drop = {
  bx: number;   // base x
  by: number;   // base y
  z: number;    // current z
  v: number;    // speed toward camera
  phase: number;
  s: number;    // base scale
};

export default function DropletField({
  count = 320,
  areaX = 18,
  areaY = 7,
  depth = 70,
  nearZ = 7.8,
  minSpeed = 3.5,
  maxSpeed = 10,
  minScale = 0.035,
  maxScale = 0.075,
}: Props) {
  const meshRef = useRef<THREE.InstancedMesh>(null!);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const rand = (a: number, b: number) => a + Math.random() * (b - a);

  const drops = useMemo<Drop[]>(() => {
    return Array.from({ length: count }, () => ({
      bx: rand(-areaX, areaX),
      by: rand(-areaY * 0.2, areaY * 0.35),
      z: -rand(8, depth),
      v: rand(minSpeed, maxSpeed),
      phase: rand(0, Math.PI * 2),
      s: rand(minScale, maxScale),
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [count]);

  useFrame((state, dt) => {
    const mesh = meshRef.current;
    if (!mesh) return;

    const t = state.clock.elapsedTime;

    for (let i = 0; i < drops.length; i++) {
      const d = drops[i];

      // ✅ move toward camera (continuous)
      d.z += d.v * dt;

      // ✅ hover wobble (lens feel)
      const x = d.bx + Math.cos(t * 1.15 + d.phase) * 0.18;
      const y = d.by + Math.sin(t * 1.55 + d.phase) * 0.22;

      // slightly grow when closer (subtle)
      const closeness = THREE.MathUtils.clamp((d.z + depth) / (depth + nearZ), 0, 1);
      const s = d.s * (0.85 + closeness * 0.55);

      // respawn deep when it passes camera zone
      if (d.z > nearZ) {
        d.bx = rand(-areaX, areaX);
        d.by = rand(-areaY * 0.2, areaY * 0.35);
        d.z = -rand(12, depth);
        d.v = rand(minSpeed, maxSpeed);
        d.phase = rand(0, Math.PI * 2);
        d.s = rand(minScale, maxScale);
      }

      dummy.position.set(x, y, d.z);
      dummy.scale.setScalar(s);
      dummy.rotation.set(0, 0, 0);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    }

    mesh.instanceMatrix.needsUpdate = true;
  });

  return (
    <group frustumCulled={false}>
      <instancedMesh
        ref={meshRef}
        args={[undefined as any, undefined as any, count]}
        frustumCulled={false}
        renderOrder={5}
      >
        <sphereGeometry args={[1, 10, 10]} />
        <meshBasicMaterial
          color={"#2fffe0"}
          transparent
          opacity={0.95}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          depthTest={false}
        />
      </instancedMesh>
    </group>
  );
}