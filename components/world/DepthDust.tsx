"use client";

import * as THREE from "three";
import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";

export default function DepthDust() {
  const points = useRef<THREE.Points>(null!);

  const { geom, mat, count } = useMemo(() => {
    const count = 900;
    const positions = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * 40;      
      const y = Math.random() * 8 - 1.0;        
      const z = -Math.random() * 90 - 5;        
      positions.set([x, y, z], i * 3);
    }

    const geom = new THREE.BufferGeometry();
    geom.setAttribute("position", new THREE.BufferAttribute(positions, 3));

    const mat = new THREE.PointsMaterial({
      color: "#bfffee",
      size: 0.03,
      transparent: true,
      opacity: 0.35,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    return { geom, mat, count };
  }, []);

  useFrame((_, dt) => {
    const pos = points.current.geometry.attributes.position as THREE.BufferAttribute;

    for (let i = 0; i < count; i++) {
      let z = pos.getZ(i);
      z += dt * 0.55; // 
      if (z > 6) z = -90 - Math.random() * 20;
      pos.setZ(i, z);
    }
    pos.needsUpdate = true;
  });

  return <points ref={points} geometry={geom} material={mat} position={[0, 0.0, 0]} />;
}