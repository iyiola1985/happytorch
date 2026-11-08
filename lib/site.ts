export const site = {
  name: "Happy Touch Interiors",
  shortName: "Happy Touch",
  tagline: "Your No.1 Source for Home Elegance.",
  instagram: "https://www.instagram.com/happytouchinteriors/",
  instagramHandle: "@happytouchinteriors",
  location: "Lagos, Nigeria",
  locality: "Lagos",
  country: "Nigeria",
  description:
    "Happy Touch Interiors is a Lagos furniture, interior and construction studio. Wholesale and retail, with nationwide delivery in Nigeria and worldwide delivery on enquiry.",
} as const;

export const navItems = [
  { href: "/collection", label: "Collection" },
  { href: "/showroom", label: "3D Showroom" },
  { href: "/interiors", label: "Interiors" },
  { href: "/wholesale", label: "Wholesale" },
  { href: "/about", label: "Our Story" },
] as const;

export function siteUrl() {
  return (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, "");
}
