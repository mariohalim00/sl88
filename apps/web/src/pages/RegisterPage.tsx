import { useTranslation } from 'react-i18next';
import { Link, Navigate } from 'react-router-dom';
import { useCustomer } from '@/features/customer/hooks/useCustomer';

export function RegisterPage() {
  const { t } = useTranslation();
  const { customer, signIn } = useCustomer();

  // Already logged in — redirect to account
  if (customer != null) {
    return <Navigate to={'/account'} replace />;
  }

  return (
    <section className="mx-auto max-w-md px-4 py-16">
      <div className="rounded border border-[#e5e2d8] bg-white px-6 py-10 md:px-10">
        <h1 className="font-heading text-2xl font-semibold text-[#1c1c15]">
          {t('auth.registerTitle')}
        </h1>

        <p className="mt-4 text-sm text-[#504533]">{t('auth.registerHint')}</p>

        <button
          type="button"
          onClick={() => signIn()}
          className="mt-8 w-full rounded bg-[#f4b400] px-5 py-3 text-sm font-semibold tracking-[0.08em] text-[#1c1c15] uppercase transition hover:brightness-95"
        >
          {t('auth.signInWithCode')}
        </button>

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
