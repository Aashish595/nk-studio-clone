"use client";

import { useEffect, useRef } from "react";
import { getGSAP } from "./gsap";

/**
 * Scroll-triggered reveal animation for section children.
 * Wrap children in elements with className matching `selector` (default ".reveal-item").
 * Animates from: opacity 0, y offset, blur → to: full visibility.
 */
export function useSectionReveal(
  selector = ".reveal-item",
  options?: {
    start?: string;
    yFrom?: number;
    stagger?: number;
    duration?: number;
    blur?: string;
  }
) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const { gsap } = getGSAP();

    const items = el.querySelectorAll(selector);
    if (items.length === 0) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        items,
        {
          y: options?.yFrom ?? 50,
          opacity: 0,
          scale: 0.97,
          filter: `blur(${options?.blur ?? "6px"})`,
        },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          filter: "blur(0px)",
          duration: options?.duration ?? 1,
          ease: "power3.out",
          stagger: options?.stagger ?? 0.12,
          scrollTrigger: {
            trigger: el,
            start: options?.start ?? "top 75%",
            once: true,
          },
        }
      );
    }, el);

    return () => ctx.revert();
  }, [selector, options]);

  return ref;
}
