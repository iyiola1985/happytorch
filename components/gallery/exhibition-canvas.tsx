"use client";

import { Canvas, useThree } from "@react-three/fiber";
import { useEffect, useLayoutEffect, useState, type RefObject } from "react";
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
  const dprCap = useDprCap();
  return (
    <Canvas
      shadows={!lowPower}
      dpr={lowPower ? 1 : [1, dprCap]}
      frameloop={paused ? "never" : "always"}
      gl={{ antialias: !lowPower, alpha: false, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.05 }}
      camera={{ position: [0, 1.58, 6.2], fov: 50, near: 0.1, far: 80 }}
      style={{ width: "100%", height: "100%", touchAction: "none" }}
      onCreated={onReady}
    >
      <FillViewport />
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

function FillViewport() {
  const setSize = useThree((state) => state.setSize);
  const gl = useThree((state) => state.gl);
  useLayoutEffect(() => {
    const frame = gl.domElement.parentElement?.parentElement;
    if (!frame) return;
    const fit = () => {
      const width = frame.clientWidth;
      const height = frame.clientHeight;
      if (width < 2 || height < 2) return;
      gl.domElement.style.width = "100%";
      gl.domElement.style.height = "100%";
      gl.setSize(width, height, false);
      setSize(width, height);
    };
    fit();
    const observer = new ResizeObserver(fit);
    observer.observe(frame);
    window.addEventListener("orientationchange", fit);
    return () => {
      observer.disconnect();
      window.removeEventListener("orientationchange", fit);
    };
  }, [gl, setSize]);
  return null;
}

function useDprCap() {
  const [cap, setCap] = useState(1.5);
  useEffect(() => {
    const query = window.matchMedia("(pointer: coarse)");
    const apply = () => setCap(query.matches ? 1.25 : 1.5);
    apply();
    query.addEventListener("change", apply);
    return () => query.removeEventListener("change", apply);
  }, []);
  return cap;
}
