"use client";

import { useEffect, useRef } from "react";
import { getGSAP } from "@/lib/gsap";

export default function HeroSection({ enabled }: { enabled: boolean }) {
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!enabled) return;
    const el = wrapRef.current;
    if (!el) return;

    const { gsap } = getGSAP();

    const ctx = gsap.context(() => {
      // Animate headline words
      gsap.fromTo(
        ".hero-word",
        { y: 60, opacity: 0, filter: "blur(8px)" },
        {
          y: 0,
          opacity: 1,
          filter: "blur(0px)",
          duration: 1,
          ease: "power3.out",
          stagger: 0.08,
          delay: 0.2,
        }
      );

      // Subtitle
      gsap.fromTo(
        ".hero-subtitle",
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.9, ease: "power3.out", delay: 0.8 }
      );

      // CTA
      gsap.fromTo(
        ".hero-cta",
        { y: 20, opacity: 0, scale: 0.95 },
        { y: 0, opacity: 1, scale: 1, duration: 0.7, ease: "power3.out", delay: 1.1 }
      );

      // Stats
      gsap.fromTo(
        ".hero-stat",
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: "power3.out", stagger: 0.1, delay: 1.3 }
      );
    }, el);

    return () => ctx.revert();
  }, [enabled]);

  const words = ["Where", "Technology", "Meets", "Finance"];

  return (
    <section id="hero" className="min-h-screen flex items-center px-[56px] pt-[120px]">
      <div
        ref={wrapRef}
        className={`max-w-[960px] transition-opacity duration-700 ${enabled ? "opacity-100" : "opacity-0"}`}
      >
        {/* Main headline */}
        <h1 className="font-light text-[72px] leading-[1.02] tracking-[-0.02em]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
          <span className="overflow-hidden inline-block">
            {words.map((word, i) => (
              <span
                key={i}
                className={`hero-word inline-block mr-[18px] ${word === "Technology" || word === "Finance" ? "gradient-text" : ""}`}
                style={{ opacity: 0 }}
              >
                {word}
              </span>
            ))}
          </span>
          <br />
          <span className="hero-word inline-block text-white/70 text-[42px] font-light mt-2" style={{ opacity: 0 }}>
            Building the Future of Digital Systems
          </span>
        </h1>

        {/* Subtitle */}
        <p className="hero-subtitle mt-[28px] text-white/55 text-[16px] leading-[1.75] max-w-[620px]" style={{ opacity: 0 }}>
          AI-powered fintech solutions that bridge intelligent automation,
          blockchain infrastructure, and next-gen digital payments — transforming
          how the world interacts with finance.
        </p>

        {/* CTA */}
        <div className="hero-cta mt-[40px]" style={{ opacity: 0 }}>
          <button className="cta-btn">
            <span className="relative z-10">Discover Our Solutions</span>
            <span className="relative z-10 w-[24px] h-px bg-white/50" />
          </button>
        </div>

        {/* Quick stats */}
        <div className="mt-[56px] flex items-center gap-[56px]">
          {[
            { value: "50+", label: "Team Members" },
            { value: "10M+", label: "Transactions Processed" },
            { value: "99.9%", label: "Uptime" },
          ].map((stat, i) => (
            <div key={i} className="hero-stat" style={{ opacity: 0 }}>
              <div className="text-[28px] font-semibold gradient-text-static" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                {stat.value}
              </div>
              <div className="text-[11px] tracking-[0.18em] uppercase text-white/45 mt-1">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}