"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { BasketEmptyState } from "@/app/basket/_components/basket-empty-state";
import { BasketItemRow } from "@/app/basket/_components/basket-item-row";
import { BasketTotals } from "@/app/basket/_components/basket-totals";
import { CheckoutBar } from "@/app/basket/_components/checkout-bar";
import { OrderMethodSection } from "@/app/basket/_components/order-method-section";
import { TopAppBar } from "@/app/basket/_components/top-app-bar";
import { LanguageToggle } from "@/components/client/language-toggle";
import { useCart } from "@/components/client/cart-provider";
import { useLanguage } from "@/components/client/language-provider";
import { getLocalizedName } from "@/lib/client-format";
import { menuItems } from "@/lib/menu";
import { buildWhatsAppMessage, buildWhatsAppUrl } from "@/lib/whatsapp";

const SERVICE_FEE = 40;
const WHATSAPP_NUMBER = "01685765411";

export default function BasketPage() {
  const searchParams = useSearchParams();
  const tableFromQuery = searchParams.get("table")?.trim() ?? "";
  const menuHref = tableFromQuery ? `/menu?table=${tableFromQuery}` : "/menu";
  const { language } = useLanguage();
  const { cart, subtotal, itemCount } = useCart();
  const [orderType, setOrderType] = useState<"dinein" | "delivery">("dinein");
  const [table, setTable] = useState(tableFromQuery);
  const [address, setAddress] = useState("");
  const [error, setError] = useState("");

  const cartItems = useMemo(() => {
    return Object.entries(cart)
      .map(([id, quantity]) => {
        const item = menuItems.find((menuItem) => menuItem.id === id);
        if (!item) return null;
        return { item, quantity };
      })
      .filter(
        (
          value,
        ): value is { item: (typeof menuItems)[number]; quantity: number } =>
          Boolean(value),
      );
  }, [cart]);

  const total = subtotal + (itemCount > 0 ? SERVICE_FEE : 0);

  const handleWhatsAppOrder = () => {
    setError("");
    if (itemCount === 0) {
      setError("Your basket is empty.");
      return;
    }
    if (orderType === "dinein" && !table.trim()) {
      setError("Please enter table number.");
      return;
    }
    if (orderType === "delivery" && !address.trim()) {
      setError("Please enter delivery address.");
      return;
    }

    const message = buildWhatsAppMessage({
      orderType,
      table: table.trim(),
      address: address.trim(),
      lines: cartItems.map(({ item, quantity }) => ({
        name: getLocalizedName(item, language),
        quantity,
      })),
      subtotal,
      fee: itemCount > 0 ? SERVICE_FEE : 0,
      total,
    });

    window.location.href = buildWhatsAppUrl(WHATSAPP_NUMBER, message);
  };

  return (
    <main className="mx-auto min-h-screen w-full max-w-md bg-[#f7f5f1] pb-36">
      <TopAppBar
        title="Your Basket"
        left={
          <Link href={menuHref} className="ui-text-body-sm">
            Back
          </Link>
        }
        right={<LanguageToggle />}
      />

      <div className="space-y-4 px-4 pb-4 pt-5">
        {cartItems.length === 0 ? (
          <BasketEmptyState menuHref={menuHref} />
        ) : (
          cartItems.map(({ item, quantity }) => (
            <BasketItemRow key={item.id} item={item} quantity={quantity} />
          ))
        )}

        {cartItems.length > 0 ? (
          <>
            <OrderMethodSection
              orderType={orderType}
              tableFromQuery={tableFromQuery}
              table={table}
              address={address}
              onSelectDinein={() => setOrderType("dinein")}
              onSelectDelivery={() => setOrderType("delivery")}
              onTableChange={setTable}
              onAddressChange={setAddress}
            />

            <BasketTotals
              subtotal={subtotal}
              fee={itemCount > 0 ? SERVICE_FEE : 0}
              total={total}
            />
          </>
        ) : null}
      </div>

      <CheckoutBar
        error={error}
        disabled={itemCount === 0}
        onOrder={handleWhatsAppOrder}
      />
    </main>
  );
}
