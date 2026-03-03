"use client";

import * as THREE from "three";
import React, { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import CrystalRock from "./CrystalRock";

type Rock = { scale: [number, number, number]; rotY: number };

export default function OrbitCrystalSet({
  center = [0, 0, -0.6] as [number, number, number],
  radius = 3.2,
  speed = 0.06,
  y = 0.45,
  tiltX = 0.12,
  tiltZ = 0.06,
  hoverAmp = 0.08,
  hoverSpeed = 0.55,
  zOffset = -2.2,
}: {
  center?: [number, number, number];
  radius?: number;
  speed?: number;
  y?: number;
  tiltX?: number;
  tiltZ?: number;
  hoverAmp?: number;
  hoverSpeed?: number;
  zOffset?: number;
}) {
  const rootRef = useRef<THREE.Group>(null!);
  const orbitRef = useRef<THREE.Group>(null!);

  const rocks = useMemo<Rock[]>(
    () => [
      { scale: [0.85, 0.92, 0.82], rotY: 0.8 },
      { scale: [0.62, 0.66, 0.6], rotY: 2.1 },
      { scale: [0.72, 0.78, 0.7], rotY: 3.6 },
    ],
    []
  );

  const baseAngles = useMemo(() => [0, (Math.PI * 2) / 3, (Math.PI * 4) / 3], []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;

    const root = rootRef.current;
    const orbit = orbitRef.current;
    if (!root || !orbit) return;

    root.position.set(center[0], center[1], center[2]);
    orbit.rotation.x = tiltX;
    orbit.rotation.z = tiltZ;

    root.position.y = center[1] + y + Math.sin(t * hoverSpeed) * hoverAmp;

    for (let i = 0; i < orbit.children.length; i++) {
      const m = orbit.children[i] as THREE.Object3D;

      const a = baseAngles[i] - t * speed; // clockwise
      const px = Math.cos(a) * radius;
      const pz = Math.sin(a) * radius;

      m.position.set(px, 0, pz + zOffset);
      m.rotation.set(0, rocks[i].rotY + t * 0.05, 0);
    }
  });

  return (
    <group ref={rootRef} frustumCulled={false}>
      <group ref={orbitRef} frustumCulled={false}>
        {rocks.map((r, i) => (
          <CrystalRock key={i} scale={r.scale} />
        ))}
      </group>
    </group>
  );
}