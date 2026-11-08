import { useMemo } from "react";
import * as THREE from "three";
import { brand, mixBrand } from "@/lib/brand";

export type Tone = "living" | "dining" | "bedroom" | "lounge" | "gallery";

export type StudioMaterials = {
  fabric: THREE.MeshPhysicalMaterial;
  fabricLight: THREE.MeshPhysicalMaterial;
  wood: THREE.MeshPhysicalMaterial;
  stone: THREE.MeshPhysicalMaterial;
  metal: THREE.MeshPhysicalMaterial;
  shade: THREE.MeshStandardMaterial;
};

const palettes: Record<Tone, { fabric: string; fabricLight: string; wood: string; stone: string; metal: string; shade: string }> = {
  living: { fabric: "#b7a89a", fabricLight: "#d8cbbd", wood: "#3a2a22", stone: "#e4dcd2", metal: "#2a2623", shade: "#f3e7d8" },
  dining: { fabric: "#514940", fabricLight: "#6d645b", wood: "#2b211c", stone: "#e7e0d6", metal: "#24211e", shade: "#f4ebdf" },
  bedroom: { fabric: "#8c8276", fabricLight: "#d2c7b8", wood: "#4a3b32", stone: "#ddd4c8", metal: "#3a342e", shade: "#f7f0e6" },
  lounge: { fabric: "#3a322d", fabricLight: "#514840", wood: "#241c18", stone: "#b7aea3", metal: "#1c1917", shade: "#ead6c0" },
  gallery: { fabric: "#6d6258", fabricLight: "#8d8072", wood: "#3c2c24", stone: "#ddd6cb", metal: "#2c2825", shade: "#f6eee3" },
};

const cache = new Map<Tone, StudioMaterials>();

export function materialsFor(tone: Tone) {
  const existing = cache.get(tone);
  if (existing) return existing;
  const palette = palettes[tone];
  const sheen = new THREE.Color(brand.ivory);
  const created: StudioMaterials = {
    fabric: new THREE.MeshPhysicalMaterial({
      color: palette.fabric,
      roughness: 0.74,
      metalness: 0,
      sheen: 0.55,
      sheenColor: sheen,
      sheenRoughness: 0.5,
    }),
    fabricLight: new THREE.MeshPhysicalMaterial({
      color: palette.fabricLight,
      roughness: 0.68,
      metalness: 0,
      sheen: 0.7,
      sheenColor: sheen,
      sheenRoughness: 0.42,
    }),
    wood: new THREE.MeshPhysicalMaterial({
      color: palette.wood,
      roughness: 0.4,
      metalness: 0.02,
      clearcoat: 0.16,
      clearcoatRoughness: 0.55,
    }),
    stone: new THREE.MeshPhysicalMaterial({ color: palette.stone, roughness: 0.55, metalness: 0.02, clearcoat: 0.08 }),
    metal: new THREE.MeshPhysicalMaterial({ color: palette.metal, roughness: 0.32, metalness: 0.62 }),
    shade: new THREE.MeshStandardMaterial({
      color: palette.shade,
      roughness: 0.7,
      side: THREE.DoubleSide,
      emissive: new THREE.Color(brand.ivory),
      emissiveIntensity: 0.18,
    }),
  };
  cache.set(tone, created);
  return created;
}

export function useRoomMaterials(tone: Tone) {
  return useMemo(() => {
    const wall = tone === "living" ? brand.ivory : brand.ink;
    const floor = tone === "living" ? mixBrand(brand.ivory, brand.ink, 0.08) : brand.ink;
    const rug = tone === "living" ? mixBrand(brand.ivory, brand.ink, 0.22) : brand.ink;
    return {
      floor: new THREE.MeshStandardMaterial({ color: floor, roughness: 0.95 }),
      wall: new THREE.MeshStandardMaterial({ color: wall, roughness: 1 }),
      window: new THREE.MeshBasicMaterial({
        color: brand.ivory,
        transparent: true,
        opacity: tone === "living" ? 0.55 : tone === "lounge" ? 0.08 : 0.16,
      }),
      rug: new THREE.MeshStandardMaterial({ color: rug, roughness: 1 }),
    };
  }, [tone]);
}
