import { notFound } from "next/navigation";
import { ProductForm } from "@/components/admin/product-form";
import { deleteProductAction } from "@/lib/actions";
import { getCategories, getProductById } from "@/lib/store";

export const metadata = { title: "Edit product", robots: { index: false, follow: false } };

export default async function EditProductPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ saved?: string }>;
}) {
  const [{ id }, query] = await Promise.all([params, searchParams]);
  const [product, categories] = await Promise.all([getProductById(id), getCategories()]);
  if (!product) notFound();
  return (
    <div>
      <h1 className="mb-4 font-serif text-5xl">{product.name}</h1>
      {query.saved ? <p className="mb-6 text-sm">Saved.</p> : null}
      <ProductForm product={product} categories={categories} />
      <form
        action={deleteProductAction}
        className="mt-12"
      >
        <input type="hidden" name="id" value={product.id} />
        <button type="submit" className="text-[0.68rem] uppercase tracking-[0.2em] text-red">
          Remove product
        </button>
      </form>
    </div>
  );
}
