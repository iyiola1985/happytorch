import { DeliveryStudio } from "@/components/delivery/delivery-studio";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Worldwide delivery",
  description: "Happy Touch Interiors delivers furniture from Lagos across Nigeria and, on enquiry, worldwide.",
  path: "/delivery",
});

export default function DeliveryPage() {
  return (
    <div className="px-6 pb-24 pt-32 md:px-10 md:pt-40">
      <p className="kicker text-[0.68rem] uppercase tracking-[0.32em] text-espresso/50">Lagos</p>
      <h1 className="mt-5 max-w-5xl font-serif text-[clamp(2.5rem,11vw,6.6rem)] leading-[0.88]">FROM LAGOS TO YOUR WORLD.</h1>
      <p className="mt-8 max-w-xl text-base leading-7">
        Bringing beautiful furniture and home elegance closer to you, wherever you are.
      </p>
      <div className="mt-16">
        <DeliveryStudio />
      </div>
    </div>
  );
}
