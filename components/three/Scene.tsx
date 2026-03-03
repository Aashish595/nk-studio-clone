// ./components/three/Scene.tsx
"use client";

import * as THREE from "three";
import React, { Suspense, useEffect, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  EffectComposer,
  Bloom,
  Vignette,
  Noise,
} from "@react-three/postprocessing";

import CameraRig from "./CameraRig";

import InnerShardOrbit from "../world/InnerShardOrbit";
import NeonObelisk from "../world/NeonObelisk";
import OrbitCrystalSet from "../world/OrbitCrystalSet";

import Pond from "../world/Pond";
import PondSparks from "../world/PondSparks";
import DepthDust from "../world/DepthDust";
import Aurora from "../world/Aurora";
import HillsTerrain from "../world/HillsTerrain";
import MountainsBackdrop from "../world/MountainsBackdrop";

function useSectionProgress(sectionId: string) {
  const progressRef = useRef(0);

  useEffect(() => {
    const el = document.getElementById(sectionId);
    if (!el) return;

    const onScroll = () => {
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;

      const start = vh * 0.85;
      const end = vh * 0.25;

      const p = (start - r.top) / (start - end);
      progressRef.current = THREE.MathUtils.clamp(p, 0, 1);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [sectionId]);

  return progressRef;
}

function FocusShift({
  focusRef,
  progressRef,
  rightX,
  leftX,
}: {
  focusRef: React.RefObject<THREE.Group>;
  progressRef: React.RefObject<number>;
  rightX: number;
  leftX: number;
}) {
  useFrame(() => {
    const g = focusRef.current;
    if (!g) return;

    const t = progressRef.current;
    const desiredX = THREE.MathUtils.lerp(rightX, leftX, t);
    g.position.x = THREE.MathUtils.lerp(g.position.x, desiredX, 0.08);
  });

  return null;
}

export default function Scene() {
  const terrainRef = useRef<THREE.Mesh>(null!);
  const focusRef = useRef<THREE.Group>(null!);
  const showreelProgress = useSectionProgress("showreel");

  const localCenter: [number, number, number] = [0, 0, -0.6];

  return (
    <Canvas
      // LOWER DPR (major blink fix)
      dpr={[1, 1.25]}
      gl={{
        antialias: true,
        powerPreference: "high-performance",
      }}
      camera={{ position: [0, 1.2, 8.5], fov: 42, near: 0.15, far: 220 }}
      onCreated={({ gl, scene }) => {
        gl.physicallyCorrectLights = true;
        gl.outputColorSpace = THREE.SRGBColorSpace;
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.05;
        scene.fog = new THREE.FogExp2("#03110f", 0.018);
      }}
      shadows
    >
      <color attach="background" args={["#020405"]} />

      <hemisphereLight args={["#2fffe0", "#00110c", 0.35]} />
      <ambientLight intensity={0.15} />

      <directionalLight
        position={[6, 8, 3]}
        intensity={1.15}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      <directionalLight
        position={[-10, 2, 10]}
        intensity={0.55}
        color={"#2fffe0"}
      />

      {/* NO BIG Suspense WRAPPER HERE */}
      <CameraRig />
      <Aurora />
      <DepthDust />

      <group position={[0, -0.6, 0]}>
  {/* terrain + mountains should NOT be inside Suspense */}
  <HillsTerrain terrainRef={terrainRef} />
  <MountainsBackdrop />

  {/* only things that load textures/async go in Suspense */}
  <Suspense fallback={null}>
    <Pond />
    <PondSparks origin={[-10, -0.38, 4]} />
  </Suspense>

  <group ref={focusRef} position={[0, 0, 0]}>
    <NeonObelisk terrainRef={terrainRef} position={[0, 0, -0.6]} height={3.6} width={0.55} depth={0.55} hover={0.28} />
    <OrbitCrystalSet center={localCenter} radius={3.2} speed={0.06} zOffset={-2.2} />
    <InnerShardOrbit center={localCenter} height={3.6} radius={0.16} count={34} speed={0.06} />
  </group>
</group>

      <EffectComposer multisampling={0}>
        {/*  Bloom without mipmapBlur (much lighter) */}
        <Bloom
          intensity={1.2}
          luminanceThreshold={0.5}
          luminanceSmoothing={0.85}
        />
        <Noise opacity={0.035} />
        <Vignette eskil={false} offset={0.12} darkness={0.9} />
      </EffectComposer>
    </Canvas>
  );
}
