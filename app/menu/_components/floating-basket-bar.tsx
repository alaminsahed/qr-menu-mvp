"use client";

import Link from "next/link";
import { useCart } from "@/components/client/cart-provider";
import { formatBdt } from "@/lib/client-format";

export function FloatingBasketBar({
  tableNumber,
}: {
  tableNumber?: string | null;
}) {
  const { itemCount, subtotal } = useCart();
  const basketHref = tableNumber ? `/basket?table=${tableNumber}` : "/basket";
  if (itemCount === 0) return null;

  return (
    <div className="fixed inset-x-0 bottom-20 z-40 mx-auto w-full max-w-sm px-4">
      <Link
        href={basketHref}
        className="flex min-h-12 items-center justify-between rounded-xl bg-[#8c2d0f] px-4 text-white shadow-[0_8px_18px_rgba(86,31,14,0.4)]"
      >
        <span className="flex items-center gap-2 font-semibold">
          <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#f5d8ca] text-xs text-[#8c2d0f]">
            {itemCount}
          </span>
          <span className="material-symbols-outlined text-[18px]">
            shopping_basket
          </span>
          View Basket
        </span>
        <span className="font-semibold">{formatBdt(subtotal)}</span>
      </Link>
    </div>
  );
}
