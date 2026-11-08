import { deleteCategoryAction, saveCategory } from "@/lib/actions";
import { getCategories, getProducts } from "@/lib/store";

export const metadata = { title: "Categories", robots: { index: false, follow: false } };

export default async function CategoriesPage() {
  const [categories, products] = await Promise.all([getCategories(), getProducts()]);
  return (
    <div>
      <h1 className="font-serif text-5xl">Categories</h1>
      <ul className="mt-10 max-w-3xl divide-y divide-espresso/10">
        {categories.map((category) => {
          const count = products.filter((product) => product.categoryId === category.id).length;
          return (
            <li key={category.id} className="py-6">
              <form action={saveCategory} className="grid gap-3 md:grid-cols-[1fr_1fr_6rem_auto] md:items-end">
                <input type="hidden" name="id" value={category.id} />
                <label className="text-[0.68rem] uppercase tracking-[0.18em]">
                  Name
                  <input className="field" name="name" defaultValue={category.name} />
                </label>
                <label className="text-[0.68rem] uppercase tracking-[0.18em]">
                  Note
                  <input className="field" name="description" defaultValue={category.description} />
                </label>
                <label className="text-[0.68rem] uppercase tracking-[0.18em]">
                  Order
                  <input className="field" name="sortOrder" type="number" defaultValue={category.sortOrder} />
                </label>
                <button type="submit" className="text-[0.68rem] uppercase tracking-[0.18em]">
                  Save
                </button>
              </form>
              <p className="mt-2 text-xs text-espresso/50">{count} products</p>
              {count === 0 ? (
                <form action={deleteCategoryAction}>
                  <input type="hidden" name="id" value={category.id} />
                  <button type="submit" className="mt-2 text-[0.68rem] uppercase tracking-[0.18em]">
                    Remove
                  </button>
                </form>
              ) : null}
            </li>
          );
        })}
      </ul>
      <form action={saveCategory} className="mt-12 grid max-w-3xl gap-3 md:grid-cols-[1fr_1fr_6rem_auto] md:items-end">
        <label className="text-[0.68rem] uppercase tracking-[0.18em]">
          New category
          <input className="field" name="name" required />
        </label>
        <label className="text-[0.68rem] uppercase tracking-[0.18em]">
          Note
          <input className="field" name="description" />
        </label>
        <label className="text-[0.68rem] uppercase tracking-[0.18em]">
          Order
          <input className="field" name="sortOrder" type="number" defaultValue={categories.length + 1} />
        </label>
        <button type="submit" className="text-[0.68rem] uppercase tracking-[0.18em]">
          Add
        </button>
      </form>
    </div>
  );
}
