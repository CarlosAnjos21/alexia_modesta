import { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { CATEGORIES } from "./models/Category";
import { CartProvider, useCartContext } from "./controllers/CartContext";
import { Navbar } from "./views/Navbar";
import { CartDrawer } from "./views/CartDrawer";
import { CategoryPage } from "./pages/CategoryPage";

function AppContent() {
  const [termo, setTermo] = useState("");
  const [carrinhoAberto, setCarrinhoAberto] = useState(false);
  const { cartCount } = useCartContext();

  return (
    <div className="min-h-screen bg-[#14161B]">
      <Navbar
        termo={termo}
        setTermo={setTermo}
        cartCount={cartCount}
        onOpenCart={() => setCarrinhoAberto(true)}
      />

      <Routes>
        <Route path="/" element={<Navigate to={`/categoria/${CATEGORIES[0].id}`} replace />} />
        <Route path="/categoria/:categoriaId" element={<CategoryPage termo={termo} />} />
        <Route path="*" element={<Navigate to={`/categoria/${CATEGORIES[0].id}`} replace />} />
      </Routes>

      <CartDrawer open={carrinhoAberto} onClose={() => setCarrinhoAberto(false)} />

      <footer className="border-t border-white/10 py-8 text-center text-white/30 text-xs">
        ORBE — vitrine de demonstração multi-categoria
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <CartProvider>
      <AppContent />
    </CartProvider>
  );
}
