import { useState } from "react";
import {
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Truck,
  Crown,
} from "lucide-react";
import { FaInstagram } from "react-icons/fa";
import { Link } from "react-router-dom";
import type { Product } from "../models/Product";
import { useCatalogContext } from "../controllers/CatalogContext";
import { ProductCard } from "../views/ProductCard";
import { ProductModal } from "../views/ProductModal";
import { RevealOnScroll } from "../views/RevealOnScroll";
import logoHero from "../assets/alexia.png";

export function HomePage() {
  const { produtos, carregando, erro } = useCatalogContext();
  const [produtoAberto, setProdutoAberto] = useState<Product | null>(null);

  const destaques = produtos.slice(0, 8);

  const scrollToProducts = () => {
    document.getElementById("destaques")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <main className="bg-[#FAF8F5] text-[#2D241E] overflow-hidden">
      {/* Hero Section Sofisticada */}
      <section className="relative overflow-hidden border-b border-[#C89B7B]/20 bg-gradient-to-b from-[#FAF8F5] via-[#F5EFEA] to-[#FAF8F5]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_25%,rgba(200,155,123,0.12),transparent_40%),radial-gradient(circle_at_15%_75%,rgba(140,99,71,0.06),transparent_35%)] pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-24 lg:py-28 grid lg:grid-cols-[1.1fr_.9fr] gap-12 items-center">
          <RevealOnScroll direction="up">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#C89B7B]/40 bg-[#C89B7B]/10 text-[#C89B7B] text-xs font-semibold uppercase tracking-[0.2em] mb-6 shadow-sm">
                <Crown className="w-3.5 h-3.5" />
                Coleção Exclusiva & Modesta
              </div>

              <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl leading-[0.95] text-[#2D241E] font-semibold max-w-2xl">
                Sofisticação e <span className="text-rose-gradient">Elegância</span> em Cada Detalhe.
              </h1>

              <p className="mt-6 max-w-xl text-[#2D241E]/70 text-base sm:text-lg leading-relaxed font-sans font-normal">
                Moda feminina pensada para valorizar a modéstia com requinte, conforto e caimento perfeito.
              </p>

              <div className="mt-8 flex flex-wrap gap-4 items-center">
                <button
                  onClick={scrollToProducts}
                  className="inline-flex items-center gap-2.5 bg-gradient-to-r from-[#C89B7B] to-[#B87D4B] text-white px-7 py-3.5 rounded-full text-sm font-semibold shadow-lg hover:shadow-xl hover:opacity-95 transition-all duration-300 transform hover:-translate-y-0.5 active:scale-95"
                >
                  Explorar Coleção <ArrowRight className="w-4 h-4" />
                </button>

                <Link
                  to="/categoria/vestidos"
                  className="inline-flex items-center gap-2 border border-[#C89B7B]/40 text-[#2D241E] px-6 py-3.5 rounded-full text-sm font-medium hover:bg-white hover:border-[#C89B7B] transition-all shadow-sm"
                >
                  Ver Vestidos
                </Link>
              </div>
            </div>
          </RevealOnScroll>

          {/* Destaque Visual com Moldura Rosé Gold */}
          <RevealOnScroll delay={150} direction="scale">
            <div className="relative mx-auto w-full max-w-md">
              <div className="absolute -inset-4 rounded-[3rem] bg-gradient-to-tr from-[#C89B7B]/20 via-[#FAF8F5] to-[#C89B7B]/10 blur-xl" />
              <div className="relative aspect-[4/5] rounded-[2.5rem] overflow-hidden border-2 border-[#C89B7B]/30 bg-white shadow-2xl p-2">
                <div className="relative w-full h-full rounded-[2rem] overflow-hidden bg-[#F3ECE6]">
                  <img
                    src={logoHero}
                    alt="Alexia Modesta"
                    className="w-full h-full object-cover object-center p-8 hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-x-4 bottom-4 rounded-2xl border border-white/40 bg-white/80 backdrop-blur-md p-4 shadow-lg text-center">
                    <p className="text-[#C89B7B] text-[10px] uppercase tracking-[0.25em] font-bold">
                      Alexia Modesta
                    </p>
                    <p className="text-[#2D241E] mt-0.5 font-serif text-lg font-semibold">
                      Moda Feminina de Alto Padrão
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </RevealOnScroll>
        </div>
      </section>

      {/* Faixa de Benefícios */}
      <section className="border-b border-[#C89B7B]/15 bg-white/70 backdrop-blur-sm py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 sm:grid-cols-3 gap-6">
          <RevealOnScroll delay={50} direction="up">
            <div className="flex items-center gap-3.5 p-3 rounded-2xl bg-[#FAF8F5] border border-[#C89B7B]/10">
              <div className="w-10 h-10 rounded-full bg-[#C89B7B]/15 flex items-center justify-center text-[#C89B7B]">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-[#2D241E]">Envio para Todo o Brasil</p>
                <p className="text-xs text-[#8C6347]">Entrega rápida com rastreio online</p>
              </div>
            </div>
          </RevealOnScroll>

          <RevealOnScroll delay={120} direction="up">
            <div className="flex items-center gap-3.5 p-3 rounded-2xl bg-[#FAF8F5] border border-[#C89B7B]/10">
              <div className="w-10 h-10 rounded-full bg-[#C89B7B]/15 flex items-center justify-center text-[#C89B7B]">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-[#2D241E]">Atendimento via WhatsApp</p>
                <p className="text-xs text-[#8C6347]">Consultoria de moda e suporte direto</p>
              </div>
            </div>
          </RevealOnScroll>

          <RevealOnScroll delay={190} direction="up">
            <div className="flex items-center gap-3.5 p-3 rounded-2xl bg-[#FAF8F5] border border-[#C89B7B]/10">
              <div className="w-10 h-10 rounded-full bg-[#C89B7B]/15 flex items-center justify-center text-[#C89B7B]">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-[#2D241E]">Qualidade Premium</p>
                <p className="text-xs text-[#8C6347]">Tecidos nobres e ótimo acabamento</p>
              </div>
            </div>
          </RevealOnScroll>
        </div>
      </section>

      {/* Grade de Categorias em Destaque */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-14 sm:py-18">
        <RevealOnScroll direction="up">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-[#C89B7B] text-xs uppercase tracking-[0.25em] font-semibold">
              Navegue pelas Coleções
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#2D241E] font-semibold mt-1">
              Categorias Principais
            </h2>
          </div>
        </RevealOnScroll>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {[
            { id: "saias", label: "Saias", desc: "Mídi e Evasê" },
            { id: "vestidos", label: "Vestidos", desc: "Elegância Clássica" },
            { id: "conjuntos", label: "Conjuntos", desc: "Peças Coordenadas" },
            { id: "camisas", label: "Camisas", desc: "Seda & Alfaiataria" },
            { id: "acessorios", label: "Acessórios", desc: "Cintos & Detalhes" },
          ].map((cat, idx) => (
            <RevealOnScroll key={cat.id} delay={idx * 70} direction="scale">
              <Link
                to={`/categoria/${cat.id}`}
                className="group flex flex-col items-center justify-center p-6 rounded-2xl bg-white border border-[#C89B7B]/20 hover:border-[#C89B7B] hover:shadow-lg transition-all duration-300 text-center transform hover:-translate-y-1"
              >
                <span className="w-12 h-12 rounded-full bg-[#FAF8F5] border border-[#C89B7B]/30 flex items-center justify-center text-[#C89B7B] font-serif text-xl font-bold group-hover:bg-[#C89B7B] group-hover:text-white transition-colors duration-300 mb-3">
                  {cat.label[0]}
                </span>
                <span className="font-serif text-lg font-semibold text-[#2D241E] group-hover:text-[#C89B7B] transition-colors">
                  {cat.label}
                </span>
                <span className="text-[11px] text-[#8C6347] mt-0.5">
                  {cat.desc}
                </span>
              </Link>
            </RevealOnScroll>
          ))}
        </div>
      </section>

      {/* Seção de Destaques de Produtos com Filtro */}
      <section id="destaques" className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
        <RevealOnScroll direction="up">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-10 pb-4 border-b border-[#C89B7B]/20">
            <div>
              <span className="text-[#C89B7B] text-xs uppercase tracking-[0.25em] font-semibold">
                Vitrine Exclusiva
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl text-[#2D241E] font-semibold mt-1">
                Destaques da Loja
              </h2>
            </div>
            <Link
              to="/categoria/vestidos"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#C89B7B] hover:text-[#2D241E] transition-colors"
            >
              Ver Todas as Peças <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </RevealOnScroll>

        {carregando ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="aspect-[3/4] rounded-2xl bg-[#F3ECE6] animate-pulse border border-[#C89B7B]/10"
              />
            ))}
          </div>
        ) : erro ? (
          <p className="text-red-700 text-sm font-medium">{erro}</p>
        ) : destaques.length === 0 ? (
          <p className="text-[#8C6347] text-sm">Nenhum produto disponível no momento.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {destaques.map((p, idx) => (
              <ProductCard
                key={p.id}
                produto={p}
                index={idx}
                onOpen={setProdutoAberto}
              />
            ))}
          </div>
        )}
      </section>

      {/* Banner Promocional com Gradiente Rosé */}
      <section className="my-10 max-w-7xl mx-auto px-4 sm:px-6">
        <RevealOnScroll direction="scale">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#2D241E] via-[#382E28] to-[#2D241E] text-white p-8 sm:p-14 shadow-2xl border border-[#C89B7B]/40">
            <div className="relative z-10 max-w-2xl">
              <span className="text-[#C89B7B] text-xs uppercase tracking-[0.25em] font-semibold">
                Pedido Direto no WhatsApp
              </span>
              <h2 className="font-serif text-3xl sm:text-5xl font-semibold mt-2 leading-tight">
                Monte seu carrinho e receba atendimento exclusivo.
              </h2>
              <p className="text-[#FAF8F5]/80 text-xs sm:text-sm mt-4 leading-relaxed font-sans">
                Escolha a cor, o tamanho e a quantidade desejada. Ao clicar em finalizar, tudo é formatado automaticamente para envio no nosso WhatsApp oficial.
              </p>
              <button
                onClick={scrollToProducts}
                className="mt-6 inline-flex items-center gap-2.5 bg-gradient-to-r from-[#C89B7B] to-[#B87D4B] text-white px-7 py-3 rounded-full text-sm font-semibold shadow-lg hover:opacity-95 transition-all active:scale-95"
              >
                Comprar Agora <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </RevealOnScroll>
      </section>

      {/* Módulo Instagram */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <RevealOnScroll direction="up">
          <div className="rounded-3xl border border-[#C89B7B]/30 bg-white p-8 sm:p-10 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm">
            <div>
              <p className="font-serif text-2xl text-[#2D241E] font-semibold">
                Siga a @alexiamodesta
              </p>
              <p className="text-xs sm:text-sm text-[#8C6347] mt-1">
                Fique por dentro das novidades, provadores e lançamentos diários.
              </p>
            </div>
            <a
              href="https://www.instagram.com/alexiamodesta/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2.5 border border-[#C89B7B]/40 text-[#2D241E] px-6 py-3 rounded-full text-sm font-semibold hover:bg-[#C89B7B] hover:text-white transition-all shadow-sm"
            >
              <FaInstagram className="w-4 h-4" /> Instagram Oficial
            </a>
          </div>
        </RevealOnScroll>
      </section>

      {produtoAberto && (
        <ProductModal
          produto={produtoAberto}
          onClose={() => setProdutoAberto(null)}
        />
      )}
    </main>
  );
}
