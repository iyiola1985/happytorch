"use client";

import Link from "next/link";
import { enquiryCopy, type PublicProduct } from "@/lib/public-catalogue";
import { useWishlist } from "@/components/wishlist/wishlist-provider";

export function WishlistView({ products }: { products: PublicProduct[] }) {
  const wishlist = useWishlist();
  const saved = products.filter((product) => wishlist.has(product.id));
  return (
    <div className="px-6 pb-24 pt-32 md:px-10 md:pt-40">
      <h1 className="font-serif text-6xl leading-none">Wishlist</h1>
      {saved.length === 0 ? (
        <p className="mt-8 max-w-md text-base leading-7">
          Pieces you save will gather here, on this device.
          <Link href="/collection" className="rule-link ml-4">
            <span>Collection</span>
            <span className="line" />
          </Link>
        </p>
      ) : (
        <div className="mt-12 flex flex-col">
          {saved.map((product) => (
            <article key={product.id} className="grid items-center gap-6 border-b border-espresso/10 py-8 md:grid-cols-[180px_1fr_auto]">
              <div className="aspect-square bg-ivory">
                {product.images[0] ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={product.images[0].src} alt={product.images[0].alt} loading="lazy" decoding="async" className="h-full w-full object-contain" />
                ) : null}
              </div>
              <div>
                <Link href={`/collection/${product.slug}`} className="font-serif text-4xl">
                  {product.name}
                </Link>
                <p className="mt-3 text-sm">{enquiryCopy.details}</p>
                <Link href={`/collection/${product.slug}#enquire`} className="btn mt-5">
                  {enquiryCopy.request}
                </Link>
              </div>
              <button type="button" onClick={() => wishlist.toggle(product.id)} className="text-[0.68rem] uppercase tracking-[0.22em]">
                Remove
              </button>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
