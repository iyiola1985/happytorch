"use client";

import { createContext, useContext, useEffect, useState } from "react";

const key = "ht-wishlist";

const WishlistContext = createContext<{
  ids: string[];
  has: (id: string) => boolean;
  toggle: (id: string) => void;
}>({
  ids: [],
  has: () => false,
  toggle: () => undefined,
});

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [ids, setIds] = useState<string[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem(key) || "[]") as unknown;
      if (Array.isArray(stored)) setIds(stored.filter((item) => typeof item === "string"));
    } catch {
      setIds([]);
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    localStorage.setItem(key, JSON.stringify(ids));
  }, [ids, ready]);

  return (
    <WishlistContext.Provider
      value={{
        ids,
        has: (id) => ids.includes(id),
        toggle: (id) => setIds((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id])),
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  return useContext(WishlistContext);
}
