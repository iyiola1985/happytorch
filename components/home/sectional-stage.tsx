"use client";

import { useLayoutEffect, useRef } from "react";

const HERO = "/home/luxury-sofa.webp";

const PLATES = [
  { src: "/catalog/oval-dining-set.webp", className: "right-[6%] top-[12%] w-[34vw] max-w-[220px] md:w-[18vw] md:max-w-[280px]", ratio: "1 / 1", depth: 22 },
  { src: "/catalog/display-cabinet.webp", className: "right-[18%] top-[22%] w-[26vw] max-w-[160px] md:right-[22%] md:w-[13vw] md:max-w-[200px]", ratio: "3 / 4", depth: 46 },
  { src: "/catalog/executive-office-set.webp", className: "right-[8%] top-[16%] w-[40vw] max-w-[240px] md:w-[22vw] md:max-w-[340px]", ratio: "5 / 4", depth: 30 },
  { src: "/catalog/recliner-sofa.webp", className: "right-[14%] top-[18%] w-[28vw] max-w-[180px] md:w-[15vw] md:max-w-[230px]", ratio: "1 / 1", depth: 54 },
  { src: "/catalog/automatic-massage-chair.webp", className: "right-[7%] top-[14%] w-[30vw] max-w-[190px] md:w-[16vw] md:max-w-[250px]", ratio: "3 / 4", depth: 26 },
  { src: "/catalog/dining-set.webp", className: "right-[16%] top-[20%] w-[32vw] max-w-[200px] md:w-[17vw] md:max-w-[260px]", ratio: "1 / 1", depth: 40 },
  { src: "/catalog/upholstered-bed.webp", className: "right-[9%] top-[18%] w-[38vw] max-w-[230px] md:w-[20vw] md:max-w-[300px]", ratio: "5 / 4", depth: 34 },
  { src: "/catalog/bedside-table.webp", className: "right-[20%] top-[14%] w-[24vw] max-w-[150px] md:w-[12vw] md:max-w-[180px]", ratio: "1 / 1", depth: 58 },
] as const;

function smoothstep(value: number) {
  const t = Math.min(1, Math.max(0, value));
  return t * t * (3 - 2 * t);
}

function heroPresence(progress: number) {
  if (progress <= 0.22) return 1;
  if (progress >= 0.56) return 0;
  return 1 - smoothstep((progress - 0.22) / 0.34);
}

function plateFade(progress: number, index: number, count: number) {
  const center = index / Math.max(1, count - 1);
  const half = 0.72 / count;
  const delta = Math.abs(progress - center);
  if (delta >= half) return 0;
  return smoothstep(1 - delta / half);
}

export function SectionalStage({
  progressRef,
  reduced,
}: {
  progressRef: React.RefObject<number>;
  reduced: boolean;
}) {
  const photoRef = useRef<HTMLDivElement>(null);
  const platesRef = useRef<Array<HTMLImageElement | null>>([]);

  useLayoutEffect(() => {
    const apply = (progress: number) => {
      const presence = reduced ? 1 : heroPresence(progress);
        const scale = reduced ? 1 : 1 + Math.min(progress, 0.56) * 0.06;
      if (photoRef.current) {
        photoRef.current.style.opacity = String(presence);
        photoRef.current.style.transform = `scale(${scale})`;
      }
      const quiet = 0.42 + 0.58 * (1 - presence);
      platesRef.current.forEach((plate, index) => {
        if (!plate) return;
        const fade = reduced ? (index === 0 ? 1 : 0) : plateFade(progress, index, PLATES.length);
        const depth = PLATES[index]?.depth ?? 24;
        const opening = presence > 0.85 ? 0 : 1;
        plate.style.opacity = String(fade * 0.22 * quiet * opening);
        plate.style.transform = `translate3d(0, ${(progress - 0.35) * depth}px, 0)`;
      });
    };

    apply(reduced ? 0 : (progressRef.current ?? 0));
    if (reduced) return;

    let frame = 0;
    let last = Number.NaN;
    const loop = () => {
      frame = requestAnimationFrame(loop);
      if (document.hidden) return;
      const progress = progressRef.current ?? 0;
      if (progress === last) return;
      last = progress;
      apply(progress);
    };
    frame = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frame);
  }, [progressRef, reduced]);

  return (
    <div className="pointer-events-none fixed inset-0 z-[1]" aria-hidden>
      <div ref={photoRef} className="absolute inset-0 origin-center will-change-transform">
        <div className="absolute inset-0 bg-ivory" />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={HERO}
          alt=""
          loading="lazy"
          decoding="async"
          className="absolute left-1/2 top-[62%] max-h-[58vh] w-[min(92vw,520px)] -translate-x-1/2 -translate-y-1/2 object-contain drop-shadow-[0_28px_40px_rgba(17,17,17,0.16)] md:left-[62%] md:top-[56%] md:max-h-[68vh] md:w-[min(46vw,640px)]"
        />
      </div>
      {PLATES.map((plate, index) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={plate.src}
          ref={(node) => {
            platesRef.current[index] = node;
          }}
          src={plate.src}
          alt=""
          decoding="async"
          loading="lazy"
          className={`absolute object-cover opacity-0 ${plate.className}`}
          style={{ aspectRatio: plate.ratio }}
        />
      ))}
    </div>
  );
}
