import Link from "next/link";
import { stockLabel } from "@/lib/format";
import { getCategories, getProducts } from "@/lib/store";

export const metadata = { title: "Products", robots: { index: false, follow: false } };

export default async function ProductsPage() {
  const [products, categories] = await Promise.all([getProducts(), getCategories()]);
  return (
    <div>
      <div className="flex items-end justify-between gap-6">
        <h1 className="font-serif text-5xl">Products</h1>
        <Link href="/admin/products/new" className="text-[0.68rem] uppercase tracking-[0.22em]">
          Add
        </Link>
      </div>
      {products.length === 0 ? (
        <p className="mt-10 max-w-lg text-sm leading-6">No products yet. Add the first piece from the studio’s photography.</p>
      ) : (
        <ul className="mt-10 divide-y divide-espresso/10">
          {products.map((product) => {
            const category = categories.find((item) => item.id === product.categoryId)?.name ?? "—";
            const stock = stockLabel(product.stockStatus);
            return (
              <li key={product.id} className="flex flex-wrap items-baseline justify-between gap-4 py-4">
                <div>
                  <Link href={`/admin/products/${product.id}`} className="font-serif text-3xl">
                    {product.name}
                  </Link>
                  <p className="mt-1 text-sm text-espresso/60">
                    {category}
                    {product.published ? "" : " · Unpublished"}
                    {stock ? ` · ${stock}` : ""}
                  </p>
                </div>
                <Link href={`/collection/${product.slug}`} className="text-[0.68rem] uppercase tracking-[0.18em]">
                  View
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
