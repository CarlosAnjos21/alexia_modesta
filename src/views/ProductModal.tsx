import { useState, useEffect } from "react";
import { X, Plus, Minus, Check } from "lucide-react";
import { COLORS } from "../models/Product";
import type { Product } from "../models/Product";
import { fmtPreco } from "../utils/format";
import { useCartContext } from "../controllers/CartContext";

interface Props {
  produto: Product;
  onClose: () => void;
}

export function ProductModal({ produto, onClose }: Props) {
  const { addToCart } = useCartContext();
  const [corSelecionada, setCorSelecionada] = useState(
    produto.variantes[0].cor,
  );
  const [qtd, setQtd] = useState(1);
  const [confirmado, setConfirmado] = useState(false);

  const variante = produto.variantes.find((v) => v.cor === corSelecionada);
  const estoque = variante ? variante.estoque : 0;

  useEffect(() => {
    setQtd(1);
    setConfirmado(false);
  }, [corSelecionada]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 p-0 sm:p-6"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-[#1B1E25] w-full sm:max-w-2xl sm:rounded-2xl rounded-t-2xl max-h-[90vh] overflow-y-auto border border-white/10"
      >
        <div className="flex justify-end p-3">
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center"
          >
            <X className="w-4 h-4 text-white/70" />
          </button>
        </div>

        <div className="grid sm:grid-cols-2 gap-6 px-6 pb-6">
          <img
            src={produto.img}
            alt={produto.nome}
            className="w-full aspect-square object-cover rounded-xl"
          />

          <div className="flex flex-col gap-4">
            <div>
              <h2 className="font-serif text-2xl text-[#F5F3EE]">
                {produto.nome}
              </h2>
              <p className="text-white/50 text-sm mt-1">{produto.desc}</p>
            </div>

            <span className="text-[#E8B84B] font-serif text-2xl">
              {fmtPreco(produto.preco)}
            </span>

            <div>
              <p className="text-white/60 text-xs uppercase tracking-wide mb-2">
                Cor
              </p>
              <div className="flex gap-2 flex-wrap">
                {produto.variantes.map((v) => (
                  <button
                    key={v.cor}
                    onClick={() => setCorSelecionada(v.cor)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs capitalize transition ${
                      corSelecionada === v.cor
                        ? "border-[#E8B84B] text-[#F5F3EE]"
                        : "border-white/15 text-white/60 hover:border-white/35"
                    }`}
                  >
                    <span
                      className="w-3.5 h-3.5 rounded-full border border-white/20"
                      style={{ backgroundColor: COLORS[v.cor] }}
                    />
                    {v.cor}
                    {v.estoque === 0 && (
                      <span className="text-[#c94a3d]">(esgotado)</span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            <p className="text-xs text-white/50">
              {estoque > 0
                ? `${estoque} unidade${estoque > 1 ? "s" : ""} em estoque nessa cor`
                : "Sem estoque nessa cor"}
            </p>

            <div className="flex items-center gap-3">
              <div className="flex items-center border border-white/15 rounded-full">
                <button
                  onClick={() => setQtd((q) => Math.max(1, q - 1))}
                  className="w-8 h-8 flex items-center justify-center text-white/70 hover:text-white"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="w-8 text-center text-sm text-[#F5F3EE]">
                  {qtd}
                </span>
                <button
                  onClick={() => setQtd((q) => Math.min(estoque || 1, q + 1))}
                  className="w-8 h-8 flex items-center justify-center text-white/70 hover:text-white"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              <button
                disabled={estoque === 0}
                onClick={() => {
                  addToCart(produto, corSelecionada, qtd);
                  setConfirmado(true);
                }}
                className="flex-1 bg-[#E8B84B] text-[#14161B] font-medium text-sm py-2.5 rounded-full disabled:opacity-30 disabled:cursor-not-allowed hover:brightness-95 transition flex items-center justify-center gap-1.5"
              >
                {confirmado ? (
                  <>
                    <Check className="w-4 h-4" /> Adicionado
                  </>
                ) : (
                  "Adicionar ao carrinho"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
