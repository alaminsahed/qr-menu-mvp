"use client";

import { CartProvider } from "@/components/client/cart-provider";
import { LanguageProvider } from "@/components/client/language-provider";
import { MenuProvider } from "@/components/client/menu-provider";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <LanguageProvider>
      <MenuProvider>
        <CartProvider>{children}</CartProvider>
      </MenuProvider>
    </LanguageProvider>
  );
}
