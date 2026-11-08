"use client";

import { createContext, useContext, useEffect, useState } from "react";

const HeaderToneContext = createContext<{
  overPaper: boolean;
  setOverPaper: (value: boolean) => void;
}>({ overPaper: false, setOverPaper: () => undefined });

export function HeaderToneProvider({ children }: { children: React.ReactNode }) {
  const [overPaper, setOverPaper] = useState(false);
  return <HeaderToneContext.Provider value={{ overPaper, setOverPaper }}>{children}</HeaderToneContext.Provider>;
}

export function useHeaderTone() {
  return useContext(HeaderToneContext);
}

export function useLightHeaderUntilFooter() {
  const { setOverPaper } = useHeaderTone();
  useEffect(() => {
    const footer = document.querySelector("[data-site-footer]");
    if (!footer) return;
    const observer = new IntersectionObserver(
      ([entry]) => setOverPaper(Boolean(entry?.isIntersecting)),
      { threshold: 0.12 },
    );
    observer.observe(footer);
    return () => {
      observer.disconnect();
      setOverPaper(false);
    };
  }, [setOverPaper]);
}
