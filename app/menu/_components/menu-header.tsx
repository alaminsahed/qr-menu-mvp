"use client";

import { LanguageToggle } from "@/components/client/language-toggle";

export function MenuHeader() {
  return (
    <header className="mb-4 bg-[#f7f5f1] pb-2 shadow-[0_8px_10px_-10px_rgba(26,26,26,0.35)]">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-[1.65rem] leading-none font-semibold text-[#7c2c16]">
          Shonali Bhoj
        </h1>
        <div className="flex items-center gap-2">
          <button
            type="button"
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
