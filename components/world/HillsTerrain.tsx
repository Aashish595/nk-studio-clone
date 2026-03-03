"use client";

import * as THREE from "three";
import React, { useEffect, useMemo } from "react";
import { useLoader } from "@react-three/fiber";

type Props = {
  terrainRef?: React.RefObject<THREE.Mesh>;
};

type PondDef = { x: number; z: number; r: number; depth: number };

//  put your real filenames here (match exactly)
const GROUND_TEX = [
  "/textures/terrain/ground/albedo.jpg",
  "/textures/terrain/ground/normal.jpg",
  "/textures/terrain/ground/roughness.jpg",
  "/textures/terrain/ground/ao.jpg",
] as const;

// optional preload
useLoader.preload(THREE.TextureLoader, [...GROUND_TEX]);

function setupTex(t: THREE.Texture, repeatX: number, repeatY: number, isColor = false) {
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(repeatX, repeatY);
  t.anisotropy = 4;
  t.magFilter = THREE.LinearFilter;
  t.minFilter = THREE.LinearMipmapLinearFilter;
  t.generateMipmaps = true;
  if (isColor) t.colorSpace = THREE.SRGBColorSpace;
  t.needsUpdate = true;
}

export default function HillsTerrain({ terrainRef }: Props) {
  // ✅ THREE is now defined because we imported it above
  const [albedo, normal, roughness, ao] = useLoader(THREE.TextureLoader, [...GROUND_TEX]);

  useEffect(() => {
    setupTex(albedo, 10, 10, true);
    setupTex(normal, 10, 10);
    setupTex(roughness, 10, 10);
    setupTex(ao, 10, 10);
  }, [albedo, normal, roughness, ao]);

  const geom = useMemo(() => {
    const W = 140;
    const D = 160;
    const segW = 260;
    const segD = 320;

    const g = new THREE.PlaneGeometry(W, D, segW, segD);
    g.rotateX(-Math.PI / 2);

    const pos = g.attributes.position as THREE.BufferAttribute;

    const ponds: PondDef[] = [
      { x: -18, z: 10, r: 13, depth: 1.6 },
      { x: 12, z: -6, r: 10, depth: 1.6 },
      { x: 26, z: 22, r: 8, depth: 1.6 },
    ];

    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const z = pos.getZ(i);

      // rolling hills
      let h =
        Math.sin(x * 0.035) * 1.2 +
        Math.sin(z * 0.04) * 1.0 +
        Math.sin((x + z) * 0.02) * 0.9;

      // calm center
      const centerFade = 1.0 - THREE.MathUtils.smoothstep(Math.hypot(x, z), 12, 55);
      h *= 0.55 + centerFade * 0.15;

      // carve ponds
      for (const p of ponds) {
        const d = Math.hypot(x - p.x, z - p.z);
        const t = THREE.MathUtils.clamp(1 - d / p.r, 0, 1);
        const smooth = t * t * (3 - 2 * t);
        h -= smooth * p.depth;
      }

      pos.setY(i, h);
    }

    // ✅ uv2 for AO map
    const uv = g.attributes.uv as THREE.BufferAttribute;
    g.setAttribute("uv2", new THREE.BufferAttribute((uv.array as Float32Array).slice(), 2));

    pos.needsUpdate = true;
    g.computeVertexNormals();
    g.computeBoundingSphere();
    return g;
  }, []);

  const mat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        map: albedo,
        normalMap: normal,
        roughnessMap: roughness,
        aoMap: ao,

        roughness: 1.0,
        metalness: 0.0,

        aoMapIntensity: 1.0,
        normalScale: new THREE.Vector2(0.9, 0.9),

        // slight alien tint
        color: new THREE.Color("#0b2a24"),
        emissive: new THREE.Color("#04110f"),
        emissiveIntensity: 0.22,

        fog: true,
      }),
    [albedo, normal, roughness, ao]
  );

  return (
    <mesh
      ref={terrainRef}
      geometry={geom}
      material={mat}
      receiveShadow
      frustumCulled={false}
    />
  );
}