import type { MetadataRoute } from "next";
import { brand } from "@/lib/brand";
import { site } from "@/lib/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: site.name,
    short_name: site.shortName,
    description: site.tagline,
    start_url: "/",
    display: "standalone",
    background_color: brand.ink,
    theme_color: brand.ivory,
  };
}
