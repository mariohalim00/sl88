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
  return (
    <header className="space-y-5">
      <div className="space-y-2">
        <p className="inline-flex rounded-full border border-border/80 px-3 py-1 text-xs uppercase tracking-wider text-muted-foreground">
          SL88 MVP Catalog
        </p>
        <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
          Find carpets that match your space
        </h1>
        <p className="max-w-2xl text-sm text-muted-foreground md:text-base">
          Browse our starter collection with mock inventory, realistic pricing,
          and a testable cart workflow ready for future API integration.
        </p>
      </div>

      <div className="grid gap-3 md:grid-cols-[1fr_auto]">
        <Input
          value={searchTerm}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search by style, room, or product name"
          aria-label="Search products"
          className="h-10 bg-card/70"
        />
        <div className="flex h-10 items-center rounded-md border border-border bg-card/70 px-4 text-sm font-medium">
          Cart Items: {totalItems}
        </div>
      </div>
    </header>
  );
}
