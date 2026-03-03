"use client";

import * as THREE from "three";
import React, { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";

export default function GroundSpread({
  count = 1200,
  y = -1.15,
  center = [0, -0.6] as [number, number], // x,z around obelisk base
}: {
  count?: number;
  y?: number;
  center?: [number, number];
}) {
  const ref = useRef<THREE.Points>(null!);

  const state = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const vel = new Float32Array(count * 2); // vx,vz
    const life = new Float32Array(count);

    const rand = (a: number, b: number) => a + Math.random() * (b - a);

    const respawn = (i: number) => {
      const a = i * 3;
      const v = i * 2;

      const ang = rand(0, Math.PI * 2);
      const r = rand(0, 0.9);

      positions[a + 0] = center[0] + Math.cos(ang) * r;
      positions[a + 1] = y + rand(0.04, 0.35);
      positions[a + 2] = center[1] + Math.sin(ang) * r;

      // slow spread outward
      vel[v + 0] = Math.cos(ang) * rand(0.10, 0.45);
      vel[v + 1] = Math.sin(ang) * rand(0.10, 0.45);

      // long life = slow feel
      life[i] = rand(3.0, 7.0);
    };

    for (let i = 0; i < count; i++) respawn(i);

    return { positions, vel, life, respawn };
  }, [count, y, center]);

  useFrame((stateR3F, dt) => {
    const pts = ref.current;
    if (!pts) return;

    const pos = pts.geometry.getAttribute("position") as THREE.BufferAttribute;
    const t = stateR3F.clock.elapsedTime;

    for (let i = 0; i < count; i++) {
      const a = i * 3;
      const v = i * 2;

      state.life[i] -= dt;

      pos.array[a + 0] += state.vel[v + 0] * dt;
      pos.array[a + 2] += state.vel[v + 1] * dt;

      // hover shimmer (small)
      pos.array[a + 1] += Math.sin(t * 1.2 + i * 0.03) * 0.0009;

      if (state.life[i] <= 0) state.respawn(i);
    }

    pos.needsUpdate = true;
  });

  return (
    <points ref={ref} frustumCulled={false} renderOrder={2}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" array={state.positions} itemSize={3} />
      </bufferGeometry>

      <pointsMaterial
        color={"#2fffe0"}
        size={0.11}          // ✅ visible
        sizeAttenuation
        transparent
        opacity={0.22}       // ✅ visible but subtle
        depthWrite={false}
        depthTest={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}