"use client";

import { useEffect, useRef } from "react";
import { getGSAP } from "@/lib/gsap";

type MilestoneCard = {
  month: string;
  title: string;
  desc: string;
  align?: "left" | "center";
  h?: string;
  className?: string;
};

function Milestone({
  month,
  title,
  desc,
  align = "left",
  h = "h-[210px]",
  className = "",
}: MilestoneCard) {
  const alignCls =
    align === "center" ? "items-center text-center" : "items-start text-left";

  return (
    <div
      className={[
        "ss-card group relative isolate z-30 w-full",
        h,
        "rounded-[18px]",
        "bg-white/5 supports-[backdrop-filter]:bg-black/40",
        "backdrop-blur-2xl",
        "border border-white/14",
        "shadow-[0_24px_70px_rgba(0,0,0,0.65)]",
        "overflow-hidden",
        "transition-transform duration-300 ease-out",
        "hover:-translate-y-[6px]",
        className,
      ].join(" ")}
    >
      {/* glass sheen */}
      <div className="pointer-events-none absolute inset-0 opacity-70 bg-[linear-gradient(135deg,rgba(255,255,255,0.10),transparent_38%,rgba(0,255,200,0.06))]" />
      {/* inner ring */}
      <div className="pointer-events-none absolute inset-0 rounded-[18px] ring-1 ring-white/10" />
      {/* hover glow */}
      <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-[radial-gradient(600px_circle_at_30%_15%,rgba(0,255,200,0.18),transparent_55%)]" />
      {/* top hairline */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-white/12" />

      <div
        className={[
          "relative h-full p-[26px] flex flex-col justify-between",
          alignCls,
        ].join(" ")}
      >
        <div className="flex items-center gap-3">
          <span className="h-[8px] w-[8px] rounded-full bg-emerald-300/90 shadow-[0_0_18px_rgba(0,255,200,0.55)]" />
          <div className="text-white/85 text-[12px] tracking-[0.18em] uppercase">
            {month}
          </div>
        </div>

        <div className="max-w-[96%]">
          <div className="text-white/92 font-light text-[22px] leading-[1.2] tracking-[-0.01em]">
            {title}
          </div>
          <div className="mt-2 text-white/55 text-[12px] leading-[1.55]">
            {desc}
          </div>
        </div>

        <div className="flex items-center gap-2 text-white/40 text-[11px]">
          <span className="inline-block h-[1px] w-[24px] bg-white/18" />
          <span>Milestone</span>
        </div>
      </div>
    </div>
  );
}

export default function StudioStatsSection() {
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;

    const { gsap } = getGSAP();

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".ss-copy",
        { y: 18, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.9,
          ease: "power3.out",
          stagger: 0.08,
          scrollTrigger: { trigger: el, start: "top 70%", once: true },
        }
      );

      gsap.fromTo(
        ".ss-card",
        { y: 40, opacity: 0, scale: 0.96, filter: "blur(6px)" },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          filter: "blur(0px)",
          duration: 0.9,
          ease: "power3.out",
          stagger: 0.10,
          scrollTrigger: { trigger: el, start: "top 70%", once: true },
        }
      );
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="studio"
      className="relative z-30 min-h-screen pt-[120px] pb-[140px]"
    >
      <div ref={wrapRef} className="mx-auto max-w-[1600px] px-[56px]">
        {/* ===== 2 DIV LAYOUT (LEFT EMPTY, RIGHT CONTENT) ===== */}
        <div className="grid grid-cols-12 gap-x-[26px]">
          {/* LEFT EMPTY SPACE FOR 3D */}
          <div className="col-span-5" />

          {/* RIGHT SIDE CONTENT */}
          <div className="col-span-7">
            {/* TOP COPY */}
            <h2 className="ss-copy text-white/95 font-light text-[64px] leading-[1.02] tracking-[-0.02em]">
              We create experiences that
              <br />
              ignite passion by reimagining
              <br />
              what&apos;s possible
            </h2>

            <div className="ss-copy mt-[26px] grid grid-cols-12 gap-x-[18px] items-start">
              <div className="col-span-5">
                <div className="flex items-start gap-[12px]">
                  <span className="mt-[7px] h-[6px] w-[6px] rounded-full bg-emerald-300/90 shadow-[0_0_18px_rgba(0,255,200,0.5)]" />
                  <div className="text-[11px] tracking-[0.18em] uppercase text-white/70 leading-[1.6]">
                    FROM RESEARCH TO REAL-WORLD IMPACT
                    <br />
                    ACROSS US &amp; INDIA.
                  </div>
                </div>
              </div>

              <div className="col-span-7">
                <p className="text-white/70 text-[14px] leading-[1.75]">
                  A focused timeline of how we built Hind AI—starting with
                  advanced generative AI research, growing a world-class team,
                  and launching into intelligent automation &amp; creative
                  problem solving.
                </p>
              </div>
            </div>

            {/* ===== GENUINE DATA: MILESTONES GRID (MINIMIZED) ===== */}
            <div className="mt-[44px] grid grid-cols-12 gap-[18px]">
              <div className="col-span-6">
                <Milestone
                  month="May 2024"
                  title="Foundation in the US"
                  desc="Registered in the US and kick-started research into advanced generative AI."
                />
              </div>

              <div className="col-span-6">
                <Milestone
                  month="May 2024"
                  title="Building a world-class AI team"
                  desc="Began forming the core team while deepening AI research."
                />
              </div>

              <div className="col-span-5">
                <Milestone
                  month="June 2024"
                  title="Expanded vision & leadership"
                  desc="Hired dedicated talent and welcomed new co-founders to accelerate innovation."
                  h="h-[230px]"
                />
              </div>

              <div className="col-span-7">
                <Milestone
                  month="July 2024"
                  title="Commitment to India"
                  desc="Registered in India as Finsocial Digital Systems—cementing local innovation."
                />
              </div>

              <div className="col-span-12">
                <Milestone
                  month="September 2024"
                  title="First growth milestone"
                  desc="Reached a 10-member team—laying the foundation for rapid growth."
                  align="center"
                  h="h-[230px]"
                />
              </div>

              <div className="col-span-7">
                <Milestone
                  month="December 2024"
                  title="Scaled to 25 members"
                  desc="Grew to 25 passionate people driving R&amp;D forward."
                />
              </div>

              <div className="col-span-5">
                <Milestone
                  month="February 2025"
                  title="AI breakthroughs"
                  desc="Developed generative AI models that set new industry benchmarks."
                  h="h-[230px]"
                />
              </div>

              <div className="col-span-12">
                <Milestone
                  month="April 2025"
                  title="Launched Hind AI"
                  desc="Official launch—beginning a new era of intelligent automation and creative problem solving."
                  align="center"
                  h="h-[230px]"
                />
              </div>
            </div>

            <div className="mt-[18px]">
              <button className="text-white/85 text-[12px] tracking-[0.22em] uppercase border-b border-white/30 hover:border-white/70 pb-2">
                DISCOVER OUR JOURNEY
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}