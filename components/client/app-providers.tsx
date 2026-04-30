"use client";

import { CartProvider } from "@/components/client/cart-provider";
import { LanguageProvider } from "@/components/client/language-provider";
import { MenuProvider } from "@/components/client/menu-provider";
import { Toaster } from "sonner";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <LanguageProvider>
      <MenuProvider>
        <CartProvider>
          {children}
          <Toaster richColors position="top-right" />
        </CartProvider>
      </MenuProvider>
    </LanguageProvider>
  );
}
