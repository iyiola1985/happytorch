"use client";

import { Canvas } from "@react-three/fiber";
import * as THREE from "three";
import { ShowroomScene } from "@/components/three/showroom-scene";
import type { ShowroomRoomId } from "@/lib/types";

export function ShowroomCanvas({
  room,
  selected,
  rotations,
  drag,
  models,
  onSelect,
  paused,
}: {
  room: ShowroomRoomId;
  selected: string | null;
  rotations: React.RefObject<Record<string, number>>;
  drag: React.RefObject<number>;
  models: Record<string, string>;
  onSelect: (id: string) => void;
  paused: boolean;
}) {
  return (
    <Canvas
      shadows
      dpr={[1, 1.5]}
      frameloop={paused ? "never" : "always"}
      gl={{ antialias: true, alpha: false, toneMapping: THREE.ACESFilmicToneMapping }}
      camera={{ position: [3.1, 1.35, 4.15], fov: 32, near: 0.1, far: 40 }}
      onPointerMissed={() => onSelect("")}
      style={{ touchAction: "none" }}
    >
      <ShowroomScene room={room} selected={selected} rotations={rotations} drag={drag} models={models} onSelect={onSelect} />
    </Canvas>
  );
}
