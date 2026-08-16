import { useState } from "react";
import type { Variant } from "../models/Product";
import { apiPostForm } from "../services/api";

export interface NovoProduto {
  categoria: string;
  nome: string;
  preco: string;
  desc: string;
  imagem: File | null;
  variantes: Variant[];
}

export function useCreateProduct() {
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [sucesso, setSucesso] = useState(false);

  async function submit(dados: NovoProduto) {
    setEnviando(true);
    setErro(null);
    setSucesso(false);

    try {
      const form = new FormData();
      form.append("categoria", dados.categoria);
      form.append("nome", dados.nome);
      form.append("preco", dados.preco);
      form.append("desc", dados.desc);
      form.append("variantes", JSON.stringify(dados.variantes));
      if (dados.imagem) form.append("imagem", dados.imagem);

      await apiPostForm("/api/produtos", form);
      setSucesso(true);
    } catch {
      setErro("Não foi possível salvar o produto. Confira os campos e tente de novo.");
    } finally {
      setEnviando(false);
    }
  }

  return { submit, enviando, erro, sucesso };
}
