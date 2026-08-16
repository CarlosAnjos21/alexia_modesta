import { createContext, useContext } from "react";
import type { ReactNode } from "react";
import { useCart } from "./useCart";
import type { CartState } from "./useCart";
import { useCatalogContext } from "./CatalogContext";

const CartContext = createContext<CartState | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const { produtos } = useCatalogContext();
  const cart = useCart(produtos);

  return <CartContext.Provider value={cart}>{children}</CartContext.Provider>;
}

export function useCartContext(): CartState {
  const ctx = useContext(CartContext);

  if (!ctx) {
    throw new Error("useCartContext deve ser usado dentro de CartProvider");
  }

  return ctx;
}
