"use client";

import { useEffect, useRef } from "react";
import { getGSAP } from "@/lib/gsap";

export default function BottomNav() {
  const navRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = navRef.current;
    if (!el) return;

    const { gsap, ScrollTrigger } = getGSAP();

    gsap.set(el, { willChange: "transform" });

    const topTarget = 22;
    const bottomOffset = 34;
    const navHeight = el.getBoundingClientRect().height;

    const getY = () => {
      const distance =
        window.innerHeight - bottomOffset - navHeight - topTarget;
      return -Math.max(0, distance);
    };

    const tween = gsap.to(el, {
      y: getY,
      scale: 0.98,
      ease: "none",
      scrollTrigger: {
        trigger: "#hero",
        start: "top top",
        end: "bottom top",
        scrub: 0.8,
        invalidateOnRefresh: true,
      },
    });

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, []);

  return (
    <div ref={navRef} className="fixed left-1/2 bottom-[34px] -translate-x-1/2 z-30">
      <div
        className="
          flex items-center gap-[46px] px-[44px] h-[56px]
          rounded-[18px]
          border border-white/10
          bg-black/35 backdrop-blur-xl
          shadow-[0_20px_60px_rgba(0,0,0,0.5)]
          text-[14px] text-white/80
        "
      >
        <a className="hover:text-white transition" href="#solutions">Solutions</a>
        <a className="hover:text-white transition" href="#studio">Technology</a>
        <a className="hover:text-white transition" href="#droplet-intro">About</a>
        <a className="hover:text-white transition" href="#warp">Insights</a>
        <a className="hover:text-white transition" href="#contact">Contact</a>
      </div>
    </div>
  );
}