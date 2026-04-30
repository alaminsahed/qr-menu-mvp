"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import { menuItems as fallbackMenuItems, type MenuItem } from "@/lib/menu";

export type MenuCategory = {
  key: string;
  label_en: string;
  label_bn: string;
  sort_order: number;
};

type MenuContextValue = {
  items: MenuItem[];
  categories: MenuCategory[];
  isLoading: boolean;
  error: string | null;
};

const MenuContext = createContext<MenuContextValue | null>(null);

export function MenuProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [items, setItems] = useState<MenuItem[]>(fallbackMenuItems);
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    if (!pathname.startsWith("/menu")) return;

    async function loadMenu() {
      if (isMounted) {
        setIsLoading(true);
        setError(null);
      }
      try {
        const response = await fetch("/api/menu", { cache: "no-store" });
        if (!response.ok) {
          throw new Error(`Menu request failed with status ${response.status}`);
        }

        const payload = (await response.json()) as {
          items?: MenuItem[];
          categories?: MenuCategory[];
        };
        if (isMounted && Array.isArray(payload.items)) {
          setItems(payload.items);
        }
        if (isMounted && Array.isArray(payload.categories)) {
          setCategories(payload.categories);
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
  }, [pathname]);

  const fallbackCategories = useMemo(() => {
    const byKey = new Map<string, MenuCategory>();
    for (const item of fallbackMenuItems) {
      const key = item.category_slug ?? item.category;
      if (!byKey.has(key)) {
        byKey.set(key, {
          key,
          label_en: item.category_name_en ?? item.category,
          label_bn: item.category_name_bn ?? item.category,
          sort_order: byKey.size,
        });
      }
    }
    return Array.from(byKey.values());
  }, []);

  const resolvedCategories =
    categories.length > 0
      ? categories
      : fallbackCategories;

  const value = useMemo(
    () => ({ items, categories: resolvedCategories, isLoading, error }),
    [items, resolvedCategories, isLoading, error],
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
