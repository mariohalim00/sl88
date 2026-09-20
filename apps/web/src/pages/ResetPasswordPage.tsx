import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useCustomer } from '@/features/customer/hooks/useCustomer';

export function ResetPasswordPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { customer, resetPassword, isLoading, error } = useCustomer();
  const [searchParams] = useSearchParams();
  const resetUrl = searchParams.get('url');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);

  if (resetUrl == null) {
    return (
      <section className="mx-auto max-w-md px-4 py-16">
        <div className="rounded border border-[#e5e2d8] bg-white px-6 py-10 text-center md:px-10">
          <h1 className="font-heading text-2xl font-semibold text-[#1c1c15]">
            {t('auth.resetPasswordTitle')}
          </h1>
          <p className="mt-4 text-sm text-[#504533]">
            {t('auth.resetPasswordInvalidLink')}
          </p>
          <Link
            to="/forgot-password"
            className="mt-6 inline-block rounded bg-[#f4b400] px-5 py-3 text-sm font-semibold tracking-[0.08em] text-[#1c1c15] uppercase transition hover:brightness-95"
          >
            {t('auth.resetPasswordRequestNew')}
          </Link>
        </div>
      </section>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    if (password !== confirmPassword) {
      setValidationError(t('auth.resetPasswordMismatch'));
      return;
    }

    try {
      await resetPassword(resetUrl, password);
      void navigate('/account');
    } catch {
      // error already surfaced via useCustomer hook state
    }
  };

  const displayError = validationError ?? error;

  return (
    <section className="mx-auto max-w-md px-4 py-16">
      <div className="rounded border border-[#e5e2d8] bg-white px-6 py-10 md:px-10">
        <h1 className="font-heading text-2xl font-semibold text-[#1c1c15]">
          {t('auth.resetPasswordTitle')}
        </h1>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          {displayError != null && (
            <div className="space-y-3">
              <p className="rounded border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {displayError}
              </p>
              <Link
                to="/forgot-password"
                className="block text-center text-sm font-medium text-[#7a5900] underline underline-offset-2 hover:text-[#1c1c15]"
              >
                {t('auth.resetPasswordRequestNew')}
              </Link>
            </div>
          )}

          <div>
            <label
              htmlFor="reset-password"
              className="mb-1.5 block text-sm font-medium text-[#504533]"
            >
              {t('auth.resetPasswordNewPassword')}
            </label>
            <input
              id="reset-password"
              type="password"
              required
              minLength={5}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-10 w-full rounded-lg border border-[#d4c4ac] bg-white px-3 text-sm text-[#1c1c15] outline-none transition focus:border-[#f4b400] focus:ring-1 focus:ring-[#f4b400]"
              placeholder={t('auth.passwordPlaceholder')}
            />
          </div>

          <div>
            <label
              htmlFor="reset-confirm-password"
              className="mb-1.5 block text-sm font-medium text-[#504533]"
            >
              {t('auth.resetPasswordConfirmPassword')}
            </label>
            <input
              id="reset-confirm-password"
              type="password"
              required
              minLength={5}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="h-10 w-full rounded-lg border border-[#d4c4ac] bg-white px-3 text-sm text-[#1c1c15] outline-none transition focus:border-[#f4b400] focus:ring-1 focus:ring-[#f4b400]"
              placeholder={t('auth.resetPasswordConfirmPlaceholder')}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded bg-[#f4b400] px-5 py-3 text-sm font-semibold tracking-[0.08em] text-[#1c1c15] uppercase transition hover:brightness-95 disabled:opacity-50"
          >
            {isLoading ? '...' : t('auth.resetPasswordButton')}
          </button>
        </form>
      </div>
    </section>
  );
}
