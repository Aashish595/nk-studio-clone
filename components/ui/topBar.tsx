"use client";

export default function TopBar() {
  return (
    <header className="fixed top-0 left-0 right-0 z-30 px-[56px] pt-[36px] flex items-start justify-between">
      <div className="flex items-center gap-10">
        <div className="text-[34px] font-semibold tracking-tight leading-none" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
          <span className="gradient-text-static">Fin</span>Social
        </div>

        <div className="hidden md:block text-[11px] tracking-[0.25em] opacity-60 mt-[10px] uppercase">
          Technology · Finance · Innovation
        </div>
      </div>

      <nav className="flex items-center gap-8 mt-[10px]">
        <a href="#solutions" className="text-[12px] tracking-[0.18em] opacity-70 hover:opacity-100 transition uppercase">Solutions</a>
        <a href="#studio" className="text-[12px] tracking-[0.18em] opacity-70 hover:opacity-100 transition uppercase">About</a>
        <a href="#contact" className="text-[12px] tracking-[0.18em] opacity-70 hover:opacity-100 transition uppercase">Contact</a>
      </nav>
    </header>
  );
}