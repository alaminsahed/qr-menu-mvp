"use client";

import { CartProvider } from "@/components/client/cart-provider";
import { LanguageProvider } from "@/components/client/language-provider";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <LanguageProvider>
      <CartProvider>{children}</CartProvider>
    </LanguageProvider>
  );
}
