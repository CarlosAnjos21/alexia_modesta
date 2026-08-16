import { useMemo } from "react";
import { PRODUTOS } from "../models/Product";
import type { Product } from "../models/Product";

export function useProductFilter(
  categoriaAtiva: string,
  termo: string,
): Product[] {
  return useMemo(() => {
    const t = termo.trim().toLowerCase();
    return PRODUTOS.filter((p) => {
      const okCategoria = p.categoria === categoriaAtiva;
      const okBusca =
        !t ||
        p.nome.toLowerCase().includes(t) ||
        p.desc.toLowerCase().includes(t);
      return okCategoria && okBusca;
    });
  }, [categoriaAtiva, termo]);
}
