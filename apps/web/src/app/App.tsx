import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { AppShell } from '@/components/layout/AppShell';
import { AccountPage } from '@/pages/AccountPage';
import { AdminPage } from '@/pages/AdminPage';
import { CheckoutResultPage } from '@/pages/CheckoutResultPage';
import { ForgotPasswordPage } from '@/pages/ForgotPasswordPage';
import { LandingPage } from '@/pages/LandingPage';
import { LoginPage } from '@/pages/LoginPage';
import { NotFoundPage } from '@/pages/NotFoundPage';
import { ProductDetailsPage } from '@/pages/ProductDetailsPage';
import { RegisterPage } from '@/pages/RegisterPage';
import { ResetPasswordPage } from '@/pages/ResetPasswordPage';
import { ShopAllPage } from '@/pages/ShopAllPage';

export function App() {
  return (
    <BrowserRouter>
      <AppShell>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/shop/all" element={<ShopAllPage />} />
          <Route path="/products/:handle" element={<ProductDetailsPage />} />
          <Route path="/checkout/result" element={<CheckoutResultPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/account" element={<AccountPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </AppShell>
    </BrowserRouter>
  );
}
