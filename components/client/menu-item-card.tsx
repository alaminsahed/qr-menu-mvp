"use client";

import Image from "next/image";
import { useCart } from "@/components/client/cart-provider";
import { useLanguage } from "@/components/client/language-provider";
import { QuantityPicker } from "@/components/client/quantity-picker";
import {
  formatBdt,
  getLocalizedDescription,
  getLocalizedName,
} from "@/lib/client-format";
import type { MenuItem } from "@/lib/menu";

export function MenuItemCard({ item }: { item: MenuItem }) {
  const { language } = useLanguage();
  const { addItem, decreaseItem, getItemQty } = useCart();
  const qty = getItemQty(item.id);

  return (
    <div className="flex gap-3 rounded-2xl bg-white p-3 shadow-[0_2px_14px_rgba(80,40,20,0.07)]">
      <div className="flex-1">
        <h3 className="text-2xl leading-tight font-semibold text-[#171717]">
          {getLocalizedName(item, language)}
        </h3>
        <p className="mt-1 text-sm leading-5 text-[#554843]">
          {getLocalizedDescription(item, language)}
        </p>
        <div className="mt-3 flex items-center justify-between">
          <span className="text-2xl leading-none text-[#6c3f2f]">
            {formatBdt(item.price)}
          </span>
          {item.available ? (
            <QuantityPicker
              quantity={qty}
              onAdd={() => addItem(item.id)}
              onRemove={() => decreaseItem(item.id)}
            />
          ) : (
            <span className="ui-badge-disabled">Out of stock</span>
          )}
        </div>
      </div>
      <div className="relative h-24 w-24 overflow-hidden rounded-xl bg-[#f2f2f2]">
        <Image
          src={item.image_url}
          alt={item.name_en}
          fill
          className="object-cover"
        />
      </div>
    </div>
  );
}
