import { z } from "zod";
import { deliveryScopes, enquiryTypes, showroomRoomIds, stockStatuses } from "@/lib/types";

export const enquirySchema = z
  .object({
    intent: z.enum(enquiryTypes),
    name: z.string().trim().min(2, "Please enter your name.").max(120),
    email: z.string().trim().email("Enter a valid email address.").max(180),
    phone: z.string().trim().max(40).optional().default(""),
    message: z.string().trim().min(8, "Please add a few words about the enquiry.").max(4000),
    businessName: z.string().trim().max(160).optional().default(""),
    role: z.string().trim().max(120).optional().default(""),
    destination: z.string().trim().max(160).optional().default(""),
    deliveryScope: z.enum(["", ...deliveryScopes]).optional().default(""),
    interests: z.array(z.string().max(120)).max(20).optional().default([]),
    quantity: z.string().trim().max(80).optional().default(""),
    productSlug: z.string().trim().max(120).optional().default(""),
    projectType: z.string().trim().max(80).optional().default(""),
  })
  .superRefine((value, context) => {
    if (value.intent === "wholesale") {
      if (!value.businessName) {
        context.addIssue({ code: "custom", path: ["businessName"], message: "Add the business name." });
      }
      if (!value.quantity) {
        context.addIssue({ code: "custom", path: ["quantity"], message: "Add an estimated quantity." });
      }
      if (!value.destination) {
        context.addIssue({ code: "custom", path: ["destination"], message: "Add the destination country." });
      }
    }
    if (value.intent === "delivery" && !value.deliveryScope) {
      context.addIssue({
        code: "custom",
        path: ["deliveryScope"],
        message: "Choose nationwide or international.",
      });
    }
    if (value.intent === "delivery" && !value.destination) {
      context.addIssue({ code: "custom", path: ["destination"], message: "Add the destination." });
    }
    if (value.phone && value.phone.replace(/\D/g, "").length < 7) {
      context.addIssue({ code: "custom", path: ["phone"], message: "Check the telephone number." });
    }
  });

const optionalNumber = z
  .string()
  .trim()
  .optional()
  .transform((value) => {
    if (!value) return null;
    const amount = Number(value);
    return Number.isFinite(amount) ? amount : Number.NaN;
  });

export const productSchema = z.object({
  id: z.string().trim().optional().default(""),
  name: z.string().trim().min(2, "Add the product name.").max(140),
  slug: z.string().trim().max(80).optional().default(""),
  categoryId: z.string().trim().min(1, "Choose a category."),
  description: z.string().trim().max(5000).optional().default(""),
  priceNgn: optionalNumber.refine((value) => value == null || value >= 0, "Price must be a number."),
  internationalAmount: optionalNumber.refine(
    (value) => value == null || value >= 0,
    "International price must be a number.",
  ),
  internationalCurrency: z
    .string()
    .trim()
    .toUpperCase()
    .optional()
    .default("")
    .refine((value) => value === "" || /^[A-Z]{3}$/.test(value), "Use a three-letter currency code."),
  stockStatus: z.enum(["", ...stockStatuses]).optional().default(""),
  dimensions: z.string().trim().max(200).optional().default(""),
  material: z.string().trim().max(200).optional().default(""),
  colour: z.string().trim().max(120).optional().default(""),
  featured: z.boolean().optional().default(false),
  homepageFeatured: z.boolean().optional().default(false),
  published: z.boolean().optional().default(false),
  showroomRoom: z.enum(["", ...showroomRoomIds]).optional().default(""),
  showroomAnchor: z.string().trim().max(80).optional().default(""),
  modelPath: z.string().trim().max(240).optional().default(""),
});

export const categorySchema = z.object({
  id: z.string().trim().optional().default(""),
  name: z.string().trim().min(2).max(80),
  description: z.string().trim().max(400).optional().default(""),
  sortOrder: z.coerce.number().int().min(0).max(999),
});

export const settingsSchema = z.object({
  whatsappNumber: z
    .string()
    .trim()
    .max(24)
    .refine((value) => {
      if (!value) return true;
      const digits = value.replace(/\D/g, "");
      return digits.length >= 8 && digits.length <= 15;
    }, "Enter the number in international format, or leave it empty."),
  instagramUrl: z
    .string()
    .trim()
    .url("Enter a full Instagram URL.")
    .refine((value) => value.startsWith("https://"), "The Instagram URL should begin with https://"),
  chairScale: z.coerce.number().min(0.1).max(8),
  chairRotationY: z.coerce.number().min(-360).max(360),
  heroProductId: z.string().trim().max(80).optional().default(""),
  chairModelPath: z.string().trim().max(240).optional().default(""),
  logoPath: z.string().trim().max(240).optional().default(""),
});

export function isSafeAssetPath(value: string) {
  if (!value) return true;
  if (value.startsWith("https://")) return true;
  return /^\/(media|models)\/[a-zA-Z0-9._/-]+$/.test(value) && !value.includes("..");
}
