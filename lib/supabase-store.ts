import "server-only";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { site } from "@/lib/site";
import type { Category, Enquiry, EnquiryStatus, Product, Settings } from "@/lib/types";
import type { AssetKind, CatalogRepository } from "@/lib/repository";

type ProductRow = {
  id: string;
  slug: string;
  name: string;
  category_id: string;
  description: string;
  price_ngn: number | null;
  international_amount: number | null;
  international_currency: string | null;
  stock_status: Product["stockStatus"];
  dimensions: string;
  material: string;
  colour: string;
  featured: boolean;
  homepage_featured: boolean;
  showroom_room: Product["showroomRoom"];
  showroom_anchor: string | null;
  model_path: string;
  published: boolean;
  created_at: string;
  updated_at: string;
  product_images?: { id: string; src: string; alt: string; sort_order: number }[];
};

type SettingsRow = {
  whatsapp_number: string;
  instagram_url: string;
  chair_model_path: string;
  chair_scale: number;
  chair_rotation_y: number;
  hero_product_id: string;
  logo_path: string;
};

function client(): SupabaseClient {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("Supabase is not configured.");
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

function mapProduct(row: ProductRow): Product {
  const images = [...(row.product_images ?? [])].sort((a, b) => a.sort_order - b.sort_order);
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    categoryId: row.category_id,
    description: row.description ?? "",
    images: images.map((image) => ({ src: image.src, alt: image.alt })),
    priceNgn: row.price_ngn,
    internationalPrice:
      row.international_amount != null && row.international_currency
        ? { amount: Number(row.international_amount), currency: row.international_currency }
        : null,
    stockStatus: row.stock_status,
    dimensions: row.dimensions ?? "",
    material: row.material ?? "",
    colour: row.colour ?? "",
    featured: row.featured,
    homepageFeatured: row.homepage_featured,
    showroomRoom: row.showroom_room,
    showroomAnchor: row.showroom_anchor,
    modelPath: row.model_path ?? "",
    published: row.published,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function productRow(product: Product) {
  return {
    id: product.id,
    slug: product.slug,
    name: product.name,
    category_id: product.categoryId,
    description: product.description,
    price_ngn: product.priceNgn,
    international_amount: product.internationalPrice?.amount ?? null,
    international_currency: product.internationalPrice?.currency ?? null,
    stock_status: product.stockStatus,
    dimensions: product.dimensions,
    material: product.material,
    colour: product.colour,
    featured: product.featured,
    homepage_featured: product.homepageFeatured,
    showroom_room: product.showroomRoom,
    showroom_anchor: product.showroomAnchor,
    model_path: product.modelPath,
    published: product.published,
    created_at: product.createdAt,
    updated_at: product.updatedAt,
  };
}

function mapSettings(row: SettingsRow | null): Settings {
  return {
    whatsappNumber: row?.whatsapp_number ?? "",
    instagramUrl: row?.instagram_url || site.instagram,
    chairModelPath: row?.chair_model_path ?? "",
    chairScale: row?.chair_scale == null ? 1 : Number(row.chair_scale),
    chairRotationY: row?.chair_rotation_y == null ? 0 : Number(row.chair_rotation_y),
    heroProductId: row?.hero_product_id ?? "",
    logoPath: row?.logo_path ?? "",
  };
}

function bucket(kind: AssetKind) {
  switch (kind) {
    case "image":
      return "product-images";
    case "model":
      return "models";
    case "logo":
      return "brand-assets";
    default: {
      const _exhaustive: never = kind;
      return _exhaustive;
    }
  }
}

async function throwIf(error: { message: string } | null) {
  if (error) throw new Error(error.message);
}

export function supabaseRepository(): CatalogRepository {
  const db = client();
  return {
    async listProducts() {
      const { data, error } = await db
        .from("products")
        .select("*, product_images(*)")
        .order("created_at", { ascending: false });
      throwIf(error);
      return ((data ?? []) as ProductRow[]).map(mapProduct);
    },
    async upsertProduct(product) {
      const { error } = await db.from("products").upsert(productRow(product));
      throwIf(error);
      const removed = await db.from("product_images").delete().eq("product_id", product.id);
      throwIf(removed.error);
      if (product.images.length === 0) return;
      const inserted = await db.from("product_images").insert(
        product.images.map((image, index) => ({
          id: crypto.randomUUID(),
          product_id: product.id,
          src: image.src,
          alt: image.alt,
          sort_order: index,
        })),
      );
      throwIf(inserted.error);
    },
    async deleteProduct(id) {
      const { error } = await db.from("products").delete().eq("id", id);
      throwIf(error);
    },
    async listCategories() {
      const { data, error } = await db.from("categories").select("*").order("sort_order");
      throwIf(error);
      return (data ?? []).map((row) => ({
        id: row.id as string,
        slug: row.slug as string,
        name: row.name as string,
        description: (row.description as string) ?? "",
        sortOrder: row.sort_order as number,
      }));
    },
    async upsertCategory(category: Category) {
      const { error } = await db.from("categories").upsert({
        id: category.id,
        slug: category.slug,
        name: category.name,
        description: category.description,
        sort_order: category.sortOrder,
      });
      throwIf(error);
    },
    async deleteCategory(id) {
      const { error } = await db.from("categories").delete().eq("id", id);
      throwIf(error);
    },
    async listEnquiries() {
      const { data, error } = await db.from("enquiries").select("*").order("created_at", { ascending: false });
      throwIf(error);
      return (data ?? []).map((row) => {
        const payload = row.payload as Enquiry;
        return { ...payload, id: row.id as string, status: row.status as EnquiryStatus, createdAt: row.created_at as string };
      });
    },
    async addEnquiry(enquiry) {
      const { error } = await db.from("enquiries").insert({
        id: enquiry.id,
        status: enquiry.status,
        created_at: enquiry.createdAt,
        payload: enquiry,
      });
      throwIf(error);
    },
    async updateEnquiry(id, status) {
      const existing = await db.from("enquiries").select("payload").eq("id", id).single();
      throwIf(existing.error);
      const payload = { ...(existing.data?.payload as Enquiry), status };
      const { error } = await db.from("enquiries").update({ status, payload }).eq("id", id);
      throwIf(error);
    },
    async getSettings() {
      const { data, error } = await db.from("site_settings").select("*").eq("id", 1).maybeSingle();
      throwIf(error);
      return mapSettings(data as SettingsRow | null);
    },
    async updateSettings(settings) {
      const { error } = await db.from("site_settings").upsert({
        id: 1,
        whatsapp_number: settings.whatsappNumber,
        instagram_url: settings.instagramUrl,
        chair_model_path: settings.chairModelPath,
        chair_scale: settings.chairScale,
        chair_rotation_y: settings.chairRotationY,
        hero_product_id: settings.heroProductId,
        logo_path: settings.logoPath,
      });
      throwIf(error);
    },
    async saveAsset(kind, id, bytes, ext) {
      const name = `${kind}/${id}/${crypto.randomUUID()}.${ext}`;
      const target = bucket(kind);
      const uploaded = await db.storage.from(target).upload(name, bytes, {
        contentType: ext === "glb" ? "model/gltf-binary" : `image/${ext === "jpg" ? "jpeg" : ext}`,
        upsert: false,
      });
      throwIf(uploaded.error);
      const { data } = db.storage.from(target).getPublicUrl(name);
      return data.publicUrl;
    },
    async deleteAsset(src) {
      const url = process.env.SUPABASE_URL;
      if (!url || !src.startsWith(url)) return;
      const marker = "/storage/v1/object/public/";
      const index = src.indexOf(marker);
      if (index < 0) return;
      const rest = src.slice(index + marker.length);
      const slash = rest.indexOf("/");
      if (slash < 0) return;
      const bucketName = rest.slice(0, slash);
      const objectPath = rest.slice(slash + 1);
      await db.storage.from(bucketName).remove([objectPath]);
    },
  };
}

export function supabaseConfigured() {
  return Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
}
