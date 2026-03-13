"use client";

import * as THREE from "three";
import React, { useEffect, useMemo, useRef } from "react";
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

  const xsRef = useRef<Float32Array>(new Float32Array(count));
  const ysRef = useRef<Float32Array>(new Float32Array(count));
  const zsRef = useRef<Float32Array>(new Float32Array(count));
  const lensRef = useRef<Float32Array>(new Float32Array(count));
  const spdRef = useRef<Float32Array>(new Float32Array(count));
  const positionsRef = useRef<Float32Array>(new Float32Array(count * 2 * 3));

  const seedRef = useRef(246813579);

  const rand = (a: number, b: number) => {
    seedRef.current = (1664525 * seedRef.current + 1013904223) % 4294967296;
    const r = seedRef.current / 4294967296;
    return a + r * (b - a);
  };

  const respawn = (i: number) => {
    const xs = xsRef.current;
    const ys = ysRef.current;
    const zs = zsRef.current;
    const lens = lensRef.current;
    const spd = spdRef.current;

    xs[i] = rand(-radius, radius);
    ys[i] = rand(-radius * 0.6, radius * 0.6);
    zs[i] = -rand(depth * 0.25, depth);
    lens[i] = rand(minLen, maxLen);
    spd[i] = rand(0.7, 1.45);
  };

  const initialPositions = useMemo(
    () => new Float32Array(count * 2 * 3),
    [count]
  );

  useEffect(() => {
    xsRef.current = new Float32Array(count);
    ysRef.current = new Float32Array(count);
    zsRef.current = new Float32Array(count);
    lensRef.current = new Float32Array(count);
    spdRef.current = new Float32Array(count);
    positionsRef.current = new Float32Array(count * 2 * 3);

    const positions = positionsRef.current;
    const xs = xsRef.current;
    const ys = ysRef.current;
    const zs = zsRef.current;
    const lens = lensRef.current;

    for (let i = 0; i < count; i++) {
      respawn(i);
    }

    for (let i = 0; i < count; i++) {
      const a = i * 6;
      positions[a + 0] = xs[i];
      positions[a + 1] = ys[i];
      positions[a + 2] = zs[i];
      positions[a + 3] = xs[i];
      positions[a + 4] = ys[i];
      positions[a + 5] = zs[i] - lens[i];
    }

    const geometry = geoRef.current;
    if (!geometry) return;

    const attr = geometry.getAttribute("position") as THREE.BufferAttribute;
    attr.array = positions;
    attr.needsUpdate = true;
  }, [count, depth, radius, minLen, maxLen]);

  useFrame((_, dt) => {
    const geometry = geoRef.current;
    if (!geometry) return;

    const pos = geometry.getAttribute("position") as THREE.BufferAttribute;
    const arr = pos.array as Float32Array;

    const xs = xsRef.current;
    const ys = ysRef.current;
    const zs = zsRef.current;
    const lens = lensRef.current;
    const spd = spdRef.current;

    for (let i = 0; i < count; i++) {
      zs[i] += speed * spd[i] * dt;

      xs[i] += Math.sin((zs[i] + i) * 0.03) * 0.002;
      ys[i] += Math.cos((zs[i] + i) * 0.03) * 0.002;

      if (zs[i] > nearZ) {
        respawn(i);
      }

      const a = i * 6;
      arr[a + 0] = xs[i];
      arr[a + 1] = ys[i];
      arr[a + 2] = zs[i];

      arr[a + 3] = xs[i];
      arr[a + 4] = ys[i];
      arr[a + 5] = zs[i] - lens[i];
    }

    pos.needsUpdate = true;
  });

  return (
    <lineSegments frustumCulled={false}>
      <bufferGeometry ref={geoRef}>
        <bufferAttribute
          attach="attributes-position"
          args={[initialPositions, 3]}
        />
      </bufferGeometry>

      <lineBasicMaterial
        color="#2fffe0"
        transparent
        opacity={0.75}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </lineSegments>
  );
}