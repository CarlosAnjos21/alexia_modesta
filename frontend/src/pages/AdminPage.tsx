import { useState } from "react";
import { Plus, X, Check } from "lucide-react";
import type { Variant } from "../models/Product";
import { useCatalogContext } from "../controllers/CatalogContext";
import { useCreateProduct } from "../controllers/useCreateProduct";

const VARIANTE_VAZIA: Variant = { cor: "", tamanho: "", estoque: 0 };

export function AdminPage() {
  const { categorias, refetch } = useCatalogContext();
  const { submit, enviando, erro, sucesso } = useCreateProduct();

  const [categoria, setCategoria] = useState("");
  const [nome, setNome] = useState("");
  const [preco, setPreco] = useState("");
  const [desc, setDesc] = useState("");
  const [imagem, setImagem] = useState<File | null>(null);
  const [variantes, setVariantes] = useState<Variant[]>([{ ...VARIANTE_VAZIA }]);

  function atualizarVariante(idx: number, campo: keyof Variant, valor: string) {
    setVariantes((prev) =>
      prev.map((v, i) => (i === idx ? { ...v, [campo]: campo === "estoque" ? Number(valor) : valor } : v))
    );
  }

  function adicionarVariante() {
    setVariantes((prev) => [...prev, { ...VARIANTE_VAZIA }]);
  }

  function removerVariante(idx: number) {
    setVariantes((prev) => prev.filter((_, i) => i !== idx));
  }

  function limparFormulario() {
    setCategoria("");
    setNome("");
    setPreco("");
    setDesc("");
    setImagem(null);
    setVariantes([{ ...VARIANTE_VAZIA }]);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await submit({ categoria, nome, preco, desc, imagem, variantes });
    await refetch();
    limparFormulario();
  }

  return (
    <main className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
      <div className="bg-white rounded-3xl border border-[#C89B7B]/30 p-8 shadow-md">
        <span className="text-[#C89B7B] text-xs uppercase tracking-widest font-semibold block mb-1">
          Painel de Gerenciamento
        </span>
        <h1 className="font-serif text-3xl text-[#2D241E] font-semibold mb-1">Cadastrar Peça no Catálogo</h1>
        <p className="text-[#8C6347] text-xs mb-8">Página administrativa de inclusão de novos modelos no banco de dados.</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div>
            <label className="text-[#8C6347] text-xs uppercase tracking-wide mb-1.5 font-semibold block">
              Categoria
            </label>
            <select
              required
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
              className="w-full bg-[#FAF8F5] border border-[#C89B7B]/30 rounded-xl px-3.5 py-2.5 text-sm text-[#2D241E] focus:outline-none focus:ring-2 focus:ring-[#C89B7B]/60"
            >
              <option value="" disabled>Selecione a categoria</option>
              {categorias.map((c) => (
                <option key={c.id} value={c.id}>{c.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[#8C6347] text-xs uppercase tracking-wide mb-1.5 font-semibold block">
              Nome da Peça
            </label>
            <input
              required
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Ex: Vestido Alfaiataria Mídi"
              className="w-full bg-[#FAF8F5] border border-[#C89B7B]/30 rounded-xl px-3.5 py-2.5 text-sm text-[#2D241E] focus:outline-none focus:ring-2 focus:ring-[#C89B7B]/60"
            />
          </div>

          <div>
            <label className="text-[#8C6347] text-xs uppercase tracking-wide mb-1.5 font-semibold block">
              Preço (R$)
            </label>
            <input
              required
              type="number"
              step="0.01"
              min="0"
              value={preco}
              onChange={(e) => setPreco(e.target.value)}
              placeholder="199.90"
              className="w-full bg-[#FAF8F5] border border-[#C89B7B]/30 rounded-xl px-3.5 py-2.5 text-sm text-[#2D241E] focus:outline-none focus:ring-2 focus:ring-[#C89B7B]/60"
            />
          </div>

          <div>
            <label className="text-[#8C6347] text-xs uppercase tracking-wide mb-1.5 font-semibold block">
              Descrição do Produto
            </label>
            <textarea
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              rows={3}
              placeholder="Detalhes sobre o tecido, corte e acabamento..."
              className="w-full bg-[#FAF8F5] border border-[#C89B7B]/30 rounded-xl px-3.5 py-2.5 text-sm text-[#2D241E] focus:outline-none focus:ring-2 focus:ring-[#C89B7B]/60"
            />
          </div>

          <div>
            <label className="text-[#8C6347] text-xs uppercase tracking-wide mb-1.5 font-semibold block">
              Imagem do Produto
            </label>
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={(e) => setImagem(e.target.files?.[0] ?? null)}
              className="w-full text-xs text-[#8C6347] file:mr-3 file:px-4 file:py-2 file:rounded-full file:border-0 file:bg-[#C89B7B] file:text-white file:text-xs file:font-semibold"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-[#8C6347] text-xs uppercase tracking-wide font-semibold">
                Variantes (cor · tamanho · estoque)
              </label>
              <button type="button" onClick={adicionarVariante} className="text-xs text-[#C89B7B] font-semibold flex items-center gap-1">
                <Plus className="w-3.5 h-3.5" /> Adicionar Opção
              </button>
            </div>

            <div className="flex flex-col gap-2">
              {variantes.map((v, idx) => (
                <div key={idx} className="flex gap-2 items-center">
                  <input
                    placeholder="cor"
                    required
                    value={v.cor}
                    onChange={(e) => atualizarVariante(idx, "cor", e.target.value)}
                    className="flex-1 bg-[#FAF8F5] border border-[#C89B7B]/30 rounded-xl px-3 py-2 text-sm text-[#2D241E]"
                  />
                  <input
                    placeholder="tamanho"
                    required
                    value={v.tamanho}
                    onChange={(e) => atualizarVariante(idx, "tamanho", e.target.value)}
                    className="flex-1 bg-[#FAF8F5] border border-[#C89B7B]/30 rounded-xl px-3 py-2 text-sm text-[#2D241E]"
                  />
                  <input
                    placeholder="estoque"
                    required
                    type="number"
                    min="0"
                    value={v.estoque}
                    onChange={(e) => atualizarVariante(idx, "estoque", e.target.value)}
                    className="w-24 bg-[#FAF8F5] border border-[#C89B7B]/30 rounded-xl px-3 py-2 text-sm text-[#2D241E]"
                  />
                  <button
                    type="button"
                    onClick={() => removerVariante(idx)}
                    disabled={variantes.length === 1}
                    className="text-[#2D241E]/40 hover:text-red-600 disabled:opacity-20"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {erro && <p className="text-red-600 text-sm font-medium">{erro}</p>}
          {sucesso && (
            <p className="text-emerald-700 text-sm font-medium flex items-center gap-1.5">
              <Check className="w-4 h-4" /> Produto cadastrado no banco com sucesso.
            </p>
          )}

          <button
            type="submit"
            disabled={enviando}
            className="bg-gradient-to-r from-[#C89B7B] to-[#B87D4B] text-white font-semibold text-sm py-3 rounded-full shadow-md disabled:opacity-40 hover:opacity-95 transition"
          >
            {enviando ? "Salvando..." : "Salvar Produto no Catálogo"}
          </button>
        </form>
      </div>
    </main>
  );
}
