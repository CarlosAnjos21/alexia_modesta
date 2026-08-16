import { Heart } from "lucide-react";
import type { Product } from "../models/Product";
import { fmtPreco } from "../utils/format";
import { useCartContext } from "../controllers/CartContext";
import { RevealOnScroll } from "./RevealOnScroll";
import defaultLogo from "../assets/alexia.png";

interface Props {
  produto: Product;
  index: number;
  onOpen: (produto: Product) => void;
}

export function ProductCard({ produto, index, onOpen }: Props) {
  const { saved, toggleSave, addToCart } = useCartContext();
  const isSaved = saved.has(produto.id);
  const temEstoque = produto.variantes && produto.variantes.length > 0
    ? produto.variantes.some((v) => v.estoque > 0)
    : true;

  const imgSrc = produto.img || defaultLogo;

  return (
    <RevealOnScroll delay={(index % 4) * 90} direction="up">
      <div
        onClick={() => onOpen(produto)}
        className="group cursor-pointer bg-white border border-[#C89B7B]/20 rounded-2xl overflow-hidden hover:border-[#C89B7B]/60 hover:shadow-xl transition-all duration-300 h-full flex flex-col transform hover:-translate-y-1"
      >
        <div className="relative aspect-[3/4] overflow-hidden bg-[#FAF8F5] flex items-center justify-center">
          <img
            src={imgSrc}
            alt={produto.nome}
            className={`w-full h-full ${produto.img ? "object-cover object-top" : "object-contain p-8 opacity-75"} group-hover:scale-105 transition-transform duration-700 ease-out`}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Botão Favoritar */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleSave(produto.id);
            }}
            className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/80 backdrop-blur-md flex items-center justify-center shadow-md hover:bg-white transition-all active:scale-90"
            aria-label="Salvar produto"
          >
            <Heart className={`w-4 h-4 transition-colors ${isSaved ? "fill-[#C89B7B] text-[#C89B7B]" : "text-[#2D241E]/70"}`} />
          </button>

          {!temEstoque && (
            <span className="absolute bottom-3 left-3 bg-[#2D241E] text-[#FAF8F5] text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-full font-semibold">
              Esgotado
            </span>
          )}
        </div>

        <div className="p-4 sm:p-5 flex flex-col gap-2 flex-1 justify-between">
          <div>
            <span className="text-[10px] font-semibold tracking-widest uppercase text-[#C89B7B]">
              {produto.categoria || "Moda Feminina"}
            </span>
            <h3 className="text-[#2D241E] font-serif text-lg font-semibold leading-snug line-clamp-1 group-hover:text-[#C89B7B] transition-colors">
              {produto.nome}
            </h3>
            <p className="text-[#2D241E]/60 text-xs line-clamp-2 mt-1 leading-relaxed">
              {produto.desc || produto.descricao || "Peça exclusiva em acabamento refinado com excelente caimento."}
            </p>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-[#C89B7B]/10 mt-2">
            <span className="text-[#C89B7B] font-serif text-xl font-bold">
              {fmtPreco(produto.preco)}
            </span>
            <button
              disabled={!temEstoque}
              onClick={(e) => {
                e.stopPropagation();
                const primeiraDisponivel = produto.variantes?.find((v) => v.estoque > 0) || { cor: "Padrão", tamanho: "M" };
                addToCart(produto, primeiraDisponivel.cor, primeiraDisponivel.tamanho, 1);
              }}
              className="text-xs font-semibold bg-[#2D241E] text-[#FAF8F5] px-4 py-2 rounded-full disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#C89B7B] hover:text-white transition-all shadow-sm active:scale-95"
            >
              Comprar
            </button>
          </div>
        </div>
      </div>
    </RevealOnScroll>
  );
}
