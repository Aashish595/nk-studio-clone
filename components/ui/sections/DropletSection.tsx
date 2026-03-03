"use client";

export default function DropletSection() {
  return (
    <section id="droplets" className="relative min-h-screen pt-[140px] pb-[140px]">
      <div className="mx-auto max-w-[1600px] px-[56px]">
        <div className="grid grid-cols-12 gap-x-[26px]">
          <div className="col-span-6" />
          <div className="col-span-6">
            <div className="text-[11px] tracking-[0.18em] uppercase text-white/65">
              TRANSITION
            </div>

            <h2 className="mt-[18px] text-white/95 font-light text-[64px] leading-[1.02] tracking-[-0.02em]">
              Liquid droplets
              <br />
              shaping the void
            </h2>

            <p className="mt-[22px] text-white/65 text-[14px] leading-[1.8] max-w-[520px]">
              A short, controlled “water-droplet” layer to reset the mood before the next 3D phase.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}