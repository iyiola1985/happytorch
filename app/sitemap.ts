import type { MetadataRoute } from "next";
import { getPublishedProducts } from "@/lib/store";
import { siteUrl } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteUrl();
  const now = new Date();
  const staticRoutes = ["", "/collection", "/showroom", "/interiors", "/wholesale", "/about", "/delivery", "/contact"].map(
    (path) => ({
      url: `${base}${path || "/"}`,
      lastModified: now,
    }),
  );
  const products = await getPublishedProducts();
  return [
    ...staticRoutes,
    ...products.map((product) => ({
      url: `${base}/collection/${product.slug}`,
      lastModified: new Date(product.updatedAt),
    })),
  ];
}
