export const SOFA_FRAME_COUNT = 238;
export const DESKTOP_FRAME_COUNT = 90;
export const MOBILE_FRAME_COUNT = 30;

export function sofaFrameSrc(index: number) {
  const number = String(index + 1).padStart(3, "0");
  return `/sofa-frames/frame-${number}.webp`;
}

export function sequenceIndices(count: number, total = SOFA_FRAME_COUNT) {
  return Array.from({ length: count }, (_, slot) => Math.round((slot * (total - 1)) / (count - 1)));
}

export function sequenceFrameSrc(slot: number, mobile: boolean) {
  const number = String(slot + 1).padStart(3, "0");
  if (mobile) return `/sequence/mobile/frame-${number}.webp`;
  const index = sequenceIndices(DESKTOP_FRAME_COUNT)[slot] ?? 0;
  return sofaFrameSrc(index);
}

export const ASSEMBLED_SOFA_SRC = sofaFrameSrc(SOFA_FRAME_COUNT - 1);
