"use client";

import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useEffect, useRef } from "react";

export default function CameraRigScene2() {
  const { camera, size } = useThree();

  const mouse = useRef({ x: 0, y: 0 });

  // move camera closer here
  const basePosition = useRef(new THREE.Vector3(1.65, 1.0, 9.6));

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

  useEffect(() => {
    camera.fov = 38;
    camera.updateProjectionMatrix();
  }, [camera]);

  useFrame((_, dt) => {
    const mx = mouse.current.x;
    const my = mouse.current.y;

    const camOffsetX = mx * 0.32;
    const camOffsetY = -my * 0.16;

    targetPosition.current.set(
      basePosition.current.x + camOffsetX,
      basePosition.current.y + camOffsetY,
      basePosition.current.z
    );

    const smooth = 1 - Math.pow(0.001, dt);
    camera.position.lerp(targetPosition.current, smooth);

    lookTarget.current.set(
      -4.2 + mx * 0.12,
      0.55 + (-my * 0.06),
      -1.8
    );

    camera.lookAt(lookTarget.current);
  });

  return null;
}