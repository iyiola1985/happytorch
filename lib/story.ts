export const scenes = [
  { id: "arrival", index: "01", label: "Arrival" },
  { id: "reveal", index: "02", label: "Reveal" },
  { id: "living", index: "03", label: "Living room" },
  { id: "collection", index: "04", label: "Collection" },
  { id: "brand", index: "05", label: "The house" },
  { id: "invitation", index: "06", label: "Invitation" },
] as const;

const bounds = [0, 0.16, 0.33, 0.52, 0.7, 0.85, 1];

export function sceneAt(progress: number) {
  const t = Math.min(1, Math.max(0, progress));
  let index = 0;
  for (let i = 0; i < bounds.length - 1; i += 1) {
    if (t >= bounds[i] && t < bounds[i + 1]) index = i;
  }
  if (t >= 1) index = scenes.length - 1;
  return index;
}
