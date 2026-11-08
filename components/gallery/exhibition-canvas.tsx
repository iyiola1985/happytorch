"use client";

import { Canvas } from "@react-three/fiber";
import { type RefObject } from "react";
import * as THREE from "three";
import { ExhibitionScene } from "@/components/gallery/exhibition-scene";
import type { WalkControl } from "@/components/gallery/exhibition-scene";
import type { ExhibitionDisplay } from "@/lib/exhibition-layout";

export function ExhibitionCanvas({
  displays,
  focusId,
  reduced,
  lowPower,
  paused,
  walk,
  onFocus,
  onReady,
}: {
  displays: ExhibitionDisplay[];
  focusId: string | null;
  reduced: boolean;
  lowPower: boolean;
  paused: boolean;
  walk: RefObject<WalkControl>;
  onFocus: (id: string) => void;
  onReady: () => void;
}) {
  return (
    <Canvas
      shadows={!lowPower}
      dpr={lowPower ? 1 : [1, 1.5]}
      frameloop={paused ? "never" : "always"}
      gl={{ antialias: !lowPower, alpha: false, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.05 }}
      camera={{ position: [0, 1.58, 6.2], fov: lowPower ? 56 : 50, near: 0.1, far: 80 }}
      style={{ touchAction: "none" }}
      onCreated={onReady}
    >
      <ExhibitionScene
        displays={displays}
        focusId={focusId}
        reduced={reduced}
        lowPower={lowPower}
        walk={walk}
        onFocus={onFocus}
      />
    </Canvas>
  );
}
