"use client";

import { useMemo, useState } from "react";
import { CategoryChips } from "@/components/client/category-chips";
import { FloatingBasketBar } from "@/components/client/floating-basket-bar";
import { LanguageToggle } from "@/components/client/language-toggle";
import { MenuItemCard } from "@/components/client/menu-item-card";
import { TopAppBar } from "@/components/client/top-app-bar";
import { menuItems } from "@/lib/menu";

export function MenuScreen({ tableNumber }: { tableNumber: string | null }) {
  const categories = useMemo(
    () => Array.from(new Set(menuItems.map((item) => item.category))),
    [],
  );
  const [activeCategory, setActiveCategory] = useState(categories[0] || "");

  const filteredItems = menuItems.filter(
    (item) => item.category === activeCategory,
  );

  return (
    <main className="min-h-screen bg-app pb-24">
      <TopAppBar title="Shonali Bhoj" right={<LanguageToggle />} />
      <div className="ui-screen">
        <p className="ui-text-body-sm mb-3">
          {tableNumber ? `Table ${tableNumber}` : "Table not selected"}
        </p>
        <CategoryChips
          categories={categories}
          active={activeCategory}
          onChange={setActiveCategory}
        />

        <section className="ui-panel mb-6">
          <h2 className="ui-text-title">Today&apos;s Special</h2>
          <p className="ui-text-body-sm mt-1">
            Explore our signature dishes crafted for quick ordering.
          </p>
        </section>

        <section className="space-y-3">
          <h3 className="ui-text-title">{activeCategory}</h3>
          {filteredItems.map((item) => (
            <MenuItemCard key={item.id} item={item} />
          ))}
        </section>
      </div>
      <FloatingBasketBar />
    </main>
  );
}
