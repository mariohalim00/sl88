import { useTranslation } from 'react-i18next';

type ShopAllFilterBarProps = {
  searchTerm: string;
  totalItems: number;
  onSearchChange: (value: string) => void;
};

const quickFilters = [
  { key: 'shopAllFilter.quickFilters.kitchen', value: 'kitchen' },
  { key: 'shopAllFilter.quickFilters.welcomeMats', value: 'welcomeMats' },
  { key: 'shopAllFilter.quickFilters.outdoor', value: 'outdoor' },
  { key: 'shopAllFilter.quickFilters.wool', value: 'wool' },
  { key: 'shopAllFilter.quickFilters.silk', value: 'silk' },
  { key: 'shopAllFilter.quickFilters.jute', value: 'jute' },
];

export function ShopAllFilterBar({
  searchTerm,
  totalItems,
  onSearchChange,
}: ShopAllFilterBarProps) {
  const { t } = useTranslation();

  return (
    <div className="space-y-4">
      <div className="flex gap-2 overflow-x-auto pb-2">
        {quickFilters.map((filter) => (
          <button
            key={filter.value}
            type="button"
            className={[
              'whitespace-nowrap rounded-full border px-4 py-1.5 text-xs font-semibold tracking-[0.08em] uppercase',
              filter.value === 'silk'
                ? 'border-[#f4b400] bg-[#f4b400]/10 text-[#7a5900]'
                : 'border-[#d4c4ac] bg-[#f7f4e9] text-[#504533]',
            ].join(' ')}
          >
            {t(filter.key)}
          </button>
        ))}
      </div>

      <div className="grid gap-3 md:grid-cols-[1fr_auto_auto]">
        <input
          value={searchTerm}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder={t('shopAllFilter.searchPlaceholder')}
          aria-label={t('shopAllFilter.searchAria')}
          className="h-11 rounded border border-[#d4c4ac] bg-white px-3 text-sm text-[#1c1c15] placeholder:text-[#504533]/70 focus:border-[#f4b400] focus:outline-none"
        />
        <div className="flex h-11 items-center rounded border border-[#d4c4ac] bg-white px-4 text-sm text-[#504533]">
          {t('shopAllFilter.itemsInBag', { count: totalItems })}
        </div>
        <div className="relative">
          <select className="h-11 w-full appearance-none rounded border border-[#d4c4ac] bg-white px-4 pr-9 text-sm text-[#1c1c15] focus:border-[#f4b400] focus:outline-none">
            <option>{t('shopAllFilter.sort.recommended')}</option>
            <option>{t('shopAllFilter.sort.newestArrivals')}</option>
            <option>{t('shopAllFilter.sort.priceLowToHigh')}</option>
            <option>{t('shopAllFilter.sort.priceHighToLow')}</option>
          </select>
          <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-[#504533]">
            ▾
          </span>
        </div>
      </div>
    </div>
  );
}
