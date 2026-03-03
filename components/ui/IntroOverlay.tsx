"use client";

import { useEffect, useRef } from "react";
import { getGSAP } from "@/lib/gsap";

type IntroOverlayProps = {
  onDone: () => void;
  durationSec?: number; // optional (default 3)
};

export default function IntroOverlay({ onDone, durationSec = 3 }: IntroOverlayProps) {
  const wrap = useRef<HTMLDivElement>(null);
  const dot = useRef<HTMLDivElement>(null);
  const glow = useRef<HTMLDivElement>(null);
  const doneOnce = useRef(false);

  useEffect(() => {
    const { gsap } = getGSAP();

    // ✅ IMPORTANT: in React dev, effects may run twice (StrictMode)
    // Kill any previous animations on these elements to prevent "double speed"
    gsap.killTweensOf([dot.current, glow.current, wrap.current]);

    // Use GSAP context for safe cleanup
    const ctx = gsap.context(() => {
      // Smooth floating (slow)
      gsap.to(dot.current, {
        y: -8,
        duration: 2.6,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
      });

      // Tiny drift (even slower)
      gsap.to(dot.current, {
        x: 5,
        duration: 4.2,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
      });

      // Glow breathing
      gsap.to(glow.current, {
        scale: 1.45,
        opacity: 0.6,
        duration: 2.4,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
      });

      // Intro fade in -> hold -> fade out
      const tl = gsap.timeline({
        defaults: { ease: "sine.inOut" },
        onComplete: () => {
          // prevent double-calling in dev
          if (!doneOnce.current) {
            doneOnce.current = true;
            onDone();
          }
        },
      });

      tl.set(wrap.current, { autoAlpha: 0 })
        .to(wrap.current, { autoAlpha: 1, duration: 0.55 })
        .to(wrap.current, { autoAlpha: 1, duration: Math.max(0.5, durationSec - 1.2) })
        .to(wrap.current, { autoAlpha: 0, duration: 0.65 });
    });

    // ✅ cleanup MUST return void
    return () => {
      ctx.revert(); // kills timeline + tweens created in ctx
    };
  }, [onDone, durationSec]);

  return (
    <div
      ref={wrap}
      // ✅ FULL BLACK so nothing behind shows
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black"
      style={{ pointerEvents: "all" }} // blocks clicks behind
    >
      <div className="flex items-center gap-8">
        <div className="relative w-6 h-6">
          <div
            ref={glow}
            className="absolute inset-0 rounded-full blur-[12px]"
            style={{ background: "rgba(37,255,217,0.55)", transform: "scale(1.1)" }}
          />
          <div
            ref={dot}
            className="absolute left-1/2 top-1/2 w-[7px] h-[7px] -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{
              background: "rgb(37,255,217)",
              boxShadow: "0 0 18px rgba(37,255,217,0.85)",
            }}
          />
        </div>

        <p className="text-[18px] tracking-[0.08em] text-white/85">
          It all starts with a spark
        </p>
      </div>
    </div>
  );
}