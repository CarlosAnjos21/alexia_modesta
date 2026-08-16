import { useState } from "react";
import { useParams, Navigate } from "react-router-dom";
import type { Product } from "../models/Product";
import { useProductFilter } from "../controllers/useProductFilter";
import { useCatalogContext } from "../controllers/CatalogContext";
import { ProductCard } from "../views/ProductCard";
import { ProductModal } from "../views/ProductModal";
import { RevealOnScroll } from "../views/RevealOnScroll";

interface Props {
  termo: string;
}

export function CategoryPage({ termo }: Props) {
  const { categoriaId } = useParams<{ categoriaId: string }>();
  const { categorias, produtos, carregando, erro } = useCatalogContext();
  const categoria = categorias.find((c) => c.id === categoriaId);

  const produtosFiltrados = useProductFilter(produtos, categoriaId ?? "", termo);
  const [produtoAberto, setProdutoAberto] = useState<Product | null>(null);

  if (carregando) {
    return <p className="max-w-6xl mx-auto px-4 sm:px-6 py-10 text-white/40 text-sm">Carregando catálogo...</p>;
  }

  if (erro) {
    return <p className="max-w-6xl mx-auto px-4 sm:px-6 py-10 text-[#c94a3d] text-sm">{erro}</p>;
  }

  if (categorias.length > 0 && !categoria) {
    return <Navigate to={`/categoria/${categorias[0].id}`} replace />;
  }

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      <RevealOnScroll>
        <div className="mb-8">
          <p className="text-[#E8B84B] text-xs uppercase tracking-[0.2em] mb-1">Categoria</p>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#F5F3EE]">{categoria?.label}</h1>
          <p className="text-white/40 text-sm mt-2">
            {produtosFiltrados.length} produto{produtosFiltrados.length !== 1 ? "s" : ""} encontrado{produtosFiltrados.length !== 1 ? "s" : ""}
          </p>
        </div>
      </RevealOnScroll>

      {produtosFiltrados.length === 0 ? (
        <p className="text-white/40 text-sm">Nada encontrado para essa busca nessa categoria.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {produtosFiltrados.map((p, idx) => (
            <ProductCard key={p.id} produto={p} index={idx} onOpen={setProdutoAberto} />
          ))}
        </div>
      )}

      {produtoAberto && <ProductModal produto={produtoAberto} onClose={() => setProdutoAberto(null)} />}
    </main>
  );
}
