import { assertNever } from "@/lib/assert";
import type { DeliveryScope, EnquiryType, StockStatus } from "@/lib/types";

/** Studio records only. Customer pages use enquiryCopy in lib/public-catalogue.ts. */
export function formatNgn(amount: number) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatMoney(amount: number, currency: string) {
  try {
    return new Intl.NumberFormat("en", {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(amount);
  } catch {
    return `${currency} ${amount}`;
  }
}

export function formatDate(iso: string) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

export function stockLabel(status: StockStatus | null) {
  switch (status) {
    case "in_stock":
      return "In stock";
    case "out_of_stock":
      return "Out of stock";
    case "made_to_order":
      return "Made to order";
    case null:
      return null;
    default:
      return assertNever(status);
  }
}

export function enquiryLabel(type: EnquiryType) {
  switch (type) {
    case "retail":
      return "Retail";
    case "wholesale":
      return "Wholesale";
    case "interior":
      return "Interior";
    case "delivery":
      return "Delivery";
    case "general":
      return "General";
    default:
      return assertNever(type);
  }
}

export function deliveryLabel(scope: DeliveryScope) {
  switch (scope) {
    case "nationwide":
      return "Nationwide, Nigeria";
    case "international":
      return "International";
    default:
      return assertNever(scope);
  }
}

export function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

export function slugify(input: string) {
  const slug = input
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 80);
  return slug;
}
