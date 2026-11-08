"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { site } from "@/lib/site";

export function ShopHeader({ logoPath }: { logoPath: string }) {
  const [overFooter, setOverFooter] = useState(false);

  useEffect(() => {
    const footer = document.querySelector("[data-site-footer]");
    if (!footer) return;
    const observer = new IntersectionObserver(([entry]) => setOverFooter(Boolean(entry?.isIntersecting)), {
      threshold: 0.08,
    });
    observer.observe(footer);
    return () => observer.disconnect();
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50 bg-transparent">
      <div className={`flex items-center px-4 pt-[max(0.75rem,env(safe-area-inset-top))] pb-3 md:px-10 ${overFooter ? "border-b border-black/10 bg-white" : ""}`}>
        <Link href="/" className="bg-transparent">
          {logoPath ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={logoPath} alt={site.name} decoding="async" className="h-12 w-auto bg-transparent sm:h-14 md:h-16" />
          ) : (
            <span className="font-serif text-[1.35rem] tracking-[0.16em] text-[#111111]">HAPPY TOUCH</span>
          )}
        </Link>
      </div>
    </header>
  );
}
