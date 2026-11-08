"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { useLightHeaderUntilFooter } from "@/components/layout/header-tone";
import { anchors, anchorsFor, rooms } from "@/lib/showroom-config";
import { stockLabel } from "@/lib/format";
import { enquiryCopy, publicCopy, type PublicProduct } from "@/lib/public-catalogue";
import { categoryName } from "@/lib/catalog";
import type { Category, ShowroomRoomId } from "@/lib/types";
import { productWhatsAppMessage, whatsappHref } from "@/lib/whatsapp";

const ShowroomCanvas = dynamic(() => import("@/components/three/showroom-canvas").then((mod) => mod.ShowroomCanvas), {
  ssr: false,
});

export function ShowroomExperience({
  products,
  categories,
  whatsappNumber,
}: {
  products: PublicProduct[];
  categories: Category[];
  whatsappNumber: string;
}) {
  const [room, setRoom] = useState<ShowroomRoomId>("living");
  const [selected, setSelected] = useState<string | null>(null);
  const [turning, setTurning] = useState(false);
  const [fading, setFading] = useState(false);
  const [webgl, setWebgl] = useState(true);
  const [hidden, setHidden] = useState(false);
  const rotations = useRef<Record<string, number>>({});
  const drag = useRef(0);
  const pointer = useRef<{ x: number; moved: boolean } | null>(null);
  useLightHeaderUntilFooter();

  const models = useMemo(() => {
    const map: Record<string, string> = {};
    products.forEach((product) => {
      if (product.showroomAnchor && product.modelPath) map[product.showroomAnchor] = product.modelPath;
    });
    return map;
  }, [products]);

  const roomRef = useRef(room);
  roomRef.current = room;

  useEffect(() => {
    try {
      const canvas = document.createElement("canvas");
      setWebgl(Boolean(canvas.getContext("webgl2") || canvas.getContext("webgl")));
    } catch {
      setWebgl(false);
    }
    const onVisibility = () => setHidden(document.hidden);
    document.addEventListener("visibilitychange", onVisibility);
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
      const index = rooms.findIndex((item) => item.id === roomRef.current);
      const next = event.key === "ArrowRight" ? rooms[index + 1] : rooms[index - 1];
      if (next) changeRoom(next.id);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  function changeRoom(id: ShowroomRoomId) {
    if (id === roomRef.current) return;
    setFading(true);
    window.setTimeout(() => {
      setRoom(id);
      setSelected(null);
      setTurning(false);
      drag.current = 0;
      setFading(false);
    }, 420);
  }

  const anchor = anchors.find((item) => item.id === selected) ?? null;
  const linked = anchor ? products.find((product) => product.showroomAnchor === anchor.id && product.published) ?? null : null;

  if (!webgl) {
    return <FlatShowroom products={products} categories={categories} whatsappNumber={whatsappNumber} />;
  }

  return (
    <div className="relative min-h-[100svh] bg-ink text-ivory">
      <div
        className="fixed inset-0 z-0"
        onPointerDown={(event) => {
          pointer.current = { x: event.clientX, moved: false };
        }}
        onPointerMove={(event) => {
          if (!pointer.current) return;
          const delta = event.clientX - pointer.current.x;
          if (Math.abs(delta) > 3) pointer.current.moved = true;
          if (turning && selected) rotations.current[selected] = (rotations.current[selected] ?? 0) + delta * 0.01;
          else drag.current += delta * 0.005;
          pointer.current.x = event.clientX;
        }}
        onPointerUp={() => {
          window.setTimeout(() => {
            if (pointer.current) pointer.current.moved = false;
          }, 0);
        }}
      >
        <ShowroomCanvas
          room={room}
          selected={selected}
          rotations={rotations}
          drag={drag}
          models={models}
          paused={hidden}
          onSelect={(id) => {
            if (pointer.current?.moved) return;
            setSelected(id || null);
            setTurning(false);
          }}
        />
      </div>
      <div className={`pointer-events-none fixed inset-0 z-10 bg-ink transition-opacity duration-500 ${fading ? "opacity-100" : "opacity-0"}`} />
      <aside className="pointer-events-auto fixed left-0 right-0 top-24 z-20 flex gap-4 overflow-x-auto px-5 md:left-8 md:right-auto md:top-1/2 md:w-56 md:-translate-y-1/2 md:flex-col md:px-0">
        {rooms.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => changeRoom(item.id)}
            className={`shrink-0 whitespace-nowrap border-l-2 pl-3 text-left text-[0.68rem] uppercase tracking-[0.22em] ${item.id === room ? "border-red text-ivory" : "border-transparent text-ivory/45"}`}
          >
            {item.name}
          </button>
        ))}
      </aside>
      <div className="pointer-events-none absolute inset-x-0 bottom-8 z-20 px-6 md:px-10">
        <p className="max-w-sm text-sm leading-6 text-ivory/70">{rooms.find((item) => item.id === room)?.summary}</p>
      </div>
      {anchor ? (
        <PiecePanel
          anchorLabel={anchor.label}
          categorySlug={anchor.categorySlug}
          category={categoryName(categories, categories.find((item) => item.slug === anchor.categorySlug)?.id ?? "")}
          product={linked}
          whatsappNumber={whatsappNumber}
          turning={turning}
          onTurn={() => setTurning((value) => !value)}
          onClose={() => {
            setSelected(null);
            setTurning(false);
          }}
        />
      ) : null}
    </div>
  );
}

function PiecePanel({
  anchorLabel,
  categorySlug,
  category,
  product,
  whatsappNumber,
  turning,
  onTurn,
  onClose,
}: {
  anchorLabel: string;
  categorySlug: string;
  category: string;
  product: PublicProduct | null;
  whatsappNumber: string;
  turning: boolean;
  onTurn: () => void;
  onClose: () => void;
}) {
  const stock = product ? stockLabel(product.stockStatus) : null;
  const whatsapp =
    product && whatsappNumber
      ? whatsappHref(whatsappNumber, productWhatsAppMessage({ name: product.name, category }))
      : null;
  return (
    <aside className="fixed bottom-0 right-0 z-30 max-h-[70svh] w-full overflow-y-auto bg-ivory p-6 text-espresso md:top-24 md:h-auto md:max-h-[calc(100svh-8rem)] md:w-[24rem]">
      <div className="flex items-start justify-between gap-4">
        <p className="text-[0.68rem] uppercase tracking-[0.24em] text-espresso/50">{product ? category : anchorLabel}</p>
        <button type="button" onClick={onClose} className="text-[0.68rem] uppercase tracking-[0.22em]">
          Close
        </button>
      </div>
      <h2 className="mt-4 font-serif text-4xl leading-none">{product ? product.name : anchorLabel}</h2>
      {product?.images[0] ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={product.images[0].src} alt={product.images[0].alt} loading="lazy" decoding="async" className="mt-6 aspect-square w-full bg-ivory object-contain" />
      ) : null}
      {product && publicCopy(product.description) ? <p className="mt-4 text-sm leading-6">{publicCopy(product.description)}</p> : null}
      {product ? <p className="mt-4 text-sm">{enquiryCopy.piece}</p> : (
        <p className="mt-4 text-sm leading-6">A place in the showroom for a piece from the collection.</p>
      )}
      {stock ? <p className={`mt-2 text-[0.68rem] uppercase tracking-[0.2em] ${product?.stockStatus === "in_stock" ? "text-forest" : ""}`}>{stock}</p> : null}
      <div className="mt-6 flex flex-col items-start gap-4">
        {product ? (
          <Link href={`/collection/${product.slug}#enquire`} className="btn">
            {enquiryCopy.request}
          </Link>
        ) : null}
        {product ? (
          <Link href={`/collection/${product.slug}`} className="rule-link">
            <span>View the piece</span>
            <span className="line" />
          </Link>
        ) : (
          <Link href={`/collection?category=${categorySlug}`} className="rule-link">
            <span>View {anchorLabel.toLowerCase()}</span>
            <span className="line" />
          </Link>
        )}
        {whatsapp ? (
          <a href={whatsapp} className="rule-link" target="_blank" rel="noreferrer">
            <span>WhatsApp</span>
            <span className="line" />
          </a>
        ) : null}
        <button type="button" onClick={onTurn} className="text-[0.68rem] uppercase tracking-[0.22em]">
          {turning ? "Turning the piece" : "Turn the piece"}
        </button>
      </div>
    </aside>
  );
}

function FlatShowroom({
  products,
  categories,
  whatsappNumber,
}: {
  products: PublicProduct[];
  categories: Category[];
  whatsappNumber: string;
}) {
  return (
    <div className="px-6 pb-24 pt-32 md:px-10">
      <h1 className="max-w-4xl font-serif text-6xl leading-none">The showroom</h1>
      <p className="mt-6 max-w-xl text-sm leading-6">The interactive model needs WebGL. The rooms remain here as an index.</p>
      <div className="mt-16 flex flex-col gap-20">
        {rooms.map((room) => (
          <section key={room.id}>
            <h2 className="font-serif text-5xl">{room.name}</h2>
            <p className="mt-3 max-w-lg text-sm leading-6">{room.summary}</p>
            <div className="mt-8 grid gap-8 md:grid-cols-2">
              {anchorsFor(room.id).map((anchor) => {
                const product = products.find((item) => item.showroomAnchor === anchor.id && item.published);
                const category = categoryName(categories, product?.categoryId ?? "");
                const whatsapp =
                  product && whatsappNumber
                    ? whatsappHref(whatsappNumber, productWhatsAppMessage({ name: product.name, category }))
                    : null;
                return (
                  <article key={anchor.id}>
                    <p className="text-[0.68rem] uppercase tracking-[0.22em] text-espresso/50">{anchor.label}</p>
                    <h3 className="mt-2 font-serif text-3xl">{product?.name ?? anchor.label}</h3>
                    {product ? (
                      <Link href={`/collection/${product.slug}`} className="mt-3 inline-block text-sm">
                        View the piece
                      </Link>
                    ) : (
                      <Link href={`/collection?category=${anchor.categorySlug}`} className="mt-3 inline-block text-sm">
                        View the category
                      </Link>
                    )}
                    {whatsapp ? (
                      <a href={whatsapp} className="mt-2 block text-sm" target="_blank" rel="noreferrer">
                        WhatsApp
                      </a>
                    ) : null}
                  </article>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
