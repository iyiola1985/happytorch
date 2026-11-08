"use client";

import { Suspense, useEffect, useLayoutEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { prepareModel } from "@/components/three/gltf-model";

export const SOFA_MODEL = "/models/uploads/luxury_sofa.glb";

const BEIGE = new THREE.Color("#E8DDD0");
const DARK = new THREE.Color("#1A1512");

export type SofaProgress = { current: number };

function LoadedSofa({ progress }: { progress: SofaProgress }) {
  const group = useRef<THREE.Group>(null);
  const gltf = useGLTF(SOFA_MODEL);
  const scene = useMemo(() => {
    const clone = gltf.scene.clone(true);
    prepareModel(clone, 1.35);
    return clone;
  }, [gltf.scene]);

  useFrame(() => {
    if (!group.current) return;
    group.current.rotation.y = THREE.MathUtils.lerp(-0.5, 1.2, progress.current);
  });

  return (
    <group ref={group}>
      <primitive object={scene} />
    </group>
  );
}

function ScrollRig({ progress }: { progress: SofaProgress }) {
  const { camera, scene } = useThree();
  const color = useMemo(() => new THREE.Color("#E8DDD0"), []);

  useLayoutEffect(() => {
    scene.background = color;
    camera.position.set(0, 0.85, 5);
    camera.lookAt(0, 0.55, 0);
  }, [camera, color, scene]);

  useFrame(() => {
    const t = progress.current;
    camera.position.z = THREE.MathUtils.lerp(5, 3, t);
    camera.lookAt(0, 0.55, 0);
    color.copy(BEIGE).lerp(DARK, t);
    scene.background = color;
  });

  return null;
}

export function ScrollSofa({ progress }: { progress: SofaProgress }) {
  useEffect(() => {
    const kick = () => window.dispatchEvent(new Event("resize"));
    const first = window.setTimeout(kick, 0);
    const second = window.setTimeout(kick, 50);
    return () => {
      window.clearTimeout(first);
      window.clearTimeout(second);
    };
  }, []);

  return (
    <Canvas
      camera={{ position: [0, 0.85, 5], fov: 32 }}
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: false }}
      resize={{ scroll: false, debounce: 0, offsetSize: true }}
      style={{ width: "100%", height: "100%" }}
    >
      <color attach="background" args={["#E8DDD0"]} />
      <ambientLight intensity={0.7} />
      <directionalLight position={[2.4, 4.2, 3.2]} intensity={1.7} />
      <Suspense fallback={null}>
        <LoadedSofa progress={progress} />
        <ScrollRig progress={progress} />
      </Suspense>
    </Canvas>
  );
}

if (typeof window !== "undefined") {
  useGLTF.preload(SOFA_MODEL);
}
