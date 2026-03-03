"use client";

import { useSectionReveal } from "@/lib/useSectionReveal";

const services = [
  {
    icon: "🤖",
    title: "AI & Machine Learning",
    desc: "Advanced generative AI models powering intelligent automation, predictive analytics, and natural language processing for financial services.",
    accent: "#2fffe0",
  },
  {
    icon: "⛓️",
    title: "Blockchain & DeFi",
    desc: "Decentralized finance protocols, smart contract development, and secure distributed ledger solutions for next-gen financial infrastructure.",
    accent: "#00aaff",
  },
  {
    icon: "☁️",
    title: "Cloud Infrastructure",
    desc: "Scalable, fault-tolerant cloud architectures engineered for high-throughput financial workloads with 99.9% uptime guarantee.",
    accent: "#8b5cf6",
  },
  {
    icon: "💳",
    title: "Digital Payments",
    desc: "Seamless payment gateway integration, real-time transaction processing, and unified payment platforms for global commerce.",
    accent: "#ff6b9d",
  },
];

export default function ShowreelSection() {
  const ref = useSectionReveal(".reveal-item", {
    yFrom: 60,
    stagger: 0.15,
    duration: 1,
  });

  return (
    <section
      id="solutions"
      className="min-h-screen flex items-center justify-center px-[56px] py-[120px]"
    >
      <div ref={ref} className="w-full max-w-[1200px]">
        {/* Section header */}
        <div className="reveal-item text-center mb-[64px]">
          <div className="text-[11px] tracking-[0.25em] uppercase text-white/50 mb-4">
            OUR SOLUTIONS
          </div>
          <h2
            className="text-[52px] font-light leading-[1.08] tracking-[-0.02em]"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            Engineered for the
            <br />
            <span className="gradient-text">future of finance</span>
          </h2>
          <p className="mt-[18px] text-white/50 text-[15px] leading-[1.7] max-w-[540px] mx-auto">
            Comprehensive technology solutions built at the intersection of
            artificial intelligence, distributed systems, and financial innovation.
          </p>
        </div>

        {/* Services grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-[22px]">
          {services.map((s, i) => (
            <div
              key={i}
              className="reveal-item glass-card group relative isolate p-[32px] min-h-[220px] flex flex-col justify-between overflow-hidden"
            >
              {/* Accent glow */}
              <div
                className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{
                  background: `radial-gradient(400px circle at 30% 20%, ${s.accent}18, transparent 60%)`,
                }}
              />

              {/* Top */}
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-[18px]">
                  <span className="text-[24px]">{s.icon}</span>
                  <span
                    className="h-[6px] w-[6px] rounded-full shadow-lg"
                    style={{
                      background: s.accent,
                      boxShadow: `0 0 16px ${s.accent}88`,
                    }}
                  />
                </div>
                <h3
                  className="text-white/92 text-[22px] font-medium leading-[1.2] tracking-[-0.01em]"
                  style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                >
                  {s.title}
                </h3>
              </div>

              {/* Bottom */}
              <div className="relative z-10 mt-[16px]">
                <p className="text-white/50 text-[13px] leading-[1.7]">{s.desc}</p>
                <div className="mt-[16px] flex items-center gap-2 text-white/35 text-[11px] tracking-[0.15em] uppercase group-hover:text-white/60 transition-colors duration-300">
                  <span className="inline-block h-px w-[20px] bg-current" />
                  <span>Learn More</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}