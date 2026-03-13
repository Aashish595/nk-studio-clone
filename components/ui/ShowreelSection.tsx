"use client";

import { useEffect, useRef, useState } from "react";

export default function ShowreelSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    const video = videoRef.current;

    if (!section || !video) return;

    const observer = new IntersectionObserver(
      async ([entry]) => {
        if (!video) return;

        if (entry.isIntersecting) {
          setIsVisible(true);
          try {
            await video.play();
          } catch (err) {
            console.error("Autoplay failed:", err);
          }
        } else {
          setIsVisible(false);
          video.pause();
        }
      },
      {
        threshold: 0.45,
      }
    );

    observer.observe(section);

    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="solutions"
      ref={sectionRef}
      className="relative w-full px-5 md:px-8 lg:px-12 py-16 md:py-20"
    >
      <div
        className={`relative mx-auto w-full max-w-[1240px] transition-all duration-700 ease-out ${
          isVisible
            ? "opacity-100 translate-y-0 scale-100"
            : "opacity-0 translate-y-6 scale-[0.985]"
        }`}
      >
        {/* subtle ambient glow */}
        <div className="pointer-events-none absolute -inset-4 rounded-[30px] bg-[radial-gradient(circle_at_top,rgba(47,255,224,0.08),transparent_38%),radial-gradient(circle_at_bottom_right,rgba(0,170,255,0.06),transparent_30%)] blur-2xl" />

        {/* clean premium frame */}
        <div className="relative overflow-hidden rounded-[26px] border border-white/10 bg-black/30 shadow-[0_18px_70px_rgba(0,0,0,0.48)] backdrop-blur-xl">
          <div className="relative w-full bg-black">
            <video
              ref={videoRef}
              className="block w-full h-auto max-h-[62vh] object-cover"
              src="/showreel.mp4"
              muted
              playsInline
              preload="auto"
              loop
              controls={false}
            />

            {/* soft cinematic overlay */}
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_top,rgba(0,0,0,0.20),rgba(0,0,0,0.04),rgba(0,0,0,0.14))]" />

            {/* subtle inner border */}
            <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-white/10" />
          </div>
        </div>
      </div>
    </section>
  );
}