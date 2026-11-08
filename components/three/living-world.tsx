"use client";

import { Suspense, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { AccentSeating, CentreTable, Console, FloorLamp, RoomShell, Sofa } from "@/components/three/furniture-kit";
import { GltfModel } from "@/components/three/gltf-model";
import { LandingSofaPhoto } from "@/components/three/landing-chair-photo";
import { ModelErrorBoundary } from "@/components/three/model-error-boundary";
import { SignatureChair } from "@/components/three/signature-chair";
import { brand } from "@/lib/brand";
import { lineupSlots } from "@/lib/scene-config";

function SlotModel({ url, height, kind }: { url: string; height: number; kind: (typeof lineupSlots)[number]["kind"] }) {
  return (
    <Suspense fallback={<SlotKind kind={kind} />}>
      <ModelErrorBoundary fallback={<SlotKind kind={kind} />}>
        <GltfModel url={url} targetHeight={height} />
      </ModelErrorBoundary>
    </Suspense>
  );
}

function SlotKind({ kind }: { kind: (typeof lineupSlots)[number]["kind"] }) {
  switch (kind) {
    case "chair":
      return <AccentSeating tone="gallery" />;
    case "table":
      return <CentreTable tone="gallery" />;
    case "lamp":
      return <FloorLamp tone="gallery" />;
    case "console":
      return <Console tone="gallery" />;
    default: {
      const _exhaustive: never = kind;
      return _exhaustive;
    }
  }
}

export function LivingWorld({ roomLight }: { roomLight: { current: number } }) {
  const light = useRef<THREE.SpotLight>(null);
  const group = useRef<THREE.Group>(null);
  useFrame(() => {
    if (light.current) light.current.intensity = 22 * roomLight.current;
    if (group.current) group.current.visible = roomLight.current > 0.05;
  });
  return (
    <group ref={group} position={[0, 0, -6]} visible={false}>
      <RoomShell tone="living" />
      <group position={[0.25, 0, -0.45]}>
        <Sofa />
      </group>
      <group position={[0.35, 0, 0.75]}>
        <CentreTable />
      </group>
      <group position={[1.7, 0, -0.15]}>
        <FloorLamp />
      </group>
      <spotLight
        ref={light}
        position={[1.8, 3.4, 1.6]}
        angle={0.9}
        penumbra={0.85}
        intensity={0}
        color={brand.ivory}
        distance={12}
        decay={2}
      />
    </group>
  );
}

export function CollectionLineup({ models }: { models: string[] }) {
  const group = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (!group.current) return;
    group.current.children.forEach((child, index) => {
      child.position.y = Math.sin(clock.elapsedTime * 0.7 + index) * 0.025;
    });
  });
  return (
    <group ref={group}>
      {lineupSlots.map((slot, index) => (
        <group key={slot.kind} position={slot.position}>
          {models[index] ? <SlotModel url={models[index]} height={slot.height} kind={slot.kind} /> : <SlotKind kind={slot.kind} />}
        </group>
      ))}
    </group>
  );
}

export function HeroChair({
  modelPath,
  scale,
  rotationY,
}: {
  modelPath: string;
  scale: number;
  rotationY: number;
}) {
  return (
    <group rotation={[0, rotationY, 0]} scale={scale}>
      {modelPath ? (
        <Suspense fallback={<SignatureChair />}>
          <ModelErrorBoundary fallback={<SignatureChair />}>
            <GltfModel url={modelPath} targetHeight={0.9} />
          </ModelErrorBoundary>
        </Suspense>
      ) : (
        <Suspense fallback={null}>
          <LandingSofaPhoto />
        </Suspense>
      )}
    </group>
  );
}
