"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SOFA_FRAME_COUNT, sofaFrameSrc } from "@/lib/sofa-frames";
import { site } from "@/lib/site";

const PAPER = "#F2F3F3";

const HOLD = 0.22;
const BLEND = 0.18;

type FrameSource = HTMLImageElement | ImageBitmap;

function frameSize(frame: FrameSource) {
  if (frame instanceof HTMLImageElement) {
    return { width: frame.naturalWidth, height: frame.naturalHeight };
  }
  return { width: frame.width, height: frame.height };
}

/** Fit the whole frame in the viewport so every device sees the same sofa, then stretch the studio edges into the spare space. */
function paintFrame(ctx: CanvasRenderingContext2D, frame: FrameSource, width: number, height: number) {
  const size = frameSize(frame);
  if (size.width === 0 || size.height === 0) return;
  const imageRatio = size.width / size.height;
  const canvasRatio = width / height;
  const wide = imageRatio > canvasRatio;
  const drawWidth = wide ? width : height * imageRatio;
  const drawHeight = wide ? width / imageRatio : height;
  const offsetX = (width - drawWidth) / 2;
  const offsetY = (height - drawHeight) / 2;

  ctx.fillStyle = PAPER;
  ctx.fillRect(0, 0, width, height);

  if (offsetY > 1) {
    const slice = Math.max(1, Math.round(size.height * 0.06));
    ctx.drawImage(frame, 0, 0, size.width, slice, offsetX, 0, drawWidth, offsetY + 2);
    ctx.drawImage(
      frame,
      0,
      size.height - slice,
      size.width,
      slice,
      offsetX,
      offsetY + drawHeight - 2,
      drawWidth,
      height - (offsetY + drawHeight) + 2,
    );
  }

  if (offsetX > 1) {
    ctx.drawImage(frame, 0, 0, 1, size.height, 0, offsetY, offsetX + 2, drawHeight);
    ctx.drawImage(
      frame,
      size.width - 1,
      0,
      1,
      size.height,
      offsetX + drawWidth - 2,
      offsetY,
      width - (offsetX + drawWidth) + 2,
      drawHeight,
    );
  }

  ctx.drawImage(frame, offsetX, offsetY, drawWidth, drawHeight);
}

function decodeLimit() {
  const viewport = window.visualViewport?.width || window.innerWidth;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  if (viewport >= 768) return 1280;
  return Math.min(960, Math.max(640, Math.ceil(viewport * dpr)));
}

async function decodeFrame(src: string, maxWidth: number) {
  const response = await fetch(src);
  if (!response.ok) throw new Error("frame");
  const blob = await response.blob();
  if (maxWidth < 1280 && typeof createImageBitmap === "function") {
    return createImageBitmap(blob, { resizeWidth: maxWidth, resizeQuality: "medium" });
  }
  const url = URL.createObjectURL(blob);
  try {
    const image = new Image();
    image.decoding = "async";
    image.src = url;
    await image.decode();
    return image;
  } finally {
    URL.revokeObjectURL(url);
  }
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
  const imagesRef = useRef<Array<FrameSource | undefined>>([]);
  const progressRef = useRef(0);
  const [heroReady, setHeroReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const frames: Array<FrameSource | undefined> = new Array(SOFA_FRAME_COUNT);
    const maxWidth = decodeLimit();
    const heroIndex = SOFA_FRAME_COUNT - 1;

    const finish = () => {
      if (cancelled) return;
      if (frames[heroIndex]) {
        imagesRef.current = frames;
        setHeroReady(true);
      }
    };

    const loadOne = async (index: number) => {
      try {
        frames[index] = await decodeFrame(sofaFrameSrc(index), maxWidth);
      } catch {
        frames[index] = frames[heroIndex];
      }
      finish();
    };

    void (async () => {
      await loadOne(heroIndex);
      const queue = Array.from({ length: heroIndex }, (_, index) => index);
      const workers = Array.from({ length: 4 }, async () => {
        while (!cancelled && queue.length > 0) {
          const index = queue.shift();
          if (index === undefined) return;
          await loadOne(index);
        }
      });
      await Promise.all(workers);
    })();

    return () => {
      cancelled = true;
      frames.forEach((frame) => {
        if (frame instanceof ImageBitmap) frame.close();
      });
    };
  }, []);

  useLayoutEffect(() => {
    if (!heroReady) return;
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
    mm.add("(max-width: 767px)", () => mount(3));
    const refresh = window.setTimeout(() => ScrollTrigger.refresh(), 200);
    return () => {
      window.clearTimeout(refresh);
      mm.revert();
    };
  }, [heroReady]);

  useEffect(() => {
    if (!heroReady) return;
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
      const nextWidth = Math.max(1, Math.round(width * dpr));
      const nextHeight = Math.max(1, Math.round(height * dpr));
      if (canvas.width === nextWidth && canvas.height === nextHeight) return;
      canvas.width = nextWidth;
      canvas.height = nextHeight;
      lastKey = "";
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
      if (!sofa || frameSize(sofa).width === 0) return;
      if (mix > 0 && (!image || frameSize(image).width === 0)) return;
      ctx.globalAlpha = 1;
      paintFrame(ctx, sofa, width, height);
      if (mix > 0 && image) {
        ctx.globalAlpha = mix;
        paintFrame(ctx, image, width, height);
        ctx.globalAlpha = 1;
      }
      lastKey = key;
    };

    const tick = () => {
      try {
        draw();
      } catch {
        lastKey = "";
      }
      frame = window.requestAnimationFrame(tick);
    };

    resize();
    draw();
    const observer = new ResizeObserver(() => {
      resize();
      lastKey = "";
      draw();
    });
    observer.observe(parent);
    frame = window.requestAnimationFrame(tick);
    return () => {
      window.cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, [heroReady]);

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
        <div data-hero-copy className="w-full">
          <p className="font-sans text-[clamp(2rem,8vw,6.6rem)] leading-[0.92] font-medium tracking-[-0.03em]">Furniture</p>
          <p className="font-sans text-[clamp(2rem,8vw,6.6rem)] leading-[0.92] font-medium tracking-[-0.03em]">&amp; Interiors</p>
          <p className="mt-3 font-serif text-[clamp(1.05rem,3.4vw,3rem)] leading-tight italic">{site.tagline}</p>
        </div>
        <p data-line="0" className="absolute inset-x-5 top-1/2 -translate-y-1/2 font-serif text-[clamp(1.55rem,6vw,4.4rem)] leading-[0.95] opacity-0 sm:inset-x-6">
          It starts in pieces.
        </p>
        <p data-line="50" className="absolute inset-x-5 top-1/2 -translate-y-1/2 font-serif text-[clamp(1.55rem,6vw,4.4rem)] leading-[0.95] opacity-0 sm:inset-x-6">
          Engineered to fit together.
        </p>
        <p data-line="100" className="absolute inset-x-5 top-1/2 -translate-y-1/2 font-serif text-[clamp(1.55rem,6vw,4.4rem)] leading-[0.95] opacity-0 sm:inset-x-6">
          The Mustard Velvet Sofa. Built to be lived in.
        </p>
      </div>
    </section>
  );
}
