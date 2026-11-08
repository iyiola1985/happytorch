"use client";

import { useTexture } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { type RefObject, Suspense, useEffect, useLayoutEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { brand, mixBrand } from "@/lib/brand";
import { EYE, HALL_HALF, corridorBounds, type ExhibitionDisplay } from "@/lib/exhibition-layout";
import { stockLabel } from "@/lib/format";
import { enquiryCopy } from "@/lib/public-catalogue";

export type WalkControl = {
  progress: number;
  yaw: number;
  nudge: number;
};

const dragged = { current: false };

export function ExhibitionScene({
  displays,
  focusId,
  reduced,
  lowPower,
  walk,
  onFocus,
}: {
  displays: ExhibitionDisplay[];
  focusId: string | null;
  reduced: boolean;
  lowPower: boolean;
  walk: RefObject<WalkControl>;
  onFocus: (id: string) => void;
}) {
  const bounds = useMemo(() => corridorBounds(displays), [displays]);
  return (
    <>
      <color attach="background" args={[brand.ivory]} />
      <fog attach="fog" args={[brand.ivory, 14, 42]} />
      <GalleryEnvironment />
      <hemisphereLight args={[brand.ivory, mixBrand(brand.ivory, brand.ink, 0.18), 0.55]} />
      <ambientLight intensity={0.28} />
      <directionalLight
        position={[2.5, 6.5, 4]}
        intensity={1.15}
        castShadow={!lowPower}
        shadow-mapSize={lowPower ? undefined : [1024, 1024]}
        shadow-camera-near={0.5}
        shadow-camera-far={30}
        shadow-camera-left={-8}
        shadow-camera-right={8}
        shadow-camera-top={8}
        shadow-camera-bottom={-8}
      />
      <Corridor bounds={bounds} />
      {displays.map((display) => (
        <Suspense key={display.product.id} fallback={null}>
          <DisplayFrame display={display} focused={focusId === display.product.id} dimmed={Boolean(focusId && focusId !== display.product.id)} lowPower={lowPower} onFocus={onFocus} />
        </Suspense>
      ))}
      <Walker displays={displays} focusId={focusId} reduced={reduced} walk={walk} bounds={bounds} />
    </>
  );
}

function GalleryEnvironment() {
  const { gl, scene } = useThree();
  useLayoutEffect(() => {
    const pmrem = new THREE.PMREMGenerator(gl);
    const room = new RoomEnvironment();
    const target = pmrem.fromScene(room, 0.04);
    scene.environment = target.texture;
    return () => {
      scene.environment = null;
      target.texture.dispose();
      pmrem.dispose();
    };
  }, [gl, scene]);
  return null;
}

function Corridor({ bounds }: { bounds: ReturnType<typeof corridorBounds> }) {
  const length = bounds.floorNear - bounds.floorFar;
  const center = (bounds.floorNear + bounds.floorFar) / 2;
  const stone = useStoneTexture(length);
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, center]} receiveShadow>
        <planeGeometry args={[HALL_HALF * 2 + 0.4, length]} />
        <meshPhysicalMaterial map={stone} color={brand.ivory} roughness={0.22} metalness={0.04} clearcoat={0.45} clearcoatRoughness={0.35} />
      </mesh>
      <mesh position={[-HALL_HALF, 2.05, center]} receiveShadow>
        <boxGeometry args={[0.18, 4.1, length]} />
        <meshStandardMaterial color={brand.ivory} roughness={0.94} />
      </mesh>
      <mesh position={[HALL_HALF, 2.05, center]} receiveShadow>
        <boxGeometry args={[0.18, 4.1, length]} />
        <meshStandardMaterial color={brand.ivory} roughness={0.94} />
      </mesh>
      <mesh position={[-HALL_HALF + 0.12, 0.16, center]}>
        <boxGeometry args={[0.08, 0.32, length]} />
        <meshStandardMaterial color={brand.ink} roughness={0.7} />
      </mesh>
      <mesh position={[HALL_HALF - 0.12, 0.16, center]}>
        <boxGeometry args={[0.08, 0.32, length]} />
        <meshStandardMaterial color={brand.ink} roughness={0.7} />
      </mesh>
      <mesh position={[0, 4.08, center]}>
        <boxGeometry args={[HALL_HALF * 2, 0.12, length]} />
        <meshStandardMaterial color={brand.ivory} roughness={0.9} />
      </mesh>
      <mesh position={[0, 2.05, bounds.floorFar]}>
        <boxGeometry args={[HALL_HALF * 2, 4.1, 0.16]} />
        <meshStandardMaterial color={brand.ivory} roughness={0.92} />
      </mesh>
      {Array.from({ length: Math.ceil(length / 4.8) }, (_, index) => {
        const z = bounds.floorNear - 2.4 - index * 4.8;
        if (z < bounds.floorFar + 1) return null;
        return (
          <group key={z} position={[0, 3.98, z]}>
            <mesh>
              <boxGeometry args={[1.35, 0.04, 0.55]} />
              <meshStandardMaterial color={brand.ivory} emissive={brand.ivory} emissiveIntensity={0.85} />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}

function useStoneTexture(length: number) {
  const texture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 512;
    const context = canvas.getContext("2d");
    if (!context) return new THREE.Texture();
    context.fillStyle = brand.ivory;
    context.fillRect(0, 0, 512, 512);
    for (let i = 0; i < 22; i += 1) {
      context.strokeStyle = `rgba(17, 17, 17, ${0.05 + (i % 5) * 0.02})`;
      context.lineWidth = 1 + (i % 3);
      context.beginPath();
      context.moveTo((i * 37) % 512, 0);
      context.bezierCurveTo(80 + i * 12, 140, 200, 280 + i * 6, (i * 53) % 512, 512);
      context.stroke();
    }
    context.strokeStyle = "rgba(17, 17, 17, 0.16)";
    context.lineWidth = 3;
    for (let i = 0; i <= 512; i += 128) {
      context.beginPath();
      context.moveTo(i, 0);
      context.lineTo(i, 512);
      context.stroke();
      context.beginPath();
      context.moveTo(0, i);
      context.lineTo(512, i);
      context.stroke();
    }
    const map = new THREE.CanvasTexture(canvas);
    map.colorSpace = THREE.SRGBColorSpace;
    map.wrapS = THREE.RepeatWrapping;
    map.wrapT = THREE.RepeatWrapping;
    map.anisotropy = 4;
    map.repeat.set(4, Math.max(8, length / 2.2));
    return map;
  }, [length]);
  useEffect(() => () => texture.dispose(), [texture]);
  return texture;
}

function DisplayFrame({
  display,
  focused,
  dimmed,
  lowPower,
  onFocus,
}: {
  display: ExhibitionDisplay;
  focused: boolean;
  dimmed: boolean;
  lowPower: boolean;
  onFocus: (id: string) => void;
}) {
  const lift = useRef<THREE.Group>(null);
  const light = useRef<THREE.SpotLight>(null);
  const target = useRef<THREE.Object3D>(null);
  const plaque = useMemo(() => makePlaque(display.product.name, stockLabel(display.product.stockStatus)), [display.product.name, display.product.stockStatus]);
  const image = display.product.images[0];
  useLayoutEffect(() => {
    if (light.current && target.current) light.current.target = target.current;
  }, []);
  useFrame((_, delta) => {
    if (!lift.current) return;
    const goal = focused ? 0.16 : 0.02;
    lift.current.position.z = THREE.MathUtils.damp(lift.current.position.z, goal, focused ? 5 : 7, delta);
  });
  const rotationY = display.side === -1 ? Math.PI / 2 - 0.48 : -Math.PI / 2 + 0.48;
  return (
    <group position={[display.x, 1.62, display.z]} rotation={[0, rotationY, 0]}>
      <object3D ref={target} position={[0, 0.15, 0.2]} />
      <spotLight ref={light} position={[0, 1.55, 1.35]} angle={0.62} penumbra={0.75} intensity={dimmed ? 2.2 : 7.5} distance={8} decay={2} color={brand.ivory} castShadow={false} />
      <group ref={lift}>
        <mesh position={[0, 0.05, -0.09]}>
          <boxGeometry args={[2.68, 3.08, 0.02]} />
          <meshBasicMaterial color={brand.red} transparent opacity={focused ? 1 : 0} depthWrite={false} />
        </mesh>
        <mesh position={[0, 0, -0.04]} castShadow={!lowPower}>
          <boxGeometry args={[2.55, 2.95, 0.07]} />
          <meshStandardMaterial color={brand.ink} roughness={0.45} metalness={0.18} />
        </mesh>
        <mesh position={[0, 0.22, 0]}>
          <planeGeometry args={[2.32, 2.32]} />
          <meshStandardMaterial color={brand.ivory} roughness={0.85} />
        </mesh>
        {image ? (
          <Suspense fallback={null}>
            <Photograph src={image.src} />
          </Suspense>
        ) : null}
        <mesh
          position={[0, 0.1, 0.03]}
          onPointerOver={(event) => {
            event.stopPropagation();
            document.body.style.cursor = "pointer";
          }}
          onPointerOut={() => {
            document.body.style.cursor = "";
          }}
          onClick={(event) => {
            event.stopPropagation();
            if (dragged.current) return;
            onFocus(display.product.id);
          }}
        >
          <planeGeometry args={[2.45, 2.85]} />
          <meshBasicMaterial transparent opacity={0} depthWrite={false} />
        </mesh>
        <mesh position={[0, -1.12, 0.01]}>
          <planeGeometry args={[1.7, 0.42]} />
          <meshBasicMaterial map={plaque} toneMapped={false} />
        </mesh>
      </group>
    </group>
  );
}

function Photograph({ src }: { src: string }) {
  const texture = useTexture(src);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 4;
  return (
    <mesh position={[0, 0.22, 0.012]}>
      <planeGeometry args={[2.18, 2.18]} />
      <meshBasicMaterial map={texture} toneMapped={false} />
    </mesh>
  );
}

function makePlaque(name: string, stock: string | null) {
  const canvas = document.createElement("canvas");
  canvas.width = 680;
  canvas.height = 180;
  const context = canvas.getContext("2d");
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  if (!context) return texture;
  context.clearRect(0, 0, 680, 180);
  context.fillStyle = brand.ivory;
  context.fillRect(0, 0, 680, 180);
  context.fillStyle = brand.red;
  context.fillRect(40, 28, 36, 3);
  context.fillStyle = brand.ink;
  context.font = "500 42px Times New Roman, serif";
  const lines = wrapText(context, name, 600);
  lines.forEach((line, index) => {
    context.fillText(line, 40, 78 + index * 40);
  });
  context.font = "400 26px Times New Roman, serif";
  const y = lines.length > 1 ? 158 : 128;
  context.fillStyle = brand.ink;
  context.fillText(enquiryCopy.details, 40, y);
  if (stock) {
    const offset = context.measureText(`${enquiryCopy.details}   `).width;
    context.fillStyle = stock === "In stock" ? brand.forest : brand.ink;
    context.fillText(stock, 40 + offset, y);
  }
  texture.needsUpdate = true;
  return texture;
}

function wrapText(context: CanvasRenderingContext2D, text: string, maxWidth: number) {
  const words = text.split(" ");
  const lines: string[] = [];
  let line = "";
  words.forEach((word) => {
    const next = line ? `${line} ${word}` : word;
    if (context.measureText(next).width > maxWidth && line) {
      lines.push(line);
      line = word;
    } else {
      line = next;
    }
  });
  if (line) lines.push(line);
  return lines.slice(0, 2);
}

function Walker({
  displays,
  focusId,
  reduced,
  walk,
  bounds,
}: {
  displays: ExhibitionDisplay[];
  focusId: string | null;
  reduced: boolean;
  walk: RefObject<WalkControl>;
  bounds: ReturnType<typeof corridorBounds>;
}) {
  const { camera, gl } = useThree();
  const look = useMemo(() => new THREE.Vector3(0, EYE, 0), []);
  const desired = useMemo(() => new THREE.Vector3(), []);
  const desiredLook = useMemo(() => new THREE.Vector3(), []);
  const focusIdRef = useRef(focusId);
  focusIdRef.current = focusId;

  useEffect(() => {
    const element = gl.domElement;
    let lastX = 0;
    let lastY = 0;
    let active = false;
    const down = (event: PointerEvent) => {
      active = true;
      dragged.current = false;
      lastX = event.clientX;
      lastY = event.clientY;
    };
    const move = (event: PointerEvent) => {
      if (!active || focusIdRef.current || !walk.current) return;
      const dx = event.clientX - lastX;
      const dy = event.clientY - lastY;
      if (Math.hypot(dx, dy) > 5) dragged.current = true;
      lastX = event.clientX;
      lastY = event.clientY;
      walk.current.yaw = THREE.MathUtils.clamp(walk.current.yaw - dx * 0.0024, -0.5, 0.5);
      walk.current.progress = THREE.MathUtils.clamp(walk.current.progress - dy * 0.0018, 0, 1);
    };
    const up = () => {
      active = false;
      window.setTimeout(() => {
        dragged.current = false;
      }, 0);
    };
    const wheel = (event: WheelEvent) => {
      if (focusIdRef.current || !walk.current) return;
      event.preventDefault();
      walk.current.progress = THREE.MathUtils.clamp(walk.current.progress + event.deltaY * 0.00055, 0, 1);
    };
    element.addEventListener("pointerdown", down);
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    element.addEventListener("wheel", wheel, { passive: false });
    return () => {
      element.removeEventListener("pointerdown", down);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      element.removeEventListener("wheel", wheel);
    };
  }, [gl, walk]);

  useFrame((_, delta) => {
    const control = walk.current;
    if (!control) return;
    if (control.nudge !== 0 && !focusIdRef.current) {
      control.progress = THREE.MathUtils.clamp(control.progress + control.nudge, 0, 1);
      control.nudge = 0;
    }
    if (!focusIdRef.current) control.yaw = THREE.MathUtils.damp(control.yaw, 0, 2.4, delta);
    const z = THREE.MathUtils.lerp(bounds.nearZ, bounds.farZ, control.progress);
    const focus = displays.find((display) => display.product.id === focusIdRef.current);
    if (focus) {
      desired.set(focus.side * -0.2, EYE, focus.z);
      desiredLook.set(focus.x, 1.55, focus.z);
    } else {
      desired.set(Math.sin(control.yaw) * 0.45, EYE, z);
      desiredLook.set(Math.sin(control.yaw) * 3.2, EYE - 0.05, z - 7);
    }
    const blend = reduced ? 1 : 1 - Math.exp(-5 * delta);
    camera.position.lerp(desired, blend);
    look.lerp(desiredLook, blend);
    camera.lookAt(look);
  });
  return null;
}
