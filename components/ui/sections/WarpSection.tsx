"use client";

export default function WarpSection() {
  return (
    <section id="warp" className="relative min-h-screen pt-[140px] pb-[140px]">
      <div className="mx-auto max-w-[1600px] px-[56px]">
        <div className="grid grid-cols-12 gap-x-[26px]">
          <div className="col-span-5" />
          <div className="col-span-7">
            <div className="text-[11px] tracking-[0.18em] uppercase text-white/65">
              NEXT PHASE
            </div>

            <h2 className="mt-[18px] text-white/95 font-light text-[64px] leading-[1.02] tracking-[-0.02em]">
              Warp into
              <br />
              depth
            </h2>

            <p className="mt-[22px] text-white/65 text-[14px] leading-[1.8] max-w-[560px]">
              Short star streaks come from depth toward the screen. Obelisk stays centered.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}