import { X, Plus, Minus, MessageCircle, Trash2, ShoppingBag } from "lucide-react";
import { fmtPreco } from "../utils/format";
import { useCartContext } from "../controllers/CartContext";
import { useCatalogContext } from "../controllers/CatalogContext";
import type { Product } from "../models/Product";
import defaultLogo from "../assets/alexia.png";

function buildWhatsAppUrl(
  items: { id: number; cor: string; tamanho: string; qtd: number }[],
  total: number,
  findProduct: (id: number) => Product | undefined
) {
  const lines = items
    .map((item) => {
      const product = findProduct(item.id);
      return product
        ? `• ${product.nome} — ${item.qtd}x — ${item.cor} — ${item.tamanho} — ${fmtPreco(product.preco * item.qtd)}`
        : "";
    })
    .filter(Boolean);

  const message = [
    "Olá! Gostaria de fazer este pedido na Alexia Modesta:",
    "",
    ...lines,
    "",
    `*Total do Pedido: ${fmtPreco(total)}*`,
    "",
    "Por favor, poderiam me informar o prazo e opções de envio?"
  ].join("\n");

  const number = (import.meta.env.VITE_WHATSAPP_NUMBER ?? "5511999999999").replace(/\D/g, "");
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

interface Props {
  open: boolean;
  onClose: () => void;
}

export function CartDrawer({ open, onClose }: Props) {
  const { items, removeFromCart, updateQty, cartTotal } = useCartContext();
  const { findProduct } = useCatalogContext();

  const finalizarWhatsApp = () => {
    if (!items.length) return;
    window.open(buildWhatsAppUrl(items, cartTotal, findProduct), "_blank", "noopener,noreferrer");
  };

  return (
    <>
      <div
        className={`fixed inset-0 bg-[#1C1714]/60 backdrop-blur-sm z-40 transition-opacity duration-300 ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />
      <aside
        className={`fixed top-0 right-0 h-full w-full sm:w-[440px] bg-[#FAF8F5] border-l border-[#C89B7B]/30 z-50 flex flex-col shadow-2xl transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Top Header */}
        <div className="flex items-center justify-between p-5 sm:p-6 border-b border-[#C89B7B]/15 bg-[#F3ECE6]/50">
          <div>
            <h2 className="font-serif text-2xl text-[#2D241E] font-semibold">Seu Carrinho</h2>
            <p className="text-xs text-[#8C6347] font-medium mt-0.5">
              {items.reduce((s, i) => s + i.qtd, 0)} item(ns) selecionado(s)
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white hover:bg-[#C89B7B] hover:text-white text-[#2D241E] flex items-center justify-center transition-colors shadow-sm"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Lista de Itens */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6">
              <div className="w-16 h-16 rounded-full bg-[#F3ECE6] flex items-center justify-center mb-4 text-[#C89B7B]">
                <ShoppingBag className="w-7 h-7" />
              </div>
              <p className="font-serif text-xl text-[#2D241E] font-semibold">Seu carrinho está vazio</p>
              <p className="text-[#8C6347] text-xs mt-1.5 leading-relaxed max-w-xs">
                Explore nossas coleções exclusivas de saias, vestidos e acessórios para compor seu look.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {items.map((i) => {
                const produto = findProduct(i.id);
                if (!produto) return null;
                const imgSrc = produto.img || defaultLogo;

                return (
                  <div
                    key={`${i.id}-${i.cor}-${i.tamanho}`}
                    className="flex gap-3.5 p-3.5 rounded-2xl bg-white border border-[#C89B7B]/20 shadow-sm transition-all hover:border-[#C89B7B]/40"
                  >
                    <img
                      src={imgSrc}
                      alt={produto.nome}
                      className="w-20 h-24 rounded-xl object-cover object-top bg-[#F3ECE6]"
                    />
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-xs sm:text-sm font-serif font-semibold text-[#2D241E] leading-snug line-clamp-1">
                            {produto.nome}
                          </p>
                          <button
                            onClick={() => removeFromCart(i.id, i.cor, i.tamanho)}
                            className="text-[#2D241E]/40 hover:text-red-600 transition p-0.5"
                            aria-label="Remover item"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <p className="text-[11px] text-[#8C6347] capitalize mt-0.5 font-medium">
                          {i.cor} · Tam: {i.tamanho}
                        </p>
                      </div>

                      <div className="flex items-center justify-between mt-2 pt-1 border-t border-[#C89B7B]/10">
                        <span className="text-sm font-serif font-bold text-[#C89B7B]">
                          {fmtPreco(produto.preco * i.qtd)}
                        </span>
                        <div className="flex items-center border border-[#C89B7B]/30 rounded-full bg-[#FAF8F5]">
                          <button
                            onClick={() => updateQty(i.id, i.cor, i.tamanho, -1)}
                            className="w-6 h-6 flex items-center justify-center text-[#2D241E] hover:text-[#C89B7B]"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-6 text-center text-xs font-semibold text-[#2D241E]">
                            {i.qtd}
                          </span>
                          <button
                            onClick={() => updateQty(i.id, i.cor, i.tamanho, 1)}
                            className="w-6 h-6 flex items-center justify-center text-[#2D241E] hover:text-[#C89B7B]"
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

        {/* Total e Checkout via WhatsApp */}
        <div className="p-5 sm:p-6 border-t border-[#C89B7B]/20 bg-[#F3ECE6]/40">
          <div className="flex justify-between items-end mb-4">
            <span className="text-xs text-[#8C6347] uppercase tracking-wider font-semibold">
              Total do Pedido
            </span>
            <span className="text-2xl text-[#2D241E] font-serif font-bold">
              {fmtPreco(cartTotal)}
            </span>
          </div>

          <button
            disabled={!items.length}
            onClick={finalizarWhatsApp}
            className="w-full bg-[#25D366] text-white font-semibold py-3.5 rounded-full shadow-md disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#20bd5a] transition duration-200 flex items-center justify-center gap-2 active:scale-95 text-sm"
          >
            <MessageCircle className="w-5 h-5 fill-white" /> Finalizar Pedido pelo WhatsApp
          </button>
          <p className="text-[10px] text-[#8C6347] text-center mt-2.5">
            Ao clicar, seu carrinho será formatado para atendimento direto no WhatsApp da loja.
          </p>
        </div>
      </aside>
    </>
  );
}
