"use client";

import * as THREE from "three";
import React, { useEffect, useMemo, useRef } from "react";
import { useFrame, useLoader } from "@react-three/fiber";

const WATER_NORMAL = "/textures/water/normal.jpg";
useLoader.preload(THREE.TextureLoader, WATER_NORMAL);

const PONDS = [
  { x: -18, z: 10, r: 10.5 },
  { x: 12,  z: -6, r: 8.0 },
  { x: 26,  z: 22, r: 6.3 },
] as const;

function setupWaterTex(t: THREE.Texture) {
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(2.5, 2.5);
  t.anisotropy = 4;
  t.needsUpdate = true;
}

function PondWater({ x, z, r, y }: { x: number; z: number; r: number; y: number }) {
  const geom = useMemo(() => new THREE.CircleGeometry(r, 96), [r]);
  const ringGeom = useMemo(() => new THREE.RingGeometry(r * 0.92, r * 1.08, 96), [r]);

  const normal = useLoader(THREE.TextureLoader, WATER_NORMAL);
  const glowRef = useRef<THREE.MeshBasicMaterial>(null!);

  useEffect(() => setupWaterTex(normal), [normal]);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    normal.offset.x = (t * 0.015) % 1;
    normal.offset.y = (t * 0.010) % 1;

    if (glowRef.current) glowRef.current.opacity = 0.22 + Math.sin(t * 1.2) * 0.05;
  });

  const waterMat = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: new THREE.Color("#0fbda7"),
        roughness: 0.1,
        transparent: true,
        opacity: 0.72,
        clearcoat: 1,
        clearcoatRoughness: 0.06,
        ior: 1.33,
        emissive: new THREE.Color("#18ffe6"),
        emissiveIntensity: 0.18,
        normalMap: normal,
        normalScale: new THREE.Vector2(0.35, 0.35),
        fog: true,
      }),
    [normal]
  );

  const glowMat = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: new THREE.Color("#2fffe0"),
        transparent: true,
        opacity: 0.22,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    []
  );

  return (
    <group position={[x, y, z]} rotation={[-Math.PI / 2, 0, 0]} frustumCulled={false}>
      <mesh geometry={geom} material={waterMat} polygonOffset polygonOffsetFactor={-2} polygonOffsetUnits={-2} />
      <mesh
        geometry={ringGeom}
        material={glowMat}
        renderOrder={5}
        ref={(m) => {
          // @ts-ignore
          if (m) glowRef.current = m.material;
        }}
      />
    </group>
  );
}

export default function Pond() {
  const y = -1.05; // ✅ because Scene group is y=-0.6
  return (
    <group>
      {PONDS.map((p, i) => (
        <PondWater key={i} x={p.x} z={p.z} r={p.r} y={y} />
      ))}
    </group>
  );
}