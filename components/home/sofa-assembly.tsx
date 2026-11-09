"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { DESKTOP_FRAME_COUNT, MOBILE_FRAME_COUNT, sequenceFrameSrc } from "@/lib/sofa-frames";

const PAPER = "#F2F3F3";

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

function mobileSequence() {
  return window.matchMedia("(max-width: 1023px)").matches;
}

function decodeFrame(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.decoding = "async";
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("frame"));
    image.src = src;
    image.decode().catch(() => undefined);
  });
}

function nearestFrame(images: Array<FrameSource | undefined>, index: number) {
  const exact = images[index];
  if (exact && frameSize(exact).width > 0) return exact;
  for (let step = 1; step < images.length; step += 1) {
    const before = images[index - step];
    if (before && frameSize(before).width > 0) return before;
    const after = images[index + step];
    if (after && frameSize(after).width > 0) return after;
  }
  return undefined;
}

function frameAt(progress: number, count: number) {
  const index = Math.min(count - 1, Math.max(0, Math.round(progress * (count - 1))));
  return { index };
}

function fade(progress: number, start: number, end: number) {
  if (progress <= start) return 0;
  if (progress >= end) return 1;
  return (progress - start) / (end - start);
}

function paintLine(line: HTMLElement | null, amount: number) {
  const reveal = line?.querySelector<HTMLElement>("[data-reveal]");
  if (!reveal) return;
  const shown = Math.min(1, Math.max(0, amount));
  reveal.style.opacity = String(shown);
  reveal.style.transform = `translate3d(0, ${(1 - shown) * 22}px, 0)`;
  reveal.style.clipPath = `inset(${(1 - shown) * 45}% 0 0 0)`;
}

function paintCaptions(root: HTMLElement, progress: number) {
  paintLine(root.querySelector<HTMLElement>("[data-line='0']"), 1 - fade(progress, 0.18, 0.3));
  paintLine(root.querySelector<HTMLElement>("[data-line='50']"), fade(progress, 0.26, 0.38) * (1 - fade(progress, 0.52, 0.64)));
  paintLine(root.querySelector<HTMLElement>("[data-line='100']"), fade(progress, 0.6, 0.74));
}

export function SofaAssembly() {
  const trackRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<Array<FrameSource | undefined>>([]);
  const progressRef = useRef(0);
  const drawRef = useRef<() => void>(() => {});
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    let loaded = 0;
    const mobile = mobileSequence();
    const count = mobile ? MOBILE_FRAME_COUNT : DESKTOP_FRAME_COUNT;
    const frames: Array<FrameSource | undefined> = new Array(count);
    gsap.registerPlugin(ScrollTrigger);

    const finish = () => {
      loaded += 1;
      if (cancelled) return;
      if (frames[0]) {
        imagesRef.current = frames;
        setReady(true);
      }
      if (loaded === count) {
        imagesRef.current = frames;
        ScrollTrigger.refresh();
      }
      drawRef.current();
    };

    const loadOne = async (index: number) => {
      try {
        frames[index] = await decodeFrame(sequenceFrameSrc(index, mobile));
      } catch {
        frames[index] = undefined;
      }
      finish();
    };

    void (async () => {
      await loadOne(0);
      const queue = Array.from({ length: count - 1 }, (_, index) => index + 1);
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
    if (!ready) return;
    const root = sectionRef.current;
    const track = trackRef.current;
    if (!root || !track) return;
    gsap.registerPlugin(ScrollTrigger);
    ScrollTrigger.config({ ignoreMobileResize: true });
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      progressRef.current = 0;
      root.querySelectorAll<HTMLElement>("[data-line]").forEach((line) => {
        const reveal = line.querySelector<HTMLElement>("[data-reveal]");
        if (!reveal) return;
        reveal.style.opacity = line.dataset.line === "0" ? "1" : "0";
        reveal.style.transform = "none";
        reveal.style.clipPath = "none";
      });
      return;
    }

    const mm = gsap.matchMedia();
    const syncProgress = (self: ScrollTrigger) => {
      progressRef.current = self.progress;
      paintCaptions(root, self.progress);
      drawRef.current();
    };

    mm.add("(min-width: 1024px)", () => {
      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: root,
          start: "top top",
          end: "+=3000",
          pin: true,
          pinType: "transform",
          scrub: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: syncProgress,
        },
      });
      return () => timeline.kill();
    });

    mm.add("(max-width: 1023px)", () => {
      const distance = () => Math.round(window.innerHeight * 3.2);
      const layout = () => {
        const height = window.innerHeight;
        root.style.height = `${height}px`;
        track.style.height = `${height + distance()}px`;
      };
      let touching = false;
      let frame = 0;
      const place = (scrolled: number, total: number) => {
        root.style.left = "0px";
        root.style.width = "100%";
        if (scrolled > 0 && scrolled < total) {
          root.style.position = "fixed";
          root.style.top = "0px";
          root.style.zIndex = "1";
          return;
        }
        root.style.zIndex = "";
        if (scrolled >= total) {
          root.style.position = "absolute";
          root.style.top = `${total}px`;
          return;
        }
        root.style.position = "";
        root.style.top = "";
        root.style.left = "";
        root.style.width = "";
      };
      const update = () => {
        const total = Math.max(1, track.offsetHeight - root.offsetHeight);
        const scrolled = window.scrollY - track.offsetTop;
        place(scrolled, total);
        const progress = Math.min(1, Math.max(0, scrolled / total));
        progressRef.current = progress;
        paintCaptions(root, progress);
        drawRef.current();
      };
      const loop = () => {
        update();
        if (touching) frame = window.requestAnimationFrame(loop);
      };
      const onStart = () => {
        touching = true;
        window.cancelAnimationFrame(frame);
        frame = window.requestAnimationFrame(loop);
      };
      const onEnd = () => {
        touching = false;
        update();
      };
      layout();
      update();
      window.addEventListener("scroll", update, { passive: true });
      window.addEventListener("touchstart", onStart, { passive: true });
      window.addEventListener("touchmove", update, { passive: true });
      window.addEventListener("touchend", onEnd, { passive: true });
      window.addEventListener("touchcancel", onEnd, { passive: true });
      window.addEventListener("orientationchange", layout);
      return () => {
        touching = false;
        window.cancelAnimationFrame(frame);
        window.removeEventListener("scroll", update);
        window.removeEventListener("touchstart", onStart);
        window.removeEventListener("touchmove", update);
        window.removeEventListener("touchend", onEnd);
        window.removeEventListener("touchcancel", onEnd);
        window.removeEventListener("orientationchange", layout);
        root.style.height = "";
        root.style.position = "";
        root.style.top = "";
        root.style.left = "";
        root.style.width = "";
        root.style.zIndex = "";
        track.style.height = "";
      };
    });

    const refresh = () => ScrollTrigger.refresh();
    const refreshSoon = window.setTimeout(refresh, 200);
    window.addEventListener("load", refresh);
    window.addEventListener("resize", refresh);
    return () => {
      window.clearTimeout(refreshSoon);
      window.removeEventListener("load", refresh);
      window.removeEventListener("resize", refresh);
      mm.revert();
    };
  }, [ready]);

  useEffect(() => {
    if (!ready) return;
    const canvas = canvasRef.current;
    const parent = canvas?.parentElement;
    const ctx = canvas?.getContext("2d", { alpha: false });
    if (!canvas || !parent || !ctx) return;

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
      const { index } = frameAt(progressRef.current, count);
      const key = `${index}:${width}:${height}`;
      if (key === lastKey) return;
      const image = nearestFrame(images, index);
      if (!image) return;
      ctx.globalAlpha = 1;
      paintFrame(ctx, image, width, height);
      lastKey = key;
    };

    const paint = () => {
      try {
        draw();
      } catch {
        lastKey = "";
      }
    };

    drawRef.current = paint;
    resize();
    paint();
    const observer = new ResizeObserver(() => {
      resize();
      lastKey = "";
      paint();
    });
    observer.observe(parent);
    return () => {
      drawRef.current = () => {};
      observer.disconnect();
    };
  }, [ready]);

  return (
    <div ref={trackRef} className="relative touch-pan-y">
    <section id="furniture" ref={sectionRef} className="relative h-[100dvh] overflow-hidden bg-[#F2F3F3]">
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" aria-label="Mustard velvet sofa assembling" />
      <div
        className="pointer-events-none absolute inset-0 z-10"
        style={{
          background:
            "linear-gradient(180deg, rgba(16, 20, 28, 0.42) 0%, rgba(16, 20, 28, 0.18) 28%, rgba(16, 20, 28, 0.28) 52%, rgba(16, 20, 28, 0.55) 100%)",
        }}
      />
      <div className="pointer-events-none absolute inset-0 z-10 flex items-end justify-center px-5 pb-[max(6.5rem,env(safe-area-inset-bottom))] text-center text-white min-[1024px]:items-center min-[1024px]:px-6 min-[1024px]:pb-0 min-[1024px]:pt-16">
        <p data-line="0" className="absolute inset-x-5 bottom-[max(6.5rem,env(safe-area-inset-bottom))] min-[1024px]:inset-x-6 min-[1024px]:bottom-auto min-[1024px]:top-1/2 min-[1024px]:-translate-y-1/2">
          <span data-reveal className="inline-block max-w-full font-display text-[clamp(1.85rem,5.2vw,4.4rem)] leading-[1.05] font-medium italic text-balance">It starts in pieces.</span>
        </p>
        <p data-line="50" className="absolute inset-x-5 bottom-[max(6.5rem,env(safe-area-inset-bottom))] min-[1024px]:inset-x-6 min-[1024px]:bottom-auto min-[1024px]:top-1/2 min-[1024px]:-translate-y-1/2">
          <span data-reveal className="inline-block max-w-full font-display text-[clamp(1.85rem,5.2vw,4.4rem)] leading-[1.05] font-medium italic text-balance opacity-0">Engineered to fit together.</span>
        </p>
        <p data-line="100" className="absolute inset-x-5 bottom-[max(6.5rem,env(safe-area-inset-bottom))] min-[1024px]:inset-x-6 min-[1024px]:bottom-auto min-[1024px]:top-1/2 min-[1024px]:-translate-y-1/2">
          <span data-reveal className="inline-block max-w-full font-display text-[clamp(1.85rem,5.2vw,4.4rem)] leading-[1.05] font-medium italic text-balance opacity-0">The Mustard Velvet Sofa. Built to be lived in.</span>
        </p>
      </div>
    </section>
    </div>
  );
}
