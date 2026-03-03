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

// Tech-themed components
import TechGrid from "../world/TechGrid";
import FloatingNodes from "../world/FloatingNodes";
import HoloSphere from "../world/HoloSphere";
import DataParticles from "../world/DataParticles";
import DepthDust from "../world/DepthDust";

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
  const focusRef = useRef<THREE.Group>(null!);
  const showreelProgress = useSectionProgress("solutions");

  return (
    <Canvas
      dpr={[1, 1.25]}
      gl={{
        antialias: true,
        powerPreference: "high-performance",
      }}
      camera={{ position: [0, 1.8, 10], fov: 42, near: 0.15, far: 220 }}
      onCreated={({ gl, scene }) => {
        gl.outputColorSpace = THREE.SRGBColorSpace;
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.1;
        scene.fog = new THREE.FogExp2("#030810", 0.015);
      }}
    >
      <color attach="background" args={["#020408"]} />

      {/* Lighting — cool blue/cyan tech theme */}
      <hemisphereLight args={["#1a3a5c", "#000408", 0.4]} />
      <ambientLight intensity={0.12} />

      <directionalLight
        position={[6, 8, 3]}
        intensity={0.9}
        color={"#4488cc"}
      />
      <directionalLight
        position={[-10, 2, 10]}
        intensity={0.4}
        color={"#2fffe0"}
      />

      <CameraRig />

      {/* Tech background */}
      <TechGrid />
      <FloatingNodes />
      <DataParticles />
      <DepthDust />

      {/* Central focal object */}
      <group ref={focusRef} position={[0, 0, 0]}>
        <HoloSphere position={[0, 1.2, -1]} radius={1.6} />
      </group>

      <FocusShift
        focusRef={focusRef}
        progressRef={showreelProgress}
        rightX={0}
        leftX={-3}
      />

      <EffectComposer multisampling={0}>
        <Bloom
          intensity={1.4}
          luminanceThreshold={0.4}
          luminanceSmoothing={0.85}
        />
        <Noise opacity={0.03} />
        <Vignette eskil={false} offset={0.12} darkness={0.85} />
      </EffectComposer>
    </Canvas>
  );
}
