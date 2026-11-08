import { useLayoutEffect, useMemo } from "react";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

export function prepareModel(scene: THREE.Object3D, targetHeight: number) {
  scene.updateMatrixWorld(true);
  const first = new THREE.Box3().setFromObject(scene);
  const size = first.getSize(new THREE.Vector3());
  const scale = targetHeight / (size.y || 1);
  scene.scale.multiplyScalar(scale);
  scene.updateMatrixWorld(true);
  const next = new THREE.Box3().setFromObject(scene);
  const center = next.getCenter(new THREE.Vector3());
  scene.position.x -= center.x;
  scene.position.z -= center.z;
  scene.position.y -= next.min.y;
  scene.traverse((node) => {
    if (node instanceof THREE.Mesh) {
      node.castShadow = true;
      node.receiveShadow = true;
    }
  });
}

export function GltfModel({ url, targetHeight }: { url: string; targetHeight: number }) {
  const gltf = useGLTF(url);
  const scene = useMemo(() => gltf.scene.clone(true), [gltf.scene]);
  useLayoutEffect(() => {
    prepareModel(scene, targetHeight);
  }, [scene, targetHeight]);
  return <primitive object={scene} />;
}
