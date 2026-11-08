"use client";

import { Billboard, useTexture } from "@react-three/drei";
import { useLayoutEffect } from "react";
import * as THREE from "three";

const SOURCE = "/home/luxury-sofa.webp";
const HEIGHT = 1.12;

export function LandingSofaPhoto() {
  const texture = useTexture(SOURCE);

  useLayoutEffect(() => {
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = 8;
    texture.needsUpdate = true;
  }, [texture]);

  const image = texture.image as { width?: number; height?: number };
  const width = image.width && image.height ? HEIGHT * (image.width / image.height) : HEIGHT * 0.8;

  return (
    <Billboard>
      <mesh position={[0, HEIGHT * 0.48, 0]}>
        <planeGeometry args={[width, HEIGHT]} />
        <meshBasicMaterial map={texture} toneMapped={false} />
      </mesh>
    </Billboard>
  );
}
