"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { BasketItemRow } from "@/app/basket/_components/basket-item-row";
import { TopAppBar } from "@/app/basket/_components/top-app-bar";
import { LanguageToggle } from "@/components/client/language-toggle";
import { useCart } from "@/components/client/cart-provider";
import { useLanguage } from "@/components/client/language-provider";
import { formatBdt, getLocalizedName } from "@/lib/client-format";
import { menuItems } from "@/lib/menu";
import { buildWhatsAppMessage, buildWhatsAppUrl } from "@/lib/whatsapp";

const SERVICE_FEE = 40;
const WHATSAPP_NUMBER = "8801700000000";

export default function BasketPage() {
  const searchParams = useSearchParams();
  const tableFromQuery = searchParams.get("table")?.trim() ?? "";
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
      total,
    });

    window.location.href = buildWhatsAppUrl(WHATSAPP_NUMBER, message);
  };

  return (
    <main className="min-h-screen bg-app pb-36">
      <TopAppBar
        title="Your Basket"
        left={
          <Link
            href={tableFromQuery ? `/menu?table=${tableFromQuery}` : "/menu"}
            className="ui-text-body-sm"
          >
            Back
          </Link>
        }
        right={<LanguageToggle />}
      />

      <div className="ui-screen space-y-4">
        {cartItems.length === 0 ? (
          <div className="ui-card p-6 text-center">
            <p className="ui-text-body-sm">No product in basket.</p>
            <Link
              href={tableFromQuery ? `/menu?table=${tableFromQuery}` : "/menu"}
              className="ui-text-body-sm mt-3 inline-block text-primary-ui underline"
            >
              Go to menu
            </Link>
          </div>
        ) : (
          cartItems.map(({ item, quantity }) => (
            <BasketItemRow key={item.id} item={item} quantity={quantity} />
          ))
        )}

        {cartItems.length > 0 ? (
          <>
            <section className="ui-panel space-y-3">
              <h2 className="ui-text-title">Order Method</h2>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setOrderType("dinein")}
                  className={`flex-1 ${
                    orderType === "dinein" ? "ui-btn-primary" : "ui-btn-secondary"
                  }`}
                >
                  At Restaurant
                </button>
                <button
                  type="button"
                  onClick={() => setOrderType("delivery")}
                  className={`flex-1 ${
                    orderType === "delivery"
                      ? "ui-btn-primary"
                      : "ui-btn-secondary"
                  }`}
                >
                  Delivery
                </button>
              </div>
              {orderType === "dinein" ? (
                tableFromQuery ? (
                  <div className="ui-input bg-elevated">
                    Table {tableFromQuery}
                  </div>
                ) : (
                  <input
                    type="text"
                    value={table}
                    onChange={(e) => setTable(e.target.value)}
                    placeholder="Table number"
                    className="ui-input"
                  />
                )
              ) : (
                <textarea
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Delivery address"
                  className="ui-input min-h-24"
                />
              )}
            </section>

            <section className="ui-panel space-y-2">
              <div className="ui-text-body-sm flex justify-between">
                <span>Subtotal</span>
                <span>{formatBdt(subtotal)}</span>
              </div>
              <div className="ui-text-body-sm flex justify-between">
                <span>Service / Delivery</span>
                <span>{formatBdt(itemCount > 0 ? SERVICE_FEE : 0)}</span>
              </div>
              <div className="flex justify-between border-t border-default pt-2 font-semibold text-primary-ui">
                <span>Total</span>
                <span>{formatBdt(total)}</span>
              </div>
            </section>
          </>
        ) : null}
      </div>

      <div className="fixed inset-x-0 bottom-0 border-t border-default bg-surface p-4">
        {error ? <p className="ui-error mb-2">{error}</p> : null}
        <button
          type="button"
          onClick={handleWhatsAppOrder}
          className="ui-btn-whatsapp disabled:cursor-not-allowed disabled:opacity-60"
          disabled={itemCount === 0}
        >
          Order via WhatsApp
        </button>
      </div>
    </main>
  );
}
