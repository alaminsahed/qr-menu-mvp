"use client";

import Link from "next/link";
import { useCart } from "@/components/client/cart-provider";
import { formatBdt } from "@/lib/client-format";

export function FloatingBasketBar() {
  const { itemCount, subtotal } = useCart();
  if (itemCount === 0) return null;

  return (
    <div className="fixed inset-x-0 bottom-4 z-40 px-5">
      <Link href="/basket" className="ui-floating-cta">
        <span className="font-semibold">View Basket ({itemCount})</span>
        <span className="font-semibold">{formatBdt(subtotal)}</span>
      </Link>
    </div>
  );
}
