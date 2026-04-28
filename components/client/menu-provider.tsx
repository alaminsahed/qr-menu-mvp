"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { menuItems as fallbackMenuItems, type MenuItem } from "@/lib/menu";

type MenuContextValue = {
  items: MenuItem[];
  isLoading: boolean;
  error: string | null;
};

const MenuContext = createContext<MenuContextValue | null>(null);

export function MenuProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<MenuItem[]>(fallbackMenuItems);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadMenu() {
      try {
        const response = await fetch("/api/menu", { cache: "no-store" });
        if (!response.ok) {
          throw new Error(`Menu request failed with status ${response.status}`);
        }

        const payload = (await response.json()) as { items?: MenuItem[] };
        if (isMounted && Array.isArray(payload.items) && payload.items.length > 0) {
          setItems(payload.items);
        }
      } catch {
        if (isMounted) {
          setError("Failed to load latest menu. Using offline fallback.");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    void loadMenu();

    return () => {
      isMounted = false;
    };
  }, []);

  const value = useMemo(
    () => ({ items, isLoading, error }),
    [items, isLoading, error],
  );

  return <MenuContext.Provider value={value}>{children}</MenuContext.Provider>;
}

export function useMenu() {
  const ctx = useContext(MenuContext);
  if (!ctx) {
    throw new Error("useMenu must be used within MenuProvider");
  }
  return ctx;
}
