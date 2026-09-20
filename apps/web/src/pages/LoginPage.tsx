import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useCustomer } from '@/features/customer/hooks/useCustomer';

export function LoginPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { customer, login, isLoading } = useCustomer();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  // Already logged in — redirect to account
  if (customer != null) {
    return <Navigate to={'/account'} replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      await login(email, password);
      void navigate('/account');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    }
  };

  return (
    <section className="mx-auto max-w-md px-4 py-16">
      <div className="rounded border border-[#e5e2d8] bg-white px-6 py-10 md:px-10">
        <h1 className="font-heading text-2xl font-semibold text-[#1c1c15]">
          {t('auth.loginTitle')}
        </h1>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          {error != null && (
            <p className="rounded border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </p>
          )}

          <div>
            <label
              htmlFor="login-email"
              className="mb-1.5 block text-sm font-medium text-[#504533]"
            >
              {t('auth.email')}
            </label>
            <input
              id="login-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-10 w-full rounded-lg border border-[#d4c4ac] bg-white px-3 text-sm text-[#1c1c15] outline-none transition focus:border-[#f4b400] focus:ring-1 focus:ring-[#f4b400]"
              placeholder={t('auth.emailPlaceholder')}
            />
          </div>

          <div>
            <div className="flex items-baseline justify-between">
              <label
                htmlFor="login-password"
                className="mb-1.5 block text-sm font-medium text-[#504533]"
              >
                {t('auth.password')}
              </label>
              <Link
                to="/forgot-password"
                className="mb-1.5 text-sm text-[#7a5900] underline underline-offset-2 hover:text-[#1c1c15]"
              >
                {t('auth.forgotPasswordLink')}
              </Link>
            </div>
            <input
              id="login-password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-10 w-full rounded-lg border border-[#d4c4ac] bg-white px-3 text-sm text-[#1c1c15] outline-none transition focus:border-[#f4b400] focus:ring-1 focus:ring-[#f4b400]"
              placeholder={t('auth.passwordPlaceholder')}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded bg-[#f4b400] px-5 py-3 text-sm font-semibold tracking-[0.08em] text-[#1c1c15] uppercase transition hover:brightness-95 disabled:opacity-50"
          >
            {isLoading ? '...' : t('auth.loginButton')}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-[#504533]">
          {t('auth.noAccount')}{' '}
          <Link
            to="/register"
            className="font-medium text-[#7a5900] underline underline-offset-2 hover:text-[#1c1c15]"
          >
            {t('auth.registerLink')}
          </Link>
        </p>
      </div>
    </section>
  );
}
