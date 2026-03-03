"use client";

export default function DropletIntroSection({ open }: { open: boolean }) {
  return (
    <section id="droplet-intro" className="relative min-h-screen pt-[140px] pb-[140px]">
      <div className="mx-auto max-w-[1600px] px-[56px]">
        <div className="grid grid-cols-12 gap-x-[26px]">
          <div className="col-span-6" />
          <div className="col-span-6">
            <div
              className={[
                "transition-all duration-700 ease-out",
                open ? "opacity-100 translate-y-0 blur-0" : "opacity-0 translate-y-6 blur-[6px]",
              ].join(" ")}
            >
              <div className="text-[11px] tracking-[0.18em] uppercase text-white/50">
                DIGITAL TRANSFORMATION
              </div>

              <h2 className="mt-[18px] text-white/95 font-light text-[64px] leading-[1.02] tracking-[-0.02em]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                A single idea
                <br />
                <span className="gradient-text-static">sparks innovation</span>
              </h2>

              <p className="mt-[22px] text-white/55 text-[14px] leading-[1.8] max-w-[560px]">
                Every breakthrough in financial technology begins with one bold concept.
                We transform that spark into scalable digital infrastructure
                that reshapes industries.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}