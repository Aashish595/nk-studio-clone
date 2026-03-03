"use client";

import * as THREE from "three";
import React, { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";

type Props = {
  count?: number;
  depth?: number;
  speed?: number;
  radius?: number;
  minLen?: number;
  maxLen?: number;
  nearZ?: number;
};

export default function StarStreaks({
  count = 1200,
  depth = 90,
  speed = 22,
  radius = 18,
  minLen = 0.08,
  maxLen = 0.42,
  nearZ = 8,
}: Props) {
  const geoRef = useRef<THREE.BufferGeometry>(null!);

  const state = useMemo(() => {
    const positions = new Float32Array(count * 2 * 3);

    const xs = new Float32Array(count);
    const ys = new Float32Array(count);
    const zs = new Float32Array(count);
    const lens = new Float32Array(count);
    const spd = new Float32Array(count);

    const rand = (a: number, b: number) => a + Math.random() * (b - a);

    const respawn = (i: number) => {
      xs[i] = rand(-radius, radius);
      ys[i] = rand(-radius * 0.6, radius * 0.6);
      zs[i] = -rand(depth * 0.25, depth); // random deep start
      lens[i] = rand(minLen, maxLen);
      spd[i] = rand(0.7, 1.45); // per-star speed (kills bundling)
    };

    for (let i = 0; i < count; i++) respawn(i);

    // write initial positions
    for (let i = 0; i < count; i++) {
      const a = i * 6;
      positions[a + 0] = xs[i];
      positions[a + 1] = ys[i];
      positions[a + 2] = zs[i];
      positions[a + 3] = xs[i];
      positions[a + 4] = ys[i];
      positions[a + 5] = zs[i] - lens[i];
    }

    return { positions, xs, ys, zs, lens, spd, respawn };
  }, [count, depth, radius, minLen, maxLen]);

  useFrame((_, dt) => {
    const g = geoRef.current;
    if (!g) return;

    const pos = g.getAttribute("position") as THREE.BufferAttribute;

    for (let i = 0; i < count; i++) {
      // move toward camera (+z)
      state.zs[i] += speed * state.spd[i] * dt;

      // tiny drift so it feels “alive”
      state.xs[i] += Math.sin((state.zs[i] + i) * 0.03) * 0.002;
      state.ys[i] += Math.cos((state.zs[i] + i) * 0.03) * 0.002;

      if (state.zs[i] > nearZ) {
        state.respawn(i);
      }

      const a = i * 6;
      pos.array[a + 0] = state.xs[i];
      pos.array[a + 1] = state.ys[i];
      pos.array[a + 2] = state.zs[i];

      pos.array[a + 3] = state.xs[i];
      pos.array[a + 4] = state.ys[i];
      pos.array[a + 5] = state.zs[i] - state.lens[i];
    }

    pos.needsUpdate = true;
  });

  return (
    <lineSegments frustumCulled={false}>
      <bufferGeometry ref={geoRef}>
        <bufferAttribute
          attach="attributes-position"
          count={state.positions.length / 3}
          array={state.positions}
          itemSize={3}
        />
      </bufferGeometry>

      <lineBasicMaterial
        color={"#2fffe0"}
        transparent
        opacity={0.75}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </lineSegments>
  );
}