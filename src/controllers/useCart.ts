import { useState, useCallback, useMemo } from "react";
import type { CartItem } from "../models/CartItem";
import type { Product } from "../models/Product";
import { PRODUTOS } from "../models/Product";
export interface CartState {
  items: CartItem[];
  saved: Set<number>;
  addToCart: (produto: Product, cor: string, qtd?: number) => void;
  removeFromCart: (id: number, cor: string) => void;
  updateQty: (id: number, cor: string, delta: number) => void;
  toggleSave: (id: number) => void;
  cartCount: number;
  cartTotal: number;
}

export function useCart(): CartState {
  const [items, setItems] = useState<CartItem[]>([]);
  const [saved, setSaved] = useState<Set<number>>(new Set());

  const addToCart = useCallback((produto: Product, cor: string, qtd = 1) => {
    setItems((prev) => {
      const idx = prev.findIndex((i) => i.id === produto.id && i.cor === cor);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = { ...next[idx], qtd: next[idx].qtd + qtd };
        return next;
      }
      return [...prev, { id: produto.id, cor, qtd }];
    });
  }, []);

  const removeFromCart = useCallback((id: number, cor: string) => {
    setItems((prev) => prev.filter((i) => !(i.id === id && i.cor === cor)));
  }, []);

  const updateQty = useCallback((id: number, cor: string, delta: number) => {
    setItems((prev) =>
      prev
        .map((i) =>
          i.id === id && i.cor === cor ? { ...i, qtd: i.qtd + delta } : i,
        )
        .filter((i) => i.qtd > 0),
    );
  }, []);

  const toggleSave = useCallback((id: number) => {
    setSaved((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }, []);

  const cartCount = useMemo(
    () => items.reduce((s, i) => s + i.qtd, 0),
    [items],
  );
  const cartTotal = useMemo(
    () =>
      items.reduce((sum, i) => {
        const produto = PRODUTOS.find((p) => p.id === i.id);
        return sum + (produto ? produto.preco * i.qtd : 0);
      }, 0),
    [items],
  );

  return {
    items,
    saved,
    addToCart,
    removeFromCart,
    updateQty,
    toggleSave,
    cartCount,
    cartTotal,
  };
}
