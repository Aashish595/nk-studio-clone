"use client";

export default function HeroSection({ enabled }: { enabled: boolean }) {
  return (
    <section id="hero" className="min-h-screen flex items-center px-[56px] pt-[120px]">
      <div className={`max-w-[900px] transition-opacity duration-700 ${enabled ? "opacity-100" : "opacity-0"}`}>
        <h1 className="font-light text-[72px] leading-[1.02] tracking-[-0.02em]">
          We empower
          <br />
          brands to
          <br />
          inspire people
        </h1>

        <div className="mt-[44px] flex items-center gap-6">
          <button className="text-[12px] tracking-[0.25em] uppercase opacity-80 hover:opacity-100 transition">
            EXPLORE OUR UNIVERSE
          </button>
          <span className="w-[44px] h-px bg-white/50" />
        </div>
      </div>
    </section>
  );
}