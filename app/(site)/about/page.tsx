import { pageMetadata } from "@/lib/seo";
import { site } from "@/lib/site";
import { getSettings } from "@/lib/store";

export const metadata = pageMetadata({
  title: "Our story",
  description: "Happy Touch Interiors is a Lagos furniture, interior and construction studio serving clients in Nigeria and internationally.",
  path: "/about",
});

export default async function AboutPage() {
  const settings = await getSettings();
  return (
    <div className="px-6 pb-24 pt-32 md:px-10 md:pt-40">
      <p className="kicker text-[0.68rem] uppercase tracking-[0.32em] text-espresso/50">{site.location}</p>
      <h1 className="mt-6 max-w-5xl font-serif text-[clamp(2.5rem,11vw,6rem)] leading-[0.92]">
        WE BELIEVE EVERY SPACE DESERVES A TOUCH OF ELEGANCE.
      </h1>
      <div className="mt-16 grid gap-16 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="max-w-xl space-y-6 text-base leading-8">
          <p>
            Happy Touch Interiors is based in Lagos, Nigeria. The studio supplies furniture for the home, and takes on interior and construction work.
          </p>
          <p>
            Clients come for a single piece, for a room, and for wholesale orders. Delivery is arranged throughout Nigeria, and internationally when a destination is confirmed with the enquiry.
          </p>
          <p>{site.tagline}</p>
          <p>
            <a href={settings.instagramUrl || site.instagram} target="_blank" rel="noreferrer" className="rule-link">
              <span>{site.instagramHandle}</span>
              <span className="line" />
            </a>
          </p>
        </div>
        <RoomDrawing />
      </div>
      <dl className="mt-20 grid gap-10 border-t border-espresso/15 pt-10 md:grid-cols-4">
        {[
          ["Furniture", "Wholesale and retail pieces for the home."],
          ["Interiors", "Design, styling and the furnishing of a space."],
          ["Construction", "Interior construction and the making of the room."],
          ["Delivery", "Nationwide in Nigeria, and worldwide on enquiry."],
        ].map(([title, copy]) => (
          <div key={title}>
            <dt className="font-serif text-3xl">{title}</dt>
            <dd className="mt-3 text-sm leading-6 text-charcoal">{copy}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

function RoomDrawing() {
  return (
    <svg viewBox="0 0 640 420" className="h-auto w-full text-espresso" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden>
      <path d="M40 340 H600" />
      <path d="M70 340 V70 H560 V340" />
      <path d="M360 70 V210 H500 V70" className="text-forest" />
      <path d="M120 340 V250 H300 V340" />
      <path d="M140 250 H280" />
      <path d="M430 340 V230 H470 V340" />
      <path d="M450 230 V150" />
      <path d="M430 150 H470" />
      <path d="M80 90 H200" />
    </svg>
  );
}
