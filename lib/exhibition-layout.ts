import type { PublicProduct } from "@/lib/public-catalogue";

export const HALL_HALF = 3.55;
export const EYE = 1.58;
export const FRAME_SPACING = 5.4;

export type ExhibitionDisplay = {
  product: PublicProduct;
  side: -1 | 1;
  x: number;
  z: number;
};

export function layoutExhibition(products: PublicProduct[]): ExhibitionDisplay[] {
  return products.map((product, index) => {
    const side: -1 | 1 = index % 2 === 0 ? -1 : 1;
    const row = Math.floor(index / 2);
    const stagger = side === 1 ? FRAME_SPACING * 0.48 : 0;
    const z = -6.5 - row * FRAME_SPACING - stagger;
    return { product, side, x: side * (HALL_HALF - 0.95), z };
  });
}

export function corridorBounds(displays: ExhibitionDisplay[]) {
  const far = displays.reduce((min, display) => Math.min(min, display.z), 0);
  return { nearZ: 6.2, farZ: far - 3.4, floorFar: far - 5, floorNear: 9 };
}
