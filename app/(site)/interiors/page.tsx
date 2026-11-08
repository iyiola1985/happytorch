import Link from "next/link";
import { pageMetadata } from "@/lib/seo";
import { services } from "@/lib/services";
import { getSettings } from "@/lib/store";
import { interiorWhatsAppMessage, whatsappHref } from "@/lib/whatsapp";

export const metadata = pageMetadata({
  title: "Interior and construction",
  description: "Interior design, interior construction and furnishing by Happy Touch Interiors in Lagos, for homes and commercial spaces.",
  path: "/interiors",
});

export default async function InteriorsPage() {
  const settings = await getSettings();
  const whatsapp = settings.whatsappNumber ? whatsappHref(settings.whatsappNumber, interiorWhatsAppMessage()) : null;
  return (
    <div className="pt-32 md:pt-40">
      <header className="px-6 pb-20 md:px-10">
        <p className="kicker text-[0.68rem] uppercase tracking-[0.32em] text-espresso/50">Interior · Construction</p>
        <h1 className="mt-5 max-w-5xl font-serif text-[clamp(2.5rem,11vw,6.4rem)] leading-[0.9]">
          The room, and the work of making it.
        </h1>
        <p className="mt-8 max-w-xl text-base leading-7">
          Happy Touch Interiors works across interior and construction, for homes and for commercial spaces.
        </p>
      </header>
      {services.map((service, index) => {
        const dark = index % 2 === 1;
        return (
          <section key={service.number} className={`px-6 py-20 md:px-10 md:py-28 ${dark ? "border-t-2 border-red bg-ink text-ivory" : "bg-ivory text-espresso"}`}>
            <div className={`grid items-end gap-8 md:grid-cols-12 ${index % 2 ? "md:text-right" : ""}`}>
              <p className={`font-sans text-6xl leading-none tabular-nums md:col-span-3 md:text-7xl ${dark ? "text-ivory" : "text-espresso/25"}`}>{service.number}</p>
              <div className="md:col-span-8 md:col-start-5">
                <h2 className="font-serif text-4xl leading-none md:text-6xl">{service.title}</h2>
                <p className="mt-6 max-w-lg text-base leading-7 md:ml-auto">{service.copy}</p>
              </div>
            </div>
          </section>
        );
      })}
      <section className="px-6 py-24 md:px-10">
        <h2 className="max-w-4xl font-serif text-5xl leading-none md:text-7xl">LET&apos;S DISCUSS YOUR SPACE.</h2>
        <div className="mt-8 flex flex-wrap gap-6">
          <Link href="/contact?intent=interior" className="btn">
            Begin an enquiry
          </Link>
          {whatsapp ? (
            <a href={whatsapp} className="rule-link" target="_blank" rel="noreferrer">
              <span>WhatsApp</span>
              <span className="line" />
            </a>
          ) : null}
        </div>
      </section>
    </div>
  );
}
