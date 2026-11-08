import "server-only";

import { mkdir, readFile, rename, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { site } from "@/lib/site";
import type { Category, Enquiry, Product, Settings } from "@/lib/types";
import type { CatalogRepository } from "@/lib/repository";

const dataDir = path.join(process.cwd(), "data");
const publicDir = path.join(process.cwd(), "public");

const defaultSettings = (): Settings => ({
  whatsappNumber: "",
  instagramUrl: site.instagram,
  chairModelPath: "",
  chairScale: 1,
  chairRotationY: 0,
  heroProductId: "",
  logoPath: "",
});

let chain: Promise<unknown> = Promise.resolve();

function serialize<T>(task: () => Promise<T>) {
  const run = chain.then(task, task);
  chain = run.then(
    () => undefined,
    () => undefined,
  );
  return run;
}

async function readJson<T>(file: string, fallback: T): Promise<T> {
  try {
    const raw = await readFile(path.join(dataDir, file), "utf8");
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

async function writeJson(file: string, data: unknown) {
  await mkdir(dataDir, { recursive: true });
  const full = path.join(dataDir, file);
  const temp = `${full}.${process.pid}.tmp`;
  await writeFile(temp, JSON.stringify(data, null, 2));
  await rename(temp, full);
}

function normalizeSettings(raw: Partial<Settings> | null | undefined): Settings {
  const base = defaultSettings();
  if (!raw) return base;
  return {
    whatsappNumber: raw.whatsappNumber ?? "",
    instagramUrl: raw.instagramUrl || base.instagramUrl,
    chairModelPath: raw.chairModelPath ?? "",
    chairScale: typeof raw.chairScale === "number" ? raw.chairScale : 1,
    chairRotationY: typeof raw.chairRotationY === "number" ? raw.chairRotationY : 0,
    heroProductId: raw.heroProductId ?? "",
    logoPath: raw.logoPath ?? "",
  };
}

function safePublicFile(src: string) {
  if (!src.startsWith("/media/") && !src.startsWith("/models/uploads/")) return null;
  if (src.includes("..")) return null;
  const full = path.resolve(publicDir, src.slice(1));
  const root = path.resolve(publicDir);
  if (full !== root && !full.startsWith(`${root}${path.sep}`)) return null;
  return full;
}

async function removeSrc(src: string) {
  const full = safePublicFile(src);
  if (!full) return;
  await rm(full, { force: true });
}

export function fileRepository(): CatalogRepository {
  return {
    async listProducts() {
      const products = await readJson<Product[]>("products.json", []);
      return products.map((product) => ({
        ...product,
        images: product.images ?? [],
        internationalPrice: product.internationalPrice ?? null,
        stockStatus: product.stockStatus ?? null,
        showroomRoom: product.showroomRoom ?? null,
        showroomAnchor: product.showroomAnchor ?? null,
        modelPath: product.modelPath ?? "",
        dimensions: product.dimensions ?? "",
        material: product.material ?? "",
        colour: product.colour ?? "",
      }));
    },
    upsertProduct(product) {
      return serialize(async () => {
        const products = await readJson<Product[]>("products.json", []);
        const index = products.findIndex((item) => item.id === product.id);
        if (index >= 0) products[index] = product;
        else products.push(product);
        await writeJson("products.json", products);
      });
    },
    deleteProduct(id) {
      return serialize(async () => {
        const products = await readJson<Product[]>("products.json", []);
        const current = products.find((item) => item.id === id);
        await writeJson(
          "products.json",
          products.filter((item) => item.id !== id),
        );
        if (!current) return;
        await Promise.all((current.images ?? []).map((image) => removeSrc(image.src)));
        if (current.modelPath) await removeSrc(current.modelPath);
        await rm(path.join(publicDir, "media", "products", id), { recursive: true, force: true });
      });
    },
    async listCategories() {
      const categories = await readJson<Category[]>("categories.json", []);
      return [...categories].sort((a, b) => a.sortOrder - b.sortOrder);
    },
    upsertCategory(category) {
      return serialize(async () => {
        const categories = await readJson<Category[]>("categories.json", []);
        const index = categories.findIndex((item) => item.id === category.id);
        if (index >= 0) categories[index] = category;
        else categories.push(category);
        await writeJson("categories.json", categories);
      });
    },
    deleteCategory(id) {
      return serialize(async () => {
        const categories = await readJson<Category[]>("categories.json", []);
        await writeJson(
          "categories.json",
          categories.filter((item) => item.id !== id),
        );
      });
    },
    async listEnquiries() {
      const enquiries = await readJson<Enquiry[]>("enquiries.json", []);
      return [...enquiries].sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
    },
    addEnquiry(enquiry) {
      return serialize(async () => {
        const enquiries = await readJson<Enquiry[]>("enquiries.json", []);
        enquiries.push(enquiry);
        await writeJson("enquiries.json", enquiries);
      });
    },
    updateEnquiry(id, status) {
      return serialize(async () => {
        const enquiries = await readJson<Enquiry[]>("enquiries.json", []);
        await writeJson(
          "enquiries.json",
          enquiries.map((enquiry) => (enquiry.id === id ? { ...enquiry, status } : enquiry)),
        );
      });
    },
    async getSettings() {
      return normalizeSettings(await readJson<Partial<Settings>>("settings.json", defaultSettings()));
    },
    updateSettings(settings) {
      return serialize(async () => {
        await writeJson("settings.json", settings);
      });
    },
    async saveAsset(kind, id, bytes, ext) {
      const filename = `${crypto.randomUUID()}.${ext}`;
      const relative =
        kind === "image"
          ? path.join("media", "products", id, filename)
          : kind === "logo"
            ? path.join("media", "brand", filename)
            : path.join("models", "uploads", filename);
      const full = path.join(publicDir, relative);
      await mkdir(path.dirname(full), { recursive: true });
      await writeFile(full, bytes);
      return `/${relative.split(path.sep).join("/")}`;
    },
    deleteAsset(src) {
      return removeSrc(src);
    },
  };
}
