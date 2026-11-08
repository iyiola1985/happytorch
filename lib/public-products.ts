import "server-only";

import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "node:fs";
import path from "node:path";
import { toPublicProduct, type PublicProduct } from "@/lib/public-catalogue";
import { supabaseConfigured } from "@/lib/supabase-store";
import type { Product } from "@/lib/types";

function readCatalogue(): Product[] {
  try {
    const raw = readFileSync(path.join(process.cwd(), "data", "products.json"), "utf8");
    return JSON.parse(raw) as Product[];
  } catch {
    return [];
  }
}

async function loadCatalogue(): Promise<PublicProduct[]> {
  if (!supabaseConfigured()) return readCatalogue().map(toPublicProduct);
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return readCatalogue().map(toPublicProduct);
  const db = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
  const { data, error } = await db
    .from("products")
    .select("id, slug, name, category_id, description, stock_status, dimensions, material, colour, featured, homepage_featured, showroom_room, showroom_anchor, model_path, published, created_at, updated_at, product_images(*)")
    .order("created_at", { ascending: false });
  if (error || !data) return [];
  return (data as Array<Record<string, unknown>>).map((row) => {
    const images = [...((row.product_images as Array<{ src: string; alt: string; sort_order: number }> | null) ?? [])].sort(
      (a, b) => a.sort_order - b.sort_order,
    );
    return toPublicProduct({
      id: String(row.id),
      slug: String(row.slug),
      name: String(row.name),
      categoryId: String(row.category_id),
      description: String(row.description ?? ""),
      images: images.map((image) => ({ src: image.src, alt: image.alt })),
      priceNgn: null,
      internationalPrice: null,
      stockStatus: (row.stock_status as Product["stockStatus"]) ?? null,
      dimensions: String(row.dimensions ?? ""),
      material: String(row.material ?? ""),
      colour: String(row.colour ?? ""),
      featured: Boolean(row.featured),
      homepageFeatured: Boolean(row.homepage_featured),
      showroomRoom: (row.showroom_room as Product["showroomRoom"]) ?? null,
      showroomAnchor: row.showroom_anchor ? String(row.showroom_anchor) : null,
      modelPath: String(row.model_path ?? ""),
      published: Boolean(row.published),
      createdAt: String(row.created_at),
      updatedAt: String(row.updated_at),
    });
  });
}

function related(products: PublicProduct[], current: PublicProduct) {
  const others = products.filter((item) => item.published && item.id !== current.id);
  const same = others.filter((item) => item.categoryId === current.categoryId);
  return {
    title: same.length > 0 ? "In this category" : "Also in the collection",
    items: (same.length > 0 ? same : others).slice(0, 3),
  };
}

export async function getPublicCatalogue() {
  const products = await loadCatalogue();
  return products.filter((product) => product.published);
}

export async function getPublicPiece(slug: string) {
  const products = await loadCatalogue();
  const product = products.find((item) => item.slug === slug);
  if (!product) return null;
  return { product, more: related(products, product) };
}
