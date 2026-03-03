"use client";

import { useEffect, useRef } from "react";
import { getGSAP } from "@/lib/gsap";

export default function BottomNav() {
  const navRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = navRef.current;
    if (!el) return;

    const { gsap, ScrollTrigger } = getGSAP();

    // optional: smoother transform rendering
    gsap.set(el, { willChange: "transform" });

    // compute how far it should travel (bottom position -> top bar area)
    const topTarget = 22;      // where you want it to end up from top
    const bottomOffset = 34;   // your current bottom offset
    const navHeight = el.getBoundingClientRect().height;

    const getY = () => {
      // current y is 0 at bottom; we move it up by this distance
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
        start: "top top",        // when hero starts
        end: "bottom top",       // until hero scrolls out
        scrub: 0.8,              // <-- THIS is what makes it feel smooth
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
        <a className="hover:text-white transition" href="#studio">Studio</a>
        <a className="hover:text-white transition" href="#work">Work</a>
        <a className="hover:text-white transition" href="#services">Services</a>
        <a className="hover:text-white transition" href="#news">News</a>
        <a className="hover:text-white transition" href="#contact">Contact</a>
      </div>
    </div>
  );
}