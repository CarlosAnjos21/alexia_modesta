import { useState } from "react";
import { Routes, Route, Navigate, Link } from "react-router-dom";
import { CatalogProvider, useCatalogContext } from "./controllers/CatalogContext";
import { CartProvider, useCartContext } from "./controllers/CartContext";
import { Navbar } from "./views/Navbar";
import { CartDrawer } from "./views/CartDrawer";
import { CategoryPage } from "./pages/CategoryPage";
import { AdminPage } from "./pages/AdminPage";

function AppContent() {
  const [termo, setTermo] = useState("");
  const [carrinhoAberto, setCarrinhoAberto] = useState(false);
  const { categorias } = useCatalogContext();
  const { cartCount } = useCartContext();

  const primeiraCategoria = categorias[0]?.id ?? "";

  return (
    <div className="min-h-screen bg-[#14161B]">
      <Navbar
        termo={termo}
        setTermo={setTermo}
        cartCount={cartCount}
        onOpenCart={() => setCarrinhoAberto(true)}
      />

      <Routes>
        <Route path="/" element={<Navigate to={`/categoria/${primeiraCategoria}`} replace />} />
        <Route path="/categoria/:categoriaId" element={<CategoryPage termo={termo} />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="*" element={<Navigate to={`/categoria/${primeiraCategoria}`} replace />} />
      </Routes>

      <CartDrawer open={carrinhoAberto} onClose={() => setCarrinhoAberto(false)} />

      <footer className="border-t border-white/10 py-8 text-center text-white/30 text-xs flex flex-col items-center gap-2">
        <span>Alexia Modesta — moda feminina</span>
        <Link to="/admin" className="hover:text-white/60 transition">Área administrativa</Link>
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
