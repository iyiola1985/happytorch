"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useHeaderTone } from "@/components/layout/header-tone";
import { setLenisLocked } from "@/components/layout/lenis-controller";
import { Magnetic } from "@/components/ui/magnetic";
import { navItems, site } from "@/lib/site";

export function SiteHeader({ logoPath }: { logoPath: string }) {
  const pathname = usePathname();
  const { overPaper } = useHeaderTone();
  const [open, setOpen] = useState(false);
  const reduced = useReducedMotion();
  const immersive = pathname === "/showroom";
  const home = pathname === "/";
  const light = !open && immersive && !overPaper;

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    setLenisLocked("menu", open);
    return () => {
      document.body.style.overflow = "";
      setLenisLocked("menu", false);
    };
  }, [open]);

  if (home) return null;

  const color = open
    ? "bg-ivory text-espresso"
    : light
      ? "bg-transparent text-ivory"
      : "border-b border-ink/10 bg-ivory/95 text-espresso backdrop-blur-md";

  return (
    <header className={`fixed inset-x-0 top-0 z-40 ${open ? "bg-ivory text-espresso" : color}`}>
      <div className="flex items-center justify-between px-5 pt-[max(1.25rem,env(safe-area-inset-top))] pb-5 md:px-10">
        <Link href="/" className="relative z-50" onClick={() => setOpen(false)}>
          {logoPath ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={logoPath} alt={site.name} decoding="async" className="h-16 w-auto md:h-[4.5rem]" />
          ) : (
            <span className="block leading-none">
              <span className="block font-serif text-[1.35rem] tracking-[0.16em]">HAPPY TOUCH</span>
              <span className="mt-1 block text-[0.58rem] tracking-[0.34em]">INTERIORS</span>
            </span>
          )}
        </Link>
        <nav className="hidden items-center gap-8 lg:flex" aria-label="Primary">
          {navItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`border-b pb-1 text-[0.68rem] uppercase tracking-[0.26em] transition-colors ${
                  active ? (light ? "border-red text-ivory" : "border-red text-red") : "border-transparent"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="flex items-center gap-5">
          <Magnetic>
            <Link href="/contact" className="btn hidden sm:inline-flex">
              Enquire now
            </Link>
          </Magnetic>
          <button
            type="button"
            className="relative z-50 text-[0.68rem] uppercase tracking-[0.26em] lg:hidden"
            aria-expanded={open}
            onClick={() => setOpen((value) => !value)}
          >
            {open ? "Close" : "Menu"}
          </button>
        </div>
      </div>
      <AnimatePresence>
        {open ? (
          <motion.nav
            className="fixed inset-0 z-40 flex flex-col justify-end overflow-y-auto bg-ivory px-6 pt-24 pb-[max(4rem,env(safe-area-inset-bottom))] text-espresso"
            initial={reduced ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={reduced ? undefined : { opacity: 0 }}
            aria-label="Mobile"
          >
            {navItems.map((item, index) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={`border-t border-espresso/15 py-4 font-serif text-[clamp(2.15rem,11vw,3.5rem)] leading-none ${pathname === item.href ? "text-red" : ""}`}
              >
                <span className="mr-4 font-sans text-xs tracking-[0.28em] text-espresso/50 tabular-nums">0{index + 1}</span>
                {item.label}
              </Link>
            ))}
            <Link href="/contact" onClick={() => setOpen(false)} className="btn mt-8 self-start">
              Enquire now
            </Link>
          </motion.nav>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
