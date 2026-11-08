"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { stockLabel } from "@/lib/format";
import { enquiryCopy, publicCopy, type PublicProduct } from "@/lib/public-catalogue";
import { productWhatsAppMessage, whatsappHref } from "@/lib/whatsapp";
import { useWishlist } from "@/components/wishlist/wishlist-provider";

export function QuickView({
  product,
  category,
  whatsappNumber,
  onClose,
}: {
  product: PublicProduct;
  category: string;
  whatsappNumber: string;
  onClose: () => void;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const wishlist = useWishlist();
  const image = product.images[0];
  const stock = stockLabel(product.stockStatus);
  const whatsapp = whatsappNumber
    ? whatsappHref(whatsappNumber, productWhatsAppMessage({ name: product.name, category }))
    : null;

  useEffect(() => {
    const node = dialog.current;
    if (!node) return;
    if (!node.open) node.showModal();
    const onCloseDialog = () => onClose();
    node.addEventListener("close", onCloseDialog);
    return () => node.removeEventListener("close", onCloseDialog);
  }, [onClose]);

  return (
    <dialog ref={dialog} className="drawer" aria-label={product.name}>
      <div className="flex h-full flex-col overflow-y-auto">
        <div className="flex justify-end px-6 py-5">
          <button type="button" onClick={() => dialog.current?.close()} className="text-[0.68rem] uppercase tracking-[0.22em]">
            Close
          </button>
        </div>
        <div className="aspect-square bg-ivory">
          {image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={image.src} alt={image.alt} loading="lazy" decoding="async" className="h-full w-full object-contain" />
          ) : null}
        </div>
        <div className="px-6 py-8">
          <p className="text-[0.68rem] uppercase tracking-[0.28em] text-espresso/50">{category}</p>
          <h2 className="mt-3 font-serif text-5xl leading-none">{product.name}</h2>
          {publicCopy(product.description) ? <p className="mt-6 text-sm leading-7">{publicCopy(product.description)}</p> : null}
          <p className="mt-6 text-sm">{enquiryCopy.piece}</p>
          {stock ? <p className={`mt-3 text-[0.68rem] uppercase tracking-[0.22em] ${product.stockStatus === "in_stock" ? "text-forest" : ""}`}>{stock}</p> : null}
          <div className="mt-8 flex flex-col items-start gap-4">
            <Link href={`/collection/${product.slug}#enquire`} className="btn">
              {enquiryCopy.request}
            </Link>
            <Link href={`/collection/${product.slug}`} className="rule-link">
              <span>View the piece</span>
              <span className="line" />
            </Link>
            {whatsapp ? (
              <a href={whatsapp} target="_blank" rel="noreferrer" className="rule-link">
                <span>WhatsApp</span>
                <span className="line" />
              </a>
            ) : null}
            <button type="button" onClick={() => wishlist.toggle(product.id)} className="text-[0.68rem] uppercase tracking-[0.22em]">
              {wishlist.has(product.id) ? "Saved" : "Save to wishlist"}
            </button>
          </div>
        </div>
      </div>
    </dialog>
  );
}
