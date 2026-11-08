import { ExhibitionGallery } from "@/components/gallery/exhibition-gallery";
import { getPublicCatalogue } from "@/lib/public-products";
import { pageMetadata } from "@/lib/seo";
import { getCategories, getSettings } from "@/lib/store";

export const metadata = pageMetadata({
  title: "3D Showroom",
  description: "Walk the Happy Touch collection, an exhibition corridor of the studio's furniture.",
  path: "/showroom",
});

export default async function ShowroomPage() {
  const [products, categories, settings] = await Promise.all([getPublicCatalogue(), getCategories(), getSettings()]);
  return <ExhibitionGallery products={products} categories={categories} whatsappNumber={settings.whatsappNumber} />;
}
