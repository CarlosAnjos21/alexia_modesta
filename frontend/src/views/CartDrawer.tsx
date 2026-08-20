import { useState } from "react";
import {
  X,
  Plus,
  Minus,
  MessageCircle,
  Trash2,
  ShoppingBag,
} from "lucide-react";
import { fmtPreco } from "../utils/format";
import { useCartContext } from "../controllers/CartContext";
import { useCatalogContext } from "../controllers/CatalogContext";
import type { Product } from "../models/Product";
import defaultLogo from "../assets/alexia.png";

type FormaPagamento = "pix" | "1x" | "2x" | "3x" | "4x" | "5x";
type Parcela = "1x" | "2x" | "3x" | "4x" | "5x";

const parcelas: Parcela[] = ["1x", "2x", "3x", "4x", "5x"];

function buildWhatsAppUrl(
  items: { id: number; cor: string; tamanho: string; qtd: number }[],
  total: number,
  formaPagamento: FormaPagamento,
  findProduct: (id: number) => Product | undefined,
) {
  const lines = items
    .map((item) => {
      const product = findProduct(item.id);

      if (!product) return "";

      return `• ${product.nome} — ${item.qtd}x — ${item.cor} — ${
        item.tamanho
      } — ${fmtPreco(product.preco * item.qtd)}`;
    })
    .filter(Boolean);

  const pagamento =
    formaPagamento === "pix" ? "PIX" : `Cartão de crédito — ${formaPagamento}`;

  const message = [
    "Olá! Vim do site e quero finalizar esse pedido.",
    "",
    ...lines,
    "",
    `Forma de pagamento: ${pagamento}`,
    `*Valor total do pedido: ${fmtPreco(total)}*`,
    "",
    "Por favor, poderiam me informar o prazo e opções de envio?",
  ].join("\n");

  const number = (
    import.meta.env.VITE_WHATSAPP_NUMBER ?? "5585985100882"
  ).replace(/\D/g, "");

  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

interface Props {
  open: boolean;
  onClose: () => void;
}

export function CartDrawer({ open, onClose }: Props) {
  const [formaPagamento, setFormaPagamento] = useState<FormaPagamento>("pix");

  const [cartaoAberto, setCartaoAberto] = useState(false);

  const { items, removeFromCart, updateQty, cartTotal } = useCartContext();
  const { findProduct } = useCatalogContext();

  /*
   * ==============================
   * CÁLCULOS DE PAGAMENTO
   * ==============================
   */

  const pixTotal = cartTotal >= 200 ? cartTotal * 0.95 : cartTotal;

  const quantidadeParcelas =
    formaPagamento === "pix" ? null : Number(formaPagamento.replace("x", ""));

  const temAcrescimo = quantidadeParcelas !== null && quantidadeParcelas >= 3;

  const valorFinalPagamento =
    formaPagamento === "pix"
      ? pixTotal
      : temAcrescimo
        ? cartTotal * 1.05
        : cartTotal;

  const valorParcela =
    quantidadeParcelas !== null
      ? valorFinalPagamento / quantidadeParcelas
      : null;

  /*
   * ==============================
   * FUNÇÕES
   * ==============================
   */

  const calcularParcela = (quantidade: number) => {
    const total = quantidade >= 3 ? cartTotal * 1.05 : cartTotal;

    return total / quantidade;
  };

  const selecionarPix = () => {
    setFormaPagamento("pix");
    setCartaoAberto(false);
  };

  const abrirCartao = () => {
    setCartaoAberto((prev) => !prev);

    // Se estava no PIX, seleciona 1x automaticamente
    if (formaPagamento === "pix") {
      setFormaPagamento("1x");
    }
  };

  const selecionarParcela = (parcela: Parcela) => {
    setFormaPagamento(parcela);
  };

  const finalizarWhatsApp = () => {
    if (!items.length) return;

    const url = buildWhatsAppUrl(
      items,
      valorFinalPagamento,
      formaPagamento,
      findProduct,
    );

    window.open(url, "_blank", "noopener,noreferrer");
  };

  /*
   * ==============================
   * RENDER
   * ==============================
   */

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-[#1C1714]/60 backdrop-blur-sm z-40 transition-opacity duration-300 ${
          open
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Drawer */}
      <aside
        className={`fixed top-0 right-0 h-full w-full sm:w-[440px] bg-[#FAF8F5] border-l border-[#C89B7B]/30 z-50 flex flex-col shadow-2xl transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* ================= HEADER ================= */}
        <div className="flex items-center justify-between p-5 sm:p-6 border-b border-[#C89B7B]/15 bg-[#F3ECE6]/50">
          <div>
            <h2 className="font-serif text-2xl text-[#2D241E] font-semibold">
              Seu Carrinho
            </h2>

            <p className="text-xs text-[#8C6347] font-medium mt-0.5">
              {items.reduce((total, item) => total + item.qtd, 0)} item(ns)
              selecionado(s)
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white hover:bg-[#C89B7B] hover:text-white text-[#2D241E] flex items-center justify-center transition-colors shadow-sm"
            aria-label="Fechar carrinho"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ================= PRODUTOS ================= */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6">
              <div className="w-16 h-16 rounded-full bg-[#F3ECE6] flex items-center justify-center mb-4 text-[#C89B7B]">
                <ShoppingBag className="w-7 h-7" />
              </div>

              <p className="font-serif text-xl text-[#2D241E] font-semibold">
                Seu carrinho está vazio
              </p>

              <p className="text-[#8C6347] text-xs mt-1.5 leading-relaxed max-w-xs">
                Explore nossas coleções exclusivas de saias, vestidos e
                acessórios para compor seu look.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {items.map((item) => {
                const produto = findProduct(item.id);

                if (!produto) return null;

                const imgSrc = produto.img || defaultLogo;

                return (
                  <div
                    key={`${item.id}-${item.cor}-${item.tamanho}`}
                    className="flex gap-3.5 p-3.5 rounded-2xl bg-white border border-[#C89B7B]/20 shadow-sm transition-all hover:border-[#C89B7B]/40"
                  >
                    {/* Imagem */}
                    <img
                      src={imgSrc}
                      alt={produto.nome}
                      className="w-20 h-24 rounded-xl object-cover object-top bg-[#F3ECE6]"
                    />

                    {/* Informações */}
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-xs sm:text-sm font-serif font-semibold text-[#2D241E] leading-snug line-clamp-1">
                            {produto.nome}
                          </p>

                          <button
                            onClick={() =>
                              removeFromCart(item.id, item.cor, item.tamanho)
                            }
                            className="text-[#2D241E]/40 hover:text-red-600 transition p-0.5"
                            aria-label="Remover item"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        <p className="text-[11px] text-[#8C6347] capitalize mt-0.5 font-medium">
                          {item.cor} · Tam: {item.tamanho}
                        </p>
                      </div>

                      {/* Preço + quantidade */}
                      <div className="flex items-center justify-between mt-2 pt-1 border-t border-[#C89B7B]/10">
                        <span className="text-sm font-serif font-bold text-[#C89B7B]">
                          {fmtPreco(produto.preco * item.qtd)}
                        </span>

                        <div className="flex items-center border border-[#C89B7B]/30 rounded-full bg-[#FAF8F5]">
                          <button
                            onClick={() =>
                              updateQty(item.id, item.cor, item.tamanho, -1)
                            }
                            className="w-6 h-6 flex items-center justify-center text-[#2D241E] hover:text-[#C89B7B]"
                            aria-label="Diminuir quantidade"
                          >
                            <Minus className="w-3 h-3" />
                          </button>

                          <span className="w-6 text-center text-xs font-semibold text-[#2D241E]">
                            {item.qtd}
                          </span>

                          <button
                            onClick={() =>
                              updateQty(item.id, item.cor, item.tamanho, 1)
                            }
                            className="w-6 h-6 flex items-center justify-center text-[#2D241E] hover:text-[#C89B7B]"
                            aria-label="Aumentar quantidade"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* ================= CHECKOUT ================= */}
        <div className="p-5 sm:p-6 border-t border-[#C89B7B]/20 bg-[#F3ECE6]/40">
          {/* Total */}
          <div className="flex justify-between items-end mb-4">
            <div>
              <span className="text-xs text-[#8C6347] uppercase tracking-wider font-semibold">
                Total do Pedido
              </span>

              {formaPagamento === "pix" && cartTotal >= 200 && (
                <p className="text-[10px] text-[#8C6347]/70 mt-1">
                  5% de desconto no PIX
                </p>
              )}

              {temAcrescimo && (
                <p className="text-[10px] text-[#8C6347]/70 mt-1">
                  5% de acréscimo
                </p>
              )}

              {valorParcela !== null && (
                <p className="text-[10px] text-[#8C6347]/70 mt-1">
                  {formaPagamento} de {fmtPreco(valorParcela)}
                </p>
              )}
            </div>

            <span className="text-2xl text-[#2D241E] font-serif font-bold">
              {fmtPreco(valorFinalPagamento)}
            </span>
          </div>

          {/* Forma de pagamento */}
          <div className="mb-5">
            <p className="text-xs text-[#8C6347] uppercase tracking-wider font-semibold mb-3">
              Forma de pagamento
            </p>

            <div className="flex flex-col gap-2">
              {/* PIX */}
              <label
                className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all duration-200 ${
                  formaPagamento === "pix"
                    ? "border-[#C89B7B]/50 bg-[#C89B7B]/5"
                    : "border-[#C89B7B]/15 bg-white/80 hover:border-[#C89B7B]/30"
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="formaPagamento"
                    value="pix"
                    checked={formaPagamento === "pix"}
                    onChange={selecionarPix}
                    className="accent-[#C89B7B]"
                  />

                  <div>
                    <p className="text-sm font-semibold text-[#2D241E]">
                      💠 PIX
                    </p>

                    <p className="text-[10px] text-[#8C6347]/70">
                      {cartTotal >= 200
                        ? "5% de desconto"
                        : "Sem desconto abaixo de R$ 200"}
                    </p>
                  </div>
                </div>

                <span className="text-sm font-semibold text-[#2D241E]">
                  {fmtPreco(pixTotal)}
                </span>
              </label>

              {/* CARTÃO */}
              <div
                className={`rounded-xl border transition-all duration-200 ${
                  formaPagamento !== "pix"
                    ? "border-[#C89B7B]/40 bg-[#C89B7B]/5"
                    : "border-[#C89B7B]/15 bg-white/80"
                }`}
              >
                <button
                  type="button"
                  onClick={abrirCartao}
                  className="w-full flex items-center justify-between p-3 text-left"
                >
                  <div>
                    <p className="text-sm font-semibold text-[#2D241E]">
                      💳 Cartão de crédito
                    </p>

                    <p className="text-[10px] text-[#8C6347]/70">Até 5x</p>
                  </div>

                  <span className="text-[#8C6347] text-xs">
                    {cartaoAberto ? "▲" : "▼"}
                  </span>
                </button>

                {/* Parcelas */}
                {cartaoAberto && (
                  <div className="px-3 pb-3 flex flex-col gap-1.5">
                    {parcelas.map((parcela) => {
                      const quantidade = Number(parcela.replace("x", ""));

                      const valorParcela = calcularParcela(quantidade);

                      const selecionada = formaPagamento === parcela;

                      return (
                        <label
                          key={parcela}
                          className={`flex items-center justify-between p-2.5 rounded-lg border cursor-pointer transition-all duration-150 ${
                            selecionada
                              ? "border-[#C89B7B]/50 bg-white shadow-sm"
                              : "border-[#C89B7B]/10 bg-white/50 hover:bg-white hover:border-[#C89B7B]/25"
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <input
                              type="radio"
                              name="formaPagamento"
                              value={parcela}
                              checked={selecionada}
                              onChange={() => selecionarParcela(parcela)}
                              className="accent-[#C89B7B]"
                            />

                            <span className="text-xs font-semibold text-[#2D241E]">
                              {parcela}
                            </span>
                          </div>

                          <div className="text-right">
                            <p className="text-xs font-semibold text-[#2D241E]">
                              {fmtPreco(valorParcela)}
                            </p>

                            <p className="text-[9px] text-[#8C6347]/70">
                              {quantidade <= 2
                                ? "sem juros"
                                : "5% de acréscimo"}
                            </p>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Finalizar */}
          <button
            disabled={!items.length}
            onClick={finalizarWhatsApp}
            className="w-full bg-[#25D366] text-white font-semibold py-3.5 rounded-full shadow-md disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#20bd5a] transition duration-200 flex items-center justify-center gap-2 active:scale-95 text-sm"
          >
            <MessageCircle className="w-5 h-5 fill-white" />
            Finalizar Pedido pelo WhatsApp
          </button>

          <p className="text-[10px] text-[#8C6347] text-center mt-2.5">
            Ao clicar, seu carrinho será formatado para atendimento direto no
            WhatsApp da loja.
          </p>
        </div>
      </aside>
    </>
  );
}
