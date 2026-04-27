"use client";

import Image from "next/image";
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

  return (
    <main className="mx-auto min-h-screen w-full max-w-sm bg-[#f7f5f1] pb-36">
      <div className="px-4 pb-4 pt-5">
        <header className="mb-5 flex items-center justify-between gap-3">
          <h1 className="text-xl font-bold text-[#7c2c16]">Shonali Bhoj</h1>
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="rounded-full bg-[#22c55e] px-3 py-1.5 text-xs font-semibold text-white"
            >
              Call Waiter
            </button>
            <LanguageToggle />
          </div>
        </header>

        <p className="mb-3 text-xs text-[#7f6b63]">
          {tableNumber ? `Table ${tableNumber}` : "Table not selected"}
        </p>

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
                      ? "bg-[#4b6f4f] text-white"
                      : "bg-[#e8e5df] text-[#5f4f49]"
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
          <article className="relative overflow-hidden rounded-3xl">
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
              <h3 className="text-xl font-semibold">{featuredItem.name_en}</h3>
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
                {category === "Drinks" ? "Cooling Drinks" : `${category}`}
              </h3>
              {itemsByCategory.map((item) => (
                <MenuItemCard key={item.id} item={item} />
              ))}
            </section>
          );
        })}
      </div>
      <FloatingBasketBar />
      <nav className="fixed inset-x-0 bottom-0 z-30 mx-auto flex w-full max-w-sm border-t border-[#ebe7df] bg-[#f7f5f1]">
        <button
          type="button"
          className="flex-1 py-3 text-sm font-semibold text-[#8c2d0f]"
        >
          Menu
        </button>
        <button type="button" className="flex-1 py-3 text-sm text-[#95877f]">
          Basket
        </button>
      </nav>
    </main>
  );
}
