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

const DEFAULT_CATEGORIES: Category[] = [
  { id: "vestidos", label: "Vestidos" },
  { id: "saias", label: "Saias" },
  { id: "conjuntos", label: "Conjuntos" },
  { id: "camisas", label: "Camisas" },
  { id: "acessorios", label: "Acessórios" },
];

const DEFAULT_PRODUTOS: Product[] = [
  {
    id: 1,
    categoria: "vestidos",
    nome: "Vestido Mídi Polly Larissa",
    preco: 219.9,
    descricao: "Tecido super fluido em toque suave, caimento leve e fechamento delicado em zíper.",
    img: "",
    variantes: [
      { id: 101, cor: "verde", tamanho: "38/42", estoque: 5 },
      { id: 102, cor: "amarelo", tamanho: "38/42", estoque: 3 },
      { id: 103, cor: "marrom", tamanho: "38/42", estoque: 4 },
    ],
  },
  {
    id: 2,
    categoria: "vestidos",
    nome: "Vestido Alfaiataria Premium Rosé",
    preco: 249.9,
    descricao: "Comprimento mídi elegante, tecido encorpado de altíssima qualidade e caimento estruturado.",
    img: "",
    variantes: [
      { id: 201, cor: "rosé", tamanho: "38/42", estoque: 4 },
      { id: 202, cor: "caramelo", tamanho: "38/42", estoque: 3 },
    ],
  },
  {
    id: 3,
    categoria: "saias",
    nome: "Saia Mídi Evasê Alfaiataria Premium",
    preco: 159.9,
    descricao: "Modelagem evasê clássica com pregas frontais refinadas e cós estruturado.",
    img: "",
    variantes: [
      { id: 301, cor: "bege", tamanho: "M", estoque: 3 },
      { id: 302, cor: "verde", tamanho: "M", estoque: 2 },
    ],
  },
  {
    id: 4,
    categoria: "saias",
    nome: "Saia de Cetim Plissada Champanhe",
    preco: 139.9,
    descricao: "Caimento impecável em cetim nobre, brilho discreto e sofisticação.",
    img: "",
    variantes: [{ id: 401, cor: "champanhe", tamanho: "M", estoque: 4 }],
  },
  {
    id: 5,
    categoria: "conjuntos",
    nome: "Conjunto Alfaiataria Modesta Rosé Gold",
    preco: 289.9,
    descricao: "Blazer acinturado e saia midi estruturada em tecido premium com toque aveludado.",
    img: "",
    variantes: [{ id: 501, cor: "rosé", tamanho: "M", estoque: 3 }],
  },
  {
    id: 6,
    categoria: "camisas",
    nome: "Camisa Seda Pura Gola Laço",
    preco: 179.9,
    descricao: "Confeccionada em seda refinada com detalhe de gravata borboleta adaptável e botões perolados.",
    img: "",
    variantes: [{ id: 601, cor: "off-white", tamanho: "M", estoque: 5 }],
  },
  {
    id: 7,
    categoria: "acessorios",
    nome: "Cinto Couro Legítimo Fivela Rosé Gold",
    preco: 79.9,
    descricao: "Cinto em couro nobre ajustável com acabamento escovado em tom rosé bronze.",
    img: "",
    variantes: [{ id: 701, cor: "caramelo", tamanho: "Único", estoque: 10 }],
  },
];

export function CatalogProvider({ children }: { children: ReactNode }) {
  const [categorias, setCategorias] = useState<Category[]>(DEFAULT_CATEGORIES);
  const [produtos, setProdutos] = useState<Product[]>(DEFAULT_PRODUTOS);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  const carregar = useCallback(async () => {
    try {
      const [cats, prods] = await Promise.all([
        apiGet<Category[]>("/api/categorias"),
        apiGet<Product[]>("/api/produtos"),
      ]);
      if (cats && cats.length > 0) setCategorias(cats);
      if (prods && prods.length > 0) setProdutos(prods);
      setErro(null);
    } catch {
      // Usa os dados padrão de fallback caso a API backend esteja offline
      setCategorias(DEFAULT_CATEGORIES);
      setProdutos(DEFAULT_PRODUTOS);
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
