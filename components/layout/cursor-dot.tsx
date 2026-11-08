"use client";

import { useEffect, useRef } from "react";

export function CursorDot() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!fine.matches || reduced.matches) return;
    const dot = ref.current;
    if (!dot) return;
    document.documentElement.classList.add("has-cursor");
    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;
    let currentX = x;
    let currentY = y;
    let frame = 0;
    const onMove = (event: PointerEvent) => {
      x = event.clientX;
      y = event.clientY;
    };
    const loop = () => {
      currentX += (x - currentX) * 0.28;
      currentY += (y - currentY) * 0.28;
      dot.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;
      frame = requestAnimationFrame(loop);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    frame = requestAnimationFrame(loop);
    return () => {
      document.documentElement.classList.remove("has-cursor");
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(frame);
    };
  }, []);

  return <div ref={ref} className="cursor-dot" aria-hidden />;
}
