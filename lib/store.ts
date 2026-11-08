import "server-only";

import { unstable_noStore as noStore } from "next/cache";
import { fileRepository } from "@/lib/file-store";
import type { CatalogRepository } from "@/lib/repository";
import { supabaseConfigured, supabaseRepository } from "@/lib/supabase-store";
import type { Product } from "@/lib/types";

function repository(): CatalogRepository {
  return supabaseConfigured() ? supabaseRepository() : fileRepository();
}

export async function getProducts() {
  noStore();
  return repository().listProducts();
}

export async function getPublishedProducts() {
  const products = await getProducts();
  return products.filter((product) => product.published);
}

export async function getProductBySlug(slug: string) {
  const products = await getProducts();
  return products.find((product) => product.slug === slug) ?? null;
}

export async function getProductById(id: string) {
  if (!id) return null;
  const products = await getProducts();
  return products.find((product) => product.id === id) ?? null;
}

export async function getCategories() {
  noStore();
  return repository().listCategories();
}

export async function getSettings() {
  noStore();
  return repository().getSettings();
}

export async function getEnquiries() {
  noStore();
  return repository().listEnquiries();
}

export async function saveProductRecord(product: Product) {
  await repository().upsertProduct(product);
}

export async function removeProduct(id: string) {
  await repository().deleteProduct(id);
}

export async function saveCategoryRecord(category: Parameters<CatalogRepository["upsertCategory"]>[0]) {
  await repository().upsertCategory(category);
}

export async function removeCategory(id: string) {
  await repository().deleteCategory(id);
}

export async function saveEnquiry(enquiry: Parameters<CatalogRepository["addEnquiry"]>[0]) {
  await repository().addEnquiry(enquiry);
}

export async function setEnquiryStatus(id: string, status: Parameters<CatalogRepository["updateEnquiry"]>[1]) {
  await repository().updateEnquiry(id, status);
}

export async function saveSettingsRecord(settings: Parameters<CatalogRepository["updateSettings"]>[0]) {
  await repository().updateSettings(settings);
}

export async function storeAsset(kind: Parameters<CatalogRepository["saveAsset"]>[0], id: string, bytes: Buffer, ext: string) {
  return repository().saveAsset(kind, id, bytes, ext);
}

export async function removeAsset(src: string) {
  await repository().deleteAsset(src);
}
