"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { WalkControl } from "@/components/gallery/exhibition-scene";
import { categoryName } from "@/lib/catalog";
import { layoutExhibition } from "@/lib/exhibition-layout";
import { stockLabel } from "@/lib/format";
import { enquiryCopy, type PublicProduct } from "@/lib/public-catalogue";
import type { Category } from "@/lib/types";
import { productWhatsAppMessage, whatsappHref } from "@/lib/whatsapp";

const ExhibitionCanvas = dynamic(() => import("@/components/gallery/exhibition-canvas").then((mod) => mod.ExhibitionCanvas), {
  ssr: false,
});

export function ExhibitionGallery({
  products,
  categories,
  whatsappNumber,
}: {
  products: PublicProduct[];
  categories: Category[];
  whatsappNumber: string;
}) {
  const displays = layoutExhibition(products);
  const walk = useRef<WalkControl>({ progress: 0.04, yaw: 0, nudge: 0 });
  const [focusId, setFocusId] = useState<string | null>(null);
  const [webgl, setWebgl] = useState(true);
  const [reduced, setReduced] = useState(false);
  const [lowPower, setLowPower] = useState(false);
  const [paused, setPaused] = useState(false);
  const [ready, setReady] = useState(false);
  const [help, setHelp] = useState(false);
  const focus = displays.find((display) => display.product.id === focusId) ?? null;
  const focusRef = useRef(focusId);
  focusRef.current = focusId;

  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const narrow = window.matchMedia("(max-width: 767px)");
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => {
      setReduced(motion.matches);
      const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 8;
      setLowPower(narrow.matches || memory <= 4);
    };
    apply();
    narrow.addEventListener("change", apply);
    motion.addEventListener("change", apply);
    try {
      const canvas = document.createElement("canvas");
      setWebgl(Boolean(canvas.getContext("webgl2") || canvas.getContext("webgl")));
    } catch {
      setWebgl(false);
    }
    if (!sessionStorage.getItem("ht-corridor")) setHelp(true);
    const onVisibility = () => setPaused(document.hidden);
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setFocusId(null);
        return;
      }
      if (focusRef.current) return;
      if (event.key === "ArrowUp" || event.key === "w" || event.key === "W") walk.current.nudge += 0.06;
      if (event.key === "ArrowDown" || event.key === "s" || event.key === "S") walk.current.nudge -= 0.06;
      if (event.key === "ArrowLeft") walk.current.yaw = Math.max(-0.5, walk.current.yaw - 0.12);
      if (event.key === "ArrowRight") walk.current.yaw = Math.min(0.5, walk.current.yaw + 0.12);
    };
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      document.body.style.cursor = "";
      narrow.removeEventListener("change", apply);
      motion.removeEventListener("change", apply);
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  const dismissHelp = () => {
    sessionStorage.setItem("ht-corridor", "1");
    setHelp(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-ivory text-espresso">
      {webgl ? (
        <ExhibitionCanvas
          displays={displays}
          focusId={focusId}
          reduced={reduced}
          lowPower={lowPower}
          paused={paused}
          walk={walk}
          onFocus={(id) => {
            dismissHelp();
            setFocusId(id);
          }}
          onReady={() => setReady(true)}
        />
      ) : (
        <FlatCorridor products={products} categories={categories} whatsappNumber={whatsappNumber} />
      )}
      <div className={`pointer-events-none absolute left-0 top-0 z-10 max-w-xl p-6 transition-opacity duration-500 md:p-10 ${focus ? "opacity-0" : "opacity-100"}`}>
        <p className="font-serif text-[clamp(2rem,4vw,3.4rem)] leading-none">THE HAPPY TOUCH COLLECTION</p>
        <p className="mt-4 max-w-md text-sm leading-6 text-espresso/80">Discover furniture designed to make every space feel extraordinary.</p>
        <Link href="/" className="rule-link pointer-events-auto mt-8 text-espresso">
          <span>Leave the showroom</span>
          <span className="line" />
        </Link>
      </div>
      {webgl && !focus ? (
        <div className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 gap-8 text-[0.68rem] uppercase tracking-[0.22em]">
          <button type="button" onClick={() => { walk.current.nudge -= 0.08; }}>Back</button>
          <button type="button" onClick={() => { walk.current.nudge += 0.08; }}>Forward</button>
        </div>
      ) : null}
      {webgl && !ready ? <p className="absolute inset-0 grid place-items-center text-[0.68rem] uppercase tracking-[0.28em] text-espresso/60">Opening the corridor</p> : null}
      {help && webgl ? (
        <div className="absolute inset-0 z-20 grid place-items-center bg-ivory/80 px-6">
          <div className="max-w-md bg-ivory px-8 py-10 shadow-[0_24px_60px_rgb(17_17_17/0.08)]">
            <p className="kicker text-[0.68rem] uppercase tracking-[0.28em] text-espresso/60">First visit</p>
            <h2 className="mt-4 font-serif text-4xl leading-none">Walk the exhibition.</h2>
            <p className="mt-5 text-sm leading-7">
              {reduced
                ? "Choose Forward or Back to move. Select a piece to bring it forward. Motion stays immediate."
                : "Drag up or down to walk. Drag sideways to look along the walls. On a phone, swipe. Click a piece to bring it forward."}
            </p>
            <button type="button" className="btn mt-8" onClick={dismissHelp}>
              Enter the corridor
            </button>
          </div>
        </div>
      ) : null}
      {focus ? (
        <PiecePanel
          product={focus.product}
          category={categoryName(categories, focus.product.categoryId)}
          whatsappNumber={whatsappNumber}
          onClose={() => setFocusId(null)}
        />
      ) : null}
    </div>
  );
}

function PiecePanel({
  product,
  category,
  whatsappNumber,
  onClose,
}: {
  product: PublicProduct;
  category: string;
  whatsappNumber: string;
  onClose: () => void;
}) {
  const image = product.images[0];
  const stock = stockLabel(product.stockStatus);
  const whatsapp = whatsappNumber
    ? whatsappHref(whatsappNumber, productWhatsAppMessage({ name: product.name, category }))
    : null;
  return (
    <aside className="absolute bottom-0 right-0 z-30 max-h-[78svh] w-full overflow-y-auto border-t-2 border-red bg-ivory p-6 text-espresso shadow-[0_-20px_50px_rgb(17_17_17/0.12)] md:top-0 md:h-full md:max-h-none md:w-[26rem] md:border-l-2 md:border-t-0 md:p-10 md:shadow-[-20px_0_50px_rgb(17_17_17/0.08)]">
      <button type="button" onClick={onClose} className="text-[0.68rem] uppercase tracking-[0.22em]">
        Close
      </button>
      {image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={image.src} alt={image.alt} loading="lazy" decoding="async" className="mt-6 aspect-square w-full bg-ivory object-contain" />
      ) : null}
      <p className="mt-6 text-[0.68rem] uppercase tracking-[0.24em] text-espresso/50">{category}</p>
      <h2 className="mt-3 font-serif text-5xl leading-none">{product.name}</h2>
      <p className="mt-6 text-sm">{enquiryCopy.piece}</p>
      {stock ? <p className={`mt-3 text-[0.68rem] uppercase tracking-[0.22em] ${product.stockStatus === "in_stock" ? "text-forest" : ""}`}>{stock}</p> : null}
      <div className="mt-8 flex flex-col items-start gap-4">
        <Link href={`/collection/${product.slug}#enquire`} className="btn">
          {enquiryCopy.request}
        </Link>
        {whatsapp ? (
          <a href={whatsapp} className="rule-link" target="_blank" rel="noreferrer">
            <span>WhatsApp enquiry</span>
            <span className="line" />
          </a>
        ) : null}
        <Link href={`/collection/${product.slug}`} className="rule-link">
          <span>View the piece</span>
          <span className="line" />
        </Link>
      </div>
    </aside>
  );
}

function FlatCorridor({
  products,
  categories,
  whatsappNumber,
}: {
  products: PublicProduct[];
  categories: Category[];
  whatsappNumber: string;
}) {
  return (
    <div className="h-full overflow-y-auto px-6 pb-24 pt-36 md:px-10">
      <p className="max-w-xl text-sm leading-6">This browser cannot open the three-dimensional corridor. The collection is here in full.</p>
      <div className="mt-12 grid gap-12 md:grid-cols-2">
        {products.map((product) => {
          const category = categoryName(categories, product.categoryId);
          const stock = stockLabel(product.stockStatus);
          const whatsapp = whatsappNumber
            ? whatsappHref(whatsappNumber, productWhatsAppMessage({ name: product.name, category }))
            : null;
          const image = product.images[0];
          return (
            <article key={product.id}>
              {image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={image.src} alt={image.alt} loading="lazy" decoding="async" className="aspect-square w-full bg-ivory object-contain" />
              ) : null}
              <h2 className="mt-4 font-serif text-4xl">{product.name}</h2>
              <p className="mt-3 text-sm">{enquiryCopy.details}</p>
              {stock ? <p className={`mt-2 text-[0.68rem] uppercase tracking-[0.22em] ${product.stockStatus === "in_stock" ? "text-forest" : ""}`}>{stock}</p> : null}
              <Link href={`/collection/${product.slug}#enquire`} className="btn mt-6">
                {enquiryCopy.request}
              </Link>
              {whatsapp ? (
                <a href={whatsapp} className="rule-link mt-4" target="_blank" rel="noreferrer">
                  <span>WhatsApp enquiry</span>
                  <span className="line" />
                </a>
              ) : null}
            </article>
          );
        })}
      </div>
    </div>
  );
}
