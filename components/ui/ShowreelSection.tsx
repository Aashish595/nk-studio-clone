"use client";

import { useEffect, useRef, useState } from "react";

export default function ShowreelSection() {
  const ref = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const el = ref.current!;
    const vid = videoRef.current!;

    const io = new IntersectionObserver(
      async (entries) => {
        const e = entries[0];
        if (e.isIntersecting) {
          try {
            // autoplay (must be muted)
            vid.muted = true;
            await vid.play();
          } catch {}
        } else {
          vid.pause();
        }
      },
      { threshold: 0.45 }
    );

    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      id="showreel"
      className="min-h-screen flex items-center justify-center px-[56px] py-[120px]"
    >
      {/* This is your “cinematic frame” */}
      <div className="w-full max-w-[1200px] aspect-[16/9] rounded-[18px] overflow-hidden border border-white/10 bg-black/20 backdrop-blur-xl shadow-[0_30px_90px_rgba(0,0,0,0.55)] relative">
        {/* Replace src with your showreel */}
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          src="/showreel.mp4"
          playsInline
          muted
          loop
          onCanPlay={() => setReady(true)}
        />
        {/* Optional overlay label */}
        <div className="absolute top-5 left-6 text-[12px] tracking-[0.25em] text-white/70">
          SHOWREEL
        </div>

        {!ready && (
          <div className="absolute inset-0 flex items-center justify-center text-white/70">
            Loading…
          </div>
        )}
      </div>
    </section>
  );
}