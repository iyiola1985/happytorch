import Link from "next/link";
import { navItems, site } from "@/lib/site";

export function SiteFooter({ instagram, logoPath }: { instagram: string; logoPath: string }) {
  return (
    <footer data-site-footer className="relative z-10 overflow-x-clip bg-ink px-5 py-14 pb-[max(3.5rem,env(safe-area-inset-bottom))] text-ivory md:px-10 md:py-20">
      <div className="grid gap-10 border-t border-red pt-10 md:grid-cols-[1.4fr_1fr_1fr] md:gap-16 md:pt-12">
        <div>
          {logoPath ? (
            <Link href="/" className="relative inline-flex items-center justify-center bg-transparent">
              <span
                aria-hidden
                className="pointer-events-none absolute top-1/2 left-1/2 h-[180%] w-[210%] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
                style={{
                  background:
                    "radial-gradient(ellipse at center, rgba(245,242,236,0.78) 0%, rgba(245,242,236,0.34) 38%, rgba(245,242,236,0.08) 62%, rgba(17,17,17,0) 78%)",
                }}
              />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={logoPath} alt={site.name} loading="lazy" decoding="async" className="relative h-20 w-auto max-w-full bg-transparent md:h-32" />
            </Link>
          ) : (
            <p className="font-serif text-5xl leading-none tracking-[0.08em] md:text-7xl">HAPPY TOUCH</p>
          )}
          <p className="mt-4 max-w-sm text-sm leading-6 text-ivory/70">{site.tagline}</p>
        </div>
        <div>
          <p className="kicker text-[0.68rem] uppercase tracking-[0.28em] text-ivory/70">Visit</p>
          <p className="mt-4 text-lg">{site.location}</p>
          <p className="mt-2 max-w-xs text-sm leading-6 text-ivory/70">
            Wholesale and retail. Interior and construction. Nationwide delivery in Nigeria, and worldwide delivery on enquiry.
          </p>
        </div>
        <div>
          <p className="kicker text-[0.68rem] uppercase tracking-[0.28em] text-ivory/70">Explore</p>
          <ul className="mt-4 space-y-2 text-ivory/80 [&_a]:transition-colors [&_a]:hover:text-ivory">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link href={item.href}>{item.label}</Link>
              </li>
            ))}
            <li>
              <Link href="/delivery">Worldwide delivery</Link>
            </li>
            <li>
              <Link href="/contact">Contact</Link>
            </li>
            <li>
              <a href={instagram} target="_blank" rel="noreferrer">
                {site.instagramHandle}
              </a>
            </li>
          </ul>
        </div>
      </div>
      <p className="mt-16 flex flex-wrap items-center gap-x-6 gap-y-2 text-[0.68rem] uppercase tracking-[0.22em] text-ivory/50">
        <span>
          © {new Date().getFullYear()} {site.name}
        </span>
        <a href="https://sholatech.com" target="_blank" rel="noreferrer" className="transition-colors hover:text-ivory">
          Powered by Sholatech
        </a>
      </p>
    </footer>
  );
}
