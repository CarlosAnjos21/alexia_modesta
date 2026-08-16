import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import type { Product } from "../models/Product";
import { useProductFilter } from "../controllers/useProductFilter";
import { useCatalogContext } from "../controllers/CatalogContext";
import { ProductCard } from "../views/ProductCard";
import { ProductModal } from "../views/ProductModal";
import { RevealOnScroll } from "../views/RevealOnScroll";

interface Props {
  termo: string;
}

const CATEGORY_NAMES: Record<string, string> = {
  saias: "Saias",
  vestidos: "Vestidos",
  conjuntos: "Conjuntos",
  camisas: "Camisas",
  acessorios: "Acessórios",
};

export function CategoryPage({ termo }: Props) {
  const { categoriaId } = useParams<{ categoriaId: string }>();
  const { categorias, produtos, carregando, erro } = useCatalogContext();

  const currentCatId = categoriaId ?? "vestidos";
  const categoriaLabel = CATEGORY_NAMES[currentCatId] || categorias.find((c) => c.id === currentCatId)?.label || currentCatId;

  const produtosFiltrados = useProductFilter(produtos, currentCatId, termo);
  const [produtoAberto, setProdutoAberto] = useState<Product | null>(null);

  if (carregando) {
    return (
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-16 text-[#8C6347] text-sm">
        Carregando catálogo de {categoriaLabel}...
      </main>
    );
  }

  if (erro) {
    return (
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-16 text-red-700 text-sm font-medium">
        {erro}
      </main>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
      {/* Cabeçalho da Categoria */}
      <RevealOnScroll direction="up">
        <div className="mb-10 pb-6 border-b border-[#C89B7B]/20 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-[#8C6347] uppercase tracking-widest font-semibold mb-1">
              <Link to="/" className="hover:text-[#C89B7B]">Início</Link>
              <span>/</span>
              <span className="text-[#C89B7B]">{categoriaLabel}</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-5xl text-[#2D241E] font-semibold">
              Coleção de {categoriaLabel}
            </h1>
            <p className="text-[#8C6347] text-xs sm:text-sm mt-2">
              {produtosFiltrados.length} modelo{produtosFiltrados.length !== 1 ? "s" : ""} encontrado{produtosFiltrados.length !== 1 ? "s" : ""}
              {termo ? ` para "${termo}"` : ""}
            </p>
          </div>

          {/* Atalhos para outras categorias */}
          <div className="flex gap-2 flex-wrap">
            {Object.entries(CATEGORY_NAMES).map(([id, label]) => (
              <Link
                key={id}
                to={`/categoria/${id}`}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition ${
                  id === currentCatId
                    ? "bg-[#C89B7B] text-white shadow-sm font-semibold"
                    : "bg-[#F3ECE6] text-[#2D241E]/80 hover:bg-[#C89B7B]/20"
                }`}
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      </RevealOnScroll>

      {/* Grade de Produtos */}
      {produtosFiltrados.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-[#C89B7B]/20 p-8 shadow-sm">
          <p className="font-serif text-xl text-[#2D241E] font-semibold">Nenhum produto encontrado</p>
          <p className="text-[#8C6347] text-xs mt-2">
            Não encontramos itens correspondentes a "{termo}" na categoria {categoriaLabel}.
          </p>
          <Link
            to="/"
            className="mt-5 inline-block bg-[#2D241E] text-white text-xs font-semibold px-5 py-2.5 rounded-full hover:bg-[#C89B7B] transition"
          >
            Voltar ao Início
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {produtosFiltrados.map((p, idx) => (
            <ProductCard key={p.id} produto={p} index={idx} onOpen={setProdutoAberto} />
          ))}
        </div>
      )}

      {produtoAberto && (
        <ProductModal produto={produtoAberto} onClose={() => setProdutoAberto(null)} />
      )}
    </main>
  );
}
