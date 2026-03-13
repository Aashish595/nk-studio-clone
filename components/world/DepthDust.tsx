"use client";

import * as THREE from "three";
import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";

export default function DepthDust() {
  const pointsRef = useRef<THREE.Points>(null!);
  const count = 900;

  const positionsRef = useRef<Float32Array>(new Float32Array(count * 3));
  const seedRef = useRef(123456789);

  const rand = (a: number, b: number) => {
    seedRef.current = (1664525 * seedRef.current + 1013904223) % 4294967296;
    const r = seedRef.current / 4294967296;
    return a + r * (b - a);
  };

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute(
      "position",
      new THREE.BufferAttribute(new Float32Array(count * 3), 3)
    );
    return geo;
  }, []);

  const material = useMemo(() => {
    return new THREE.PointsMaterial({
      color: "#bfffee",
      size: 0.03,
      transparent: true,
      opacity: 0.35,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
  }, []);

  useEffect(() => {
    const positions = positionsRef.current;

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      positions[i3 + 0] = rand(-20, 20);
      positions[i3 + 1] = rand(-1, 7);
      positions[i3 + 2] = rand(-95, -5);
    }

    const attr = geometry.getAttribute("position") as THREE.BufferAttribute;
    attr.array = positions;
    attr.needsUpdate = true;
  }, [geometry]);

  useFrame((_, dt) => {
    const attr = geometry.getAttribute("position") as THREE.BufferAttribute;
    const pos = attr.array as Float32Array;

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      pos[i3 + 2] += dt * 0.55;

      if (pos[i3 + 2] > 6) {
        pos[i3 + 2] = rand(-110, -90);
      }
    }

    attr.needsUpdate = true;
  });

  return (
    <points
      ref={pointsRef}
      geometry={geometry}
      material={material}
      position={[0, 0, 0]}
    />
  );
}