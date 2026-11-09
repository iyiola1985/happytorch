"use client";

import { useLayoutEffect, useRef } from "react";
import { site } from "@/lib/site";

const breakAt = site.tagline.indexOf(" for ");
const lead = breakAt === -1 ? site.tagline : site.tagline.slice(0, breakAt);
const rest = breakAt === -1 ? "" : site.tagline.slice(breakAt + 1);

export function ChairClose() {
  const sectionRef = useRef<HTMLElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const frame = frameRef.current;
    const copy = copyRef.current;
    if (!section || !frame || !copy) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const apply = () => {
      const start = window.innerHeight;
      const end = window.innerHeight * 0.32;
      const shown = Math.min(1, Math.max(0, (start - section.getBoundingClientRect().top) / (start - end)));
      frame.style.transform = `scale(${1.03 - shown * 0.03})`;
      copy.style.opacity = String(shown);
      copy.style.transform = `translate3d(0, ${(1 - shown) * 10}px, 0)`;
    };
    apply();
    window.addEventListener("scroll", apply, { passive: true });
    window.addEventListener("resize", apply);
    return () => {
      window.removeEventListener("scroll", apply);
      window.removeEventListener("resize", apply);
    };
  }, []);

  return (
    <section ref={sectionRef} className="relative h-[100dvh] overflow-hidden bg-[#E8E8E8]">
      <div ref={frameRef} className="absolute inset-0 origin-center">
        <img
          src="/hero/armchairs.webp"
          alt="Navy and amber armchairs with side tables"
          decoding="async"
          className="h-full w-full object-contain object-bottom min-[1024px]:object-cover min-[1024px]:object-center"
        />
      </div>
      <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-24 bg-gradient-to-b from-[#F2F3F3] to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-20 bg-gradient-to-b from-transparent to-[#111111]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 z-10 flex h-[24%] items-end justify-center overflow-hidden px-6 pb-2 text-center text-[#111111]">
        <div ref={copyRef} className="max-w-3xl">
          <p className="font-serif text-[clamp(1.7rem,3.5vh,2.85rem)] leading-[1.02] font-medium italic">{lead}</p>
          {rest ? <p className="font-serif text-[clamp(1.7rem,3.5vh,2.85rem)] leading-[1.02] font-medium italic">{rest}</p> : null}
          <p className="mt-3 font-sans text-[0.62rem] tracking-[0.32em] uppercase">{site.name}</p>
          <p className="mt-1.5 font-sans text-[0.62rem] tracking-[0.32em] text-[#111111]/55 uppercase">{site.location}</p>
        </div>
      </div>
    </section>
  );
}
