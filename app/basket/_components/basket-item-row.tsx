"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
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
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  useEffect(() => {
    if (!isPreviewOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsPreviewOpen(false);
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isPreviewOpen]);

  return (
    <div className="ui-card flex gap-3">
      <button
        type="button"
        onClick={() => setIsPreviewOpen(true)}
        className="relative h-20 w-20 overflow-hidden rounded-xl"
        aria-label={`Open image preview for ${item.name_en}`}
      >
        <Image
          src={item.image_url}
          alt={item.name_en}
          fill
          className="object-cover"
        />
      </button>
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

      {isPreviewOpen ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4"
          onClick={() => setIsPreviewOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label={`${item.name_en} image preview`}
        >
          <button
            type="button"
            onClick={() => setIsPreviewOpen(false)}
            className="absolute right-4 top-4 z-20 flex h-11 w-11 items-center justify-center rounded-full bg-white/95 text-2xl leading-none text-[#121212] shadow-md"
            aria-label="Close image preview"
          >
            ×
          </button>

          <div
            className="relative h-[76vh] w-full max-w-md overflow-hidden rounded-2xl bg-black/30"
            onClick={(event) => event.stopPropagation()}
          >
            <Image
              src={item.image_url}
              alt={item.name_en}
              fill
              className="object-contain"
              sizes="100vw"
              priority
            />
          </div>
        </div>
      ) : null}
    </div>
  );
}
