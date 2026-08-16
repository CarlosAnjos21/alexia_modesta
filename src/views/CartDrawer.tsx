import { X, Plus, Minus } from "lucide-react";
import { PRODUTOS } from "../models/Product";
import { fmtPreco } from "../utils/format";
import { useCartContext } from "../controllers/CartContext";

interface Props {
  open: boolean;
  onClose: () => void;
}

export function CartDrawer({ open, onClose }: Props) {
  const { items, removeFromCart, updateQty, cartTotal } = useCartContext();

  return (
    <>
      <div
        className={`fixed inset-0 bg-black/60 z-40 transition-opacity ${open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
        onClick={onClose}
      />
      <aside
        className={`fixed top-0 right-0 h-full w-full sm:w-96 bg-[#1B1E25] border-l border-white/10 z-50 flex flex-col transition-transform duration-300 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <h2 className="font-serif text-lg text-[#F5F3EE]">Seu carrinho</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center">
            <X className="w-4 h-4 text-white/70" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
          {items.length === 0 && <p className="text-white/40 text-sm">Seu carrinho está vazio.</p>}
          {items.map((i) => {
            const produto = PRODUTOS.find((p) => p.id === i.id);
            if (!produto) return null;
            return (
              <div key={`${i.id}-${i.cor}`} className="flex gap-3">
                <img src={produto.img} alt={produto.nome} className="w-16 h-16 rounded-lg object-cover" />
                <div className="flex-1">
                  <p className="text-sm text-[#F5F3EE]">{produto.nome}</p>
                  <p className="text-xs text-white/50 capitalize">{i.cor}</p>
                  <div className="flex items-center justify-between mt-1">
                    <div className="flex items-center border border-white/15 rounded-full">
                      <button onClick={() => updateQty(i.id, i.cor, -1)} className="w-6 h-6 flex items-center justify-center text-white/70">
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-6 text-center text-xs text-[#F5F3EE]">{i.qtd}</span>
                      <button onClick={() => updateQty(i.id, i.cor, 1)} className="w-6 h-6 flex items-center justify-center text-white/70">
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                    <span className="text-xs text-[#E8B84B]">{fmtPreco(produto.preco * i.qtd)}</span>
                  </div>
                </div>
                <button onClick={() => removeFromCart(i.id, i.cor)} className="text-white/30 hover:text-white/70">
                  <X className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>

        <div className="p-4 border-t border-white/10">
          <div className="flex justify-between text-sm mb-3">
            <span className="text-white/60">Total</span>
            <span className="text-[#F5F3EE] font-serif text-lg">{fmtPreco(cartTotal)}</span>
          </div>
          <button
            disabled={items.length === 0}
            className="w-full bg-[#E8B84B] text-[#14161B] font-medium py-2.5 rounded-full disabled:opacity-30 disabled:cursor-not-allowed hover:brightness-95 transition"
          >
            Finalizar compra
          </button>
        </div>
      </aside>
    </>
  );
}
