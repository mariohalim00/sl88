import { useTranslation } from 'react-i18next';
import { Input } from '@/components/ui/input';

type StoreHeaderProps = {
  searchTerm: string;
  onSearchChange: (nextValue: string) => void;
  totalItems: number;
};

export function StoreHeader({
  searchTerm,
  onSearchChange,
  totalItems,
}: StoreHeaderProps) {
  const { t } = useTranslation();

  return (
    <header className="space-y-5">
      <div className="space-y-2">
        <p className="inline-flex rounded-full border border-border/80 px-3 py-1 text-xs uppercase tracking-wider text-muted-foreground">
          {t('storeHeader.badge')}
        </p>
        <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
          {t('storeHeader.title')}
        </h1>
        <p className="max-w-2xl text-sm text-muted-foreground md:text-base">
          {t('storeHeader.description')}
        </p>
      </div>

      <div className="grid gap-3 md:grid-cols-[1fr_auto]">
        <Input
          value={searchTerm}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder={t('storeHeader.searchPlaceholder')}
          aria-label={t('storeHeader.searchAria')}
          className="h-10 bg-card/70"
        />
        <div className="flex h-10 items-center rounded-md border border-border bg-card/70 px-4 text-sm font-medium">
          {t('common.labels.cartItems')}: {totalItems}
        </div>
      </div>
    </header>
  );
}
