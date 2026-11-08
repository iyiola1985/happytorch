"use client";

import { useEffect, useState, type ComponentType } from "react";

type GlobeProps = {
  reduced: boolean;
  paused: boolean;
};

export function GlobeView({ reduced, paused }: GlobeProps) {
  const [Globe, setGlobe] = useState<ComponentType<GlobeProps> | null>(null);

  useEffect(() => {
    let active = true;
    // Loaded after mount so the WebGL module is not registered in the shared SSR graph.
    void import("@/components/three/globe-canvas").then((mod) => {
      if (active) setGlobe(() => mod.GlobeCanvas);
    });
    return () => {
      active = false;
    };
  }, []);

  if (!Globe) return null;
  return <Globe reduced={reduced} paused={paused} />;
}
