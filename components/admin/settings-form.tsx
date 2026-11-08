"use client";

import { useActionState } from "react";
import { saveSettings, type FormState } from "@/lib/actions";
import type { Product, Settings } from "@/lib/types";

const initial: FormState = { ok: false };

export function SettingsForm({ settings, products }: { settings: Settings; products: Product[] }) {
  const [state, action, pending] = useActionState(saveSettings, initial);
  return (
    <form action={action} className="grid max-w-2xl gap-6">
      <label className="block text-[0.68rem] uppercase tracking-[0.2em]">
        WhatsApp number
        <input className="field" name="whatsappNumber" defaultValue={settings.whatsappNumber} placeholder="Country code first, for example 234…" />
      </label>
      <p className="text-sm leading-6 text-espresso/70">Leave this empty until the official business number is confirmed. The site will not invent one.</p>
      <label className="block text-[0.68rem] uppercase tracking-[0.2em]">
        Instagram
        <input className="field" name="instagramUrl" defaultValue={settings.instagramUrl} />
      </label>
      <label className="block text-[0.68rem] uppercase tracking-[0.2em]">
        Homepage chair product
        <select className="field" name="heroProductId" defaultValue={settings.heroProductId}>
          <option value="">Studio placeholder</option>
          {products.map((product) => (
            <option key={product.id} value={product.id}>
              {product.name}
            </option>
          ))}
        </select>
      </label>
      <label className="block text-[0.68rem] uppercase tracking-[0.2em]">
        Chair model path
        <input className="field" name="chairModelPath" defaultValue={settings.chairModelPath} placeholder="/models/uploads/chair.glb" />
      </label>
      <label className="block text-sm">
        Upload chair model
        <input className="mt-2 block" type="file" name="chairModel" accept=".glb,.gltf,model/gltf-binary" />
      </label>
      <div className="grid gap-6 md:grid-cols-2">
        <label className="block text-[0.68rem] uppercase tracking-[0.2em]">
          Scale
          <input className="field" name="chairScale" type="number" step="0.01" defaultValue={settings.chairScale} />
        </label>
        <label className="block text-[0.68rem] uppercase tracking-[0.2em]">
          Rotation, degrees
          <input className="field" name="chairRotationY" type="number" step="1" defaultValue={settings.chairRotationY} />
        </label>
      </div>
      <label className="block text-[0.68rem] uppercase tracking-[0.2em]">
        Logo path
        <input className="field" name="logoPath" defaultValue={settings.logoPath} />
      </label>
      <label className="block text-sm">
        Upload logo
        <input className="mt-2 block" type="file" name="logo" accept="image/jpeg,image/png,image/webp,image/avif" />
      </label>
      <p className="text-sm leading-6 text-espresso/70">
        Camera paths and studio lighting live in the scene configuration so they can be tuned with the real model. A compressed GLB replaces the sculpted placeholder without changing the page.
      </p>
      {state.error ? <p className="text-sm text-red">{state.error}</p> : null}
      {state.ok ? <p className="text-sm">Saved.</p> : null}
      <button type="submit" disabled={pending} className="justify-self-start text-[0.72rem] uppercase tracking-[0.22em]">
        {pending ? "Saving" : "Save settings"}
      </button>
    </form>
  );
}
