import Link from "next/link";
import { adminConfigError } from "@/lib/auth";
import { getEnquiries, getProducts, getSettings } from "@/lib/store";

export const metadata = { title: "Overview", robots: { index: false, follow: false } };

export default async function AdminHome() {
  const [products, enquiries, settings] = await Promise.all([getProducts(), getEnquiries(), getSettings()]);
  const published = products.filter((product) => product.published).length;
  const featured = products.filter((product) => product.homepageFeatured).length;
  const fresh = enquiries.filter((enquiry) => enquiry.status === "new").length;
  const password = process.env.ADMIN_PASSWORD ?? "";
  return (
    <div>
      <h1 className="font-serif text-5xl">Overview</h1>
      {adminConfigError() ? <p className="mt-4 text-sm">{adminConfigError()}</p> : null}
      {password && password.length < 12 ? (
        <p className="mt-4 text-sm">The admin password is shorter than 12 characters.</p>
      ) : null}
      <dl className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Products" value={String(products.length)} />
        <Stat label="Published" value={String(published)} />
        <Stat label="On the homepage" value={String(featured)} />
        <Stat label="New enquiries" value={String(fresh)} />
      </dl>
      <ul className="mt-12 max-w-xl space-y-3 text-sm leading-6">
        <li>WhatsApp: {settings.whatsappNumber ? "Configured" : "Not configured. Add the business number in settings."}</li>
        <li>Signature chair: {settings.chairModelPath || "Studio placeholder. Upload a GLB in settings when the model is ready."}</li>
        <li>Logo: {settings.logoPath ? "Uploaded" : "Wordmark in use until a logo file is added."}</li>
        <li>Photographs, prices and stock stay empty until you enter them. Nothing is assumed to be in stock.</li>
      </ul>
      <Link href="/admin/products/new" className="btn mt-10">
        Add a product
      </Link>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-[0.68rem] uppercase tracking-[0.22em] text-espresso/50">{label}</dt>
      <dd className="mt-2 font-sans text-5xl tabular-nums tracking-tight">{value}</dd>
    </div>
  );
}
