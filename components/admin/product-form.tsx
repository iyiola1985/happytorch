"use client";

import { useActionState } from "react";
import { saveProduct, type FormState } from "@/lib/actions";
import { anchors } from "@/lib/showroom-config";
import { roomName } from "@/lib/showroom-config";
import type { Category, Product, ShowroomRoomId } from "@/lib/types";

const initial: FormState = { ok: false };

export function ProductForm({ product, categories }: { product?: Product; categories: Category[] }) {
  const [state, action, pending] = useActionState(saveProduct, initial);
  const error = (name: string) => state.fieldErrors?.[name]?.[0];
  return (
    <form action={action} className="grid max-w-3xl gap-6">
      {product ? <input type="hidden" name="id" value={product.id} /> : null}
      <label className="block text-[0.68rem] uppercase tracking-[0.2em]">
        Name
        <input className="field" name="name" defaultValue={product?.name ?? ""} required />
      </label>
      {error("name") ? <p className="text-sm text-red">{error("name")}</p> : null}
      <label className="block text-[0.68rem] uppercase tracking-[0.2em]">
        Page address
        <input className="field" name="slug" defaultValue={product?.slug ?? ""} placeholder="Generated from the name if empty" />
      </label>
      <label className="block text-[0.68rem] uppercase tracking-[0.2em]">
        Category
        <select className="field" name="categoryId" defaultValue={product?.categoryId ?? categories[0]?.id}>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </label>
      <label className="block text-[0.68rem] uppercase tracking-[0.2em]">
        Description
        <textarea className="field min-h-32" name="description" defaultValue={product?.description ?? ""} />
      </label>
      <div className="grid gap-6 md:grid-cols-2">
        <label className="block text-[0.68rem] uppercase tracking-[0.2em]">
          Price in NGN
          <input className="field" name="priceNgn" inputMode="decimal" defaultValue={product?.priceNgn ?? ""} placeholder="Leave empty if unconfirmed" />
        </label>
        <label className="block text-[0.68rem] uppercase tracking-[0.2em]">
          Stock
          <select className="field" name="stockStatus" defaultValue={product?.stockStatus ?? ""}>
            <option value="">Do not display</option>
            <option value="in_stock">In stock</option>
            <option value="out_of_stock">Out of stock</option>
            <option value="made_to_order">Made to order</option>
          </select>
        </label>
        <label className="block text-[0.68rem] uppercase tracking-[0.2em]">
          International amount
          <input className="field" name="internationalAmount" inputMode="decimal" defaultValue={product?.internationalPrice?.amount ?? ""} />
        </label>
        <label className="block text-[0.68rem] uppercase tracking-[0.2em]">
          Currency
          <input className="field" name="internationalCurrency" defaultValue={product?.internationalPrice?.currency ?? ""} placeholder="USD" />
        </label>
        <label className="block text-[0.68rem] uppercase tracking-[0.2em]">
          Dimensions
          <input className="field" name="dimensions" defaultValue={product?.dimensions ?? ""} />
        </label>
        <label className="block text-[0.68rem] uppercase tracking-[0.2em]">
          Material
          <input className="field" name="material" defaultValue={product?.material ?? ""} />
        </label>
        <label className="block text-[0.68rem] uppercase tracking-[0.2em]">
          Colour
          <input className="field" name="colour" defaultValue={product?.colour ?? ""} />
        </label>
      </div>
      <div className="flex flex-wrap gap-6 text-sm">
        <label className="flex items-center gap-2">
          <input type="checkbox" name="published" defaultChecked={product?.published ?? false} /> Published
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" name="featured" defaultChecked={product?.featured ?? false} /> Featured in the collection
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" name="homepageFeatured" defaultChecked={product?.homepageFeatured ?? false} /> Homepage sequence
        </label>
      </div>
      <label className="block text-[0.68rem] uppercase tracking-[0.2em]">
        Showroom place
        <select className="field" name="showroomAnchor" defaultValue={product?.showroomAnchor ?? ""}>
          <option value="">Not linked</option>
          {anchors.map((anchor) => (
            <option key={anchor.id} value={anchor.id}>
              {roomName(anchor.room as ShowroomRoomId)} — {anchor.label}
            </option>
          ))}
        </select>
      </label>
      <label className="block text-[0.68rem] uppercase tracking-[0.2em]">
        Model path
        <input className="field" name="modelPath" defaultValue={product?.modelPath ?? ""} placeholder="/models/uploads/piece.glb" />
      </label>
      <label className="block text-sm">
        Replace 3D model
        <input className="mt-2 block w-full" type="file" name="model" accept=".glb,.gltf,model/gltf-binary" />
      </label>
      <div className="grid gap-4">
        <p className="text-[0.68rem] uppercase tracking-[0.2em]">Photographs</p>
        {(product?.images ?? []).map((image) => (
          <label key={image.src} className="grid grid-cols-[72px_1fr] gap-4 text-sm">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={image.src} alt="" loading="lazy" decoding="async" className="h-20 w-16 object-cover" />
            <span>
              <input type="hidden" name="existingSrc" value={image.src} />
              <input className="field" name="existingAlt" defaultValue={image.alt} aria-label="Image description" />
            </span>
          </label>
        ))}
        <label className="block text-sm">
          Add photographs
          <input className="mt-2 block w-full" type="file" name="images" accept="image/jpeg,image/png,image/webp,image/avif" multiple />
        </label>
        <label className="block text-[0.68rem] uppercase tracking-[0.2em]">
          Description for new photographs
          <input className="field" name="imageAlt" placeholder="Defaults to the product name" />
        </label>
      </div>
      {state.error ? <p className="text-sm text-red">{state.error}</p> : null}
      <button type="submit" disabled={pending} className="justify-self-start text-[0.72rem] uppercase tracking-[0.24em]">
        {pending ? "Saving" : "Save product"}
      </button>
    </form>
  );
}
