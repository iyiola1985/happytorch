"use client";

import { RoundedBox } from "@react-three/drei";
import type { Tone } from "@/components/three/materials";
import { materialsFor, useRoomMaterials } from "@/components/three/materials";
import { brand } from "@/lib/brand";
import { SignatureChair } from "@/components/three/signature-chair";

export function Sofa({ tone = "living" }: { tone?: Tone }) {
  const materials = materialsFor(tone);
  return (
    <group>
      <mesh position={[0, 0.06, 0]} material={materials.wood} castShadow receiveShadow>
        <boxGeometry args={[2.08, 0.08, 0.86]} />
      </mesh>
      <RoundedBox args={[1.96, 0.14, 0.78]} radius={0.03} smoothness={2} position={[0, 0.18, 0.02]} material={materials.fabric} castShadow />
      {[-0.64, 0, 0.64].map((x) => (
        <RoundedBox
          key={x}
          args={[0.6, 0.11, 0.64]}
          radius={0.04}
          smoothness={2}
          position={[x, 0.3, 0.05]}
          material={materials.fabricLight}
          castShadow
        />
      ))}
      <RoundedBox
        args={[1.96, 0.4, 0.14]}
        radius={0.03}
        smoothness={2}
        position={[0, 0.48, -0.32]}
        rotation={[-0.08, 0, 0]}
        material={materials.fabric}
        castShadow
      />
      <mesh position={[-1.04, 0.34, 0]} material={materials.fabric} castShadow>
        <boxGeometry args={[0.12, 0.32, 0.82]} />
      </mesh>
      <mesh position={[1.04, 0.34, 0]} material={materials.fabric} castShadow>
        <boxGeometry args={[0.12, 0.32, 0.82]} />
      </mesh>
    </group>
  );
}

export function CentreTable({ tone = "living" }: { tone?: Tone }) {
  const materials = materialsFor(tone);
  const feet: Array<[number, number]> = [
    [-0.42, -0.2],
    [0.42, -0.2],
    [-0.42, 0.2],
    [0.42, 0.2],
  ];
  return (
    <group>
      <RoundedBox args={[1.08, 0.035, 0.56]} radius={0.006} smoothness={1} position={[0, 0.36, 0]} material={materials.stone} castShadow receiveShadow />
      {feet.map(([x, z]) => (
        <mesh key={`${x}-${z}`} position={[x, 0.17, z]} material={materials.metal} castShadow>
          <cylinderGeometry args={[0.012, 0.012, 0.34, 8]} />
        </mesh>
      ))}
    </group>
  );
}

export function FloorLamp({ tone = "living", elevate = 0 }: { tone?: Tone; elevate?: number }) {
  const materials = materialsFor(tone);
  return (
    <group position={[0, elevate, 0]}>
      <mesh position={[0, 0.012, 0]} rotation={[-Math.PI / 2, 0, 0]} material={materials.metal} receiveShadow>
        <circleGeometry args={[0.16, 24]} />
      </mesh>
      <mesh position={[0, 0.72, 0]} material={materials.metal} castShadow>
        <cylinderGeometry args={[0.012, 0.016, 1.4, 8]} />
      </mesh>
      <mesh position={[0, 1.42, 0]} material={materials.shade} castShadow>
        <cylinderGeometry args={[0.16, 0.22, 0.28, 20, 1, true]} />
      </mesh>
      <mesh position={[0, 1.38, 0]}>
        <sphereGeometry args={[0.035, 12, 12]} />
        <meshBasicMaterial color={brand.ivory} />
      </mesh>
    </group>
  );
}

export function DiningTable({ tone = "dining" }: { tone?: Tone }) {
  const materials = materialsFor(tone);
  return (
    <group>
      <mesh position={[0, 0.74, 0]} material={materials.stone} castShadow receiveShadow>
        <boxGeometry args={[1.8, 0.04, 0.9]} />
      </mesh>
      {[
        [-0.75, -0.32],
        [0.75, -0.32],
        [-0.75, 0.32],
        [0.75, 0.32],
      ].map(([x, z]) => (
        <mesh key={`${x}-${z}`} position={[x, 0.36, z]} material={materials.wood} castShadow>
          <boxGeometry args={[0.06, 0.72, 0.06]} />
        </mesh>
      ))}
    </group>
  );
}

export function DiningChair({ tone = "dining" }: { tone?: Tone }) {
  const materials = materialsFor(tone);
  return (
    <group>
      <mesh position={[0, 0.46, 0]} material={materials.fabric} castShadow>
        <boxGeometry args={[0.42, 0.05, 0.42]} />
      </mesh>
      <mesh position={[0, 0.78, -0.18]} material={materials.fabricLight} castShadow>
        <boxGeometry args={[0.42, 0.46, 0.04]} />
      </mesh>
      {[
        [-0.16, 0.16],
        [0.16, 0.16],
        [-0.16, -0.16],
        [0.16, -0.16],
      ].map(([x, z]) => (
        <mesh key={`${x}-${z}`} position={[x, 0.22, z]} material={materials.wood} castShadow>
          <cylinderGeometry args={[0.015, 0.012, 0.44, 8]} />
        </mesh>
      ))}
    </group>
  );
}

export function Bed({ tone = "bedroom" }: { tone?: Tone }) {
  const materials = materialsFor(tone);
  return (
    <group>
      <mesh position={[0, 0.16, 0.05]} material={materials.wood} castShadow receiveShadow>
        <boxGeometry args={[1.7, 0.22, 2.1]} />
      </mesh>
      <mesh position={[0, 0.32, 0.08]} material={materials.fabricLight} castShadow>
        <boxGeometry args={[1.58, 0.14, 1.9]} />
      </mesh>
      <mesh position={[0, 0.62, -0.9]} material={materials.fabric} castShadow>
        <boxGeometry args={[1.7, 0.7, 0.08]} />
      </mesh>
      <RoundedBox args={[0.48, 0.12, 0.28]} radius={0.04} smoothness={2} position={[-0.32, 0.44, -0.62]} material={materials.fabric} castShadow />
      <RoundedBox args={[0.48, 0.12, 0.28]} radius={0.04} smoothness={2} position={[0.32, 0.44, -0.62]} material={materials.fabricLight} castShadow />
    </group>
  );
}

export function SideTable({ tone = "bedroom" }: { tone?: Tone }) {
  const materials = materialsFor(tone);
  return (
    <group>
      <mesh position={[0, 0.48, 0]} material={materials.wood} castShadow receiveShadow>
        <boxGeometry args={[0.42, 0.04, 0.42]} />
      </mesh>
      <mesh position={[0, 0.24, 0]} material={materials.wood} castShadow>
        <boxGeometry args={[0.34, 0.44, 0.34]} />
      </mesh>
    </group>
  );
}

export function Console({ tone = "gallery" }: { tone?: Tone }) {
  const materials = materialsFor(tone);
  return (
    <group>
      <mesh position={[0, 0.28, 0]} material={materials.wood} castShadow receiveShadow>
        <boxGeometry args={[1.55, 0.42, 0.38]} />
      </mesh>
      <mesh position={[0, 0.5, 0]} material={materials.stone} castShadow>
        <boxGeometry args={[1.6, 0.025, 0.42]} />
      </mesh>
    </group>
  );
}

export function Pendant({ tone = "dining" }: { tone?: Tone }) {
  const materials = materialsFor(tone);
  return (
    <group>
      <mesh position={[0, 1.55, 0]} material={materials.metal}>
        <cylinderGeometry args={[0.004, 0.004, 0.8, 6]} />
      </mesh>
      <mesh position={[0, 1.12, 0]} material={materials.shade} castShadow>
        <cylinderGeometry args={[0.16, 0.26, 0.2, 20, 1, true]} />
      </mesh>
    </group>
  );
}

export function Plinth() {
  const materials = materialsFor("gallery");
  return (
    <mesh position={[0, 0.08, 0]} material={materials.stone} receiveShadow castShadow>
      <cylinderGeometry args={[0.46, 0.5, 0.16, 28]} />
    </mesh>
  );
}

export function RoomShell({ tone = "living" }: { tone?: Tone }) {
  const materials = useRoomMaterials(tone);
  return (
    <group>
      <mesh position={[0, -0.04, 0]} material={materials.floor} receiveShadow>
        <boxGeometry args={[8, 0.08, 7]} />
      </mesh>
      <mesh position={[0, 0.006, 0.15]} rotation={[-Math.PI / 2, 0, 0]} material={materials.rug} receiveShadow>
        <planeGeometry args={[tone === "dining" ? 3.2 : 3.6, tone === "dining" ? 3.6 : 2.3]} />
      </mesh>
      <mesh position={[-2.7, 1.45, -2.85]} material={materials.wall} receiveShadow>
        <boxGeometry args={[2.4, 2.9, 0.12]} />
      </mesh>
      <mesh position={[2.7, 1.45, -2.85]} material={materials.wall} receiveShadow>
        <boxGeometry args={[2.4, 2.9, 0.12]} />
      </mesh>
      <mesh position={[0, 2.65, -2.85]} material={materials.wall}>
        <boxGeometry args={[3, 0.5, 0.12]} />
      </mesh>
      <mesh position={[0, 1.4, -2.77]} material={materials.window}>
        <planeGeometry args={[1.7, 1.8]} />
      </mesh>
      <mesh position={[-3.95, 1.45, 0]} rotation={[0, Math.PI / 2, 0]} material={materials.wall}>
        <planeGeometry args={[7, 2.9]} />
      </mesh>
      <mesh position={[3.95, 1.45, 0]} rotation={[0, -Math.PI / 2, 0]} material={materials.wall}>
        <planeGeometry args={[7, 2.9]} />
      </mesh>
    </group>
  );
}

export function AccentSeating({ tone = "living" }: { tone?: Tone }) {
  return <SignatureChair tone={tone} />;
}
