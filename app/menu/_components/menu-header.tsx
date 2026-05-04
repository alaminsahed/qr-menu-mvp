"use client";

import Image from "next/image";
import { LanguageToggle } from "@/components/client/language-toggle";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

export function MenuHeader({
  tableNumber,
  restaurantName,
  restaurantLogoUrl,
  whatsappNumber,
}: {
  tableNumber: string | null;
  restaurantName: string;
  restaurantLogoUrl: string | null;
  whatsappNumber: string;
}) {
  const handleCallWaiter = () => {
    const table = tableNumber?.trim();
    const message = table
      ? `Immediately need waiter help. Table: ${table}`
      : "Immediately need waiter help.";
    window.location.href = buildWhatsAppUrl(whatsappNumber, message);
  };

  return (
    <header className="-mx-4 mb-4 w-auto bg-[#f7f5f1]/95 px-4 pb-2 shadow-[0_8px_12px_-10px_rgba(26,26,26,0.12)] backdrop-blur-lg">
      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          {restaurantLogoUrl ? (
            <div
              className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-white shadow-[inset_0_0_0_1px_rgba(0,0,0,0.06)]"
              role="img"
              aria-label="Restaurant logo"
            >
              <Image
                src={restaurantLogoUrl}
                alt=""
                width={48}
                height={48}
                className="h-12 w-12 object-contain"
                sizes="48px"
              />
            </div>
          ) : null}
          {restaurantName ? (
            <h1 className="min-w-0 truncate text-[1.65rem] leading-none font-semibold text-[#7c2c16]">
              {restaurantName}
            </h1>
          ) : null}
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleCallWaiter}
            className="rounded-full bg-[#22c55e] px-3 py-1 text-[11px] font-semibold text-white shadow-[0_3px_6px_rgba(34,197,94,0.28)]"
          >
            Call Waiter
          </button>
          <LanguageToggle />
        </div>
      </div>
    </header>
  );
}
