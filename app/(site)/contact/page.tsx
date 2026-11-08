import { EnquiryForm } from "@/components/forms/enquiry-form";
import { getPublicPiece } from "@/lib/public-products";
import { pageMetadata } from "@/lib/seo";
import { getCategories } from "@/lib/store";
import type { EnquiryType } from "@/lib/types";

export const metadata = pageMetadata({
  title: "Contact",
  description: "Enquire with Happy Touch Interiors in Lagos about furniture, wholesale, interiors or delivery.",
  path: "/contact",
});

function parseIntent(value: string | undefined): EnquiryType {
  switch (value) {
    case "retail":
    case "wholesale":
    case "interior":
    case "delivery":
    case "general":
      return value;
    default:
      return "general";
  }
}

export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<{ intent?: string; product?: string }>;
}) {
  const params = await searchParams;
  const intent = parseIntent(params.intent);
  const [categories, piece] = await Promise.all([getCategories(), params.product ? getPublicPiece(params.product) : Promise.resolve(null)]);
  const product = piece?.product ?? null;
  const labels: Record<EnquiryType, string> = {
    retail: "Send enquiry",
    wholesale: "Submit wholesale enquiry",
    interior: "Let's discuss your space",
    delivery: "Enquire about delivery",
    general: "Send enquiry",
  };
  return (
    <div className="grid gap-16 px-6 pb-24 pt-32 md:px-10 md:pt-40 lg:grid-cols-[0.8fr_1fr]">
      <div>
        <p className="kicker text-[0.68rem] uppercase tracking-[0.32em] text-espresso/50">Lagos, Nigeria</p>
        <h1 className="mt-5 font-serif text-[clamp(2.5rem,11vw,5.8rem)] leading-[0.9]">Talk to our team.</h1>
        <p className="mt-8 max-w-md text-base leading-7">
          Retail, wholesale, interiors and delivery. Send the details of what you have in mind.
        </p>
      </div>
      <EnquiryForm
        intent={intent}
        categories={categories}
        productSlug={product?.slug}
        productName={product?.name}
        submitLabel={labels[intent]}
        showDelivery={intent !== "interior"}
      />
    </div>
  );
}
