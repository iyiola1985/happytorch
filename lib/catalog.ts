import { publicCopy, type PublicProduct } from "@/lib/public-catalogue";
import type { Category } from "@/lib/types";

export type ProductSort = "featured" | "name" | "newest";

export function categoryName(categories: Category[], categoryId: string) {
  return categories.find((category) => category.id === categoryId)?.name ?? "Collection";
}

export function filterProducts(
  products: PublicProduct[],
  categories: Category[],
  input: { query: string; category: string; sort: ProductSort },
) {
  const query = input.query.trim().toLowerCase();
  const filtered = products.filter((product) => {
    if (!product.published) return false;
    if (input.category && product.categoryId !== input.category) return false;
    if (!query) return true;
    const category = categoryName(categories, product.categoryId).toLowerCase();
    const haystack = [product.name, publicCopy(product.description), product.material, product.colour, category]
      .join(" ")
      .toLowerCase();
    return haystack.includes(query);
  });

  const sorted = [...filtered];
  switch (input.sort) {
    case "name":
      sorted.sort((a, b) => a.name.localeCompare(b.name));
      break;
    case "newest":
      sorted.sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1));
      break;
    case "featured":
      sorted.sort((a, b) => {
        const score = (product: PublicProduct) =>
          (product.featured ? 2 : 0) + (product.homepageFeatured ? 1 : 0);
        const delta = score(b) - score(a);
        if (delta !== 0) return delta;
        return a.name.localeCompare(b.name);
      });
      break;
    default: {
      const _exhaustive: never = input.sort;
      return _exhaustive;
    }
  }
  return sorted;
}
