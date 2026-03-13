"use client";

import * as THREE from "three";
import { Canvas } from "@react-three/fiber";
import {
  EffectComposer,
  Bloom,
  Noise,
  Vignette,
} from "@react-three/postprocessing";
import { Suspense } from "react";

import CameraRigScene2 from "./CameraRigScene2";
import StarBackdrop from "../world/scene2/StarBackdrop";
import GroundSpread from "../world/scene2/GroundSpread";
import StarStreaks from "../world/scene2/StarStreaks";
import SingleDropIntro from "../world/scene2/SingleDropIntro";
import TechDataCore from "../world/scene2/TechDataCore";

export default function Scene2Canvas({
  mode,
  onDropIntroDone,
  introColor = "#2fffe0",
}: {
  mode: "dropIntro" | "idle" | "warp";
  onDropIntroDone?: () => void;
  introColor?: string;
}) {
  const introOnly = mode === "dropIntro";

  return (
    <Canvas
      style={{
        position: "fixed",
        inset: 0,
        width: "100%",
        height: "100%",
        zIndex: 0,
      }}
      dpr={[1, 1.5]}
      gl={{
        antialias: true,
        powerPreference: "high-performance",
        alpha: true,
      }}
      camera={{ position: [1.65, 1.0, 9.6], fov: 44, near: 0.1, far: 220 }}
      onCreated={({ gl, scene }) => {
        gl.outputColorSpace = THREE.SRGBColorSpace;
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.02;
        scene.fog = new THREE.FogExp2("#020a09", 0.017);
      }}
    >
      <color attach="background" args={["#020405"]} />

      <ambientLight intensity={0.18} />
      <directionalLight position={[5, 8, 4]} intensity={0.8} />
      <directionalLight
        position={[-8, 2, 10]}
        intensity={0.22}
        color={"#2fffe0"}
      />

      <Suspense fallback={null}>
        <CameraRigScene2 />

        {/* show droplet first, scene later */}
        {introOnly ? (
          <SingleDropIntro
            play
            onDone={onDropIntroDone}
            x={-9.6}
            z={-1.8}
            color={introColor}
          />
        ) : (
          <>
            <StarBackdrop />
            <GroundSpread />
            {mode === "warp" && <StarStreaks />}
            <TechDataCore position={[-9.8, 0.55, -1.8]} scale={1.75} />
          </>
        )}
      </Suspense>

      <EffectComposer multisampling={0}>
        <Bloom
          intensity={1.15}
          luminanceThreshold={0.34}
          luminanceSmoothing={0.88}
          mipmapBlur
        />
        <Noise opacity={0.03} />
        <Vignette eskil={false} offset={0.12} darkness={0.88} />
      </EffectComposer>
    </Canvas>
  );
}