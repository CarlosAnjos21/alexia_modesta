import { useState } from "react";
import { useParams, Navigate } from "react-router-dom";
import { CATEGORIES } from "../models/Category";
import type { Product } from "../models/Product";
import { useProductFilter } from "../controllers/useProductFilter";
import { ProductCard } from "../views/ProductCard";
import { ProductModal } from "../views/ProductModal";
import { RevealOnScroll } from "../views/RevealOnScroll";

interface Props {
  termo: string;
}

export function CategoryPage({ termo }: Props) {
  const { categoriaId } = useParams<{ categoriaId: string }>();
  const categoria = CATEGORIES.find((c) => c.id === categoriaId);

  if (!categoria) {
    return <Navigate to={`/categoria/${CATEGORIES[0].id}`} replace />;
  }

  const produtos = useProductFilter(categoria.id, termo);
  const [produtoAberto, setProdutoAberto] = useState<Product | null>(null);

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      <RevealOnScroll>
        <div className="mb-8">
          <p className="text-[#E8B84B] text-xs uppercase tracking-[0.2em] mb-1">
            Categoria
          </p>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#F5F3EE]">
            {categoria.label}
          </h1>
          <p className="text-white/40 text-sm mt-2">
            {produtos.length} produto{produtos.length !== 1 ? "s" : ""}{" "}
            encontrado{produtos.length !== 1 ? "s" : ""}
          </p>
        </div>
      </RevealOnScroll>

      {produtos.length === 0 ? (
        <p className="text-white/40 text-sm">
          Nada encontrado para essa busca nessa categoria.
        </p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {produtos.map((p, idx) => (
            <ProductCard
              key={p.id}
              produto={p}
              index={idx}
              onOpen={setProdutoAberto}
            />
          ))}
        </div>
      )}

      {produtoAberto && (
        <ProductModal
          produto={produtoAberto}
          onClose={() => setProdutoAberto(null)}
        />
      )}
    </main>
  );
}
