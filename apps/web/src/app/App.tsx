import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AdminPage } from "@/pages/AdminPage";
import { AppShell } from "@/components/layout/AppShell";
import { LandingPage } from "@/pages/LandingPage";
import { ProductDetailsPage } from "@/pages/ProductDetailsPage";
import { ShopAllPage } from "@/pages/ShopAllPage";

export function App() {
  return (
    <BrowserRouter>
      <AppShell>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/shop/all" element={<ShopAllPage />} />
          <Route path="/products/:productId" element={<ProductDetailsPage />} />
          <Route path="/admin" element={<AdminPage />} />
        </Routes>
      </AppShell>
    </BrowserRouter>
  );
}