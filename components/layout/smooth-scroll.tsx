"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { useEffect } from "react";
import { registerLenis } from "@/components/layout/lenis-controller";
import "lenis/dist/lenis.css";

export function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.registerPlugin(ScrollTrigger);
    ScrollTrigger.config({ ignoreMobileResize: true });
    const lenis = new Lenis({
      lerp: 0.075,
      smoothWheel: true,
      syncTouch: true,
      syncTouchLerp: 0.075,
      touchMultiplier: 1.5,
      wheelMultiplier: 0.8,
      autoRaf: false,
      anchors: true,
      stopInertiaOnNavigate: true,
      allowNestedScroll: true,
    });
    registerLenis(lenis);
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    const refresh = window.setTimeout(() => ScrollTrigger.refresh(), 200);
    const onOrientation = () => {
      lenis.resize();
      ScrollTrigger.refresh();
    };
    const onViewport = () => {
      lenis.resize();
    };
    const onRefresh = () => lenis.resize();
    ScrollTrigger.addEventListener("refresh", onRefresh);
    window.addEventListener("orientationchange", onOrientation);
    window.visualViewport?.addEventListener("resize", onViewport);
    return () => {
      window.clearTimeout(refresh);
      ScrollTrigger.removeEventListener("refresh", onRefresh);
      window.removeEventListener("orientationchange", onOrientation);
      window.visualViewport?.removeEventListener("resize", onViewport);
      gsap.ticker.remove(tick);
      registerLenis(null);
      lenis.destroy();
    };
  }, []);

  return null;
}
