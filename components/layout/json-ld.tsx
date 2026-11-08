import { getSettings } from "@/lib/store";
import { site, siteUrl } from "@/lib/site";

export async function JsonLd() {
  const settings = await getSettings();
  const data: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "FurnitureStore",
    name: site.name,
    description: site.description,
    url: siteUrl(),
    slogan: site.tagline,
    address: {
      "@type": "PostalAddress",
      addressLocality: site.locality,
      addressCountry: "NG",
    },
    areaServed: {
      "@type": "Country",
      name: "Nigeria",
    },
    sameAs: [settings.instagramUrl || site.instagram],
  };
  if (settings.whatsappNumber) {
    data.contactPoint = {
      "@type": "ContactPoint",
      telephone: settings.whatsappNumber,
      contactType: "customer service",
      availableLanguage: "English",
    };
  }
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}
