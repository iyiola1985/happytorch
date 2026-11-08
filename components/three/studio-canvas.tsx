"use client";

import { Canvas } from "@react-three/fiber";
import * as THREE from "three";
import { StudioScene } from "@/components/three/studio-scene";

export function StudioCanvas({
  progressRef,
  narrow,
  reduced,
  lowPower,
  modelPath,
  modelScale,
  modelRotation,
  featuredModels,
  paused,
}: {
  progressRef: React.RefObject<number>;
  narrow: boolean;
  reduced: boolean;
  lowPower: boolean;
  modelPath: string;
  modelScale: number;
  modelRotation: number;
  featuredModels: string[];
  paused: boolean;
}) {
  return (
    <Canvas
      shadows
      dpr={lowPower ? 1 : [1, 1.6]}
      frameloop={paused ? "never" : "always"}
      gl={{
        antialias: true,
        alpha: false,
        powerPreference: "high-performance",
        toneMapping: THREE.ACESFilmicToneMapping,
      }}
      camera={{ position: [0.2, 1.02, 3.7], fov: narrow ? 36 : 30, near: 0.1, far: 40 }}
      style={{ touchAction: "pan-y" }}
      aria-hidden
    >
      <StudioScene
        progressRef={progressRef}
        narrow={narrow}
        reduced={reduced}
        lowPower={lowPower}
        modelPath={modelPath}
        modelScale={modelScale}
        modelRotation={modelRotation}
        featuredModels={featuredModels}
      />
    </Canvas>
  );
}
