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
    <main className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
      <h1 className="font-serif text-3xl text-[#F5F3EE] mb-1">Cadastrar produto</h1>
      <p className="text-white/40 text-sm mb-8">Sem login por enquanto — página de uso interno.</p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div>
          <label className="text-white/60 text-xs uppercase tracking-wide mb-2 block">Categoria</label>
          <select
            required
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-[#F5F3EE] focus:outline-none focus:ring-2 focus:ring-[#E8B84B]/60"
          >
            <option value="" disabled>Selecione</option>
            {categorias.map((c) => (
              <option key={c.id} value={c.id}>{c.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-white/60 text-xs uppercase tracking-wide mb-2 block">Nome</label>
          <input
            required
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-[#F5F3EE] focus:outline-none focus:ring-2 focus:ring-[#E8B84B]/60"
          />
        </div>

        <div>
          <label className="text-white/60 text-xs uppercase tracking-wide mb-2 block">Preço (R$)</label>
          <input
            required
            type="number"
            step="0.01"
            min="0"
            value={preco}
            onChange={(e) => setPreco(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-[#F5F3EE] focus:outline-none focus:ring-2 focus:ring-[#E8B84B]/60"
          />
        </div>

        <div>
          <label className="text-white/60 text-xs uppercase tracking-wide mb-2 block">Descrição</label>
          <textarea
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            rows={3}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-[#F5F3EE] focus:outline-none focus:ring-2 focus:ring-[#E8B84B]/60"
          />
        </div>

        <div>
          <label className="text-white/60 text-xs uppercase tracking-wide mb-2 block">Foto</label>
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={(e) => setImagem(e.target.files?.[0] ?? null)}
            className="w-full text-sm text-white/70 file:mr-3 file:px-3 file:py-1.5 file:rounded-full file:border-0 file:bg-[#F5F3EE] file:text-[#14161B] file:text-xs file:font-medium"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-white/60 text-xs uppercase tracking-wide">Variantes (cor · tamanho · estoque)</label>
            <button type="button" onClick={adicionarVariante} className="text-xs text-[#E8B84B] flex items-center gap-1">
              <Plus className="w-3.5 h-3.5" /> Adicionar
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
                  className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-[#F5F3EE] focus:outline-none focus:ring-2 focus:ring-[#E8B84B]/60"
                />
                <input
                  placeholder="tamanho"
                  required
                  value={v.tamanho}
                  onChange={(e) => atualizarVariante(idx, "tamanho", e.target.value)}
                  className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-[#F5F3EE] focus:outline-none focus:ring-2 focus:ring-[#E8B84B]/60"
                />
                <input
                  placeholder="estoque"
                  required
                  type="number"
                  min="0"
                  value={v.estoque}
                  onChange={(e) => atualizarVariante(idx, "estoque", e.target.value)}
                  className="w-24 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-[#F5F3EE] focus:outline-none focus:ring-2 focus:ring-[#E8B84B]/60"
                />
                <button
                  type="button"
                  onClick={() => removerVariante(idx)}
                  disabled={variantes.length === 1}
                  className="text-white/30 hover:text-white/70 disabled:opacity-20 disabled:cursor-not-allowed"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {erro && <p className="text-[#c94a3d] text-sm">{erro}</p>}
        {sucesso && (
          <p className="text-[#1f8a6f] text-sm flex items-center gap-1.5">
            <Check className="w-4 h-4" /> Produto salvo com sucesso.
          </p>
        )}

        <button
          type="submit"
          disabled={enviando}
          className="bg-[#E8B84B] text-[#14161B] font-medium text-sm py-2.5 rounded-full disabled:opacity-40 disabled:cursor-not-allowed hover:brightness-95 transition"
        >
          {enviando ? "Salvando..." : "Salvar produto"}
        </button>
      </form>
    </main>
  );
}
