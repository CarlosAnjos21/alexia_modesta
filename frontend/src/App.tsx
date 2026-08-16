import { useState } from "react";
import { Routes, Route, Navigate, Link } from "react-router-dom";
import { CatalogProvider } from "./controllers/CatalogContext";
import { CartProvider, useCartContext } from "./controllers/CartContext";
import { Navbar } from "./views/Navbar";
import { CartDrawer } from "./views/CartDrawer";
import { CategoryPage } from "./pages/CategoryPage";
import { HomePage } from "./pages/HomePage";
import { AdminPage } from "./pages/AdminPage";

function AppContent() {
  const [termo, setTermo] = useState("");
  const [carrinhoAberto, setCarrinhoAberto] = useState(false);
  const { cartCount } = useCartContext();

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#2D241E] flex flex-col font-sans selection:bg-[#C89B7B]/30 selection:text-[#2D241E]">
      <Navbar
        termo={termo}
        setTermo={setTermo}
        cartCount={cartCount}
        onOpenCart={() => setCarrinhoAberto(true)}
      />

      <div className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/categoria/:categoriaId" element={<CategoryPage termo={termo} />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>

      <CartDrawer open={carrinhoAberto} onClose={() => setCarrinhoAberto(false)} />

      {/* Rodapé Sofisticado */}
      <footer className="border-t border-[#C89B7B]/20 bg-[#FAF8F5] py-12 text-center text-[#8C6347] text-xs flex flex-col items-center gap-3">
        <div className="flex items-center gap-2">
          <span className="font-serif text-lg text-[#2D241E] font-semibold">Alexia Modesta</span>
          <span className="text-[#C89B7B]">|</span>
          <span className="text-[11px] uppercase tracking-wider text-[#C89B7B]">Moda Feminina</span>
        </div>
        <p className="max-w-md text-[#8C6347]/80 text-[11px] leading-relaxed">
          Peças exclusivas desenvolvidas com foco em modéstia, elegância e acabamento impecável.
        </p>
        <div className="flex items-center gap-4 mt-2">
          <Link to="/" className="hover:text-[#C89B7B] transition-colors">Início</Link>
          <Link to="/categoria/vestidos" className="hover:text-[#C89B7B] transition-colors">Vestidos</Link>
          <Link to="/categoria/saias" className="hover:text-[#C89B7B] transition-colors">Saias</Link>
          <Link to="/admin" className="hover:text-[#C89B7B] transition-colors font-medium">Área Administrativa</Link>
        </div>
        <p className="text-[10px] text-[#8C6347]/60 mt-4">
          © {new Date().getFullYear()} Alexia Modesta. Todos os direitos reservados.
        </p>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <CatalogProvider>
      <CartProvider>
        <AppContent />
      </CartProvider>
    </CatalogProvider>
  );
}
