"use client";

import { useEffect, useState } from "react";

export default function ScrollHint() {
  const [scrollPercent, setScrollPercent] = useState(0);
  const [isHeroVisible, setIsHeroVisible] = useState(true);

  // Scroll percentage
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;

      const percent = (scrollTop / docHeight) * 100;

      setScrollPercent(Math.min(100, Math.round(percent)));
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Hero visibility detection
  useEffect(() => {
    const hero = document.getElementById("hero");

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsHeroVisible(entry.isIntersecting);
      },
      { threshold: 0.2 }
    );

    if (hero) observer.observe(hero);

    return () => {
      if (hero) observer.unobserve(hero);
    };
  }, []);

  return (
    <div className="fixed right-[18px] bottom-[120px] z-30 flex flex-col items-center">

      {/* If hero visible → show text */}
      {isHeroVisible ? (
        <div className="rotate-90 origin-bottom-right text-[10px] tracking-[0.35em] opacity-50">
          SCROLL TO DISCOVER
        </div>
      ) : (
        // After hero → show percentage + green dot
        <div className="rotate-90 origin-bottom-right flex items-center gap-2 text-xs">
          <span className=" font-medium">
            {scrollPercent}%
          </span>
          <span className="w-2 h-2 bg-green-400 rounded-full" />
        </div>
      )}
    </div>
  );
}