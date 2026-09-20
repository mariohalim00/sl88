import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, Navigate } from 'react-router-dom';
import { recoverCustomerPassword } from '@/features/customer/api/customer';
import { useCustomer } from '@/features/customer/hooks/useCustomer';

export function ForgotPasswordPage() {
  const { t } = useTranslation();
  const { customer } = useCustomer();

  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Already logged in — redirect to account
  if (customer != null) {
    return <Navigate to={'/account'} replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await recoverCustomerPassword(email);
      setSubmitted(true);
    } catch {
      // Always show the generic confirmation regardless of outcome.
      setSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="mx-auto max-w-md px-4 py-16">
      <div className="rounded border border-[#e5e2d8] bg-white px-6 py-10 md:px-10">
        <h1 className="font-heading text-2xl font-semibold text-[#1c1c15]">
          {t('auth.forgotPasswordTitle')}
        </h1>

        {submitted ? (
          <div className="mt-8 space-y-5">
            <p className="rounded border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
              {t('auth.forgotPasswordSent')}
            </p>
            <Link
              to="/login"
              className="block text-center text-sm font-medium text-[#7a5900] underline underline-offset-2 hover:text-[#1c1c15]"
            >
              {t('auth.loginLink')}
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <p className="text-sm text-[#504533]">
              {t('auth.forgotPasswordHint')}
            </p>

            <div>
              <label
                htmlFor="forgot-email"
                className="mb-1.5 block text-sm font-medium text-[#504533]"
              >
                {t('auth.email')}
              </label>
              <input
                id="forgot-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-10 w-full rounded-lg border border-[#d4c4ac] bg-white px-3 text-sm text-[#1c1c15] outline-none transition focus:border-[#f4b400] focus:ring-1 focus:ring-[#f4b400]"
                placeholder={t('auth.emailPlaceholder')}
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded bg-[#f4b400] px-5 py-3 text-sm font-semibold tracking-[0.08em] text-[#1c1c15] uppercase transition hover:brightness-95 disabled:opacity-50"
            >
              {isSubmitting ? '...' : t('auth.forgotPasswordButton')}
            </button>

            <p className="text-center text-sm text-[#504533]">
              <Link
                to="/login"
                className="font-medium text-[#7a5900] underline underline-offset-2 hover:text-[#1c1c15]"
              >
                {t('auth.loginLink')}
              </Link>
            </p>
          </form>
        )}
      </div>
    </section>
  );
}
