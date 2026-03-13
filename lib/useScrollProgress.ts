"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function useScrollProgress() {
  const progress = useRef(0);

  useEffect(() => {
    const st = ScrollTrigger.create({
      trigger: document.documentElement,    
      start: "top top",
      end: "bottom bottom",
      scrub: 1,
      onUpdate: (self) => {
        progress.current = self.progress; 
      },
    });

    return () => st.kill();
  }, []);

  return progress;
}