"use client";

import { useEffect, useMemo } from "react";
import * as THREE from "three";
import type { Tone } from "@/components/three/materials";
import { brand } from "@/lib/brand";

function useBoucle() {
  const material = useMemo(() => {
    const size = 96;
    const data = new Uint8Array(size * size * 4);
    for (let i = 0; i < size * size; i += 1) {
      const grain = 150 + Math.floor(Math.random() * 105);
      data[i * 4] = grain;
      data[i * 4 + 1] = grain;
      data[i * 4 + 2] = grain;
      data[i * 4 + 3] = 255;
    }
    const bump = new THREE.DataTexture(data, size, size);
    bump.wrapS = THREE.RepeatWrapping;
    bump.wrapT = THREE.RepeatWrapping;
    bump.repeat.set(5, 5);
    bump.needsUpdate = true;
    bump.colorSpace = THREE.NoColorSpace;
    return new THREE.MeshPhysicalMaterial({
      color: "#e4d9cc",
      roughness: 0.94,
      metalness: 0,
      sheen: 1,
      sheenColor: new THREE.Color(brand.ivory),
      sheenRoughness: 0.62,
      bumpMap: bump,
      bumpScale: 0.045,
    });
  }, []);

  useEffect(
    () => () => {
      material.bumpMap?.dispose();
      material.dispose();
    },
    [material],
  );

  return material;
}

export function SignatureChair({ tone: _tone = "living" }: { tone?: Tone }) {
  const boucle = useBoucle();
  return (
    <group position={[0, 0.05, 0]}>
      <mesh position={[0, 0.2, 0.08]} scale={[1.35, 0.34, 1.2]} material={boucle} castShadow receiveShadow>
        <sphereGeometry args={[0.32, 40, 24]} />
      </mesh>
      <mesh position={[0, 0.46, -0.18]} scale={[1.2, 1, 0.55]} material={boucle} castShadow>
        <sphereGeometry args={[0.34, 40, 24]} />
      </mesh>
      <mesh position={[-0.34, 0.32, 0.02]} scale={[0.42, 0.36, 0.95]} material={boucle} castShadow>
        <sphereGeometry args={[0.28, 28, 18]} />
      </mesh>
      <mesh position={[0.34, 0.32, 0.02]} scale={[0.42, 0.36, 0.95]} material={boucle} castShadow>
        <sphereGeometry args={[0.28, 28, 18]} />
      </mesh>
      <mesh position={[0, 0.015, 0.04]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <circleGeometry args={[0.28, 32]} />
        <meshStandardMaterial color={brand.ink} roughness={0.8} />
      </mesh>
    </group>
  );
}
