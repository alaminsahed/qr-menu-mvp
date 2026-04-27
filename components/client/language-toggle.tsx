"use client";

import { useLanguage } from "@/components/client/language-provider";

export function LanguageToggle() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="ui-lang-toggle">
      <button
        type="button"
        onClick={() => setLanguage("en")}
        className={language === "en" ? "text-primary-ui" : "text-muted-ui"}
      >
        EN
      </button>
      <span className="text-muted-ui">|</span>
      <button
        type="button"
        onClick={() => setLanguage("bn")}
        className={language === "bn" ? "text-primary-ui" : "text-muted-ui"}
      >
        BN
      </button>
    </div>
  );
}
