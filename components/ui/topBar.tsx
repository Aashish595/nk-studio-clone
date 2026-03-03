"use client";

export default function TopBar() {
  return (
    <header className="fixed top-0 left-0 right-0 z-30 px-[56px] pt-[36px] flex items-start justify-between">
      <div className="flex items-center gap-10">
        <div className="text-[34px] font-medium tracking-tight leading-none">
          <span className="text-[#25ffd9]">/</span>nk
        </div>

        <div className="hidden md:block text-[12px] tracking-[0.25em] opacity-70 mt-[10px]">
          CREATIVITY POWERHOUSE
        </div>
      </div>

      <div className="text-[12px] tracking-[0.25em] opacity-80 mt-[10px]">
        ENG ▾
      </div>
    </header>
  );
}