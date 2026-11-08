import { EnquiryForm } from "@/components/forms/enquiry-form";
import { getPublicPiece } from "@/lib/public-products";
import { pageMetadata } from "@/lib/seo";
import { getCategories, getSettings } from "@/lib/store";
import { wholesaleWhatsAppMessage, whatsappHref } from "@/lib/whatsapp";

export const metadata = pageMetadata({
  title: "Wholesale",
  description: "Wholesale furniture enquiries for dealers, developers, hotels and interior professionals. Happy Touch Interiors, Lagos.",
  path: "/wholesale",
});

export default async function WholesalePage({
  searchParams,
}: {
  searchParams: Promise<{ product?: string }>;
}) {
  const params = await searchParams;
  const [categories, settings, piece] = await Promise.all([
    getCategories(),
    getSettings(),
    params.product ? getPublicPiece(params.product) : Promise.resolve(null),
  ]);
  const whatsapp = settings.whatsappNumber ? whatsappHref(settings.whatsappNumber, wholesaleWhatsAppMessage()) : null;
  return (
    <div className="grid gap-16 px-6 pb-24 pt-32 md:px-10 md:pt-40 lg:grid-cols-[0.8fr_1.1fr]">
      <div className="lg:sticky lg:top-32 lg:self-start">
        <p className="kicker text-[0.68rem] uppercase tracking-[0.32em] text-espresso/50">Wholesale</p>
        <h1 className="mt-5 font-serif text-[clamp(2.5rem,11vw,5.6rem)] leading-[0.9]">Furniture, supplied with intent.</h1>
        <p className="mt-8 max-w-md text-base leading-7">
          For dealers, developers, hotels and interior professionals ordering beyond a single home. Tell us the pieces you are considering, an estimated quantity and the destination.
        </p>
        {whatsapp ? (
          <a href={whatsapp} className="rule-link mt-8" target="_blank" rel="noreferrer">
            <span>WhatsApp the studio</span>
            <span className="line" />
          </a>
        ) : null}
      </div>
      <EnquiryForm
        intent="wholesale"
        categories={categories}
        productSlug={piece?.product.slug}
        productName={piece?.product.name}
        submitLabel="Submit wholesale enquiry"
        showDelivery
      />
    </div>
  );
}
