"use client";

import { useEffect, useRef } from "react";

export default function Cursor() {
  const ringRef = useRef<HTMLDivElement | null>(null);
  const dotRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let rx = 0; // ring x
    let ry = 0; // ring y
    let tx = 0; // target x
    let ty = 0; // target y

    // 🔥 Lower = more snake delay
    const ringEase = 0.02;
    const dotEase = 0.15;

    let dotX = 0;
    let dotY = 0;

    const maxInner = 8;

    const onMove = (e: PointerEvent) => {
      tx = e.clientX;
      ty = e.clientY;
    };

    let raf = 0;

    const animate = () => {
      // Snake trailing ring
      rx += (tx - rx) * ringEase;
      ry += (ty - ry) * ringEase;

      if (ringRef.current) {
        ringRef.current.style.transform =
          `translate3d(${rx}px, ${ry}px, 0) translate(-50%, -50%)`;
      }

      // Inner dot slight elastic movement
      const dx = tx - rx;
      const dy = ty - ry;

      dotX += (dx - dotX) * dotEase;
      dotY += (dy - dotY) * dotEase;

      dotX = Math.max(-maxInner, Math.min(maxInner, dotX));
      dotY = Math.max(-maxInner, Math.min(maxInner, dotY));

      if (dotRef.current) {
        dotRef.current.style.transform =
          `translate3d(${dotX}px, ${dotY}px, 0) translate(-50%, -50%)`;
      }

      raf = requestAnimationFrame(animate);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    raf = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      ref={ringRef}
      className="
        fixed top-0 left-0
        pointer-events-none
        z-[9999]
        w-12 h-12
        rounded-full
        bg-emerald-400/10
        backdrop-blur-xl
        shadow-[0_0_40px_rgba(16,185,129,0.25)]
      "
    >
      <div
        ref={dotRef}
        className="
          absolute left-1/2 top-1/2
          w-2 h-2
          rounded-full
          bg-emerald-400
          shadow-[0_0_20px_rgba(52,211,153,0.8)]
        "
      />
    </div>
  );
}