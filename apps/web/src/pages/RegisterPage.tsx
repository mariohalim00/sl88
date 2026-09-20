import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { useCustomer } from '@/features/customer/hooks/useCustomer';

export function RegisterPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { customer, register, isLoading } = useCustomer();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  // Already logged in — redirect to account
  if (customer != null) {
    void navigate('/account', { replace: true });
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      await register({ firstName, lastName, email, password });
      void navigate('/account');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    }
  };

  return (
    <section className="mx-auto max-w-md px-4 py-16">
      <div className="rounded border border-[#e5e2d8] bg-white px-6 py-10 md:px-10">
        <h1 className="font-heading text-2xl font-semibold text-[#1c1c15]">
          {t('auth.registerTitle')}
        </h1>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          {error != null && (
            <p className="rounded border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </p>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="register-firstName"
                className="mb-1.5 block text-sm font-medium text-[#504533]"
              >
                {t('auth.firstName')}
              </label>
              <input
                id="register-firstName"
                type="text"
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="h-10 w-full rounded-lg border border-[#d4c4ac] bg-white px-3 text-sm text-[#1c1c15] outline-none transition focus:border-[#f4b400] focus:ring-1 focus:ring-[#f4b400]"
              />
            </div>
            <div>
              <label
                htmlFor="register-lastName"
                className="mb-1.5 block text-sm font-medium text-[#504533]"
              >
                {t('auth.lastName')}
              </label>
              <input
                id="register-lastName"
                type="text"
                required
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="h-10 w-full rounded-lg border border-[#d4c4ac] bg-white px-3 text-sm text-[#1c1c15] outline-none transition focus:border-[#f4b400] focus:ring-1 focus:ring-[#f4b400]"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="register-email"
              className="mb-1.5 block text-sm font-medium text-[#504533]"
            >
              {t('auth.email')}
            </label>
            <input
              id="register-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-10 w-full rounded-lg border border-[#d4c4ac] bg-white px-3 text-sm text-[#1c1c15] outline-none transition focus:border-[#f4b400] focus:ring-1 focus:ring-[#f4b400]"
              placeholder={t('auth.emailPlaceholder')}
            />
          </div>

          <div>
            <label
              htmlFor="register-password"
              className="mb-1.5 block text-sm font-medium text-[#504533]"
            >
              {t('auth.password')}
            </label>
            <input
              id="register-password"
              type="password"
              required
              minLength={5}
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
            {isLoading ? '...' : t('auth.registerButton')}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-[#504533]">
          {t('auth.hasAccount')}{' '}
          <Link
            to="/login"
            className="font-medium text-[#7a5900] underline underline-offset-2 hover:text-[#1c1c15]"
          >
            {t('auth.loginLink')}
          </Link>
        </p>
      </div>
    </section>
  );
}
