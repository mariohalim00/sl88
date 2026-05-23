import { useTranslation } from 'react-i18next';

const categoryHighlights = [
  {
    titleKey: 'landing.collections.kitchenCarpetsTitle',
    descriptionKey: 'landing.collections.kitchenCarpetsDescription',
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuA2yCQFSVkJrujFwwzmkO9diuP0QodGZXJ2_-5NDnRtDxTnY5YHmwh5aQqPPYLeJ0fItj618nbj0r0oqDHAa_nrtTahQI2BsPrwWw3UQ10NUzwsMROMo_Mr-z00sGeFidlhIAV8atK9tGOoLmliVAEVQY8GByW4wnLOxaSwxKbWVmQSaJl2YM2IBWyujmsFcEwXnVAYByzzCwwXGqRhoWqL0drmcmXYjoYKvhgTfogU24ObuHI4HiW1qCZLV9Q1cyQ9hq1pD-3kgQA',
  },
  {
    titleKey: 'landing.collections.welcomeMatsTitle',
    descriptionKey: 'landing.collections.welcomeMatsDescription',
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDhRkrxOYKq3bup1QF0fnR8crOQ4utEmJlkGin-byrbn4imyBTv7r2ri3tgA2J_9PxJmH3N9XzjIkHqfCEqHfHH_zocw64M9pJ9aY7uDcqgOXCFMlZXp59OTZZ4k9hG2bGjQZflnF0pzpjl-trbEMMgd_zwzPMc0MUiVUGpVHBV42G7EOGm3SbkmU2KGPSInlRslaUULgrLSZVvzijExUQElXSQaUYRmzWPjLAJ4y-7qgp7-YhFDXnqBVMXazP7DgMxTPFTnGQSbzc',
  },
  {
    titleKey: 'landing.collections.carCarpetsTitle',
    descriptionKey: 'landing.collections.carCarpetsDescription',
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuA24MSxRx5eE-JPbt_ur5puVCu4IaQb-SJl-8pJobxafPvfkUQPO_LSwWwJLyBlLDJVfE7wedrq5g_zi_T9875vk56uCXDfR5hvKx-5i8iDqK1VArO5UQ9rwZXgt-bYzYD-usqqKzK16VbtyXHw0abpqbvsEC-nnXGaxPEEmGxz6FjLW4JdpXMvcn--4FJOp4yLxe5XD3conScZs0kI8iJuq7LOaIOq9wpGpsSO-1zexJsE9-lH1WG2QuqsKGPBkhO2kOdgewid3Xc',
  },
  {
    titleKey: 'landing.collections.bespokeCollectionTitle',
    descriptionKey: 'landing.collections.bespokeCollectionDescription',
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBt5c2NFj1J8sZIt3l0sv7r9YAVgsCbYyodiZWT0MZnweWBZDosBUmaoLOWefJ44iWPEfg5tDRjYr5dDy1vIIZcBd1fnPMuh_70Mc9Y5LfCDDguq-2BP8kBK_HmyiLcY0KaPUBeDW46kxaprpYvii-0UwMzbSPAXR4GagM4c5-mgrEbEfG5yXBGMCT62O7OORLgem6vMscBZi4Qb5hjCgTsgwYDy1-W-5ERsWItYNU_w-EJqEjvuqsaEiho7QbHTMHTIM6uWpuJ5MI',
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
