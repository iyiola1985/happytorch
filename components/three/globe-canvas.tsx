"use client";

import { Canvas } from "@react-three/fiber";
import { GlobeScene } from "@/components/three/globe-scene";

export function GlobeCanvas({ reduced, paused }: { reduced: boolean; paused: boolean }) {
  return (
    <Canvas
      dpr={[1, 1.5]}
      frameloop={paused || reduced ? "demand" : "always"}
      camera={{ position: [0, 0.15, 2.7], fov: 32 }}
      gl={{ antialias: true, alpha: false }}
      style={{ width: "100%", height: "100%" }}
      aria-hidden
    >
      <GlobeScene reduced={reduced} />
    </Canvas>
  );
}
