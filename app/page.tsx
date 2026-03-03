"use client";

import { useEffect, useRef, useState } from "react";
import Scene from "@/components/three/Scene";
import Scene2Canvas from "@/components/three/Scene2Canvas";
import IntroOverlay from "@/components/ui/IntroOverlay";
import UIOverlay from "@/components/ui/UIOverlay";

export default function Page() {
  const [introDone, setIntroDone] = useState(false);

  const [bg, setBg] = useState<"scene1" | "scene2">("scene1");
  const [scene2Mode, setScene2Mode] = useState<"dropIntro" | "idle" | "warp">("idle");
  const [dropletOpen, setDropletOpen] = useState(false);

  const [introColor, setIntroColor] = useState("#2fffe0");

  // ✅ scroll direction (up/down)
  const dirRef = useRef<"up" | "down">("down");

  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      dirRef.current = y > last ? "down" : "up";
      last = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!introDone) return;

    const intro = document.getElementById("droplet-intro");
    const warp = document.getElementById("warp");
    if (!intro || !warp) return;

    let wasIntro = false;
    let wasWarp = false;

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          const id = (e.target as HTMLElement).id;

          // ✅ DROPLET INTRO SECTION
          if (id === "droplet-intro") {
            if (e.isIntersecting && !wasIntro) {
              wasIntro = true;

              setBg("scene2");
              setScene2Mode("dropIntro");
              setDropletOpen(false); // hide UI until splash done

              // color by direction
              setIntroColor(dirRef.current === "up" ? "#f6feff" : "#2fffe0"); // white on up, teal on down
            }

            if (!e.isIntersecting) wasIntro = false;
          }

          // ✅ WARP SECTION
          if (id === "warp") {
            if (e.isIntersecting && !wasWarp) {
              wasWarp = true;
              setBg("scene2");
              setScene2Mode("warp");
              setDropletOpen(true);
            }
            if (!e.isIntersecting) wasWarp = false;
          }
        }

        // if none active, go back scene1
        const introRect = intro.getBoundingClientRect();
        const warpRect = warp.getBoundingClientRect();
        const introActive = introRect.top < window.innerHeight * 0.7 && introRect.bottom > window.innerHeight * 0.3;
        const warpActive = warpRect.top < window.innerHeight * 0.7 && warpRect.bottom > window.innerHeight * 0.3;

        if (!introActive && !warpActive) {
          setBg("scene1");
        }
      },
      { threshold: 0.35 }
    );

    io.observe(intro);
    io.observe(warp);
    return () => io.disconnect();
  }, [introDone]);

  return (
    <main className="relative min-h-screen bg-black text-white">
      {!introDone && <IntroOverlay onDone={() => setIntroDone(true)} />}

      {introDone && (
        <>
          {/* Background canvases */}
          <div className="fixed inset-0 z-0">
            <div className={`absolute inset-0 transition-opacity duration-700 ${bg === "scene1" ? "opacity-100" : "opacity-0"}`}>
              <Scene />
            </div>

            <div className={`absolute inset-0 transition-opacity duration-700 ${bg === "scene2" ? "opacity-100" : "opacity-0"}`}>
              <Scene2Canvas
                mode={scene2Mode}
                introColor={introColor}
                onDropIntroDone={() => {
                  setDropletOpen(true);    
                  setScene2Mode("idle");   
                }}
              />
            </div>
          </div>

          {/* UI */}
          <div className="relative z-10">
            <UIOverlay introDone={introDone} dropletOpen={dropletOpen} />
          </div>
        </>
      )}
    </main>
  );
}