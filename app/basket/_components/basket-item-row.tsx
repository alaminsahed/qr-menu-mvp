"use client";

import Image from "next/image";
import { useCart } from "@/components/client/cart-provider";
import { useLanguage } from "@/components/client/language-provider";
import { QuantityPicker } from "@/components/client/quantity-picker";
import { formatBdt, getLocalizedName } from "@/lib/client-format";
import type { MenuItem } from "@/lib/menu";

export function BasketItemRow({
  item,
  quantity,
}: {
  item: MenuItem;
  quantity: number;
}) {
  const { language } = useLanguage();
  const { addItem, decreaseItem, removeItem } = useCart();

  return (
    <div className="ui-card flex gap-3">
      <div className="relative h-20 w-20 overflow-hidden rounded-xl">
        <Image
          src={item.image_url}
          alt={item.name_en}
          fill
          className="object-cover"
        />
      </div>
      <div className="flex flex-1 flex-col">
        <div className="flex items-start justify-between">
          <h3 className="ui-text-title">{getLocalizedName(item, language)}</h3>
          <button
            type="button"
            onClick={() => removeItem(item.id)}
            className="text-xs text-muted-ui"
          >
            Remove
          </button>
        </div>
        <p className="mt-1 text-sm text-secondary-ui">{formatBdt(item.price)}</p>
        <div className="mt-2">
          <QuantityPicker
            quantity={quantity}
            onAdd={() => addItem(item.id)}
            onRemove={() => decreaseItem(item.id)}
          />
        </div>
      </div>
    </div>
  );
}
