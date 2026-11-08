import { ProductForm } from "@/components/admin/product-form";
import { getCategories } from "@/lib/store";

export const metadata = { title: "New product", robots: { index: false, follow: false } };

export default async function NewProductPage() {
  const categories = await getCategories();
  return (
    <div>
      <h1 className="mb-8 font-serif text-5xl">New product</h1>
      <p className="mb-8 max-w-xl text-sm leading-6">
        Leave price and stock empty until they are confirmed. An empty stock field is hidden on the site.
      </p>
      <ProductForm categories={categories} />
    </div>
  );
}
