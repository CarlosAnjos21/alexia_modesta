import { useState } from "react";
import { CATEGORIES } from "../models/Category";
import type { Product } from "../models/Product";
import { useProductFilter } from "../controllers/useProductFilter";
import { ProductCard } from "./ProductCard";
import { ProductModal } from "./ProductModal";
import { RevealOnScroll } from "./RevealOnScroll";

interface Props {
  categoriaAtiva: string;
  termo: string;
}

export function CategoryPage({ categoriaAtiva, termo }: Props) {
  const produtos = useProductFilter(categoriaAtiva, termo);
  const [produtoAberto, setProdutoAberto] = useState<Product | null>(null);
  const label = CATEGORIES.find((c) => c.id === categoriaAtiva)?.label;

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      <RevealOnScroll>
        <div className="mb-8">
          <p className="text-[#E8B84B] text-xs uppercase tracking-[0.2em] mb-1">
            Categoria
          </p>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#F5F3EE]">
            {label}
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
