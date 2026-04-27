"use client";

import Link from "next/link";
import { useCart } from "@/components/client/cart-provider";
import { formatBdt } from "@/lib/client-format";

export function FloatingBasketBar() {
  const { itemCount, subtotal } = useCart();
  if (itemCount === 0) return null;

  return (
    <div className="fixed inset-x-0 bottom-14 z-40 mx-auto w-full max-w-sm px-4">
      <Link
        href="/basket"
        className="flex min-h-12 items-center justify-between rounded-xl bg-[#8c2d0f] px-4 text-white shadow-lg"
      >
        <span className="flex items-center gap-2 font-semibold">
          <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#f5d8ca] text-xs text-[#8c2d0f]">
            {itemCount}
          </span>
          View Basket
        </span>
        <span className="font-semibold">{formatBdt(subtotal)}</span>
      </Link>
    </div>
  );
}
