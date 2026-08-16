import { createContext, useContext, useEffect, useState, useCallback } from "react";
import type { ReactNode } from "react";
import type { Product } from "../models/Product";
import type { Category } from "../models/Category";
import { apiGet } from "../services/api";

export interface CatalogState {
  categorias: Category[];
  produtos: Product[];
  carregando: boolean;
  erro: string | null;
  findProduct: (id: number) => Product | undefined;
  refetch: () => Promise<void>;
}

const CatalogContext = createContext<CatalogState | null>(null);

export function CatalogProvider({ children }: { children: ReactNode }) {
  const [categorias, setCategorias] = useState<Category[]>([]);
  const [produtos, setProdutos] = useState<Product[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  const carregar = useCallback(async () => {
    try {
      const [cats, prods] = await Promise.all([
        apiGet<Category[]>("/api/categorias"),
        apiGet<Product[]>("/api/produtos"),
      ]);
      setCategorias(cats);
      setProdutos(prods);
      setErro(null);
    } catch {
      setErro("Não foi possível carregar o catálogo. Tente novamente em instantes.");
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => {
    carregar();
  }, [carregar]);

  function findProduct(id: number) {
    return produtos.find((p) => p.id === id);
  }

  return (
    <CatalogContext.Provider value={{ categorias, produtos, carregando, erro, findProduct, refetch: carregar }}>
      {children}
    </CatalogContext.Provider>
  );
}

export function useCatalogContext(): CatalogState {
  const ctx = useContext(CatalogContext);
  if (!ctx) throw new Error("useCatalogContext deve ser usado dentro de CatalogProvider");
  return ctx;
}
