"use client";

import * as THREE from "three";
import React, { useMemo, useRef, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";

// ✅ safer import style for three-stdlib
import { LineMaterial } from "three-stdlib";
import { LineSegments2 } from "three-stdlib";
import { LineSegmentsGeometry } from "three-stdlib";

type Props = {
  position?: [number, number, number];
  rotation?: [number, number, number];
  height?: number;
  width?: number;
  depth?: number;

  hover?: number;
  outlinePx?: number;

  // ✅ terrain snap ref
  terrainRef?: React.RefObject<THREE.Mesh>;
};

export default function NeonObelisk({
  position = [0, 0, -0.6],
  rotation = [0, 0.55, -0.18],
  height = 3.6,
  width = 0.55,
  depth = 0.55,
  hover = 0.28,
  outlinePx = 6,
  terrainRef,
}: Props) {
  const group = useRef<THREE.Group>(null!);
  const lineRef = useRef<LineSegments2>(null!);
  const glowRef = useRef<LineSegments2>(null!);

  const { size } = useThree();

  // ---------------- geometry ----------------
  const boxGeom = useMemo(
    () => new THREE.BoxGeometry(width, height, depth),
    [width, height, depth]
  );

  const lineGeom = useMemo(() => {
    const edges = new THREE.EdgesGeometry(boxGeom, 18);
    const pos = edges.attributes.position.array as Float32Array;

    const g = new LineSegmentsGeometry();
    g.setPositions(Array.from(pos));
    edges.dispose();
    return g;
  }, [boxGeom]);

  // ---------------- materials ----------------
  const lineMat = useMemo(() => {
    return new LineMaterial({
      color: new THREE.Color("#00ffd5"),
      transparent: true,
      opacity: 0.95,
      linewidth: outlinePx,
      depthTest: true,
      depthWrite: false,
    });
  }, [outlinePx]);

  const glowMat = useMemo(() => {
    return new LineMaterial({
      color: new THREE.Color("#00ffd5"),
      transparent: true,
      opacity: 0.35,
      linewidth: outlinePx * 2.0,
      depthTest: true,
      depthWrite: false,
    });
  }, [outlinePx]);

  //  LineMaterial needs resolution
  useEffect(() => {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = size.width * dpr;
    const h = size.height * dpr;
    lineMat.resolution.set(w, h);
    glowMat.resolution.set(w, h);
  }, [size.width, size.height, lineMat, glowMat]);

  // ---------------- raycast helpers ----------------
  const ray = useMemo(() => new THREE.Raycaster(), []);
  const down = useMemo(() => new THREE.Vector3(0, -1, 0), []);
  const origin = useMemo(() => new THREE.Vector3(), []);
  const localXZ = useMemo(() => new THREE.Vector3(), []);
  const worldXZ = useMemo(() => new THREE.Vector3(), []);
  const worldTarget = useMemo(() => new THREE.Vector3(), []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;

    // lock x/z in local space (inside your <group position={[0,-0.6,0]}>)
    group.current.position.x = position[0];
    group.current.position.z = position[2];

    const floatY = Math.sin(t * 0.8) * 0.06;

    const parent = group.current.parent; // ✅ the world group (-0.6)

    if (terrainRef?.current && parent) {
      // local -> world for accurate raycast
      localXZ.set(position[0], 0, position[2]);
      worldXZ.copy(localXZ);
      parent.localToWorld(worldXZ);

      // raycast down in world space
      origin.set(worldXZ.x, 80, worldXZ.z);
      ray.set(origin, down);

      const hit = ray.intersectObject(terrainRef.current, true)[0];
      if (hit) {
        const groundY = hit.point.y;
        const lift = height * 0.5 + hover;

        // desired world position
        worldTarget.set(worldXZ.x, groundY + lift, worldXZ.z);

        // world -> local (back into parent space)
        parent.worldToLocal(worldTarget);

        group.current.position.y = worldTarget.y + floatY;
      } else {
        // fallback if ray misses
        group.current.position.y = position[1] + floatY;
      }
    } else {
      // fallback if no terrainRef passed
      group.current.position.y = position[1] + floatY;
    }

    // neon breathe
    const pulse = 0.85 + 0.15 * Math.sin(t * 1.6);
    if (lineRef.current?.material)
      (lineRef.current.material as LineMaterial).opacity = 0.85 * pulse;
    if (glowRef.current?.material)
      (glowRef.current.material as LineMaterial).opacity = 0.30 * pulse;
  });

  return (
    <group ref={group} position={position} rotation={rotation}>
      {/* glass body */}
      <mesh geometry={boxGeom} renderOrder={1}>
        <meshPhysicalMaterial
          color={"#00ffd5"}
          transparent
          opacity={0.1}
          transmission={0.35}
          thickness={0.6}
          ior={1.2}
          roughness={0.12}
          metalness={0.0}
          emissive={"#00ffd5"}
          emissiveIntensity={0.65}
          depthWrite={false}
        />
      </mesh>

      {/* glow outline */}
      <primitive
        ref={glowRef}
        object={new LineSegments2(lineGeom, glowMat)}
        renderOrder={2}
      />

      {/* sharp outline */}
      <primitive
        ref={lineRef}
        object={new LineSegments2(lineGeom, lineMat)}
        renderOrder={3}
      />
    </group>
  );
}