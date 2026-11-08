export type Vec3 = [number, number, number];

export type JourneyFrame = {
  at: number;
  camera: Vec3;
  target: Vec3;
  chair: Vec3;
  chairYaw: number;
  fogNear: number;
  fogFar: number;
  roomLight: number;
  exposure: number;
};

/**
 * Scroll path for the homepage studio.
 * The signature chair is replaced from Studio settings when a GLB is uploaded.
 * Intensities in the scene assume a chair about 0.9m tall.
 */
export const journey: JourneyFrame[] = [
  {
    at: 0,
    camera: [-0.55, 0.98, 3.45],
    target: [-0.15, 0.48, 0],
    chair: [0.85, 0, 0.05],
    chairYaw: 0.45,
    fogNear: 4.8,
    fogFar: 9.2,
    roomLight: 0,
    exposure: 1.05,
  },
  {
    at: 0.16,
    camera: [1.15, 0.96, 2.85],
    target: [-0.05, 0.5, 0],
    chair: [0.05, 0, 0],
    chairYaw: 1.05,
    fogNear: 5.2,
    fogFar: 10,
    roomLight: 0.14,
    exposure: 1.05,
  },
  {
    at: 0.33,
    camera: [1.65, 0.9, 2.05],
    target: [-0.45, 0.48, 0],
    chair: [-0.85, 0, -0.15],
    chairYaw: 1.7,
    fogNear: 6,
    fogFar: 12,
    roomLight: 0.46,
    exposure: 1.02,
  },
  {
    at: 0.52,
    camera: [0.15, 1.18, -3.15],
    target: [-0.2, 0.5, -6.1],
    chair: [-1.45, 0, -5.35],
    chairYaw: 0.85,
    fogNear: 7.5,
    fogFar: 16,
    roomLight: 1,
    exposure: 1,
  },
  {
    at: 0.7,
    camera: [4.6, 1.22, -4.35],
    target: [6.6, 0.48, -6],
    chair: [-1.45, 0, -5.35],
    chairYaw: 0.7,
    fogNear: 6.5,
    fogFar: 15,
    roomLight: 0.45,
    exposure: 1.04,
  },
  {
    at: 0.85,
    camera: [1.1, 1.72, -2.1],
    target: [0.2, 0.42, -6.2],
    chair: [-1.45, 0, -5.35],
    chairYaw: 0.55,
    fogNear: 8,
    fogFar: 18,
    roomLight: 0.85,
    exposure: 0.96,
  },
  {
    at: 1,
    camera: [-1.55, 1.02, -3.55],
    target: [0.35, 0.46, -6.15],
    chair: [-1.45, 0, -5.35],
    chairYaw: 0.95,
    fogNear: 8,
    fogFar: 18,
    roomLight: 1,
    exposure: 1.02,
  },
];

function smooth(t: number) {
  const u = Math.min(1, Math.max(0, t));
  return u * u * (3 - 2 * u);
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function lerpVec(a: Vec3, b: Vec3, t: number): Vec3 {
  return [lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t)];
}

export function sampleJourney(progress: number, narrow: boolean) {
  const t = Math.min(1, Math.max(0, progress));
  let index = 0;
  while (index < journey.length - 2 && t > journey[index + 1].at) index += 1;
  const from = journey[index];
  const to = journey[index + 1];
  const u = smooth((t - from.at) / (to.at - from.at || 1));
  const sample = {
    camera: lerpVec(from.camera, to.camera, u),
    target: lerpVec(from.target, to.target, u),
    chair: lerpVec(from.chair, to.chair, u),
    chairYaw: lerp(from.chairYaw, to.chairYaw, u),
    fogNear: lerp(from.fogNear, to.fogNear, u),
    fogFar: lerp(from.fogFar, to.fogFar, u),
    roomLight: lerp(from.roomLight, to.roomLight, u),
    exposure: lerp(from.exposure, to.exposure, u),
  };
  if (narrow) {
    sample.camera = [sample.camera[0] * 0.06, sample.camera[1] * 0.55 + 0.08, sample.camera[2] + 0.95];
    sample.target = [sample.target[0] * 0.04, -0.08, sample.target[2]];
    sample.chair = [sample.chair[0] * 0.04, sample.chair[1], sample.chair[2]];
  }
  return sample;
}

export const lineupSlots = [
  { position: [4.55, 0, -6] as Vec3, kind: "chair" as const, height: 0.86 },
  { position: [6.15, 0, -6] as Vec3, kind: "table" as const, height: 0.42 },
  { position: [7.55, 0, -6] as Vec3, kind: "lamp" as const, height: 1.45 },
  { position: [9.05, 0, -6] as Vec3, kind: "console" as const, height: 0.52 },
];
