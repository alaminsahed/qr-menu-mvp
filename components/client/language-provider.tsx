"use client";

import { createContext, useContext, useState } from "react";
import type { Language } from "@/lib/client-format";

type LanguageContextValue = {
  language: Language;
  setLanguage: (lang: Language) => void;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    if (typeof window === "undefined") return "en";
    const saved = window.localStorage.getItem("qr-menu-language");
    return saved === "bn" ? "bn" : "en";
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    window.localStorage.setItem("qr-menu-language", lang);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return ctx;
}
