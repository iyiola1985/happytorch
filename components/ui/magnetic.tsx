"use client";

import { useRef } from "react";

export function Magnetic({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  return (
    <div
      ref={ref}
      className="inline-flex transition-transform duration-300 ease-out"
      onPointerMove={(event) => {
        const node = ref.current;
        if (!node || window.matchMedia("(pointer: coarse)").matches) return;
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
        const rect = node.getBoundingClientRect();
        const x = event.clientX - (rect.left + rect.width / 2);
        const y = event.clientY - (rect.top + rect.height / 2);
        node.style.transform = `translate(${x * 0.22}px, ${y * 0.28}px)`;
      }}
      onPointerLeave={() => {
        if (ref.current) ref.current.style.transform = "translate(0, 0)";
      }}
    >
      {children}
    </div>
  );
}
