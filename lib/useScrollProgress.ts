"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function useScrollProgress() {
  const progress = useRef(0);

  useEffect(() => {
    const st = ScrollTrigger.create({
      trigger: document.documentElement,     // ✅ better than document.body
      start: "top top",
      end: "bottom bottom",
      scrub: 1,
      onUpdate: (self) => {
        progress.current = self.progress; // 0..1
      },
    });

    return () => st.kill();
  }, []);

  return progress;
}