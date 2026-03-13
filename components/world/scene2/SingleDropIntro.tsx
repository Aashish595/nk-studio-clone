"use client";

import * as THREE from "three";
import React, { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";

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
  const haloRef = useRef<THREE.Mesh>(null!);
  const beamRef = useRef<THREE.Mesh>(null!);
  const particlesRef = useRef<THREE.Points>(null!);

  const started = useRef(false);
  const phase = useRef<"idle" | "fall" | "impact" | "done">("idle");
  const vy = useRef(0);
  const y = useRef(startY);
  const rt = useRef(0);

  const particleCount = 55;

  const particlePositions = useMemo(() => {
    const arr = new Float32Array(particleCount * 3);
    return arr;
  }, []);

  const particleVelocities = useMemo(() => {
    const arr = Array.from({ length: particleCount }, () => new THREE.Vector3());
    return arr;
  }, []);

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
      dropRef.current.scale.set(0.12, 0.18, 0.12);
    }

    if (ringRef.current) {
      ringRef.current.visible = false;
      ringRef.current.scale.setScalar(0.2);
      (ringRef.current.material as THREE.MeshBasicMaterial).opacity = 0;
    }

    if (haloRef.current) {
      haloRef.current.visible = false;
      haloRef.current.scale.setScalar(0.2);
      (haloRef.current.material as THREE.MeshBasicMaterial).opacity = 0;
    }

    if (beamRef.current) {
      beamRef.current.visible = false;
      beamRef.current.scale.set(1, 0.2, 1);
      (beamRef.current.material as THREE.MeshBasicMaterial).opacity = 0;
    }

    if (particlesRef.current) {
      particlesRef.current.visible = false;
    }
  }, [play, startY, x, z]);

  useFrame((state, dt) => {
    if (!play || !started.current) return;

    const t = state.clock.elapsedTime;

    if (phase.current === "fall") {
      vy.current += 26 * dt;
      y.current -= vy.current * dt;

      const wobX = Math.cos(t * 6.2) * 0.025;
      const wobZ = Math.sin(t * 5.7) * 0.025;

      if (dropRef.current) {
        dropRef.current.position.set(x + wobX, y.current, z + wobZ);
        dropRef.current.rotation.y += dt * 2.4;
      }

      if (y.current <= hitY) {
        phase.current = "impact";
        rt.current = 0;

        if (dropRef.current) dropRef.current.visible = false;

        if (ringRef.current) {
          ringRef.current.visible = true;
          ringRef.current.position.set(x, hitY + 0.015, z);
          ringRef.current.scale.setScalar(0.28);
          (ringRef.current.material as THREE.MeshBasicMaterial).opacity = 0.9;
        }

        if (haloRef.current) {
          haloRef.current.visible = true;
          haloRef.current.position.set(x, hitY + 0.03, z);
          haloRef.current.scale.setScalar(0.35);
          (haloRef.current.material as THREE.MeshBasicMaterial).opacity = 0.55;
        }

        if (beamRef.current) {
          beamRef.current.visible = true;
          beamRef.current.position.set(x, hitY + 0.4, z);
          beamRef.current.scale.set(1, 0.1, 1);
          (beamRef.current.material as THREE.MeshBasicMaterial).opacity = 0.85;
        }

        if (particlesRef.current) {
          const pos = particlesRef.current.geometry.getAttribute("position") as THREE.BufferAttribute;

          for (let i = 0; i < particleCount; i++) {
            pos.array[i * 3 + 0] = x;
            pos.array[i * 3 + 1] = hitY + 0.04;
            pos.array[i * 3 + 2] = z;

            const angle = (i / particleCount) * Math.PI * 2;
            const spread = 1 + Math.random() * 0.8;

            particleVelocities[i].set(
              Math.cos(angle) * spread,
              0.2 + Math.random() * 0.35,
              Math.sin(angle) * spread * 0.35
            );
          }

          pos.needsUpdate = true;
          particlesRef.current.visible = true;
        }
      }
    }

    if (phase.current === "impact") {
      rt.current += dt;

      const dur = 1.0;
      const p = Math.min(rt.current / dur, 1);
      const e = 1 - Math.pow(1 - p, 3);

      if (ringRef.current) {
        const s = THREE.MathUtils.lerp(0.35, 10.5, e);
        ringRef.current.scale.setScalar(s);
        (ringRef.current.material as THREE.MeshBasicMaterial).opacity = 0.9 * (1 - e);
      }

      if (haloRef.current) {
        const s = THREE.MathUtils.lerp(0.45, 3.8, e);
        haloRef.current.scale.setScalar(s);
        haloRef.current.position.y = hitY + 0.03 + e * 0.08;
        (haloRef.current.material as THREE.MeshBasicMaterial).opacity = 0.55 * (1 - e);
      }

      if (beamRef.current) {
        beamRef.current.scale.y = THREE.MathUtils.lerp(0.2, 5.2, e);
        beamRef.current.position.y = hitY + 0.15 + beamRef.current.scale.y * 0.22;
        (beamRef.current.material as THREE.MeshBasicMaterial).opacity = 0.85 * (1 - e * 1.2);
      }

      if (particlesRef.current) {
        const pos = particlesRef.current.geometry.getAttribute("position") as THREE.BufferAttribute;

        for (let i = 0; i < particleCount; i++) {
          pos.array[i * 3 + 0] += particleVelocities[i].x * dt;
          pos.array[i * 3 + 1] += particleVelocities[i].y * dt;
          pos.array[i * 3 + 2] += particleVelocities[i].z * dt;

          particleVelocities[i].multiplyScalar(0.985);
        }

        pos.needsUpdate = true;

        const mat = particlesRef.current.material as THREE.PointsMaterial;
        mat.opacity = 0.95 * (1 - e);
      }

      if (p >= 1) {
        phase.current = "done";

        if (ringRef.current) ringRef.current.visible = false;
        if (haloRef.current) haloRef.current.visible = false;
        if (beamRef.current) beamRef.current.visible = false;
        if (particlesRef.current) particlesRef.current.visible = false;

        onDone?.();
      }
    }
  });

  return (
    <group frustumCulled={false}>
      {/* falling packet / drop */}
      <mesh ref={dropRef} renderOrder={30}>
        <sphereGeometry args={[1, 20, 20]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.98}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          depthTest={false}
        />
      </mesh>

      {/* ground ring */}
      <mesh
        ref={ringRef}
        rotation={[-Math.PI / 2, 0, 0]}
        renderOrder={20}
        visible={false}
      >
        <ringGeometry args={[0.2, 0.28, 96]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          depthTest={false}
        />
      </mesh>

      {/* impact halo */}
      <mesh ref={haloRef} renderOrder={19} visible={false}>
        <sphereGeometry args={[0.35, 18, 18]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          depthTest={false}
          wireframe
        />
      </mesh>

      {/* vertical signal beam */}
      <mesh ref={beamRef} renderOrder={18} visible={false}>
        <cylinderGeometry args={[0.02, 0.02, 1, 12]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          depthTest={false}
        />
      </mesh>

      {/* impact particles */}
      <points ref={particlesRef} visible={false} renderOrder={21}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            array={particlePositions}
            count={particlePositions.length / 3}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          color={color}
          size={0.06}
          transparent
          opacity={0.95}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          depthTest={false}
        />
      </points>
    </group>
  );
}