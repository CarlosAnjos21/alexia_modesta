import { useState, useEffect, useMemo } from "react";
import { X, Plus, Minus, Check } from "lucide-react";
import { COLORS } from "../models/Product";
import type { Product } from "../models/Product";
import { fmtPreco } from "../utils/format";
import { useCartContext } from "../controllers/CartContext";
import defaultLogo from "../assets/alexia.png";

interface Props {
  produto: Product;
  onClose: () => void;
}

export function ProductModal({ produto, onClose }: Props) {
  const { addToCart } = useCartContext();

  const cores = useMemo(() => {
    if (!produto.variantes || produto.variantes.length === 0) return ["única"];
    return Array.from(new Set(produto.variantes.map((v) => v.cor)));
  }, [produto]);

  const [corSelecionada, setCorSelecionada] = useState(cores[0]);

  const tamanhos = useMemo(() => {
    if (!produto.variantes || produto.variantes.length === 0) return ["M"];
    return produto.variantes
      .filter((v) => v.cor === corSelecionada)
      .map((v) => v.tamanho);
  }, [produto, corSelecionada]);

  const [tamanhoSelecionado, setTamanhoSelecionado] = useState(tamanhos[0] || "M");

  const [qtd, setQtd] = useState(1);
  const [confirmado, setConfirmado] = useState(false);

  const variante = produto.variantes?.find(
    (v) => v.cor === corSelecionada && v.tamanho === tamanhoSelecionado
  );
  const estoque = variante ? variante.estoque : 5;

  useEffect(() => {
    if (tamanhos.length > 0) {
      setTamanhoSelecionado(tamanhos[0]);
    }
  }, [corSelecionada, tamanhos]);

  useEffect(() => {
    setQtd(1);
    setConfirmado(false);
  }, [corSelecionada, tamanhoSelecionado]);

  const imgSrc = produto.img || defaultLogo;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-[#1C1714]/60 backdrop-blur-sm p-0 sm:p-6 animate-fadeIn"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-[#FAF8F5] w-full sm:max-w-2xl sm:rounded-3xl rounded-t-3xl max-h-[90vh] overflow-y-auto border border-[#C89B7B]/30 shadow-2xl transition-all"
      >
        <div className="flex justify-between items-center p-4 sm:px-6 sm:pt-6 border-b border-[#C89B7B]/15">
          <span className="text-xs font-semibold tracking-widest uppercase text-[#C89B7B]">
            Detalhes da Peça
          </span>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-[#F3ECE6] hover:bg-[#C89B7B] hover:text-white text-[#2D241E] flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="grid sm:grid-cols-2 gap-6 p-6">
          <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-[#F3ECE6] border border-[#C89B7B]/20 flex items-center justify-center">
            <img
              src={imgSrc}
              alt={produto.nome}
              className={`w-full h-full ${produto.img ? "object-cover object-top" : "object-contain p-8 opacity-75"}`}
            />
          </div>

          <div className="flex flex-col gap-4">
            <div>
              <h2 className="font-serif text-2xl sm:text-3xl text-[#2D241E] font-semibold leading-tight">
                {produto.nome}
              </h2>
              <p className="text-[#2D241E]/70 text-xs sm:text-sm mt-2 leading-relaxed">
                {produto.desc || produto.descricao || "Peça autêntica desenvolvida em caimento exclusivo para moda evangélica e executiva."}
              </p>
            </div>

            <div className="py-1">
              <span className="text-[#C89B7B] font-serif text-3xl font-bold">
                {fmtPreco(produto.preco)}
              </span>
            </div>

            {cores.length > 0 && (
              <div>
                <p className="text-[#8C6347] text-[11px] uppercase tracking-wider font-semibold mb-2">
                  Cor
                </p>
                <div className="flex gap-2 flex-wrap">
                  {cores.map((cor) => (
                    <button
                      key={cor}
                      onClick={() => setCorSelecionada(cor)}
                      className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs capitalize transition ${
                        corSelecionada === cor
                          ? "border-[#C89B7B] bg-[#C89B7B]/10 text-[#2D241E] font-semibold"
                          : "border-[#C89B7B]/20 text-[#2D241E]/70 hover:border-[#C89B7B]/50"
                      }`}
                    >
                      <span
                        className="w-3.5 h-3.5 rounded-full border border-black/10"
                        style={{ backgroundColor: COLORS[cor] || "#C89B7B" }}
                      />
                      {cor}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {tamanhos.length > 0 && (
              <div>
                <p className="text-[#8C6347] text-[11px] uppercase tracking-wider font-semibold mb-2">
                  Tamanho
                </p>
                <div className="flex gap-2 flex-wrap">
                  {tamanhos.map((tamanho) => {
                    const v = produto.variantes?.find(
                      (v) => v.cor === corSelecionada && v.tamanho === tamanho
                    );
                    const disponivel = (v?.estoque ?? 1) > 0;
                    return (
                      <button
                        key={tamanho}
                        onClick={() => setTamanhoSelecionado(tamanho)}
                        disabled={!disponivel}
                        className={`px-3.5 py-1.5 rounded-full border text-xs transition disabled:opacity-30 disabled:cursor-not-allowed ${
                          tamanhoSelecionado === tamanho
                            ? "border-[#C89B7B] bg-[#C89B7B] text-white font-semibold shadow-sm"
                            : "border-[#C89B7B]/20 text-[#2D241E]/70 hover:border-[#C89B7B]/50"
                        }`}
                      >
                        {tamanho}
                        {!disponivel && " (esgotado)"}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <p className="text-xs text-[#8C6347]">
              {estoque > 0
                ? `Disponível (${estoque} unidade${estoque > 1 ? "s" : ""})`
                : "Sem estoque no momento"}
            </p>

            <div className="flex items-center gap-3 pt-2">
              <div className="flex items-center border border-[#C89B7B]/30 rounded-full bg-white">
                <button
                  onClick={() => setQtd((q) => Math.max(1, q - 1))}
                  className="w-9 h-9 flex items-center justify-center text-[#2D241E] hover:text-[#C89B7B] transition"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="w-8 text-center text-sm font-semibold text-[#2D241E]">{qtd}</span>
                <button
                  onClick={() => setQtd((q) => Math.min(estoque || 10, q + 1))}
                  className="w-9 h-9 flex items-center justify-center text-[#2D241E] hover:text-[#C89B7B] transition"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              <button
                disabled={estoque === 0}
                onClick={() => {
                  addToCart(produto, corSelecionada, tamanhoSelecionado, qtd);
                  setConfirmado(true);
                }}
                className="flex-1 bg-gradient-to-r from-[#C89B7B] to-[#B87D4B] text-white font-semibold text-sm py-3 rounded-full shadow-md hover:opacity-95 transition flex items-center justify-center gap-2 active:scale-95 disabled:opacity-40"
              >
                {confirmado ? (
                  <>
                    <Check className="w-4 h-4" /> Adicionado ao Carrinho
                  </>
                ) : (
                  "Adicionar ao Carrinho"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
