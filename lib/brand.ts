/**
 * Happy Touch Interiors palette.
 * These values are the source for Three.js, canvas plaques, and generated images.
 * app/globals.css @theme must stay in step with them.
 */
export const brand = {
  ivory: "#f5f2ec",
  ink: "#111111",
  red: "#a51f2b",
  redHover: "#861924",
  forest: "#355e45",
} as const;

function channel(hex: string, index: number) {
  return Number.parseInt(hex.slice(1 + index * 2, 3 + index * 2), 16);
}

/** Blend two palette hexes. Used for light bounce and stone grain, not a new brand colour. */
export function mixBrand(from: string, to: string, amount: number) {
  const mix = (start: number, end: number) => Math.round(start + (end - start) * amount);
  const red = mix(channel(from, 0), channel(to, 0));
  const green = mix(channel(from, 1), channel(to, 1));
  const blue = mix(channel(from, 2), channel(to, 2));
  return `#${[red, green, blue].map((value) => value.toString(16).padStart(2, "0")).join("")}`;
}
