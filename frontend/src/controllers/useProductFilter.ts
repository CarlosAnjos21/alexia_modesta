import { useMemo } from "react";
import type { Product } from "../models/Product";

export function useProductFilter(produtos: Product[], categoriaAtiva: string, termo: string): Product[] {
  return useMemo(() => {
    const t = termo.trim().toLowerCase();
    return produtos.filter((p) => {
      const okCategoria = !categoriaAtiva || p.categoria === categoriaAtiva;
      const descricaoCompleta = (p.desc || p.descricao || "").toLowerCase();
      const okBusca = !t || p.nome.toLowerCase().includes(t) || descricaoCompleta.includes(t);
      return okCategoria && okBusca;
    });
  }, [produtos, categoriaAtiva, termo]);
}
