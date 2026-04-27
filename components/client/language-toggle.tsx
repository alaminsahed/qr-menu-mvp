"use client";

import { useLanguage } from "@/components/client/language-provider";

export function LanguageToggle() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex items-center gap-1 rounded-full bg-[#f1efe9] p-1 text-xs font-semibold">
      <button
        type="button"
        onClick={() => setLanguage("en")}
        className={`rounded-full px-2 py-0.5 ${
          language === "en"
            ? "bg-white text-[#3b2c26] shadow-sm"
            : "text-[#8f837a]"
        }`}
      >
        EN
      </button>
      <button
        type="button"
        onClick={() => setLanguage("bn")}
        className={`rounded-full px-2 py-0.5 ${
          language === "bn"
            ? "bg-white text-[#3b2c26] shadow-sm"
            : "text-[#8f837a]"
        }`}
      >
        BN
      </button>
    </div>
  );
}
