import { NavLink } from "react-router-dom";
import { Search, ShoppingCart } from "lucide-react";
import logo from "../assets/modesta.svg";
import { useCatalogContext } from "../controllers/CatalogContext";

interface Props {
  termo: string;
  setTermo: (v: string) => void;
  cartCount: number;
  onOpenCart: () => void;
}

export function Navbar({ termo, setTermo, cartCount, onOpenCart }: Props) {
  const { categorias } = useCatalogContext();

  return (
    <header className="sticky top-0 z-40 bg-[#14161B]/95 backdrop-blur border-b border-white/10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center gap-4 flex-wrap">
        <div className="w-22 h-10 rounded-3xl overflow-hidden">
          <img src={logo} alt="Logo" className="w-full h-full object-cover scale-110" />
        </div>

        <div className="flex-1 min-w-[160px] order-3 sm:order-none w-full sm:w-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
            <input
              value={termo}
              onChange={(e) => setTermo(e.target.value)}
              placeholder="Procurar produtos..."
              className="w-full bg-white/5 border border-white/10 rounded-full pl-9 pr-4 py-2 text-sm text-[#F5F3EE] placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#E8B84B]/60"
            />
          </div>
        </div>

        <button
          onClick={onOpenCart}
          className="relative flex items-center gap-2 bg-[#E8B84B] text-[#14161B] font-medium text-sm px-4 py-2 rounded-full hover:brightness-95 transition"
        >
          <ShoppingCart className="w-4 h-4" />
          Carrinho
          {cartCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-[#c94a3d] text-white text-[11px] w-5 h-5 rounded-full flex items-center justify-center">
              {cartCount}
            </span>
          )}
        </button>
      </div>

      <nav className="max-w-6xl mx-auto px-4 sm:px-6 pb-3 flex gap-2 overflow-x-auto no-scrollbar">
        {categorias.map((c) => (
          <NavLink
            key={c.id}
            to={`/categoria/${c.id}`}
            className={({ isActive }) =>
              `whitespace-nowrap px-3.5 py-1.5 rounded-full text-sm border transition ${
                isActive
                  ? "bg-[#F5F3EE] text-[#14161B] border-[#F5F3EE]"
                  : "border-white/15 text-white/70 hover:border-white/40 hover:text-white"
              }`
            }
          >
            {c.label}
          </NavLink>
        ))}
      </nav>
    </header>
  );
}
