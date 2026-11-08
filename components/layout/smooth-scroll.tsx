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
    const touch = window.matchMedia("(pointer: coarse)").matches;
    const lenis = new Lenis({
      lerp: touch ? 0.12 : 0.075,
      smoothWheel: true,
      syncTouch: touch,
      syncTouchLerp: 0.12,
      touchMultiplier: 1.35,
      wheelMultiplier: 0.8,
      autoRaf: false,
      anchors: true,
      stopInertiaOnNavigate: true,
      allowNestedScroll: true,
    });
    registerLenis(lenis);
    lenis.on("scroll", ScrollTrigger.update);
    ScrollTrigger.scrollerProxy(document.documentElement, {
      scrollTop(value) {
        if (typeof value === "number") lenis.scrollTo(value, { immediate: true });
        return lenis.scroll;
      },
      getBoundingClientRect() {
        return { top: 0, left: 0, width: window.innerWidth, height: window.innerHeight };
      },
    });
    const tick = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    const refresh = window.setTimeout(() => ScrollTrigger.refresh(), 200);
    const onResize = () => {
      lenis.resize();
      ScrollTrigger.refresh();
    };
    const onRefresh = () => lenis.resize();
    ScrollTrigger.addEventListener("refresh", onRefresh);
    window.addEventListener("orientationchange", onResize);
    window.visualViewport?.addEventListener("resize", onResize);
    return () => {
      window.clearTimeout(refresh);
      ScrollTrigger.removeEventListener("refresh", onRefresh);
      window.removeEventListener("orientationchange", onResize);
      window.visualViewport?.removeEventListener("resize", onResize);
      gsap.ticker.remove(tick);
      registerLenis(null);
      lenis.destroy();
    };
  }, []);

  return null;
}
