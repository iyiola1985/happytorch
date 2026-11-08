"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { brand } from "@/lib/brand";

function latLon(lat: number, lon: number, radius: number) {
  const phi = THREE.MathUtils.degToRad(lat);
  const lambda = THREE.MathUtils.degToRad(lon);
  return new THREE.Vector3(
    radius * Math.cos(phi) * Math.sin(lambda),
    radius * Math.sin(phi),
    radius * Math.cos(phi) * Math.cos(lambda),
  );
}

function arcGeometry(from: THREE.Vector3, to: THREE.Vector3) {
  const mid = from.clone().add(to).multiplyScalar(0.5);
  mid.normalize().multiplyScalar(1.22 + from.distanceTo(to) * 0.18);
  const curve = new THREE.QuadraticBezierCurve3(from, mid, to);
  return new THREE.BufferGeometry().setFromPoints(curve.getPoints(40));
}

export function GlobeScene({ reduced }: { reduced: boolean }) {
  const group = useRef<THREE.Group>(null);
  const graticule = useMemo(() => {
    const points: number[] = [];
    const push = (a: THREE.Vector3, b: THREE.Vector3) => {
      points.push(a.x, a.y, a.z, b.x, b.y, b.z);
    };
    for (let lat = -60; lat <= 60; lat += 30) {
      for (let lon = 0; lon < 360; lon += 8) {
        push(latLon(lat, lon, 1), latLon(lat, lon + 8, 1));
      }
    }
    for (let lon = 0; lon < 360; lon += 30) {
      for (let lat = -80; lat < 80; lat += 8) {
        push(latLon(lat, lon, 1), latLon(lat + 8, lon, 1));
      }
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.Float32BufferAttribute(points, 3));
    return geometry;
  }, []);

  const arcs = useMemo(() => {
    const origin = latLon(6.5244, 3.3792, 1.02);
    const ends = [
      latLon(25, -20, 1.02),
      latLon(48, 10, 1.02),
      latLon(10, 45, 1.02),
      latLon(-20, 28, 1.02),
      latLon(35, 55, 1.02),
    ];
    const material = new THREE.LineBasicMaterial({ color: brand.red, transparent: true, opacity: 0.8 });
    return ends.map((end) => new THREE.Line(arcGeometry(origin, end), material));
  }, []);

  const lagos = useMemo(() => latLon(6.5244, 3.3792, 1.03), []);

  useFrame(({ clock }) => {
    if (!group.current || reduced) return;
    group.current.rotation.y = Math.sin(clock.elapsedTime * 0.22) * 0.18;
  });

  return (
    <>
      <color attach="background" args={[brand.ink]} />
      <ambientLight intensity={0.7} />
      <directionalLight position={[3, 2, 4]} intensity={1.4} color={brand.ivory} />
      <group ref={group}>
        <mesh>
          <sphereGeometry args={[0.98, 48, 32]} />
          <meshStandardMaterial color={brand.ink} roughness={0.9} />
        </mesh>
        <lineSegments geometry={graticule}>
          <lineBasicMaterial color={brand.ivory} transparent opacity={0.55} />
        </lineSegments>
        {arcs.map((arc, index) => (
          <primitive key={index} object={arc} />
        ))}
        <mesh position={lagos}>
          <sphereGeometry args={[0.035, 16, 16]} />
          <meshBasicMaterial color={brand.forest} />
        </mesh>
      </group>
    </>
  );
}
