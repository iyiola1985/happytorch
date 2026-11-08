"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SOFA_FRAME_COUNT, sofaFrameSrc } from "@/lib/sofa-frames";
import { site } from "@/lib/site";

const PAPER = "#F2F3F3";

const HOLD = 0.22;
const BLEND = 0.18;

function coverPlacement(img: HTMLImageElement, width: number, height: number) {
  const imageRatio = img.naturalWidth / img.naturalHeight;
  const canvasRatio = width / height;
  if (imageRatio > canvasRatio) {
    const drawHeight = height;
    const drawWidth = height * imageRatio;
    return { offsetX: (width - drawWidth) / 2, offsetY: 0, drawWidth, drawHeight };
  }
  const drawWidth = width;
  const drawHeight = width / imageRatio;
  return { offsetX: 0, offsetY: (height - drawHeight) / 2, drawWidth, drawHeight };
}

function paintCover(ctx: CanvasRenderingContext2D, img: HTMLImageElement, width: number, height: number) {
  const place = coverPlacement(img, width, height);
  ctx.drawImage(img, place.offsetX, place.offsetY, place.drawWidth, place.drawHeight);
}

function frameAt(progress: number, count: number) {
  if (progress <= HOLD) return { index: count - 1, mix: 0 };
  const played = (progress - HOLD) / (1 - HOLD);
  const index = Math.min(count - 1, Math.max(0, Math.round(played * (count - 1))));
  const mix = played >= BLEND ? 1 : played / BLEND;
  return { index, mix };
}

function addCaptions(timeline: gsap.core.Timeline) {
  timeline.set("[data-hero-copy]", { opacity: 1 }, 0);
  timeline.set("[data-line='0']", { opacity: 0 }, 0);
  timeline.set("[data-line='50']", { opacity: 0 }, 0);
  timeline.set("[data-line='100']", { opacity: 0 }, 0);
  timeline.to("[data-hero-copy]", { opacity: 0, ease: "none", duration: 0.12 }, 0.12);
  timeline.fromTo("[data-line='0']", { opacity: 0 }, { opacity: 1, ease: "none", duration: 0.12 }, 0.16);
  timeline.to("[data-line='0']", { opacity: 0, ease: "none", duration: 0.12 }, 0.36);
  timeline.fromTo("[data-line='50']", { opacity: 0 }, { opacity: 1, ease: "none", duration: 0.12 }, 0.4);
  timeline.to("[data-line='50']", { opacity: 0, ease: "none", duration: 0.12 }, 0.6);
  timeline.fromTo("[data-line='100']", { opacity: 0 }, { opacity: 1, ease: "none", duration: 0.14 }, 0.64);
}

export function SofaAssembly() {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const progressRef = useRef(0);
  const [percent, setPercent] = useState(0);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    let loaded = 0;
    const images = Array.from({ length: SOFA_FRAME_COUNT }, () => new Image());
    const finish = () => {
      loaded += 1;
      if (cancelled) return;
      setPercent(Math.round((loaded / SOFA_FRAME_COUNT) * 100));
      if (loaded === SOFA_FRAME_COUNT) {
        imagesRef.current = images;
        setReady(true);
      }
    };
    images.forEach((image, index) => {
      image.decoding = "async";
      image.onload = finish;
      image.onerror = finish;
      image.src = sofaFrameSrc(index);
    });
    return () => {
      cancelled = true;
      images.forEach((image) => {
        image.onload = null;
        image.onerror = null;
      });
    };
  }, []);

  useLayoutEffect(() => {
    if (!ready) return;
    const root = sectionRef.current;
    if (!root) return;
    gsap.registerPlugin(ScrollTrigger);
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      progressRef.current = 0;
      root.querySelectorAll<HTMLElement>("[data-line]").forEach((line) => {
        line.style.opacity = "0";
      });
      const heroCopy = root.querySelector<HTMLElement>("[data-hero-copy]");
      if (heroCopy) heroCopy.style.opacity = "1";
      return;
    }

    const mm = gsap.matchMedia();
    const mount = (screens: number) => {
      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: root,
          start: "top top",
          end: () => `+=${(window.visualViewport?.height || window.innerHeight) * screens}`,
          pin: true,
          scrub: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            progressRef.current = self.progress;
          },
        },
      });
      addCaptions(timeline);
    };

    mm.add("(min-width: 768px)", () => mount(3));
    mm.add("(max-width: 767px)", () => mount(2));
    const refresh = window.setTimeout(() => ScrollTrigger.refresh(), 200);
    return () => {
      window.clearTimeout(refresh);
      mm.revert();
    };
  }, [ready]);

  useEffect(() => {
    if (!ready) return;
    const canvas = canvasRef.current;
    const parent = canvas?.parentElement;
    const ctx = canvas?.getContext("2d", { alpha: false });
    if (!canvas || !parent || !ctx) return;

    let frame = 0;
    let lastKey = "";

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const width = parent.clientWidth;
      const height = parent.clientHeight;
      canvas.width = Math.max(1, Math.round(width * dpr));
      canvas.height = Math.max(1, Math.round(height * dpr));
    };

    const draw = () => {
      const images = imagesRef.current;
      const count = images.length;
      if (!count) return;
      const width = canvas.width;
      const height = canvas.height;
      const { index, mix } = frameAt(progressRef.current, count);
      const key = `${index}:${mix.toFixed(3)}:${width}:${height}`;
      if (key === lastKey) return;
      const sofa = images[count - 1];
      const image = images[index];
      if (!sofa || !sofa.complete || sofa.naturalWidth === 0) return;
      if (mix > 0 && (!image || !image.complete || image.naturalWidth === 0)) return;
      ctx.globalAlpha = 1;
      ctx.fillStyle = PAPER;
      ctx.fillRect(0, 0, width, height);
      paintCover(ctx, sofa, width, height);
      if (mix > 0 && image) {
        ctx.globalAlpha = mix;
        paintCover(ctx, image, width, height);
        ctx.globalAlpha = 1;
      }
      lastKey = key;
    };

    const tick = () => {
      draw();
      frame = window.requestAnimationFrame(tick);
    };

    resize();
    const observer = new ResizeObserver(() => {
      resize();
      lastKey = "";
    });
    observer.observe(parent);
    frame = window.requestAnimationFrame(tick);
    return () => {
      window.cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, [ready]);

  return (
    <section id="furniture" ref={sectionRef} className="relative h-[100dvh] overflow-hidden bg-[#F2F3F3]">
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" aria-label="Mustard velvet sofa assembling" />
      <div
        className="pointer-events-none absolute inset-0 z-10"
        style={{
          background:
            "linear-gradient(180deg, rgba(16, 20, 28, 0.42) 0%, rgba(16, 20, 28, 0.18) 28%, rgba(16, 20, 28, 0.28) 52%, rgba(16, 20, 28, 0.55) 100%)",
        }}
      />
      <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center px-5 pt-16 text-center text-white sm:px-6">
        <div data-hero-copy className="max-w-[18rem] sm:max-w-none">
          <p className="font-sans text-[clamp(2.35rem,11vw,6.6rem)] leading-[0.92] font-medium tracking-[-0.03em]">Furniture</p>
          <p className="font-sans text-[clamp(2.35rem,11vw,6.6rem)] leading-[0.92] font-medium tracking-[-0.03em]">&amp; Interiors</p>
          <p className="mt-3 font-serif text-[clamp(1.15rem,4.6vw,3rem)] leading-tight italic">{site.tagline}</p>
        </div>
        <p data-line="0" className="absolute inset-x-5 top-1/2 -translate-y-1/2 font-serif text-[clamp(1.7rem,7vw,4.4rem)] leading-[0.95] opacity-0 sm:inset-x-6">
          It starts in pieces.
        </p>
        <p data-line="50" className="absolute inset-x-5 top-1/2 -translate-y-1/2 font-serif text-[clamp(1.7rem,7vw,4.4rem)] leading-[0.95] opacity-0 sm:inset-x-6">
          Engineered to fit together.
        </p>
        <p data-line="100" className="absolute inset-x-5 top-1/2 -translate-y-1/2 font-serif text-[clamp(1.7rem,7vw,4.4rem)] leading-[0.95] opacity-0 sm:inset-x-6">
          The Mustard Velvet Sofa. Built to be lived in.
        </p>
      </div>
      {ready ? null : (
        <div className="absolute inset-0 z-20 grid place-items-center bg-[#F2F3F3]">
          <p className="text-sm tracking-[0.18em] text-[#3a3a3a] uppercase" role="status" aria-live="polite">
            Assembling sofa... {percent}%
          </p>
        </div>
      )}
    </section>
  );
}
