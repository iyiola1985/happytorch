import Link from "next/link";
import { CollectionBrowser } from "@/components/collection/collection-browser";
import { getPublicCatalogue } from "@/lib/public-products";
import { pageMetadata } from "@/lib/seo";
import { getCategories, getSettings } from "@/lib/store";

export const metadata = pageMetadata({
  title: "Collection",
  description: "Furniture from Happy Touch Interiors in Lagos. Sofas, chairs, dining, tables, lighting and home furnishings, wholesale and retail.",
  path: "/collection",
});

export default async function CollectionPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const [products, categories, settings, params] = await Promise.all([
    getPublicCatalogue(),
    getCategories(),
    getSettings(),
    searchParams,
  ]);
  const initial = categories.some((category) => category.slug === params.category || category.id === params.category)
    ? categories.find((category) => category.slug === params.category || category.id === params.category)?.id ?? ""
    : "";
  return (
    <div className="pt-32 md:pt-40">
      <header className="px-6 pb-10 md:px-10">
        <p className="kicker text-[0.68rem] uppercase tracking-[0.32em] text-forest">Happy Touch Interiors</p>
        <h1 className="mt-4 max-w-4xl font-serif text-[clamp(2.6rem,12vw,6.5rem)] leading-[0.9]">Collection</h1>
        <p className="mt-6 max-w-xl text-base leading-7 text-charcoal">
          The pieces currently released by the studio. Each one can be enquired for retail purchase or wholesale supply.
        </p>
        <Link href="/showroom" className="btn mt-8">
          Enter the 3D showroom
        </Link>
      </header>
      <CollectionBrowser products={products} categories={categories} initialCategory={initial} whatsappNumber={settings.whatsappNumber} />
    </div>
  );
}
