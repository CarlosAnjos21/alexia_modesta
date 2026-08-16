import { useMemo } from "react";
import type { Product } from "../models/Product";

export function useProductFilter(produtos: Product[], categoriaAtiva: string, termo: string): Product[] {
  return useMemo(() => {
    const t = termo.trim().toLowerCase();
    return produtos.filter((p) => {
      const okCategoria = p.categoria === categoriaAtiva;
      const okBusca = !t || p.nome.toLowerCase().includes(t) || p.desc.toLowerCase().includes(t);
      return okCategoria && okBusca;
    });
  }, [produtos, categoriaAtiva, termo]);
}
