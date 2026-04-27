"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { FloatingBasketBar } from "@/components/client/floating-basket-bar";
import { LanguageToggle } from "@/components/client/language-toggle";
import { MenuItemCard } from "@/components/client/menu-item-card";
import { formatBdt } from "@/lib/client-format";
import { menuItems } from "@/lib/menu";

export function MenuScreen({ tableNumber }: { tableNumber: string | null }) {
  const categories = useMemo(
    () => Array.from(new Set(menuItems.map((item) => item.category))),
    [],
  );
  const [activeCategory, setActiveCategory] = useState(categories[0] || "");
  const featuredItem = menuItems[0];
  const visibleCategories = categories.slice(0, 4);
  const categoryTitles: Record<string, string> = {
    Burgers: "Bengali Fusion Burgers",
    Drinks: "Cooling Drinks",
    Coffee: "Coffee",
  };
  const basketHref = tableNumber ? `/basket?table=${tableNumber}` : "/basket";

  return (
    <main className="mx-auto min-h-screen w-full max-w-sm bg-[#f7f5f1] pb-36">
      <div className="px-4 pb-4 pt-5">
        <header className="mb-5 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#8c2d0f] text-xs font-bold text-[#ffe6bf] shadow-[0_3px_10px_rgba(140,45,15,0.35)]">
              SB
            </span>
            <h1 className="text-[1.65rem] leading-none font-bold text-[#7c2c16]">
              Shonali Bhoj
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="rounded-full bg-[#22c55e] px-3.5 py-1.5 text-xs font-semibold text-white shadow-[0_3px_9px_rgba(34,197,94,0.35)]"
            >
              Call Waiter
            </button>
            <LanguageToggle />
          </div>
        </header>

        <div className="mb-6 overflow-x-auto">
          <div className="flex gap-2">
            {visibleCategories.map((category) => {
              const isActive = category === activeCategory;
              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => setActiveCategory(category)}
                  className={`rounded-full px-4 py-2 text-sm font-medium whitespace-nowrap ${
                    isActive
                      ? "bg-[#4b6f4f] text-white shadow-[0_4px_10px_rgba(75,111,79,0.26)]"
                      : "bg-[#e8e5df] text-[#5f4f49] shadow-[inset_0_0_0_1px_rgba(0,0,0,0.03)]"
                  }`}
                >
                  {category}
                </button>
              );
            })}
          </div>
        </div>

        <section className="mb-7">
          <h2 className="mb-3 text-[2rem] leading-none font-bold text-[#7c2c16]">
            Today&apos;s Special
          </h2>
          <article className="relative overflow-hidden rounded-3xl shadow-[0_10px_28px_rgba(0,0,0,0.26)]">
            <Image
              src={featuredItem.image_url}
              alt={featuredItem.name_en}
              width={700}
              height={360}
              className="h-[190px] w-full object-cover"
              priority
            />
            <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/75 via-black/30 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-4 text-white">
              <span className="mb-2 inline-flex rounded-full bg-[#f8df9f] px-3 py-1 text-sm font-semibold text-[#4a3729]">
                Popular
              </span>
              <h3 className="text-[1.35rem] leading-tight font-semibold">
                {featuredItem.name_en}
              </h3>
              <div className="mt-1 flex items-center justify-between gap-2">
                <p className="max-w-[72%] truncate text-sm text-white/90">
                  {featuredItem.description_en}
                </p>
                <span className="text-lg font-semibold">
                  {formatBdt(featuredItem.price)}
                </span>
              </div>
            </div>
          </article>
        </section>

        {categories.map((category) => {
          const itemsByCategory = menuItems.filter(
            (item) => item.category === category,
          );
          if (itemsByCategory.length === 0) return null;
          return (
            <section key={category} className="mb-8 space-y-3">
              <h3 className="text-[2rem] leading-none font-bold text-[#7c2c16]">
                {categoryTitles[category] ?? category}
              </h3>
              {itemsByCategory.map((item) => (
                <MenuItemCard key={item.id} item={item} />
              ))}
            </section>
          );
        })}
      </div>
      <FloatingBasketBar tableNumber={tableNumber} />
      <nav className="fixed inset-x-0 bottom-0 z-30 mx-auto flex w-full max-w-sm items-center justify-around rounded-t-2xl border-t border-[#ebe7df] bg-[#f7f5f1]/95 px-2 py-3 backdrop-blur-lg shadow-[0_-4px_20px_rgba(172,68,37,0.08)]">
        <button
          type="button"
          className="flex min-w-21 flex-col items-center justify-center rounded-xl bg-[#fff1ec] px-4 py-1.5 text-[#8c2d0f] transition-all duration-200"
        >
          <span
            className="material-symbols-outlined"
            style={{ fontVariationSettings: '"FILL" 1' }}
          >
            restaurant_menu
          </span>
          <span className="mt-1 text-[11px] font-medium">Menu</span>
        </button>
        <Link
          href={basketHref}
          className="flex min-w-21 flex-col items-center justify-center px-4 py-1.5 text-[#9b8f87] transition-all duration-200"
        >
          <span className="material-symbols-outlined">shopping_basket</span>
          <span className="mt-1 text-[11px] font-medium">Basket</span>
        </Link>
      </nav>
    </main>
  );
}
