import { ChairClose } from "@/components/home/chair-close";
import { ShopHeader } from "@/components/home/shop-header";
import { SofaAssembly } from "@/components/home/sofa-assembly";
import { SofaHero } from "@/components/home/sofa-hero";
import { pageMetadata } from "@/lib/seo";
import { getSettings } from "@/lib/store";

export const metadata = pageMetadata({
  title: "Furniture Design",
  description: "Scroll to assemble the mustard velvet sofa, from separate pieces to the finished seat.",
  path: "/",
});

export default async function HomePage() {
  const settings = await getSettings();
  return (
    <>
      <ShopHeader logoPath={settings.logoPath} />
      <SofaHero />
      <SofaAssembly />
      <ChairClose />
    </>
  );
}
