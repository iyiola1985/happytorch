import { SettingsForm } from "@/components/admin/settings-form";
import { getProducts, getSettings } from "@/lib/store";

export const metadata = { title: "Settings", robots: { index: false, follow: false } };

export default async function SettingsPage() {
  const [settings, products] = await Promise.all([getSettings(), getProducts()]);
  return (
    <div>
      <h1 className="mb-8 font-serif text-5xl">Settings</h1>
      <SettingsForm settings={settings} products={products} />
    </div>
  );
}
