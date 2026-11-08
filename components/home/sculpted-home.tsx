"use client";

import Link from "next/link";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollSofa, type SofaProgress } from "@/components/three/scroll-sofa";

export type HomeCard = {
  href: string;
  name: string;
  kicker: string;
  image: string;
  alt: string;
};

export type HomeFrame = {
  href: string;
  name: string;
  image: string;
  alt: string;
};

const SOFA = "/images/sofa.webp";
const WOOD = "/images/wood.webp";
const LIVING = "/images/living.webp";

function Split({ text, className }: { text: string; className?: string }) {
  const words = text.split(" ");
  return (
    <span className={className} data-reveal>
      {words.map((word, index) => (
        <span key={`${word}-${index}`} className="inline-block overflow-hidden pb-1 align-bottom">
          <span className="split-word inline-block">{word}</span>
          {index < words.length - 1 ? "\u00A0" : null}
        </span>
      ))}
    </span>
  );
}

export function SculptedHome({
  cards,
  frames,
  sofaAlt,
  livingAlt,
}: {
  cards: HomeCard[];
  frames: HomeFrame[];
  sofaAlt: string;
  livingAlt: string;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<SofaProgress>({ current: 0 });
  const [sofaReady, setSofaReady] = useState(false);

  useEffect(() => {
    setSofaReady(true);
  }, []);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    gsap.registerPlugin(ScrollTrigger);
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const ctx = gsap.context(() => {
      const progress = progressRef.current;
      ScrollTrigger.create({
        trigger: "[data-hero]",
        start: "top top",
        end: "+=100%",
        pin: true,
        anticipatePin: 1,
        scrub: true,
        onUpdate: (self) => {
          progress.current = self.progress;
          const copy = root.querySelector<HTMLElement>("[data-hero-copy]");
          if (!copy) return;
          const dark = self.progress > 0.45;
          copy.style.color = dark ? "#E8DDD0" : "#1A1512";
          const logo = document.querySelector<HTMLElement>("header a");
          if (logo) logo.style.background = dark ? "rgba(232, 221, 208, 0.92)" : "transparent";
          const button = copy.querySelector<HTMLElement>("a");
          if (!button) return;
          button.style.background = dark ? "#E8DDD0" : "#1A1512";
          button.style.color = dark ? "#1A1512" : "#E8DDD0";
          button.style.borderColor = dark ? "#E8DDD0" : "#1A1512";
        },
      });

      root.querySelectorAll<HTMLElement>("[data-reveal]").forEach((line) => {
        gsap.fromTo(
          line.querySelectorAll(".split-word"),
          { yPercent: 110 },
          {
            yPercent: 0,
            ease: "none",
            stagger: 0.05,
            scrollTrigger: { trigger: line, start: "top 92%", end: "top 58%", scrub: true },
          },
        );
      });

      gsap.fromTo(
        "[data-parallax]",
        { yPercent: -10 },
        {
          yPercent: 10,
          ease: "none",
          scrollTrigger: { trigger: "[data-craft]", start: "top bottom", end: "bottom top", scrub: true },
        },
      );

      root.querySelectorAll<HTMLElement>("[data-scale]").forEach((node) => {
        gsap.fromTo(node, { scale: 1.2 }, {
          scale: 1,
          ease: "none",
          scrollTrigger: {
            trigger: node.parentElement,
            start: "top bottom",
            end: "center center",
            scrub: true,
          },
        });
      });

      const mm = gsap.matchMedia();
      mm.add("(min-width: 768px)", () => {
        const track = root.querySelector<HTMLElement>("[data-track]");
        const section = root.querySelector<HTMLElement>("[data-signature]");
        if (!track || !section) return;
        const distance = () => Math.max(0, track.scrollWidth - section.clientWidth + 48);
        gsap.to(track, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: () => `+=${Math.max(distance(), 1)}`,
            pin: true,
            anticipatePin: 1,
            scrub: true,
            invalidateOnRefresh: true,
          },
        });
      });

      const shots = gsap.utils.toArray<HTMLElement>("[data-shot]");
      const showcase = root.querySelector("[data-showcase]");
      if (showcase && shots.length > 1) {
        const timeline = gsap.timeline({
          scrollTrigger: {
            trigger: showcase,
            start: "top top",
            end: "+=200%",
            pin: true,
            anticipatePin: 1,
            scrub: true,
          },
        });
        shots.forEach((shot, index) => {
          if (index === 0) {
            gsap.set(shot, { opacity: 1, scale: 1.2 });
            timeline.to(shot, { scale: 1, duration: 1, ease: "none" }, 0);
            return;
          }
          gsap.set(shot, { opacity: 0, scale: 1.2 });
          timeline.to(shots[index - 1], { opacity: 0, duration: 0.4, ease: "none" }, index);
          timeline.to(shot, { opacity: 1, scale: 1, duration: 1, ease: "none" }, index);
        });
      }

      return () => mm.revert();
    }, root);

    const refresh = window.setTimeout(() => ScrollTrigger.refresh(), 250);
    return () => {
      window.clearTimeout(refresh);
      ctx.revert();
    };
  }, []);

  return (
    <div ref={rootRef} className="sculpted bg-[#E8DDD0] text-[#1A1512]">
      <section data-hero className="relative h-[100svh] overflow-hidden bg-[#E8DDD0]">
        <div className="pointer-events-none absolute inset-0">
          {sofaReady ? <ScrollSofa progress={progressRef.current} /> : null}
        </div>
        <div data-hero-copy className="relative z-10 flex h-full flex-col items-center px-6 pt-32 text-center text-[#1A1512] md:pt-36">
          <h1 className="max-w-5xl font-serif text-[clamp(2.2rem,6vw,5.2rem)] leading-[0.9] font-medium">
            <Split text="FURNITURE, SCULPTED FOR LIVING." />
          </h1>
          <Link
            href="/collection"
            className="mt-8 border border-[#1A1512] bg-[#1A1512] px-8 py-4 text-[0.68rem] tracking-[0.22em] text-[#E8DDD0] uppercase"
          >
            Explore the collection
          </Link>
        </div>
      </section>

      <section data-signature className="overflow-hidden bg-[#E8DDD0]">
        <div className="px-6 pt-16 md:px-16 md:pt-20">
          <h2 className="font-serif text-[clamp(2.4rem,5vw,4.8rem)] leading-none">
            <Split text="Signature collection" />
          </h2>
        </div>
        <div className="overflow-x-auto md:overflow-hidden">
          <div data-track className="flex w-max gap-5 px-6 py-12 md:px-16">
            {cards.map((card) => (
              <Link key={card.href} href={card.href} className="w-[78vw] shrink-0 md:w-[38vw]">
                <div className="aspect-[4/5] overflow-hidden bg-[#d8cdc0]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={card.image} alt={card.alt} loading="lazy" decoding="async" className="h-full w-full object-cover" />
                </div>
                <p className="mt-5 text-[0.68rem] tracking-[0.28em] uppercase">{card.kicker}</p>
                <p className="mt-2 font-serif text-4xl">{card.name}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section data-craft className="relative h-[78svh] overflow-hidden bg-[#1A1512] md:h-[88svh]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          data-parallax
          src={WOOD}
          alt="Wood grain on an upholstered bench."
          loading="lazy"
          decoding="async"
          className="absolute inset-x-0 top-[-12%] h-[124%] w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1A1512]/55 via-transparent to-transparent" />
        <div className="relative z-10 flex h-full items-end px-6 pb-16 md:px-16">
          <h2 className="max-w-xl font-serif text-[clamp(2.6rem,6vw,5.4rem)] leading-[0.92] text-[#E8DDD0]">
            <Split text="Material, held close." />
          </h2>
        </div>
      </section>

      <section data-showcase className="relative h-[100svh] overflow-hidden bg-[#1A1512]">
        {frames.map((frame, index) => (
          <Link
            key={frame.href}
            href={frame.href}
            data-shot
            className="absolute inset-0 block"
            style={{ opacity: index === 0 ? 1 : 0 }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={frame.image} alt={frame.alt} loading="lazy" decoding="async" className="h-full w-full object-cover" />
            <span className="absolute bottom-16 left-6 font-serif text-4xl text-[#E8DDD0] md:bottom-20 md:left-16 md:text-6xl">
              {frame.name}
            </span>
          </Link>
        ))}
      </section>

      <section className="grid min-h-[100svh] bg-[#E8DDD0] md:grid-cols-2">
        <div className="relative min-h-[64svh] overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img data-scale src={LIVING} alt={livingAlt} loading="lazy" decoding="async" className="h-full w-full object-cover" />
        </div>
        <div className="flex items-center px-6 py-16 md:px-16">
          <div className="max-w-xl">
            <p className="text-[0.68rem] tracking-[0.28em] uppercase">Design story</p>
            <h2 className="mt-6 font-serif text-[clamp(2.2rem,4vw,4.2rem)] leading-[0.95]">
              <Split text="Elegance is not added to a home. It is built into every detail." />
            </h2>
            <Link href="/interiors" className="mt-8 inline-block text-[0.68rem] tracking-[0.22em] uppercase">
              Interiors
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-[#1A1512] px-6 py-24 text-center text-[#E8DDD0] md:py-32">
        <h2 className="mx-auto max-w-5xl font-serif text-[clamp(2.4rem,6vw,5.6rem)] leading-[0.9]">
          <Split text="CREATE A SPACE WORTH LIVING IN." />
        </h2>
        <div className="relative mx-auto mt-12 h-[58vh] max-w-5xl overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img data-scale src={SOFA} alt={sofaAlt} loading="lazy" decoding="async" className="h-full w-full object-cover object-[center_62%]" />
        </div>
        <Link
          href="/contact"
          className="mt-12 inline-block border border-[#E8DDD0] px-8 py-4 text-[0.68rem] tracking-[0.22em] uppercase"
        >
          Enquire for Details
        </Link>
      </section>
    </div>
  );
}
