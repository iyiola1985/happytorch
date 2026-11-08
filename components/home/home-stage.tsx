"use client";

import dynamic from "next/dynamic";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLightHeaderUntilFooter } from "@/components/layout/header-tone";
import { brand } from "@/lib/brand";
import { sceneAt, scenes } from "@/lib/story";

const StudioCanvas = dynamic(() => import("@/components/three/studio-canvas").then((mod) => mod.StudioCanvas), {
  ssr: false,
});

type JourneyMarker = { scene: number; slot: number };

const MarkerContext = createContext<JourneyMarker>({ scene: 0, slot: 0 });

export function useJourneyMarker() {
  return useContext(MarkerContext);
}

export function HomeStage({
  children,
  modelPath,
  modelScale,
  modelRotation,
  featuredModels,
}: {
  children: React.ReactNode;
  modelPath: string;
  modelScale: number;
  modelRotation: number;
  featuredModels: string[];
}) {
  const progressRef = useRef(0);
  const [marker, setMarker] = useState<JourneyMarker>({ scene: 0, slot: 0 });
  const [webgl, setWebgl] = useState(true);
  const [narrow, setNarrow] = useState(false);
  const [lowPower, setLowPower] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [hidden, setHidden] = useState(false);
  useLightHeaderUntilFooter();

  useEffect(() => {
    const previous = document.body.style.backgroundColor;
    document.body.style.backgroundColor = brand.ivory;
    return () => {
      document.body.style.backgroundColor = previous;
    };
  }, []);

  useEffect(() => {
    const narrowQuery = window.matchMedia("(max-width: 767px)");
    const reducedQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => {
      setNarrow(narrowQuery.matches);
      setReduced(reducedQuery.matches);
      const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 8;
      setLowPower(narrowQuery.matches || memory <= 4);
    };
    apply();
    narrowQuery.addEventListener("change", apply);
    reducedQuery.addEventListener("change", apply);
    try {
      const canvas = document.createElement("canvas");
      setWebgl(Boolean(canvas.getContext("webgl2") || canvas.getContext("webgl")));
    } catch {
      setWebgl(false);
    }
    const onVisibility = () => setHidden(document.hidden);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      narrowQuery.removeEventListener("change", apply);
      reducedQuery.removeEventListener("change", apply);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  useEffect(() => {
    const story = document.getElementById("story");
    if (story) story.dataset.flat = !webgl || reduced ? "true" : "false";
  }, [webgl, reduced]);

  useEffect(() => {
    if (reduced || !webgl) return;
    gsap.registerPlugin(ScrollTrigger);
    const context = gsap.context(() => {
      ScrollTrigger.create({
        trigger: "#story",
        start: "top top",
        end: "bottom bottom",
        scrub: 0.7,
        onUpdate: (self) => {
          progressRef.current = self.progress;
          const scene = sceneAt(self.progress);
          const slot = scene === 3 ? Math.min(3, Math.floor(((self.progress - 0.52) / 0.18) * 4)) : 0;
          setMarker((current) => (current.scene === scene && current.slot === slot ? current : { scene, slot }));
        },
      });
    });
    return () => context.revert();
  }, [reduced, webgl]);

  return (
    <MarkerContext.Provider value={marker}>
      <div className="relative bg-ivory text-espresso">
        {webgl ? (
          <div className="pointer-events-none fixed inset-0 z-0">
            <StudioCanvas
              progressRef={progressRef}
              narrow={narrow}
              reduced={reduced}
              lowPower={lowPower}
              modelPath={modelPath}
              modelScale={modelScale}
              modelRotation={modelRotation}
              featuredModels={featuredModels}
              paused={hidden}
            />
            <div className="pointer-events-none absolute inset-0 shadow-[inset_0_0_140px_rgba(17,17,17,0.06)]" />
          </div>
        ) : null}
        <SceneRail scene={marker.scene} />
        {children}
      </div>
    </MarkerContext.Provider>
  );
}

function SceneRail({ scene }: { scene: number }) {
  return (
    <nav className="fixed bottom-7 left-1/2 z-30 hidden -translate-x-1/2 items-center gap-3 md:flex" aria-label="Journey">
      {scenes.map((item, index) => (
        <button
          key={item.id}
          type="button"
          className="group flex items-center"
          onClick={() => document.getElementById(item.id)?.scrollIntoView({ behavior: "smooth" })}
          aria-current={index === scene ? "true" : undefined}
        >
          <span className={`block h-px ${index === scene ? "w-8 bg-red" : "w-4 bg-espresso/30"}`} />
          <span className="sr-only">
            {item.index} {item.label}
          </span>
        </button>
      ))}
      <span className="ml-3 font-sans text-[0.62rem] uppercase tracking-[0.28em] text-espresso/70 tabular-nums">
        {scenes[scene]?.index} {scenes[scene]?.label}
      </span>
    </nav>
  );
}
