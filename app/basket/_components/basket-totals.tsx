"use client";

import { formatBdt } from "@/lib/client-format";

type BasketTotalsProps = {
  subtotal: number;
  fee: number;
  total: number;
};

export function BasketTotals({ subtotal, fee, total }: BasketTotalsProps) {
  return (
    <section className="ui-panel space-y-2">
      <div className="ui-text-body-sm flex justify-between">
        <span>Subtotal</span>
        <span>{formatBdt(subtotal)}</span>
      </div>
      <div className="ui-text-body-sm flex justify-between">
        <span>Service / Delivery</span>
        <span>{formatBdt(fee)}</span>
      </div>
      <div className="flex justify-between border-t border-default pt-2 font-semibold text-primary-ui">
        <span>Total</span>
        <span>{formatBdt(total)}</span>
      </div>
    </section>
  );
}
