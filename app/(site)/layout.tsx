import { CursorDot } from "@/components/layout/cursor-dot";
import { IntroLoader } from "@/components/home/intro-loader";
import { JsonLd } from "@/components/layout/json-ld";
import { HeaderToneProvider } from "@/components/layout/header-tone";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { SmoothScroll } from "@/components/layout/smooth-scroll";
import { WhatsAppButton } from "@/components/layout/whatsapp-button";
import { WishlistProvider } from "@/components/wishlist/wishlist-provider";
import { getSettings } from "@/lib/store";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSettings();
  return (
    <WishlistProvider>
      <HeaderToneProvider>
        <a className="skip-link" href="#content">
          Skip to content
        </a>
        <SmoothScroll />
        <CursorDot />
        <IntroLoader logoPath={settings.logoPath} />
        <SiteHeader logoPath={settings.logoPath} />
        <main id="content">{children}</main>
        <SiteFooter
          logoPath={settings.logoPath}
          instagram={settings.instagramUrl || "https://www.instagram.com/happytouchinteriors/"}
        />
        {settings.whatsappNumber ? <WhatsAppButton number={settings.whatsappNumber} /> : null}
        <JsonLd />
      </HeaderToneProvider>
    </WishlistProvider>
  );
}
