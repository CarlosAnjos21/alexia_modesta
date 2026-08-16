import { Heart } from "lucide-react";
import type { Product } from "../models/Product";
import { fmtPreco } from "../utils/format";
import { useCartContext } from "../controllers/CartContext";
import { RevealOnScroll } from "./RevealOnScroll";

interface Props {
  produto: Product;
  index: number;
  onOpen: (produto: Product) => void;
}

export function ProductCard({ produto, index, onOpen }: Props) {
  const { saved, toggleSave, addToCart } = useCartContext();
  const isSaved = saved.has(produto.id);
  const temEstoque = produto.variantes.some((v) => v.estoque > 0);

  return (
    <RevealOnScroll delay={(index % 4) * 80}>
      <div
        onClick={() => onOpen(produto)}
        className="group cursor-pointer bg-[#1B1E25] border border-white/10 rounded-2xl overflow-hidden hover:border-white/25 transition h-full flex flex-col"
      >
        <div className="relative aspect-[3/4] overflow-hidden bg-black/20">
          <img
            src={produto.img}
            alt={produto.nome}
            className="w-full h-full object-cover object-top group-hover:scale-105 transition duration-500"
          />
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleSave(produto.id);
            }}
            className="absolute top-3 right-3 w-9 h-9 rounded-full bg-black/50 backdrop-blur flex items-center justify-center hover:bg-black/70 transition"
            aria-label="Salvar produto"
          >
            <Heart className={`w-4 h-4 ${isSaved ? "fill-[#E8B84B] text-[#E8B84B]" : "text-white"}`} />
          </button>
          {!temEstoque && (
            <span className="absolute bottom-3 left-3 bg-[#c94a3d] text-white text-[11px] px-2 py-1 rounded-full">
              Esgotado
            </span>
          )}
        </div>

        <div className="p-4 flex flex-col gap-2 flex-1">
          <h3 className="text-[#F5F3EE] font-medium leading-snug">{produto.nome}</h3>
          <p className="text-white/50 text-xs line-clamp-2 flex-1">{produto.desc}</p>
          <div className="flex items-center justify-between pt-2">
            <span className="text-[#E8B84B] font-serif text-lg">{fmtPreco(produto.preco)}</span>
            <button
              disabled={!temEstoque}
              onClick={(e) => {
                e.stopPropagation();
                const primeiraDisponivel = produto.variantes.find((v) => v.estoque > 0);
                if (primeiraDisponivel) addToCart(produto, primeiraDisponivel.cor, primeiraDisponivel.tamanho, 1);
              }}
              className="text-xs font-medium bg-[#F5F3EE] text-[#14161B] px-3 py-2 rounded-full disabled:opacity-30 disabled:cursor-not-allowed hover:brightness-95 transition"
            >
              Comprar
            </button>
          </div>
        </div>
      </div>
    </RevealOnScroll>
  );
}
