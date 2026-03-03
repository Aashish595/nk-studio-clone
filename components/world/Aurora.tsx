"use client";

import * as THREE from "three";
import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";

export default function Aurora() {
  const matRef = useRef<THREE.ShaderMaterial>(null!);

  const geom = useMemo(() => new THREE.PlaneGeometry(120, 50, 1, 1), []);

  const mat = useMemo(() => {
    return new THREE.ShaderMaterial({
      transparent: true,
      depthTest: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: {
        uTime: { value: 0 },
        uOpacity: { value: 0.22 },
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec2 vUv;
        uniform float uTime;
        uniform float uOpacity;

        float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
        float noise(vec2 p){
          vec2 i = floor(p);
          vec2 f = fract(p);
          float a = hash(i);
          float b = hash(i + vec2(1.0, 0.0));
          float c = hash(i + vec2(0.0, 1.0));
          float d = hash(i + vec2(1.0, 1.0));
          vec2 u = f*f*(3.0-2.0*f);
          return mix(a, b, u.x) + (c - a)*u.y*(1.0-u.x) + (d - b)*u.x*u.y;
        }

        void main() {
          // move waves slowly
          vec2 uv = vUv;
          float edgeX = smoothstep(0.02, 0.20, uv.x) * (1.0 - smoothstep(0.80, 0.98, uv.x));
          float edgeY = smoothstep(0.02, 0.20, uv.y) * (1.0 - smoothstep(0.80, 0.98, uv.y));
          float edge = edgeX * edgeY;
          float t = uTime * 0.08;

          // aurora bands
          float n = noise(vec2(uv.x * 2.5, uv.y * 1.2 + t));
          float bands = smoothstep(0.45, 0.75, n);

          // vertical softness
          float falloff = smoothstep(0.0, 0.35, uv.y) * (1.0 - smoothstep(0.65, 1.0, uv.y));

          // color (green-teal)
          vec3 col = vec3(0.15, 1.0, 0.78) * bands * falloff;

          // extra wisps
          float w = noise(vec2(uv.x * 6.0 + t, uv.y * 2.0));
          col += vec3(0.05, 0.55, 0.45) * smoothstep(0.55, 0.8, w) * falloff * 0.6;

          float a = uOpacity * bands * falloff;
          gl_FragColor = vec4(col, a);
        }
      `,
    });
  }, []);

  useFrame((_, dt) => {
    if (matRef.current) matRef.current.uniforms.uTime.value += dt;
  });

  return (
    <mesh
      geometry={geom}
      position={[0, 24, -140]}
      rotation={[0.18, 0, 0]}
      frustumCulled={false}
      renderOrder={-10}
    >
      <primitive ref={matRef} object={mat} attach="material" />
    </mesh>
  );
}
