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
    <div className="ui-card flex gap-3">
      <div className="flex-1">
        <h3 className="ui-text-title">{getLocalizedName(item, language)}</h3>
        <p className="ui-text-body-sm mt-1">
          {getLocalizedDescription(item, language)}
        </p>
        <div className="mt-3 flex items-center justify-between">
          <span className="font-semibold">{formatBdt(item.price)}</span>
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
      <div className="relative h-24 w-24 overflow-hidden rounded-xl">
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
