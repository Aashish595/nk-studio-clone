"use client";

import * as THREE from "three";
import React, { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";

export default function SingleDropIntro({
  play,
  onDone,
  x = 0,
  z = -0.6,
  startY = 7,
  hitY = -1.15,
  color = "#2fffe0",
}: {
  play: boolean;
  onDone?: () => void;
  x?: number;
  z?: number;
  startY?: number;
  hitY?: number;
  color?: string;
}) {
  const dropRef = useRef<THREE.Mesh>(null!);
  const ringRef = useRef<THREE.Mesh>(null!);
  const splashRef = useRef<THREE.Mesh>(null!);

  const started = useRef(false);
  const phase = useRef<"idle" | "fall" | "ripple" | "done">("idle");
  const vy = useRef(0);
  const y = useRef(startY);
  const rt = useRef(0);

  const { camera } = useThree();
  const vDir = useMemo(() => new THREE.Vector3(), []);

  // ---------- Water shader material for fullscreen splash ----------
  const splashMat = useMemo(() => {
    const c = new THREE.Color(color);
    const mat = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      depthTest: false,
      blending: THREE.NormalBlending, //  water feel (not neon). For neon use AdditiveBlending.
      uniforms: {
        uTime: { value: 0 },
        uAlpha: { value: 0 },
        uColor: { value: new THREE.Vector3(c.r, c.g, c.b) },
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
        }
      `,
      fragmentShader: `
        precision highp float;
        varying vec2 vUv;
        uniform float uTime;
        uniform float uAlpha;
        uniform vec3 uColor;

        float hash(vec2 p){
          p = fract(p * vec2(123.34, 456.21));
          p += dot(p, p + 45.32);
          return fract(p.x * p.y);
        }

        void main() {
          // center space
          vec2 p = vUv - 0.5;
          float r = length(p);

          // soft circular mask
          float mask = smoothstep(0.62, 0.0, r);

          // distortion (water wobble)
          float n = hash(p + uTime * 0.08);
          p += 0.012 * vec2(
            sin(uTime * 1.7 + p.y * 14.0 + n * 6.0),
            cos(uTime * 1.4 + p.x * 14.0 + n * 6.0)
          );

          float r2 = length(p);

          // ripple rings expanding
          float waves = sin((r2 * 38.0 - uTime * 18.0) * 6.28318);
          float ripple = pow(0.5 + 0.5 * waves, 2.2);

          // highlights near rings
          float edge = smoothstep(0.0, 0.015, abs(waves));

          // final alpha
          float a = uAlpha * mask * (0.25 + 0.75 * ripple) * (1.0 - 0.35 * edge);

          // water-ish tint + slight white highlight
          vec3 col = mix(vec3(1.0), uColor, 0.72);

          gl_FragColor = vec4(col, a);
        }
      `,
    });
    return mat;
    // recreate when color changes
  }, [color]);

  // update shader color if prop changes (without recreating plane)
  useEffect(() => {
    const c = new THREE.Color(color);
    splashMat.uniforms.uColor.value.set(c.r, c.g, c.b);
  }, [color, splashMat]);

  // ---------- reset on play ----------
  useEffect(() => {
    if (!play) return;

    started.current = true;
    phase.current = "fall";
    vy.current = 0;
    y.current = startY;
    rt.current = 0;

    if (dropRef.current) {
      dropRef.current.visible = true;
      dropRef.current.position.set(x, startY, z);
      dropRef.current.scale.setScalar(0.16);
    }

    if (ringRef.current) {
      ringRef.current.visible = false;
      ringRef.current.scale.setScalar(0.2);
      (ringRef.current.material as THREE.MeshBasicMaterial).opacity = 0;
    }

    if (splashRef.current) {
      splashRef.current.visible = false;
      splashRef.current.scale.setScalar(0.2);
      splashMat.uniforms.uAlpha.value = 0;
    }
  }, [play, startY, x, z, splashMat]);

  useFrame((state, dt) => {
    if (!play || !started.current) return;

    const t = state.clock.elapsedTime;
    splashMat.uniforms.uTime.value = t;

    // keep fullscreen plane in front of camera
    if (splashRef.current) {
      camera.getWorldDirection(vDir);
      splashRef.current.position.copy(camera.position).add(vDir.multiplyScalar(0.85));
      splashRef.current.quaternion.copy(camera.quaternion);
    }

    if (phase.current === "fall") {
      vy.current += 26 * dt;
      y.current -= vy.current * dt;

      const wobX = Math.cos(t * 6.5) * 0.03;
      const wobZ = Math.sin(t * 5.8) * 0.03;

      if (dropRef.current) {
        dropRef.current.position.set(x + wobX, y.current, z + wobZ);
        dropRef.current.rotation.y += dt * 2.2;
      }

      if (y.current <= hitY) {
        phase.current = "ripple";
        rt.current = 0;

        if (dropRef.current) dropRef.current.visible = false;

        if (ringRef.current) {
          ringRef.current.visible = true;
          ringRef.current.position.set(x, hitY + 0.02, z);
          ringRef.current.scale.setScalar(0.3);
          (ringRef.current.material as THREE.MeshBasicMaterial).opacity = 0.7;
        }

        if (splashRef.current) {
          splashRef.current.visible = true;
          splashRef.current.scale.setScalar(0.2);
          splashMat.uniforms.uAlpha.value = 0.65; // strong start
        }
      }
    }

    if (phase.current === "ripple") {
      rt.current += dt;

      const dur = 1.15;
      const p = Math.min(rt.current / dur, 1);
      const e = 1 - Math.pow(1 - p, 3);

      // ring on the ground
      if (ringRef.current) {
        const s = THREE.MathUtils.lerp(0.3, 7.2, e);
        ringRef.current.scale.setScalar(s);
        const mat = ringRef.current.material as THREE.MeshBasicMaterial;
        mat.opacity = 0.7 * (1 - e);
      }

      // fullscreen water wash
      if (splashRef.current) {
        const s = THREE.MathUtils.lerp(0.2, 4.2, e);
        splashRef.current.scale.setScalar(s);

        // fade out quicker like splash
        splashMat.uniforms.uAlpha.value = 0.65 * (1 - Math.min(1, e * 1.35));
      }

      if (p >= 1) {
        phase.current = "done";
        if (ringRef.current) ringRef.current.visible = false;
        if (splashRef.current) splashRef.current.visible = false;
        splashMat.uniforms.uAlpha.value = 0;
        onDone?.();
      }
    }
  });

  return (
    <group frustumCulled={false}>
      {/* droplet */}
      <mesh ref={dropRef} frustumCulled={false} renderOrder={30}>
        <sphereGeometry args={[1, 26, 26]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.98}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          depthTest={false}
        />
      </mesh>

      {/* ripple ring */}
      <mesh ref={ringRef} rotation={[-Math.PI / 2, 0, 0]} frustumCulled={false} renderOrder={20} visible={false}>
        <ringGeometry args={[0.22, 0.28, 110]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          depthTest={false}
        />
      </mesh>

      {/* fullscreen splash plane (shader) */}
      <mesh ref={splashRef} frustumCulled={false} renderOrder={999} visible={false}>
        <planeGeometry args={[1, 1]} />
        <primitive object={splashMat} attach="material" />
      </mesh>
    </group>
  );
}