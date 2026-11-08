"use client";

import { useState } from "react";
import { EnquiryForm } from "@/components/forms/enquiry-form";
import { stockLabel } from "@/lib/format";
import { enquiryCopy, publicCopy, type PublicProduct } from "@/lib/public-catalogue";
import type { Category } from "@/lib/types";
import { productWhatsAppMessage, whatsappHref } from "@/lib/whatsapp";
import { useWishlist } from "@/components/wishlist/wishlist-provider";
import Link from "next/link";

export function ProductView({
  product,
  category,
  whatsappNumber,
  more,
}: {
  product: PublicProduct;
  category: Category | null;
  whatsappNumber: string;
  more: { title: string; items: PublicProduct[] };
}) {
  const [index, setIndex] = useState(0);
  const [zoom, setZoom] = useState(false);
  const wishlist = useWishlist();
  const image = product.images[index];
  const stock = stockLabel(product.stockStatus);
  const whatsapp = whatsappNumber
    ? whatsappHref(
        whatsappNumber,
        productWhatsAppMessage({ name: product.name, category: category?.name ?? "Collection" }),
      )
    : null;

  return (
    <article className="px-6 pb-24 pt-32 md:px-10 md:pt-40">
      {!product.published ? (
        <p className="mb-8 text-[0.68rem] uppercase tracking-[0.22em] text-espresso/60">Unpublished. Visible to the studio only.</p>
      ) : null}
      <div className="grid gap-12 lg:grid-cols-[1.2fr_0.8fr]">
        <div>
          <button type="button" className="media-frame piece-photo block w-full overflow-hidden" onClick={() => image && setZoom(true)}>
            <div className="flex min-h-[48vh] items-center justify-center overflow-hidden bg-ivory">
              {image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={image.src}
                  alt={image.alt}
                  loading="lazy"
                  decoding="async"
                  className="max-h-[70vh] w-full object-contain p-4 transition duration-700 ease-out hover:scale-[1.02] motion-reduce:transition-none md:p-10"
                />
              ) : (
                <div className="grid h-full place-items-center text-[0.68rem] uppercase tracking-[0.22em] text-espresso/40">Photograph to follow</div>
              )}
            </div>
          </button>
          {product.images.length > 1 ? (
            <div className="mt-4 flex gap-3 overflow-x-auto">
              {product.images.map((item, imageIndex) => (
                <button key={item.src} type="button" onClick={() => setIndex(imageIndex)} className={`h-20 w-16 shrink-0 ${imageIndex === index ? "opacity-100" : "opacity-50"}`}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={item.src} alt="" loading="lazy" decoding="async" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          ) : null}
        </div>
        <div className="lg:pt-16">
          <p className="text-[0.68rem] uppercase tracking-[0.28em] text-espresso/50">
            <Link href="/collection">Collection</Link>
            {category ? ` / ${category.name}` : ""}
          </p>
          <h1 className="mt-5 font-serif text-[clamp(2.4rem,11vw,5.5rem)] leading-[0.9]">{product.name}</h1>
          {publicCopy(product.description) ? <p className="mt-8 max-w-md text-base leading-7">{publicCopy(product.description)}</p> : null}
          <p className="mt-8 text-sm uppercase tracking-[0.18em]">{enquiryCopy.piece}</p>
          {stock ? <p className={`mt-4 text-[0.68rem] uppercase tracking-[0.24em] ${product.stockStatus === "in_stock" ? "text-forest" : ""}`}>{stock}</p> : null}
          <dl className="mt-8 grid gap-3 text-sm">
            {product.dimensions ? (
              <div className="flex justify-between gap-6 border-b border-espresso/10 py-2">
                <dt className="text-espresso/50">Dimensions</dt>
                <dd>{product.dimensions}</dd>
              </div>
            ) : null}
            {product.material ? (
              <div className="flex justify-between gap-6 border-b border-espresso/10 py-2">
                <dt className="text-espresso/50">Material</dt>
                <dd>{product.material}</dd>
              </div>
            ) : null}
            {product.colour ? (
              <div className="flex justify-between gap-6 border-b border-espresso/10 py-2">
                <dt className="text-espresso/50">Colour</dt>
                <dd>{product.colour}</dd>
              </div>
            ) : null}
          </dl>
          <div className="mt-8 flex flex-col items-start gap-4">
            <a href="#enquire" className="btn">{enquiryCopy.request}</a>
            {whatsapp ? (
              <a className="rule-link" href={whatsapp} target="_blank" rel="noreferrer">
                <span>WhatsApp this piece</span>
                <span className="line" />
              </a>
            ) : null}
            <Link href={`/wholesale?product=${product.slug}`} className="rule-link">
              <span>Wholesale enquiry</span>
              <span className="line" />
            </Link>
            <button type="button" className="text-[0.68rem] uppercase tracking-[0.22em]" aria-pressed={wishlist.has(product.id)} onClick={() => wishlist.toggle(product.id)}>
              {wishlist.has(product.id) ? "Saved to wishlist" : "Save to wishlist"}
            </button>
          </div>
          <div id="enquire" className="mt-14">
            <h2 className="font-serif text-4xl">{enquiryCopy.details}</h2>
            <div className="mt-8">
              <EnquiryForm intent="retail" productSlug={product.slug} productName={product.name} submitLabel="Send enquiry" showDelivery />
            </div>
          </div>
        </div>
      </div>
      {more.items.length > 0 ? (
        <section className="mt-24 border-t border-espresso/15 pt-12">
          <h2 className="font-serif text-4xl">{more.title}</h2>
          <div className="mt-8 grid gap-12 md:grid-cols-3">
            {more.items.map((item) => (
              <Link key={item.id} href={`/collection/${item.slug}`} className="opacity-75 transition-opacity duration-500 hover:opacity-100">
                <div className="aspect-[4/5] bg-ivory">
                  {item.images[0] ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={item.images[0].src} alt={item.images[0].alt} loading="lazy" decoding="async" className="h-full w-full object-contain p-4" />
                  ) : null}
                </div>
                <p className="mt-4 font-serif text-2xl">{item.name}</p>
                <p className="mt-2 text-sm">{enquiryCopy.details}</p>
              </Link>
            ))}
          </div>
        </section>
      ) : null}
      {zoom && image ? (
        <dialog open className="viewer" onClose={() => setZoom(false)}>
          <button type="button" className="absolute right-6 top-6 text-[0.68rem] uppercase tracking-[0.22em]" onClick={() => setZoom(false)}>
            Close
          </button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={image.src} alt={image.alt} loading="lazy" decoding="async" className="h-full w-full object-contain" />
        </dialog>
      ) : null}
    </article>
  );
}
