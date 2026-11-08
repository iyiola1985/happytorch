"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { QuickView } from "@/components/collection/quick-view";
import { categoryName, filterProducts, type ProductSort } from "@/lib/catalog";
import { stockLabel } from "@/lib/format";
import { enquiryCopy, publicCopy, type PublicProduct } from "@/lib/public-catalogue";
import type { Category } from "@/lib/types";
import { useWishlist } from "@/components/wishlist/wishlist-provider";

export function CollectionBrowser({
  products,
  categories,
  initialCategory,
  whatsappNumber,
}: {
  products: PublicProduct[];
  categories: Category[];
  initialCategory: string;
  whatsappNumber: string;
}) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState(initialCategory);
  const [sort, setSort] = useState<ProductSort>("featured");
  const [active, setActive] = useState<PublicProduct | null>(null);
  const visible = useMemo(
    () => filterProducts(products, categories, { query, category, sort }),
    [products, categories, query, category, sort],
  );
  const selected = categories.find((item) => item.id === category);

  return (
    <div className="px-6 pb-24 md:px-10">
      <div className="flex flex-col gap-8 border-y border-espresso/15 py-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="flex gap-4 overflow-x-auto pb-2">
          <FilterButton active={category === ""} onClick={() => setCategory("")}>
            All
          </FilterButton>
          {categories.map((item) => (
            <FilterButton key={item.id} active={category === item.id} onClick={() => setCategory(item.id)}>
              {item.name}
            </FilterButton>
          ))}
        </div>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto] sm:items-end">
          <label className="grid gap-2 text-[0.68rem] uppercase tracking-[0.22em] text-espresso/60">
            Search
            <input className="field w-full" value={query} onChange={(event) => setQuery(event.target.value)} />
          </label>
          <label className="grid gap-2 text-[0.68rem] uppercase tracking-[0.22em] text-espresso/60">
            Sort
            <select className="field w-full" value={sort} onChange={(event) => setSort(event.target.value as ProductSort)}>
              <option value="featured">Featured</option>
              <option value="name">Name</option>
              <option value="newest">Newest</option>
            </select>
          </label>
          <Link href="/wishlist" className="text-[0.68rem] uppercase tracking-[0.22em] sm:pb-3">
            Wishlist
          </Link>
        </div>
      </div>
      {selected?.description ? <p className="mt-8 max-w-xl text-sm leading-6">{selected.description}</p> : null}
      {visible.length === 0 ? (
        <EmptyCollection hasProducts={products.some((product) => product.published)} />
      ) : (
        <div className="mt-12 flex flex-col">
          {visible.map((product, index) => (
            <ProductRow
              key={product.id}
              product={product}
              index={index}
              category={categoryName(categories, product.categoryId)}
              flip={index % 2 === 1}
              onQuickView={() => setActive(product)}
            />
          ))}
        </div>
      )}
      {active ? (
        <QuickView
          product={active}
          category={categoryName(categories, active.categoryId)}
          whatsappNumber={whatsappNumber}
          onClose={() => setActive(null)}
        />
      ) : null}
    </div>
  );
}

function FilterButton({
  active,
  children,
  onClick,
}: {
  active: boolean;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`shrink-0 border-b pb-1 text-[0.68rem] uppercase tracking-[0.2em] transition-colors ${active ? "border-red text-red" : "border-transparent text-espresso/50"}`}
    >
      {children}
    </button>
  );
}

const frames = [
  { image: "md:col-span-7", copy: "md:col-span-5", ratio: "aspect-[4/5]" },
  { image: "md:col-span-6", copy: "md:col-span-6", ratio: "aspect-square" },
  { image: "md:col-span-7", copy: "md:col-span-5", ratio: "aspect-[5/4]" },
] as const;

function ProductRow({
  product,
  index,
  category,
  flip,
  onQuickView,
}: {
  product: PublicProduct;
  index: number;
  category: string;
  flip: boolean;
  onQuickView: () => void;
}) {
  const wishlist = useWishlist();
  const image = product.images[0];
  const stock = stockLabel(product.stockStatus);
  const frame = frames[index % frames.length] ?? frames[0];
  return (
      <article className="group grid items-center gap-8 border-b border-espresso/10 py-16 md:grid-cols-12 md:gap-16 md:py-24">
      <Link href={`/collection/${product.slug}`} className={`media-frame relative block overflow-hidden ${frame.image} ${flip ? "md:order-2" : ""}`}>
        <div className={`overflow-hidden bg-ivory ${frame.ratio}`}>
          {image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={image.src}
              alt={image.alt}
              loading="lazy"
              decoding="async"
              className="h-full w-full object-contain p-6 transition duration-700 ease-out group-hover:scale-[1.03] motion-reduce:transition-none md:p-10"
            />
          ) : (
            <div className="grid h-full place-items-center text-[0.68rem] uppercase tracking-[0.22em] text-espresso/40">Photograph to follow</div>
          )}
        </div>
      </Link>
      <div className={`${frame.copy} ${flip ? "md:order-1" : ""}`}>
        <p className="text-[0.68rem] uppercase tracking-[0.28em] text-forest">{String(index + 1).padStart(2, "0")}</p>
        <p className="mt-3 text-[0.68rem] uppercase tracking-[0.28em] text-espresso/50">{category}</p>
        <h2 className="mt-4 font-serif text-[clamp(2.4rem,11vw,3.5rem)] leading-none transition-colors duration-300 group-hover:text-red md:text-6xl">
          <Link href={`/collection/${product.slug}`}>{product.name}</Link>
        </h2>
        {publicCopy(product.description) ? <p className="mt-6 max-w-md text-sm leading-7 text-charcoal">{publicCopy(product.description)}</p> : null}
        <p className="mt-6 text-sm">{enquiryCopy.details}</p>
        {stock ? <p className={`mt-2 text-[0.68rem] uppercase tracking-[0.22em] ${product.stockStatus === "in_stock" ? "text-forest" : ""}`}>{stock}</p> : null}
        <div className="mt-8 flex flex-wrap items-center gap-6">
          <Link href={`/collection/${product.slug}#enquire`} className="btn">
            {enquiryCopy.request}
          </Link>
          <button type="button" onClick={onQuickView} className="text-[0.68rem] uppercase tracking-[0.22em]">
            Quick view
          </button>
          <button
            type="button"
            aria-pressed={wishlist.has(product.id)}
            onClick={() => wishlist.toggle(product.id)}
            className="text-[0.68rem] uppercase tracking-[0.22em]"
          >
            {wishlist.has(product.id) ? "Saved" : "Save"}
          </button>
        </div>
      </div>
    </article>
  );
}

function EmptyCollection({ hasProducts }: { hasProducts: boolean }) {
  if (hasProducts) {
    return <p className="py-24 font-serif text-4xl">No piece matches that search.</p>;
  }
  return (
    <div className="py-24">
      <h2 className="max-w-3xl font-serif text-5xl leading-none md:text-7xl">The collection is being composed.</h2>
      <p className="mt-6 max-w-xl text-base leading-7 text-charcoal">
        Pieces will appear here as the studio releases them. You may enquire now for a single piece, a room, or a wholesale order.
      </p>
      <div className="mt-8 flex flex-wrap gap-6">
        <Link href="/contact" className="rule-link">
          <span>Enquire</span>
          <span className="line" />
        </Link>
        <Link href="/wholesale" className="rule-link">
          <span>Wholesale</span>
          <span className="line" />
        </Link>
        <Link href="/showroom" className="rule-link">
          <span>3D showroom</span>
          <span className="line" />
        </Link>
      </div>
    </div>
  );
}
