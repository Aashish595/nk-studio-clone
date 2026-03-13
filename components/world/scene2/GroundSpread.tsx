"use client";

import * as THREE from "three";
import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";

type SimState = {
  positions: Float32Array;
  vel: Float32Array;
  life: Float32Array;
  ready: boolean;
};

export default function GroundSpread({ count = 120 }: { count?: number }) {
  const ref = useRef<THREE.Points>(null!);

  const stateRef = useRef<SimState>({
    positions: new Float32Array(count * 3),
    vel: new Float32Array(count * 2),
    life: new Float32Array(count),
    ready: false,
  });

  const seededRandomRef = useRef(123456);

  const rand = (a: number, b: number) => {
    // simple seeded pseudo-random
    seededRandomRef.current =
      (seededRandomRef.current * 1664525 + 1013904223) % 4294967296;

    const r = seededRandomRef.current / 4294967296;
    return a + r * (b - a);
  };

  const respawnParticle = (i: number) => {
    const state = stateRef.current;
    const a = i * 3;
    const v = i * 2;

    const angle = rand(0, Math.PI * 2);
    const radius = rand(0.1, 1.8);

    state.positions[a + 0] = Math.cos(angle) * radius;
    state.positions[a + 1] = 0.02;
    state.positions[a + 2] = Math.sin(angle) * radius;

    state.vel[v + 0] = Math.cos(angle) * rand(0.2, 1.4);
    state.vel[v + 1] = Math.sin(angle) * rand(0.2, 1.4);

    state.life[i] = rand(0.6, 1.4);
  };

  useEffect(() => {
    const state = stateRef.current;

    for (let i = 0; i < count; i++) {
      respawnParticle(i);
    }

    state.ready = true;

    const points = ref.current;
    if (!points) return;

    const pos = points.geometry.getAttribute("position") as THREE.BufferAttribute;
    pos.needsUpdate = true;
  }, [count]);

  useFrame((_, dt) => {
    const points = ref.current;
    const state = stateRef.current;

    if (!points || !state.ready) return;

    const pos = points.geometry.getAttribute("position") as THREE.BufferAttribute;

    for (let i = 0; i < count; i++) {
      const a = i * 3;
      const v = i * 2;

      state.life[i] -= dt;

      pos.array[a + 0] += state.vel[v + 0] * dt;
      pos.array[a + 2] += state.vel[v + 1] * dt;

      if (state.life[i] <= 0) {
        respawnParticle(i);

        pos.array[a + 0] = state.positions[a + 0];
        pos.array[a + 1] = state.positions[a + 1];
        pos.array[a + 2] = state.positions[a + 2];
      }
    }

    pos.needsUpdate = true;
  });

  const initialPositions = useMemo(() => {
    return new Float32Array(count * 3);
  }, [count]);

  return (
    <points ref={ref} frustumCulled={false} renderOrder={2}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[initialPositions, 3]}
        />
      </bufferGeometry>

      <pointsMaterial
        color="#2fffe0"
        size={0.045}
        transparent
        opacity={0.9}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        depthTest={false}
      />
    </points>
  );
}