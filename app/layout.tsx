import type { Metadata, Viewport } from "next";
import { Bodoni_Moda, Cormorant_Garamond, Outfit } from "next/font/google";
import { brand } from "@/lib/brand";
import { site, siteUrl } from "@/lib/site";
import "./globals.css";

const serif = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

const sans = Outfit({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-outfit",
  display: "swap",
});

const display = Bodoni_Moda({
  subsets: ["latin"],
  weight: ["500"],
  style: ["italic"],
  variable: "--font-bodoni",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl()),
  title: {
    default: "Happy Touch Interiors · Luxury furniture in Lagos",
    template: "%s · Happy Touch Interiors",
  },
  description: site.description,
  applicationName: site.name,
  keywords: [
    "Happy Touch Interiors",
    "luxury furniture in Lagos",
    "furniture shop in Lagos",
    "luxury sofas in Nigeria",
    "home furniture Nigeria",
    "interior design Lagos",
    "furniture wholesale Nigeria",
    "international furniture delivery from Lagos",
  ],
  authors: [{ name: site.name }],
  openGraph: {
    type: "website",
    locale: "en_NG",
    siteName: site.name,
    title: "Happy Touch Interiors",
    description: site.description,
  },
  twitter: {
    card: "summary_large_image",
    title: "Happy Touch Interiors",
    description: site.description,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: brand.ivory,
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${serif.variable} ${sans.variable} ${display.variable}`}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
