"use client";

import { Suspense, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import {
  Bed,
  CentreTable,
  Console,
  DiningChair,
  DiningTable,
  FloorLamp,
  Pendant,
  Plinth,
  RoomShell,
  SideTable,
  Sofa,
} from "@/components/three/furniture-kit";
import { GltfModel } from "@/components/three/gltf-model";
import { ModelErrorBoundary } from "@/components/three/model-error-boundary";
import { SignatureChair } from "@/components/three/signature-chair";
import { brand } from "@/lib/brand";
import { anchorsFor, roomById } from "@/lib/showroom-config";
import type { Anchor, AnchorKind } from "@/lib/showroom-config";
import type { ShowroomRoomId } from "@/lib/types";

function toneFor(room: ShowroomRoomId) {
  switch (room) {
    case "living":
      return "living" as const;
    case "dining":
      return "dining" as const;
    case "bedroom":
      return "bedroom" as const;
    case "lounge":
      return "lounge" as const;
    case "luxury":
      return "gallery" as const;
    default: {
      const _exhaustive: never = room;
      return _exhaustive;
    }
  }
}

function KindMesh({ kind, room, anchorId }: { kind: AnchorKind; room: ShowroomRoomId; anchorId: string }) {
  const tone = toneFor(room);
  switch (kind) {
    case "sofa":
      return <Sofa tone={tone} />;
    case "chair":
      return <SignatureChair tone={tone} />;
    case "table":
      return <CentreTable tone={tone} />;
    case "lamp":
      return <FloorLamp tone={tone} elevate={anchorId === "bedroom-lamp" ? 0.52 : 0} />;
    case "diningTable":
      return <DiningTable tone={tone} />;
    case "diningChair":
      return <DiningChair tone={tone} />;
    case "bed":
      return <Bed tone={tone} />;
    case "pendant":
      return <Pendant tone={tone} />;
    case "sideTable":
      return <SideTable tone={tone} />;
    case "console":
      return <Console tone={tone} />;
    default: {
      const _exhaustive: never = kind;
      return _exhaustive;
    }
  }
}

function LinkedModel({ url, height, anchor }: { url: string; height: number; anchor: Anchor }) {
  return (
    <Suspense fallback={<KindMesh kind={anchor.kind} room={anchor.room} anchorId={anchor.id} />}>
      <ModelErrorBoundary fallback={<KindMesh kind={anchor.kind} room={anchor.room} anchorId={anchor.id} />}>
        <GltfModel url={url} targetHeight={height} />
      </ModelErrorBoundary>
    </Suspense>
  );
}

export function ShowroomScene({
  room,
  selected,
  rotations,
  drag,
  models,
  onSelect,
}: {
  room: ShowroomRoomId;
  selected: string | null;
  rotations: React.RefObject<Record<string, number>>;
  drag: React.RefObject<number>;
  models: Record<string, string>;
  onSelect: (id: string) => void;
}) {
  const camera = useThree((state) => state.camera);
  const scene = useThree((state) => state.scene);
  const pose = roomById(room);
  const yaw = useRef(0);
  const pieces = anchorsFor(room);
  const target = useRef(new THREE.Vector3());
  const offset = useRef(new THREE.Vector3());
  const next = useRef(new THREE.Vector3());
  const axis = useRef(new THREE.Vector3(0, 1, 0));

  useFrame((_, delta) => {
    target.current.set(...pose.target);
    offset.current.set(...pose.camera).sub(target.current);
    yaw.current += ((drag.current ?? 0) - yaw.current) * (1 - Math.exp(-4 * delta));
    offset.current.applyAxisAngle(axis.current, yaw.current);
    next.current.copy(target.current).add(offset.current);
    camera.position.lerp(next.current, 1 - Math.exp(-3.2 * delta));
    camera.lookAt(target.current);
    pieces.forEach((anchor) => {
      const object = scene.getObjectByName(anchor.id);
      if (!object) return;
      object.rotation.y = anchor.rotationY + (rotations.current?.[anchor.id] ?? 0);
    });
  });

  return (
    <>
      <color attach="background" args={[pose.background]} />
      <fog attach="fog" args={[pose.background, 8, 18]} />
      <ambientLight intensity={pose.fill} color={brand.ivory} />
      <hemisphereLight args={[brand.ivory, brand.ink, pose.fill]} />
      <spotLight
        position={[pose.camera[0], 3.6, pose.camera[2]]}
        angle={0.7}
        penumbra={0.8}
        intensity={pose.keyIntensity}
        color={pose.key}
        distance={16}
        decay={2}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-bias={-0.0004}
      />
      <RoomShell tone={toneFor(room)} />
      {pieces.map((anchor) => (
        <group
          key={anchor.id}
          name={anchor.id}
          position={anchor.position}
          rotation={[0, anchor.rotationY + (rotations.current?.[anchor.id] ?? 0), 0]}
          onClick={(event) => {
            event.stopPropagation();
            onSelect(anchor.id);
          }}
        >
          {room === "luxury" ? <Plinth /> : null}
          <group position={[0, room === "luxury" ? 0.16 : 0, 0]}>
            {models[anchor.id] ? (
              <LinkedModel url={models[anchor.id]} height={anchor.height} anchor={anchor} />
            ) : (
              <KindMesh kind={anchor.kind} room={anchor.room} anchorId={anchor.id} />
            )}
          </group>
          {selected === anchor.id ? (
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
              <ringGeometry args={[anchor.radius, anchor.radius + 0.025, 48]} />
              <meshBasicMaterial color={brand.red} transparent opacity={0.85} />
            </mesh>
          ) : null}
        </group>
      ))}
    </>
  );
}
