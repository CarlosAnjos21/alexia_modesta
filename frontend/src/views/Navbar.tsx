import { NavLink, Link } from "react-router-dom";
import { Search, ShoppingCart, Menu, X } from "lucide-react";
import { useState } from "react";
import logoImg from "../assets/alexia.png";
import { useCatalogContext } from "../controllers/CatalogContext";

interface Props {
  termo: string;
  setTermo: (v: string) => void;
  cartCount: number;
  onOpenCart: () => void;
}

const MENU_CATEGORIES = [
  { id: "saias", label: "Saias" },
  { id: "vestidos", label: "Vestidos" },
  { id: "conjuntos", label: "Conjuntos" },
  { id: "camisas", label: "Camisas" },
  { id: "acessorios", label: "Acessórios" },
];

export function Navbar({ termo, setTermo, cartCount, onOpenCart }: Props) {
  const { categorias } = useCatalogContext();
  const [menuOpen, setMenuOpen] = useState(false);

  // Garante que todas as categorias solicitadas apareçam no menu
  const navCategories = MENU_CATEGORIES.map((cat) => {
    const found = categorias.find((c) => c.id === cat.id);
    return found || cat;
  });

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTermo(e.target.value);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FAF8F5]/90 backdrop-blur-md border-b border-[#C89B7B]/20 shadow-sm transition-colors duration-300">
      {/* Top Banner Informativo Sofisticado */}
      <div className="bg-[#2D241E] text-[#FAF8F5] text-[11px] uppercase tracking-widest py-1.5 px-4 text-center font-medium">
        Frete Grátis nas compras acima de R$ 299 | Parcelamento em até 6x sem juros
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between gap-4">
        {/* Logo & Marca */}
        <Link to="/" className="shrink-0 flex items-center gap-3 group" aria-label="Alexia Modesta">
          <div className="w-11 h-11 rounded-full overflow-hidden border border-[#C89B7B]/40 p-0.5 bg-white shadow-sm transition-transform duration-300 group-hover:scale-105">
            <img src={logoImg} alt="Alexia Modesta" className="w-full h-full object-cover rounded-full" />
          </div>
          <div className="flex flex-col">
            <span className="font-serif text-xl sm:text-2xl font-semibold tracking-wide text-[#2D241E] leading-tight">
              Alexia Modesta
            </span>
            <span className="text-[9px] uppercase tracking-[0.25em] text-[#C89B7B] font-semibold -mt-0.5">
              Moda Feminina
            </span>
          </div>
        </Link>

        {/* Links de Navegação Principal (Desktop) */}
        <nav className="hidden lg:flex items-center gap-6 xl:gap-8 text-sm font-medium text-[#2D241E]/80">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              isActive
                ? "text-[#C89B7B] font-semibold border-b-2 border-[#C89B7B] pb-1 transition-all"
                : "hover:text-[#C89B7B] transition-colors pb-1"
            }
          >
            Início
          </NavLink>

          {navCategories.map((c) => (
            <NavLink
              key={c.id}
              to={`/categoria/${c.id}`}
              className={({ isActive }) =>
                isActive
                  ? "text-[#C89B7B] font-semibold border-b-2 border-[#C89B7B] pb-1 transition-all"
                  : "hover:text-[#C89B7B] transition-colors pb-1"
              }
            >
              {c.label}
            </NavLink>
          ))}
        </nav>

        {/* Barra de Pesquisa & Botão do Carrinho */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Campo de Busca em Telas Médias/Grandes */}
          <div className="relative hidden md:block w-48 lg:w-64">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8C6347]/60" />
            <input
              type="text"
              value={termo}
              onChange={handleSearchChange}
              placeholder="Buscar modelos..."
              className="w-full bg-[#F3ECE6] border border-[#C89B7B]/30 rounded-full pl-9 pr-4 py-2 text-xs text-[#2D241E] placeholder-[#8C6347]/50 focus:outline-none focus:ring-2 focus:ring-[#C89B7B]/50 focus:bg-white transition-all shadow-inner"
            />
            {termo && (
              <button
                onClick={() => setTermo("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#8C6347] hover:text-[#2D241E]"
              >
                ×
              </button>
            )}
          </div>

          {/* Botão Carrinho com Gradiente Rosé */}
          <button
            onClick={onOpenCart}
            className="relative inline-flex items-center gap-2 bg-gradient-to-r from-[#C89B7B] to-[#B87D4B] text-white font-medium text-xs sm:text-sm px-4 py-2.5 rounded-full shadow-md hover:opacity-95 hover:shadow-lg transition-all duration-200 active:scale-95"
            aria-label="Abrir Carrinho"
          >
            <ShoppingCart className="w-4 h-4" />
            <span className="hidden sm:inline tracking-wide font-sans">Carrinho</span>
            {cartCount > 0 && (
              <span className="bg-[#2D241E] text-[#FAF8F5] text-[10px] font-bold min-w-5 h-5 px-1.5 rounded-full flex items-center justify-center border border-[#C89B7B]/40">
                {cartCount}
              </span>
            )}
          </button>

          {/* Botão Hambúrguer Mobile */}
          <button
            className="lg:hidden w-10 h-10 rounded-full border border-[#C89B7B]/30 flex items-center justify-center text-[#2D241E] hover:bg-[#F3ECE6] transition"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Abrir menu"
          >
            {menuOpen ? <X className="w-5 h-5 text-[#C89B7B]" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Busca Mobile (Abaixo do header) */}
      <div className="md:hidden px-4 pb-3 pt-1">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8C6347]/60" />
          <input
            type="text"
            value={termo}
            onChange={handleSearchChange}
            placeholder="Buscar por vestidos, saias, conjuntos..."
            className="w-full bg-[#F3ECE6] border border-[#C89B7B]/30 rounded-full pl-9 pr-4 py-2 text-xs text-[#2D241E] placeholder-[#8C6347]/50 focus:outline-none focus:ring-2 focus:ring-[#C89B7B]/40 shadow-inner"
          />
        </div>
      </div>

      {/* Menu Mobile Retrátil */}
      {menuOpen && (
        <nav className="lg:hidden border-t border-[#C89B7B]/20 bg-[#FAF8F5] px-6 py-5 flex flex-col gap-4 shadow-xl animate-fadeIn">
          <Link
            to="/"
            onClick={() => setMenuOpen(false)}
            className="text-base font-serif text-[#2D241E] hover:text-[#C89B7B] border-b border-[#C89B7B]/10 pb-2"
          >
            Início
          </Link>
          {navCategories.map((c) => (
            <Link
              key={c.id}
              to={`/categoria/${c.id}`}
              onClick={() => setMenuOpen(false)}
              className="text-base font-serif text-[#2D241E]/80 hover:text-[#C89B7B] border-b border-[#C89B7B]/10 pb-2 flex items-center justify-between"
            >
              <span>{c.label}</span>
              <span className="text-xs text-[#C89B7B]">→</span>
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
