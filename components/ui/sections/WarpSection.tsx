"use client";

import { useSectionReveal } from "@/lib/useSectionReveal";

export default function WarpSection() {
  const ref = useSectionReveal(".reveal-item", {
    yFrom: 40,
    stagger: 0.15,
    duration: 0.9,
    start: "top 70%",
  });

  return (
    <section id="warp" className="relative min-h-screen pt-[140px] pb-[140px]">
      <div ref={ref} className="mx-auto max-w-[1600px] px-[56px]">
        <div className="grid grid-cols-12 gap-x-[26px]">
          <div className="col-span-5" />
          <div className="col-span-7">
            <div className="reveal-item text-[11px] tracking-[0.18em] uppercase text-white/50">
              NEXT ERA
            </div>

            <h2 className="reveal-item mt-[18px] text-white/95 font-light text-[64px] leading-[1.02] tracking-[-0.02em]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              Accelerating into
              <br />
              <span className="gradient-text">the future of finance</span>
            </h2>

            <p className="reveal-item mt-[22px] text-white/55 text-[14px] leading-[1.8] max-w-[560px]">
              Hyper-speed innovation meets enterprise reliability. Our systems 
              process millions of transactions in real-time, powered by 
              cutting-edge AI and distributed cloud architecture.
            </p>

            <div className="reveal-item mt-[36px] flex items-center gap-[32px]">
              <div>
                <div className="text-[28px] font-semibold gradient-text-static" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  &lt;50ms
                </div>
                <div className="text-[11px] tracking-[0.18em] uppercase text-white/40 mt-1">
                  Avg. Latency
                </div>
              </div>
              <div className="h-[32px] w-px bg-white/10" />
              <div>
                <div className="text-[28px] font-semibold gradient-text-static" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  24/7
                </div>
                <div className="text-[11px] tracking-[0.18em] uppercase text-white/40 mt-1">
                  Global Operations
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}