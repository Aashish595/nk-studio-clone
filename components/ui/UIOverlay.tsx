"use client";

import TopBar from "./topBar";
import BottomNav from "./bottomNav";
import ScrollHint from "./ScrollHint";
import HeroSection from "./HeroSection";
import ShowreelSection from "./ShowreelSection";
import StudioStatsSection from "./StudioStatsSection";

import WarpSection from "./sections/WarpSection";
import DropletIntroSection from "./sections/DropletIntroSection";

export default function UIOverlay({ introDone }: { introDone: boolean }) {
  return (
    <div className="relative z-10">
      <TopBar />
      <BottomNav />
      <ScrollHint />

      <HeroSection enabled={introDone} />
      <ShowreelSection />
      <StudioStatsSection />

      <DropletIntroSection open={introDone} />
      <WarpSection />
    </div>
  );
}