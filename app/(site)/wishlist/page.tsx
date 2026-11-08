import { WishlistView } from "@/components/wishlist/wishlist-view";
import { getPublicCatalogue } from "@/lib/public-products";

export const metadata = {
  title: "Wishlist",
  robots: { index: false, follow: false },
};

export default async function WishlistPage() {
  const products = await getPublicCatalogue();
  return <WishlistView products={products} />;
}
