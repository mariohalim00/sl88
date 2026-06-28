import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

export function NotFoundPage() {
  const { t } = useTranslation();

  return (
    <section className="mx-auto max-w-2xl rounded border border-dashed border-[#d4c4ac] bg-white px-6 py-14 text-center md:px-10">
      <p className="text-xs font-semibold tracking-[0.18em] text-[#7a5900] uppercase">
        404
      </p>
      <h1 className="mt-4 font-heading text-3xl font-semibold text-[#1c1c15] md:text-4xl">
        {t('notFound.title')}
      </h1>
      <p className="mt-3 text-sm leading-relaxed text-[#504533] md:text-base">
        {t('notFound.description')}
      </p>

      <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
        <Link
          to="/"
          className="rounded bg-[#f4b400] px-5 py-3 text-sm font-semibold tracking-[0.08em] text-[#1c1c15] uppercase transition hover:brightness-95"
        >
          {t('notFound.backHome')}
        </Link>
        <Link
          to="/shop/all"
          className="rounded border border-[#1c1c15] px-5 py-3 text-sm font-semibold tracking-[0.08em] text-[#1c1c15] uppercase transition hover:bg-[#f7f4e9]"
        >
          {t('notFound.backCatalog')}
        </Link>
      </div>
    </section>
  );
}
