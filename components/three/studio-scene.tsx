"use client";

import { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { CollectionLineup, HeroChair, LivingWorld } from "@/components/three/living-world";
import { brand, mixBrand } from "@/lib/brand";
import { sampleJourney } from "@/lib/scene-config";

export function StudioScene({
  progressRef,
  narrow,
  reduced,
  lowPower,
  modelPath,
  modelScale,
  modelRotation,
  featuredModels,
}: {
  progressRef: React.RefObject<number>;
  narrow: boolean;
  reduced: boolean;
  lowPower: boolean;
  modelPath: string;
  modelScale: number;
  modelRotation: number;
  featuredModels: string[];
}) {
  const camera = useThree((state) => state.camera);
  const gl = useThree((state) => state.gl);
  const chair = useRef<THREE.Group>(null);
  const key = useRef<THREE.SpotLight>(null);
  const keyTarget = useRef<THREE.Object3D>(null);
  const rim = useRef<THREE.SpotLight>(null);
  const rimTarget = useRef<THREE.Object3D>(null);
  const fog = useRef<THREE.Fog>(null);
  const pointer = useRef({ x: 0, y: 0 });
  const pointerTarget = useRef({ x: 0, y: 0 });
  const roomLight = useRef(0);

  useEffect(() => {
    const onMove = (event: PointerEvent) => {
      if (window.matchMedia("(pointer: coarse)").matches) return;
      pointerTarget.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      pointerTarget.current.y = (event.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  useEffect(() => {
    if (camera instanceof THREE.PerspectiveCamera) {
      camera.fov = narrow ? 36 : 30;
      camera.updateProjectionMatrix();
    }
  }, [camera, narrow]);

  useFrame((state, delta) => {
    const journey = reduced ? sampleJourney(0, narrow) : sampleJourney(progressRef.current ?? 0, narrow);
    roomLight.current = journey.roomLight;
    const damp = 1 - Math.exp(-2.4 * delta);
    if (!reduced) {
      pointer.current.x += (pointerTarget.current.x - pointer.current.x) * damp;
      pointer.current.y += (pointerTarget.current.y - pointer.current.y) * damp;
    }
    const px = reduced ? 0 : pointer.current.x;
    const py = reduced ? 0 : pointer.current.y;
    camera.position.set(journey.camera[0] + px * 0.16, journey.camera[1] - py * 0.06, journey.camera[2]);
    camera.lookAt(journey.target[0] + px * 0.06, journey.target[1], journey.target[2]);
    gl.toneMappingExposure = journey.exposure;
    const idle = reduced ? 0 : Math.sin(state.clock.elapsedTime * 0.55) * 0.028;
    const breathe = reduced ? 0 : Math.sin(state.clock.elapsedTime * 0.22) * 0.06;
    if (chair.current) {
      chair.current.position.set(journey.chair[0], journey.chair[1] + idle, journey.chair[2]);
      chair.current.rotation.y = journey.chairYaw + breathe + px * 0.18;
      chair.current.rotation.x = py * -0.02;
    }
    if (key.current && keyTarget.current) {
      key.current.position.set(journey.chair[0] + 1.35, 2.35, journey.chair[2] + 1.55);
      keyTarget.current.position.set(journey.chair[0], 0.48, journey.chair[2]);
      key.current.target = keyTarget.current;
    }
    if (rim.current && rimTarget.current) {
      rim.current.position.set(journey.chair[0] - 1.4, 1.7, journey.chair[2] - 1.5);
      rimTarget.current.position.set(journey.chair[0], 0.55, journey.chair[2]);
      rim.current.target = rimTarget.current;
    }
    if (fog.current) {
      fog.current.near = journey.fogNear;
      fog.current.far = journey.fogFar;
    }
  });

  return (
    <>
      <color attach="background" args={[brand.ivory]} />
      <fog ref={fog} attach="fog" args={[brand.ivory, 5, 10]} />
      <ambientLight intensity={0.36} color={brand.ivory} />
      <hemisphereLight args={[brand.ivory, mixBrand(brand.ivory, brand.ink, 0.12), 0.7]} />
      <directionalLight
        position={[-3.2, 4.6, 2.4]}
        intensity={1.7}
        color={brand.ivory}
        castShadow={!lowPower}
        shadow-mapSize-width={lowPower ? 512 : 1024}
        shadow-mapSize-height={lowPower ? 512 : 1024}
        shadow-bias={-0.0004}
        shadow-camera-near={0.5}
        shadow-camera-far={16}
        shadow-camera-left={-4}
        shadow-camera-right={4}
        shadow-camera-top={4}
        shadow-camera-bottom={-4}
      />
      <spotLight
        ref={key}
        angle={0.7}
        penumbra={1}
        intensity={8}
        distance={14}
        decay={2}
        color={brand.ivory}
      />
      <object3D ref={keyTarget} />
      <spotLight ref={rim} angle={0.8} penumbra={1} intensity={4} distance={12} decay={2} color={brand.ivory} />
      <object3D ref={rimTarget} />
      <group ref={chair}>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.012, 0.04]}>
          <circleGeometry args={[0.46, 40]} />
          <meshBasicMaterial color={brand.ink} transparent opacity={0.14} depthWrite={false} />
        </mesh>
        <HeroChair modelPath={modelPath} scale={modelScale} rotationY={THREE.MathUtils.degToRad(modelRotation)} />
      </group>
      <LivingWorld roomLight={roomLight} />
      <CollectionLineup models={featuredModels} />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, -4]} receiveShadow>
        <planeGeometry args={[80, 80]} />
        <meshStandardMaterial color={brand.ivory} roughness={1} />
      </mesh>
    </>
  );
}
