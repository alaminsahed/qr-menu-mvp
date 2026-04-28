"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
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
    <div className="flex gap-3 rounded-2xl bg-white p-3 shadow-[0_5px_14px_rgba(80,40,20,0.08)]">
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
      <button
        type="button"
        onClick={() => setIsPreviewOpen(true)}
        className="relative h-24 w-24 overflow-hidden rounded-xl bg-[#f2f2f2]"
        aria-label={`Open image preview for ${item.name_en}`}
      >
        <Image
          src={item.image_url}
          alt={item.name_en}
          fill
          className="object-cover"
        />
      </button>

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
