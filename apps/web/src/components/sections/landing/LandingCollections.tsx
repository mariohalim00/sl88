import { useTranslation } from 'react-i18next';

const categoryHighlights = [
  {
    titleKey: 'landing.collections.antiSlipCarpetsTitle',
    descriptionKey: 'landing.collections.antiSlipCarpetsDescription',
    imageUrl:
      '/public/branding/Collections/1920 X 1080 - KARET RUMAH TANGGA 02.png',
  },
  {
    titleKey: 'landing.collections.noodleCarpetsTitle',
    descriptionKey: 'landing.collections.noodleCarpetsDescription',
    imageUrl: '/public/branding/Collections/1920 X 1080 - KARPET BIHUN.png',
  },
  {
    titleKey: 'landing.collections.carCarpetsTitle',
    descriptionKey: 'landing.collections.carCarpetsDescription',
    imageUrl: '/public/branding/Collections/1920 X 1080 - KARPET MOBIL.png',
  },
  {
    titleKey: 'landing.collections.sTypeCarpetsTitle',
    descriptionKey: 'landing.collections.sTypeCarpetsDescription',
    imageUrl: '/public/branding/Collections/1920 x 1080 - S TYPE.png',
  },
];

export function LandingCollections() {
  const { t } = useTranslation();

  return (
    <section id="collection" className="space-y-8 md:space-y-10">
      <div className="space-y-2 text-center">
        <h2 className="font-heading text-3xl font-semibold text-[#1c1c15] md:text-4xl">
          {t('landing.collections.title')}
        </h2>
        <p className="mx-auto max-w-2xl text-sm text-[#504533] md:text-base">
          {t('landing.collections.description')}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-6 md:auto-rows-[280px]">
        {categoryHighlights.map((item, index) => (
          <article
            key={item.titleKey}
            className={[
              'group relative overflow-hidden rounded-xl',
              index === 0 ? 'md:row-span-2' : '',
              index === 3 ? 'md:col-span-2' : '',
            ].join(' ')}
          >
            <img
              src={item.imageUrl}
              alt={t(item.titleKey)}
              className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent" />
            <div className="absolute right-0 bottom-0 left-0 p-6 text-white md:p-8">
              <h3 className="font-heading text-2xl font-medium">
                {t(item.titleKey)}
              </h3>
              <p className="mt-1 text-sm text-white/85 md:text-base">
                {t(item.descriptionKey)}
              </p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
