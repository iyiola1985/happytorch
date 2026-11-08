import { notFound } from "next/navigation";
import { ProductView } from "@/components/product/product-view";
import { readSession } from "@/lib/auth";
import { getPublicPiece } from "@/lib/public-products";
import { pageMetadata } from "@/lib/seo";
import { getCategories, getSettings } from "@/lib/store";
import { siteUrl } from "@/lib/site";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const piece = await getPublicPiece(slug);
  if (!piece) return { title: "Piece" };
  return pageMetadata({
    title: piece.product.name,
    description: piece.product.description || `${piece.product.name}, from Happy Touch Interiors in Lagos.`,
    path: `/collection/${piece.product.slug}`,
  });
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [piece, categories, settings, session] = await Promise.all([
    getPublicPiece(slug),
    getCategories(),
    getSettings(),
    readSession(),
  ]);
  if (!piece || (!piece.product.published && !session)) notFound();
  const category = categories.find((item) => item.id === piece.product.categoryId) ?? null;
  const url = `${siteUrl()}/collection/${piece.product.slug}`;
  const structured = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: piece.product.name,
    description: piece.product.description || undefined,
    image: piece.product.images.map((image) => image.src),
    category: category?.name,
    url,
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structured) }} />
      <ProductView product={piece.product} category={category} whatsappNumber={settings.whatsappNumber} more={piece.more} />
    </>
  );
}
