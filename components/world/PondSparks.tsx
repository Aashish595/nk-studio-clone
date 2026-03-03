"use client";

import * as THREE from "three";
import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";

type Props = {
  origin?: [number, number, number]; // center of pond glow
};

export default function PondSparks({ origin = [-10, -0.38, 4] }: Props) {
  const points = useRef<THREE.Points>(null!);

  const { geom, mat, count, vel } = useMemo(() => {
    const count = 520;
    const positions = new Float32Array(count * 3);
    const vel = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      // start near pond origin
      positions[i * 3 + 0] = origin[0] + (Math.random() - 0.5) * 3.0;
      positions[i * 3 + 1] = origin[1] + Math.random() * 0.2;
      positions[i * 3 + 2] = origin[2] + (Math.random() - 0.5) * 2.2;
      vel[i] = 0.15 + Math.random() * 0.35;
    }

    const geom = new THREE.BufferGeometry();
    geom.setAttribute("position", new THREE.BufferAttribute(positions, 3));

    const mat = new THREE.PointsMaterial({
      color: "#00ffd5",
      size: 0.045,
      transparent: true,
      opacity: 0.45,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    return { geom, mat, count, vel };
  }, [origin]);

  useFrame((state, dt) => {
    const t = state.clock.elapsedTime;
    const pos = points.current.geometry.attributes.position as THREE.BufferAttribute;

    for (let i = 0; i < count; i++) {
      let x = pos.getX(i);
      let y = pos.getY(i);
      let z = pos.getZ(i);

      // drift upward + slightly forward (toward camera)
      y += vel[i] * dt * 0.9;
      z += dt * 0.25;

      // tiny swirl
      x += Math.sin(t * 0.7 + i) * dt * 0.02;

      // reset when too high/close
      if (y > origin[1] + 3.0 || z > origin[2] + 6.0) {
        x = origin[0] + (Math.random() - 0.5) * 3.0;
        y = origin[1] + Math.random() * 0.2;
        z = origin[2] + (Math.random() - 0.5) * 2.2;
      }

      pos.setXYZ(i, x, y, z);
    }

    pos.needsUpdate = true;
  });

  return <points ref={points} geometry={geom} material={mat} />;
}