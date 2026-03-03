"use client";

import * as THREE from "three";
import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";

type Props = {
  /** center of obelisk */
  center?: [number, number, number];
  /** obelisk height (match your rectangle height) */
  height?: number;
  /** inside radius (must be smaller than obelisk half-width) */
  radius?: number;
  /** number of shards */
  count?: number;
  /** orbit speed (cinematic slow) */
  speed?: number;
};

export default function InnerShardOrbit({
  center = [0, 1.1, -0.6],
  height = 3.6,
  radius = 0.16,
  count = 34,
  speed = 0.08,
}: Props) {
  const inst = useRef<THREE.InstancedMesh>(null!);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  // small faceted shard geometry
  const geo = useMemo(() => new THREE.DodecahedronGeometry(0.06, 0), []);

  // crystal-like green material (matches your rock vibe)
  const mat = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: new THREE.Color("#4aa79a"),
        roughness: 0.35,
        metalness: 0.0,
        transparent: true,
        opacity: 0.55,
        transmission: 0.65,
        thickness: 0.4,
        ior: 1.35,
        emissive: new THREE.Color("#00ffd5"),
        emissiveIntensity: 0.15,
        flatShading: true,
      }),
    []
  );

  // pre-bake per-shard motion params
  const data = useMemo(() => {
    const arr = [];
    for (let i = 0; i < count; i++) {
      const a = (i / count) * Math.PI * 2;
      const y = (Math.random() - 0.5) * (height * 0.75);
      arr.push({
        a,
        y,
        r: radius * (0.75 + Math.random() * 0.45),
        spin: 0.6 + Math.random() * 1.2,
        phase: Math.random() * 10,
        s: 0.35 + Math.random() * 0.55, 
      });
    }
    return arr;
  }, [count, height, radius]);

  useFrame((state) => {
    const t = state.clock.elapsedTime;

    for (let i = 0; i < data.length; i++) {
      const d = data[i];

      // orbit angle (slow)
      const ang = d.a + t * speed;

      // inside loop (circular around center)
      const x = Math.cos(ang) * d.r;
      const z = Math.sin(ang) * d.r;

      // slight vertical breathing
      const y = d.y + Math.sin(t * 0.8 + d.phase) * 0.06;

      dummy.position.set(center[0] + x, center[1] + y, center[2] + z);

      // self spin (tiny)
      dummy.rotation.set(
        Math.sin(t * d.spin + d.phase) * 0.6,
        ang + t * 0.15,
        Math.cos(t * d.spin + d.phase) * 0.6
      );

      dummy.scale.setScalar(d.s);
      dummy.updateMatrix();

      inst.current.setMatrixAt(i, dummy.matrix);
    }

    inst.current.instanceMatrix.needsUpdate = true;
  });

  return <instancedMesh ref={inst} args={[geo, mat, count]} />;
}