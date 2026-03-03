"use client";

import * as THREE from "three";
import { Canvas } from "@react-three/fiber";
import { EffectComposer, Bloom, Noise, Vignette } from "@react-three/postprocessing";
import { Suspense } from "react";

import CameraRig from "./CameraRig";
import NeonObelisk from "../world/NeonObelisk";

import StarBackdrop from "../world/scene2/StarBackdrop";
import GroundSpread from "../world/scene2/GroundSpread";
import StarStreaks from "../world/scene2/StarStreaks";
import SingleDropIntro from "../world/scene2/SingleDropIntro";

export default function Scene2Canvas({
  mode,
  onDropIntroDone,
  introColor = "#2fffe0",
}: {
  mode: "dropIntro" | "idle" | "warp";
  onDropIntroDone?: () => void;
  introColor?: string;
}) {
  return (
    <Canvas
      style={{ position: "fixed", inset: 0, width: "100%", height: "100%", zIndex: 0 }}
      dpr={[1, 1.6]}
      gl={{ antialias: true, powerPreference: "high-performance", physicallyCorrectLights: true }}
      camera={{ position: [0, 1.1, 7.6], fov: 42, near: 0.1, far: 220 }}
      onCreated={({ gl, scene }) => {
        gl.outputColorSpace = THREE.SRGBColorSpace;
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.05;
        scene.fog = new THREE.FogExp2("#020a09", 0.02);
      }}
    >
      <color attach="background" args={["#020405"]} />

      <ambientLight intensity={0.2} />
      <directionalLight position={[5, 8, 4]} intensity={0.9} />
      <directionalLight position={[-8, 2, 10]} intensity={0.25} color={"#2fffe0"} />

      <Suspense fallback={null}>
        <CameraRig />

        {/* base layers */}
        <StarBackdrop />
        <GroundSpread />

        {/* single droplet intro */}
        {mode === "dropIntro" && (
          <SingleDropIntro
            play
            onDone={onDropIntroDone}
            x={0}
            z={-0.6}
            color={introColor} //  white/teal
          />
        )}

        {/* warp */}
        {mode === "warp" && <StarStreaks />}

        <group position={[0, -0.1, 0]}>
          <NeonObelisk position={[0, 0, -0.6]} height={3.6} width={0.55} depth={0.55} hover={0.2} />
        </group>
      </Suspense>

      <EffectComposer multisampling={0}>
        <Bloom intensity={1.45} luminanceThreshold={0.35} luminanceSmoothing={0.85} mipmapBlur />
        <Noise opacity={0.04} />
        <Vignette eskil={false} offset={0.12} darkness={0.9} />
      </EffectComposer>
    </Canvas>
  );
}