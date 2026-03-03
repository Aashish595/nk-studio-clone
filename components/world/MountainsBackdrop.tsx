"use client";

import * as THREE from "three";
import React, { useMemo } from "react";

function makeRidge(width: number, height: number, segX: number, segY: number, amp: number) {
  const g = new THREE.PlaneGeometry(width, height, segX, segY);
  const pos = g.attributes.position as THREE.BufferAttribute;

  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const y = pos.getY(i);

    // peaks only on top portion
    const v = (y + height * 0.5) / height; // 0..1
    const topMask = THREE.MathUtils.smoothstep(v, 0.35, 1.0);

    const n =
      Math.sin(x * 0.045) * (amp * 1.0) +
      Math.sin(x * 0.11) * (amp * 0.65) +
      Math.sin(x * 0.21) * (amp * 0.30);

    pos.setY(i, y + topMask * (amp + n));
  }

  pos.needsUpdate = true;
  g.computeVertexNormals();
  g.computeBoundingSphere();

  // vertex colors: darker base, brighter peaks (alien green)
  const colors = new Float32Array(pos.count * 3);
  const cBase = new THREE.Color("#04110f");
  const cPeak = new THREE.Color("#0e3a31");

  for (let i = 0; i < pos.count; i++) {
    const yy = pos.getY(i);
    const t = THREE.MathUtils.clamp((yy + height * 0.35) / height, 0, 1);
    const col = cBase.clone().lerp(cPeak, t);

    colors[i * 3 + 0] = col.r;
    colors[i * 3 + 1] = col.g;
    colors[i * 3 + 2] = col.b;
  }

  g.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  return g;
}

export default function MountainsBackdrop() {
  const gNear = useMemo(() => makeRidge(240, 55, 420, 70, 9), []);
  const gMid  = useMemo(() => makeRidge(260, 65, 480, 80, 13), []);
  const gFar  = useMemo(() => makeRidge(280, 75, 520, 90, 17), []);

  //  MeshBasicMaterial = visible even in darkness
  const mNear = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        vertexColors: true,
        transparent: true,
        opacity: 0.95,
        fog: true,
        side: THREE.DoubleSide,
      }),
    []
  );
  const mMid = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        vertexColors: true,
        transparent: true,
        opacity: 0.70,
        fog: true,
        side: THREE.DoubleSide,
      }),
    []
  );
  const mFar = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        vertexColors: true,
        transparent: true,
        opacity: 0.45,
        fog: true,
        side: THREE.DoubleSide,
      }),
    []
  );

  return (
    <group frustumCulled={false}>
      {/* IMPORTANT: keep y LOW so camera can see it */}
      <mesh geometry={gNear} material={mNear} position={[0, 3.0, -28]} frustumCulled={false} />
      <mesh geometry={gMid}  material={mMid}  position={[0, 4.5, -40]} frustumCulled={false} />
      <mesh geometry={gFar}  material={mFar}  position={[0, 6.5, -56]} frustumCulled={false} />
    </group>
  );
}