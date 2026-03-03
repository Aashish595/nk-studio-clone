"use client";

import { useEffect, useRef } from "react";
import { getGSAP } from "@/lib/gsap";

type IntroOverlayProps = {
  onDone: () => void;
  durationSec?: number;
};

export default function IntroOverlay({ onDone, durationSec = 3 }: IntroOverlayProps) {
  const wrap = useRef<HTMLDivElement>(null);
  const dot = useRef<HTMLDivElement>(null);
  const glow = useRef<HTMLDivElement>(null);
  const doneOnce = useRef(false);

  useEffect(() => {
    const { gsap } = getGSAP();

    gsap.killTweensOf([dot.current, glow.current, wrap.current]);

    const ctx = gsap.context(() => {
      // Smooth floating
      gsap.to(dot.current, {
        y: -8,
        duration: 2.6,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
      });

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

      // Intro timeline
      const tl = gsap.timeline({
        defaults: { ease: "sine.inOut" },
        onComplete: () => {
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

    return () => {
      ctx.revert();
    };
  }, [onDone, durationSec]);

  return (
    <div
      ref={wrap}
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black"
      style={{ pointerEvents: "all" }}
    >
      <div className="flex flex-col items-center gap-6">
        <div className="relative w-8 h-8">
          <div
            ref={glow}
            className="absolute inset-0 rounded-full blur-[16px]"
            style={{ background: "rgba(47,255,224,0.55)", transform: "scale(1.1)" }}
          />
          <div
            ref={dot}
            className="absolute left-1/2 top-1/2 w-[8px] h-[8px] -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{
              background: "rgb(47,255,224)",
              boxShadow: "0 0 22px rgba(47,255,224,0.85)",
            }}
          />
        </div>

        <div className="text-center">
          <p className="text-[22px] tracking-[0.12em] text-white/90 font-medium" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            <span className="gradient-text-static">FinSocial</span> Digital Systems
          </p>
          <p className="mt-2 text-[12px] tracking-[0.3em] uppercase text-white/40">
            Technology · Finance · Innovation
          </p>
        </div>
      </div>
    </div>
  );
}