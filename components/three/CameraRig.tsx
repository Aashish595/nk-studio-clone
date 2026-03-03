"use client";

import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useEffect, useRef } from "react";
import { useScrollProgress } from "@/lib/useScrollProgress";

export default function CameraRig() {
  const { camera, size } = useThree();
  const scrollP = useScrollProgress();

  // Mouse normalized (-1 to 1)
  const mouse = useRef({ x: 0, y: 0 });

  // Base resting camera position
  const basePosition = useRef(new THREE.Vector3(0, 1.2, 8.5));

  // Reusable vectors (avoid garbage each frame)
  const targetPosition = useRef(new THREE.Vector3());
  const lookTarget = useRef(new THREE.Vector3());

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / size.width) * 2 - 1;
      mouse.current.y = (e.clientY / size.height) * 2 - 1;
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, [size]);

  

  const focus = useRef(new THREE.Vector3(0, 0.65, -0.6)); // your localCenter-ish

  useFrame((_, dt) => {
    const s = scrollP.current;
    const mx = mouse.current.x;
    const my = mouse.current.y;

    const dollyZ = THREE.MathUtils.lerp(0, -4.2, s);
    const dollyY = THREE.MathUtils.lerp(0, -0.7, s);

    const scrollX = THREE.MathUtils.lerp(0, -2.2, s);

    const mouseX = mx * 1.8;
    const mouseY = -my * 0.6;

    targetPosition.current.set(
      basePosition.current.x + scrollX + mouseX,
      basePosition.current.y + dollyY + mouseY,
      basePosition.current.z + dollyZ,
    );

    const smooth = 1 - Math.pow(0.001, dt);
    camera.position.lerp(targetPosition.current, smooth);

    // ✅ Keep focus near the obelisk/crystals (small shift only)
    const focusZ = THREE.MathUtils.lerp(-0.6, -1.4, s);
    const focusY = THREE.MathUtils.lerp(0.65, 0.35, s);

    lookTarget.current.set(
      0 + mouseX * 0.12, // tiny parallax
      focusY + mouseY * 0.08,
      focusZ,
    );

    camera.lookAt(lookTarget.current);
  });

  return null;
}
