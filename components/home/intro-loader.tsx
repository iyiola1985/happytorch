"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { setLenisLocked } from "@/components/layout/lenis-controller";
import { site } from "@/lib/site";

export function IntroLoader({ logoPath }: { logoPath: string }) {
  const pathname = usePathname();
  const [phase, setPhase] = useState<"hold" | "leave" | "done">(pathname === "/" ? "done" : "hold");

  useEffect(() => {
    if (pathname === "/") {
      document.documentElement.classList.add("skip-intro");
      setPhase("done");
      return;
    }
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || sessionStorage.getItem("ht-intro") === "1") {
      document.documentElement.classList.add("skip-intro");
      setPhase("done");
      return;
    }
    setLenisLocked("intro", true);
    const leave = window.setTimeout(() => setPhase("leave"), 1400);
    return () => {
      window.clearTimeout(leave);
      setLenisLocked("intro", false);
    };
  }, [pathname]);

  useEffect(() => {
    if (phase !== "leave") return;
    const done = window.setTimeout(() => {
      sessionStorage.setItem("ht-intro", "1");
      document.documentElement.classList.add("skip-intro");
      setLenisLocked("intro", false);
      setPhase("done");
    }, 900);
    return () => window.clearTimeout(done);
  }, [phase]);

  if (phase === "done") return null;

  return (
    <div className={`intro ${phase === "leave" ? "is-leaving" : ""}`} role="status" aria-live="polite" aria-label={`${site.name} loading`}>
      <div className="px-6 text-center">
        {logoPath ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={logoPath} alt={site.name} decoding="async" className="mx-auto h-40 w-auto md:h-52" />
        ) : (
          <p className="font-serif text-5xl tracking-[0.18em] text-espresso md:text-7xl">
            HAPPY TOUCH
            <span className="mt-3 block text-[0.7rem] tracking-[0.42em]">INTERIORS</span>
          </p>
        )}
        <div className="intro-line mx-auto mt-8" />
      </div>
    </div>
  );
}
