import "server-only";

import type { Category, Enquiry, EnquiryStatus, Product, Settings } from "@/lib/types";

export type AssetKind = "image" | "model" | "logo";

export interface CatalogRepository {
  listProducts(): Promise<Product[]>;
  upsertProduct(product: Product): Promise<void>;
  deleteProduct(id: string): Promise<void>;
  listCategories(): Promise<Category[]>;
  upsertCategory(category: Category): Promise<void>;
  deleteCategory(id: string): Promise<void>;
  listEnquiries(): Promise<Enquiry[]>;
  addEnquiry(enquiry: Enquiry): Promise<void>;
  updateEnquiry(id: string, status: EnquiryStatus): Promise<void>;
  getSettings(): Promise<Settings>;
  updateSettings(settings: Settings): Promise<void>;
  saveAsset(kind: AssetKind, id: string, bytes: Buffer, ext: string): Promise<string>;
  deleteAsset(src: string): Promise<void>;
}
