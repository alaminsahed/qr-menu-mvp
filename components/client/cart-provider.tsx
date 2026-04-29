"use client";

import { createContext, useContext, useMemo, useState } from "react";
import { useMenu } from "@/components/client/menu-provider";

type CartState = Record<string, number>;

type CartContextValue = {
  cart: CartState;
  addItem: (id: string) => void;
  decreaseItem: (id: string) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  getItemQty: (id: string) => number;
  itemCount: number;
  subtotal: number;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartState>({});
  const { items } = useMenu();
  const itemsById = useMemo(
    () => new Map(items.map((menuItem) => [menuItem.id, menuItem])),
    [items],
  );

  const addItem = (id: string) => {
    setCart((prev) => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
  };

  const decreaseItem = (id: string) => {
    setCart((prev) => {
      const nextQty = (prev[id] || 0) - 1;
      if (nextQty <= 0) {
        const rest = { ...prev };
        delete rest[id];
        return rest;
      }
      return { ...prev, [id]: nextQty };
    });
  };

  const removeItem = (id: string) => {
    setCart((prev) => {
      const rest = { ...prev };
      delete rest[id];
      return rest;
    });
  };

  const clearCart = () => setCart({});
  const getItemQty = (id: string) => cart[id] || 0;

  const itemCount = useMemo(
    () => Object.values(cart).reduce((acc, qty) => acc + qty, 0),
    [cart],
  );

  const subtotal = useMemo(() => {
    return Object.entries(cart).reduce((acc, [id, qty]) => {
      const item = itemsById.get(id);
      return acc + (item ? item.price * qty : 0);
    }, 0);
  }, [cart, itemsById]);

  const value: CartContextValue = {
    cart,
    addItem,
    decreaseItem,
    removeItem,
    clearCart,
    getItemQty,
    itemCount,
    subtotal,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used within CartProvider");
  }
  return ctx;
}
