import type { Product } from "@/lib/types";

/**
 * Customer-facing commercial language.
 * Stored prices remain on the product record for the studio desk.
 * Public pages receive PublicProduct, which has no price fields.
 */
export type PublicProduct = Omit<Product, "priceNgn" | "internationalPrice">;

export function toPublicProduct(product: Product): PublicProduct {
  return {
    id: product.id,
    slug: product.slug,
    name: product.name,
    categoryId: product.categoryId,
    description: publicCopy(product.description),
    images: product.images,
    stockStatus: product.stockStatus,
    dimensions: product.dimensions,
    material: product.material,
    colour: product.colour,
    featured: product.featured,
    homepageFeatured: product.homepageFeatured,
    showroomRoom: product.showroomRoom,
    showroomAnchor: product.showroomAnchor,
    modelPath: product.modelPath,
    published: product.published,
    createdAt: product.createdAt,
    updatedAt: product.updatedAt,
  };
}

export function toPublicProducts(products: Product[]) {
  return products.map(toPublicProduct);
}

export const enquiryCopy = {
  details: "Enquire for Details",
  request: "Request Information",
  piece: "Contact Us About This Piece",
} as const;

const amount = /(?:₦\s*)?(?:\d{1,3}(?:,\d{3})+|\b\d+\s*k\b)\s*(?:only)?/gi;

function dropOrphanQuotes(text: string) {
  let opens = 0;
  let result = "";
  for (const char of text) {
    if (char === "“") opens += 1;
    if (char === "”") {
      if (opens === 0) continue;
      opens -= 1;
    }
    result += char;
  }
  return result;
}

/** Drop currency amounts from copy before it is shown to a visitor. */
export function publicCopy(text: string) {
  const stripped = text
    .replace(amount, "")
    .replace(/\s+([,.;:!?])/g, "$1")
    .replace(/,\s*\./g, ".")
    .replace(/[“"]\s*[.,]\s*/g, "")
    .replace(/(^|[\s“"])[.,]\s+/g, "$1")
    .replace(/\s{2,}/g, " ")
    .replace(/\s+([”"])/g, "$1");
  return dropOrphanQuotes(stripped).trim();
}
