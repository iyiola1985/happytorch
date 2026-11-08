export const SOFA_FRAME_COUNT = 238;

export function sofaFrameSrc(index: number) {
  const number = String(index + 1).padStart(3, "0");
  return `/sofa-frames/frame-${number}.webp`;
}

export const ASSEMBLED_SOFA_SRC = sofaFrameSrc(SOFA_FRAME_COUNT - 1);
