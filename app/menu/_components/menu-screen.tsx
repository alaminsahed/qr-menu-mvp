"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { formatBdt } from "@/lib/client-format";
import { FloatingBasketBar } from "@/app/menu/_components/floating-basket-bar";
import { MenuHeader } from "@/app/menu/_components/menu-header";
import { MenuItemCard } from "@/app/menu/_components/menu-item-card";
import { useLanguage } from "@/components/client/language-provider";
import { useMenu } from "@/components/client/menu-provider";

export function MenuScreen({ tableNumber }: { tableNumber: string | null }) {
  const { language } = useLanguage();
  const { items: menuItems, categories: menuCategories, error } = useMenu();
  const itemsByCategory = useMemo(() => {
    const grouped = new Map<string, typeof menuItems>();
    for (const item of menuItems) {
      const key = item.category_slug ?? item.category;
      const existing = grouped.get(key);
      if (existing) {
        existing.push(item);
      } else {
        grouped.set(key, [item]);
      }
    }
    return grouped;
  }, [menuItems]);
  const categories = useMemo(
    () =>
      menuCategories.map((category) => ({
        key: category.key,
        label: language === "bn" ? category.label_bn : category.label_en,
      })),
    [language, menuCategories],
  );
  const [activeCategory, setActiveCategory] = useState(
    categories[0]?.key || "",
  );
  const resolvedActiveCategory = categories.some(
    (category) => category.key === activeCategory,
  )
    ? activeCategory
    : (categories[0]?.key ?? "");
  const featuredItem = useMemo(
    () => menuItems.find((item) => item.featured) ?? menuItems[0],
    [menuItems],
  );
  const visibleCategories = categories.slice(0, 4);
  const basketHref = tableNumber ? `/basket?table=${tableNumber}` : "/basket";

  return (
    <main className="mx-auto min-h-screen w-full max-w-md bg-[#f7f5f1] pb-36">
      <div className="px-4 pb-4 pt-5">
        <MenuHeader tableNumber={tableNumber} />
        {error ? (
          <p className="mb-3 rounded-xl bg-amber-50 px-3 py-2 text-xs text-amber-800">
            {error}
          </p>
        ) : null}

        <div className="mb-6 overflow-x-auto">
          <div className="flex gap-2">
            {visibleCategories.map((category) => {
              const isActive = category.key === resolvedActiveCategory;
              return (
                <button
                  key={category.key}
                  type="button"
                  onClick={() => setActiveCategory(category.key)}
                  className={`rounded-full px-4 py-2 text-sm font-medium whitespace-nowrap ${
                    isActive
                      ? "bg-[#4b6f4f] text-white shadow-[0_4px_10px_rgba(75,111,79,0.26)]"
                      : "bg-[#e8e5df] text-[#5f4f49] shadow-[inset_0_0_0_1px_rgba(0,0,0,0.03)]"
                  }`}
                >
                  {category.label}
                </button>
              );
            })}
          </div>
        </div>

        {featuredItem ? (
          <section className="mb-7">
            <h2 className="mb-3 text-[1.8rem] leading-none font-bold text-[#7c2c16]">
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
        ) : null}

        {categories
          .filter(
            (category) =>
              !resolvedActiveCategory ||
              category.key === resolvedActiveCategory,
          )
          .map((category) => {
            const itemsForCategory = itemsByCategory.get(category.key) ?? [];
            return (
              <section key={category.key} className="mb-8 space-y-3">
                <h3 className="text-[1.5rem] leading-none font-bold text-[#7c2c16]">
                  {category.label}
                </h3>
                {itemsForCategory.length > 0 ? (
                  itemsForCategory.map((item) => (
                    <MenuItemCard key={item.id} item={item} />
                  ))
                ) : (
                  <p className="rounded-2xl bg-[#ece8df] px-4 py-3 text-sm text-[#7b6a62]">
                    No items in this category yet.
                  </p>
                )}
              </section>
            );
          })}
      </div>
      <FloatingBasketBar tableNumber={tableNumber} />
      <nav className="fixed inset-x-0 bottom-3 z-30 mx-auto flex w-[calc(100%-1rem)] max-w-sm items-center justify-around rounded-3xl border border-[#eadfd3]/70 bg-[#fff9f3]/92 px-2.5 py-2.5 backdrop-blur-xl shadow-[0_14px_34px_rgba(93,43,21,0.2)]">
        <button
          type="button"
          className="flex min-w-24 flex-col items-center justify-center rounded-2xl bg-[#fff1ec] px-4 py-2 text-[#8c2d0f] shadow-[inset_0_0_0_1px_rgba(140,45,15,0.08)] transition-all duration-200"
        >
          <span
            className="material-symbols-outlined text-[22px]"
            style={{ fontVariationSettings: '"FILL" 1' }}
          >
            restaurant_menu
          </span>
          <span className="mt-1 text-[11px] font-semibold tracking-[0.01em]">
            Menu
          </span>
        </button>
        <Link
          href={basketHref}
          className="flex min-w-24 flex-col items-center justify-center rounded-2xl px-4 py-2 text-[#9b8f87] transition-all duration-200 hover:bg-[#f4ece2]/80 hover:text-[#7f6a5d]"
        >
          <span className="material-symbols-outlined text-[22px]">
            shopping_basket
          </span>
          <span className="mt-1 text-[11px] font-medium tracking-[0.01em]">
            Basket
          </span>
        </Link>
      </nav>
    </main>
  );
}
