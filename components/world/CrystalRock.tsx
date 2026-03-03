"use client";

import * as THREE from "three";
import { useMemo } from "react";
import { useTexture } from "@react-three/drei";

function makeCrystalGeometry() {
  const geo = new THREE.CylinderGeometry(0.55, 0.8, 2.2, 7, 6, false);
  geo.translate(0, 1.1, 0);

  const uv = geo.attributes.uv;
  geo.setAttribute(
    "uv2",
    new THREE.BufferAttribute((uv.array as Float32Array).slice(), 2)
  );

  geo.computeVertexNormals();
  return geo;
}

type Props = {
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: [number, number, number];
};

export default function CrystalRock({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = [1, 1, 1],
}: Props) {
  const geometry = useMemo(() => makeCrystalGeometry(), []);

  // ✅ YOUR CORRECT PATH
  const tex = useTexture({
    map: "/textures/terrain/rock/albedo.jpg",
    normalMap: "/textures/terrain/rock/normal.jpg",
    roughnessMap: "/textures/terrain/rock/roughness.jpg",
  });

  const material = useMemo(() => {
    // Important for color accuracy
    if (tex.map) tex.map.colorSpace = THREE.SRGBColorSpace;

    // Optional tiling
    Object.values(tex).forEach((t) => {
      if (!t) return;
      t.wrapS = t.wrapT = THREE.RepeatWrapping;
      t.repeat.set(1.2, 1.2);
      t.anisotropy = 4;
      t.needsUpdate = true;
    });

    return new THREE.MeshStandardMaterial({
      map: tex.map,
      normalMap: tex.normalMap,
      roughnessMap: tex.roughnessMap,
      roughness: 1,
      metalness: 0.05,
      side: THREE.FrontSide,
    });
  }, [tex]);

  return (
    <mesh
      geometry={geometry}
      material={material}
      position={position}
      rotation={rotation}
      scale={scale}
      frustumCulled={false}
    />
  );
}