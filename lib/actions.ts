"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { attemptLogin, clearSession, requireAdmin } from "@/lib/auth";
import { slugify } from "@/lib/format";
import { detectImage, detectModel } from "@/lib/media";
import { anchors } from "@/lib/showroom-config";
import {
  getCategories,
  getProductBySlug,
  getProducts,
  removeAsset,
  removeCategory,
  removeProduct,
  saveCategoryRecord,
  saveEnquiry,
  saveProductRecord,
  saveSettingsRecord,
  setEnquiryStatus,
  storeAsset,
} from "@/lib/store";
import type { Enquiry, EnquiryStatus, Product, StockStatus } from "@/lib/types";
import { categorySchema, enquirySchema, isSafeAssetPath, productSchema, settingsSchema } from "@/lib/validators";

export type FormState = {
  ok: boolean;
  error?: string;
  fieldErrors?: Record<string, string[] | undefined>;
};

const hits = new Map<string, number[]>();

function rateLimited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((time) => now - time < 60 * 60 * 1000);
  if (recent.length >= 5) {
    hits.set(ip, recent);
    return true;
  }
  recent.push(now);
  hits.set(ip, recent);
  return false;
}

function checked(formData: FormData, name: string) {
  return formData.get(name) === "on";
}

export async function loginAction(_previous: FormState, formData: FormData): Promise<FormState> {
  const result = await attemptLogin(String(formData.get("email") ?? ""), String(formData.get("password") ?? ""));
  if (!result.ok) return { ok: false, error: result.error };
  redirect("/admin");
}

export async function logoutAction() {
  await clearSession();
  redirect("/admin/login");
}

export async function createEnquiry(_previous: FormState, formData: FormData): Promise<FormState> {
  if (String(formData.get("companyWebsite") ?? "").trim()) return { ok: true };
  const headerList = await headers();
  const ip = headerList.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  if (rateLimited(ip)) {
    return { ok: false, error: "Please wait a while before sending another enquiry." };
  }

  const text = (name: string) => String(formData.get(name) ?? "");
  const parsed = enquirySchema.safeParse({
    intent: text("intent"),
    name: text("name"),
    email: text("email"),
    phone: text("phone"),
    message: text("message"),
    businessName: text("businessName"),
    role: text("role"),
    destination: text("destination"),
    deliveryScope: text("deliveryScope"),
    interests: formData.getAll("interests").map(String),
    quantity: text("quantity"),
    productSlug: text("productSlug"),
    projectType: text("projectType"),
  });
  if (!parsed.success) {
    return {
      ok: false,
      error: "Please review the form.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const value = parsed.data;
  const product = value.productSlug ? await getProductBySlug(value.productSlug) : null;
  const enquiry: Enquiry = {
    id: crypto.randomUUID(),
    type: value.intent,
    status: "new",
    createdAt: new Date().toISOString(),
    name: value.name,
    email: value.email,
    phone: value.phone ?? "",
    message: value.message,
    businessName: value.businessName ?? "",
    role: value.role ?? "",
    destination: value.destination ?? "",
    deliveryScope: value.deliveryScope ? value.deliveryScope : null,
    interests: value.interests ?? [],
    quantity: value.quantity ?? "",
    productId: product?.id ?? "",
    productName: product?.name ?? "",
    projectType: value.projectType ?? "",
  };
  await saveEnquiry(enquiry);
  revalidatePath("/admin/enquiries");
  return { ok: true };
}

export async function saveProduct(_previous: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const text = (name: string) => String(formData.get(name) ?? "");
  const parsed = productSchema.safeParse({
    id: text("id"),
    name: text("name"),
    slug: text("slug"),
    categoryId: text("categoryId"),
    description: text("description"),
    priceNgn: text("priceNgn"),
    internationalAmount: text("internationalAmount"),
    internationalCurrency: text("internationalCurrency"),
    stockStatus: text("stockStatus"),
    dimensions: text("dimensions"),
    material: text("material"),
    colour: text("colour"),
    featured: checked(formData, "featured"),
    homepageFeatured: checked(formData, "homepageFeatured"),
    published: checked(formData, "published"),
    showroomRoom: "",
    showroomAnchor: text("showroomAnchor"),
    modelPath: text("modelPath"),
  });
  if (!parsed.success) {
    return { ok: false, error: "Please review the product.", fieldErrors: parsed.error.flatten().fieldErrors };
  }
  const value = parsed.data;
  if (value.internationalAmount != null && !value.internationalCurrency) {
    return { ok: false, error: "Add a currency for the international price." };
  }
  if (value.modelPath && !isSafeAssetPath(value.modelPath)) {
    return { ok: false, error: "The model path is not valid." };
  }

  const categories = await getCategories();
  if (!categories.some((category) => category.id === value.categoryId)) {
    return { ok: false, error: "Choose a category that exists." };
  }

  const anchor = value.showroomAnchor ? anchors.find((item) => item.id === value.showroomAnchor) : undefined;
  if (value.showroomAnchor && !anchor) return { ok: false, error: "That showroom place does not exist." };
  if (anchor && value.showroomRoom && value.showroomRoom !== anchor.room) {
    return { ok: false, error: "The showroom place belongs to a different room." };
  }

  const products = await getProducts();
  const id = value.id || crypto.randomUUID();
  if (anchor && products.some((product) => product.showroomAnchor === anchor.id && product.id !== id)) {
    return { ok: false, error: "Another product is already linked to that showroom place." };
  }

  let slug = slugify(value.slug || value.name);
  if (!slug) return { ok: false, error: "The name needs letters or numbers so a page address can be made." };
  let suffix = 2;
  const base = slug;
  while (products.some((product) => product.slug === slug && product.id !== id)) {
    slug = `${base}-${suffix}`;
    suffix += 1;
  }

  const previous = products.find((product) => product.id === id) ?? null;
  const existingSrc = formData.getAll("existingSrc").map(String);
  const existingAlt = formData.getAll("existingAlt").map(String);
  const images = existingSrc.map((src, index) => ({
    src,
    alt: (existingAlt[index] || value.name).trim() || value.name,
  }));
  if (images.some((image) => !isSafeAssetPath(image.src) && !image.src.startsWith("https://"))) {
    return { ok: false, error: "One of the saved images has an unsafe path." };
  }

  const uploads = formData.getAll("images").filter((item): item is File => item instanceof File && item.size > 0);
  if (images.length + uploads.length > 8) return { ok: false, error: "A product can hold up to 8 photographs." };
  const imageAlt = String(formData.get("imageAlt") ?? "").trim() || value.name;
  for (const file of uploads) {
    if (file.size > 5 * 1024 * 1024) return { ok: false, error: "Each photograph must be under 5MB." };
    const bytes = Buffer.from(await file.arrayBuffer());
    const ext = detectImage(bytes);
    if (!ext) return { ok: false, error: "Photographs must be JPG, PNG, WEBP or AVIF." };
    images.push({ src: await storeAsset("image", id, bytes, ext), alt: imageAlt });
  }

  let modelPath = value.modelPath ?? "";
  const modelFile = formData.get("model");
  if (modelFile instanceof File && modelFile.size > 0) {
    if (modelFile.size > 40 * 1024 * 1024) return { ok: false, error: "The 3D model must be under 40MB." };
    const bytes = Buffer.from(await modelFile.arrayBuffer());
    const ext = detectModel(bytes);
    if (!ext) return { ok: false, error: "Upload a GLB or GLTF model." };
    modelPath = await storeAsset("model", id, bytes, ext);
  }

  if (previous) {
    const kept = new Set(images.map((image) => image.src));
    await Promise.all(previous.images.filter((image) => !kept.has(image.src)).map((image) => removeAsset(image.src)));
    if (previous.modelPath && previous.modelPath !== modelPath) await removeAsset(previous.modelPath);
  }

  const now = new Date().toISOString();
  const product: Product = {
    id,
    slug,
    name: value.name,
    categoryId: value.categoryId,
    description: value.description ?? "",
    images,
    priceNgn: value.priceNgn,
    internationalPrice:
      value.internationalAmount != null && value.internationalCurrency
        ? { amount: value.internationalAmount, currency: value.internationalCurrency }
        : null,
    stockStatus: value.stockStatus ? (value.stockStatus as StockStatus) : null,
    dimensions: value.dimensions ?? "",
    material: value.material ?? "",
    colour: value.colour ?? "",
    featured: value.featured ?? false,
    homepageFeatured: value.homepageFeatured ?? false,
    showroomRoom: anchor?.room ?? null,
    showroomAnchor: anchor?.id ?? null,
    modelPath,
    published: value.published ?? false,
    createdAt: previous?.createdAt ?? now,
    updatedAt: now,
  };
  await saveProductRecord(product);
  revalidatePath("/", "layout");
  redirect(`/admin/products/${product.id}?saved=1`);
}

export async function deleteProductAction(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (!id) return;
  await removeProduct(id);
  revalidatePath("/", "layout");
  redirect("/admin/products");
}

export async function saveCategory(formData: FormData) {
  await requireAdmin();
  const parsed = categorySchema.safeParse({
    id: formData.get("id"),
    name: formData.get("name"),
    description: formData.get("description"),
    sortOrder: formData.get("sortOrder"),
  });
  if (!parsed.success) return;
  const categories = await getCategories();
  const id = parsed.data.id || slugify(parsed.data.name);
  if (!id) return;
  if (categories.some((category) => category.id !== id && category.slug === id)) return;
  const previous = categories.find((category) => category.id === id);
  await saveCategoryRecord({
    id,
    slug: previous?.slug ?? id,
    name: parsed.data.name,
    description: parsed.data.description ?? "",
    sortOrder: parsed.data.sortOrder,
  });
  revalidatePath("/", "layout");
}

export async function deleteCategoryAction(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const products = await getProducts();
  if (products.some((product) => product.categoryId === id)) return;
  await removeCategory(id);
  revalidatePath("/", "layout");
}

export async function saveSettings(_previous: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const text = (name: string) => String(formData.get(name) ?? "");
  const parsed = settingsSchema.safeParse({
    whatsappNumber: text("whatsappNumber"),
    instagramUrl: text("instagramUrl"),
    chairScale: text("chairScale"),
    chairRotationY: text("chairRotationY"),
    heroProductId: text("heroProductId"),
    chairModelPath: text("chairModelPath"),
    logoPath: text("logoPath"),
  });
  if (!parsed.success) {
    return { ok: false, error: "Please review the settings.", fieldErrors: parsed.error.flatten().fieldErrors };
  }
  if (!isSafeAssetPath(parsed.data.chairModelPath ?? "") || !isSafeAssetPath(parsed.data.logoPath ?? "")) {
    return { ok: false, error: "A file path is not valid." };
  }
  const products = await getProducts();
  if (parsed.data.heroProductId && !products.some((product) => product.id === parsed.data.heroProductId)) {
    return { ok: false, error: "The homepage chair is linked to a product that does not exist." };
  }

  let chairModelPath = parsed.data.chairModelPath ?? "";
  let logoPath = parsed.data.logoPath ?? "";
  const modelFile = formData.get("chairModel");
  if (modelFile instanceof File && modelFile.size > 0) {
    if (modelFile.size > 40 * 1024 * 1024) return { ok: false, error: "The chair model must be under 40MB." };
    const bytes = Buffer.from(await modelFile.arrayBuffer());
    const ext = detectModel(bytes);
    if (!ext) return { ok: false, error: "Upload a GLB or GLTF model." };
    const nextPath = await storeAsset("model", "signature-chair", bytes, ext);
    if (chairModelPath && chairModelPath !== nextPath) await removeAsset(chairModelPath);
    chairModelPath = nextPath;
  }
  const logoFile = formData.get("logo");
  if (logoFile instanceof File && logoFile.size > 0) {
    if (logoFile.size > 2 * 1024 * 1024) return { ok: false, error: "The logo must be under 2MB." };
    const bytes = Buffer.from(await logoFile.arrayBuffer());
    const ext = detectImage(bytes);
    if (!ext) return { ok: false, error: "The logo must be a JPG, PNG, WEBP or AVIF." };
    const nextPath = await storeAsset("logo", "logo", bytes, ext);
    if (logoPath && logoPath !== nextPath) await removeAsset(logoPath);
    logoPath = nextPath;
  }

  await saveSettingsRecord({
    whatsappNumber: (parsed.data.whatsappNumber ?? "").replace(/[^\d+\s()-]/g, "").trim(),
    instagramUrl: parsed.data.instagramUrl,
    chairScale: parsed.data.chairScale,
    chairRotationY: parsed.data.chairRotationY,
    heroProductId: parsed.data.heroProductId ?? "",
    chairModelPath,
    logoPath,
  });
  revalidatePath("/", "layout");
  return { ok: true };
}

export async function setEnquiryStatusAction(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "");
  if (status !== "new" && status !== "read" && status !== "archived") return;
  await setEnquiryStatus(id, status as EnquiryStatus);
  revalidatePath("/admin/enquiries");
}
