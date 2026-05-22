import { useTranslation } from 'react-i18next';
import { Badge } from '@/components/ui/badge';

import type { AdminInventoryRow } from '@/features/catalog/model/schemas';

type AdminInventoryTableProps = {
  rows: AdminInventoryRow[];
};

function statusLabel(
  status: AdminInventoryRow['status'],
  t: (key: string) => string,
) {
  switch (status) {
    case 'in_stock':
      return (
        <Badge variant="secondary">{t('admin.table.status.inStock')}</Badge>
      );
    case 'low_stock':
      return (
        <Badge variant="outline">{t('admin.table.status.lowStock')}</Badge>
      );
    case 'out_of_stock':
      return (
        <Badge variant="destructive">
          {t('admin.table.status.outOfStock')}
        </Badge>
      );
    default:
      return <Badge variant="outline">{t('admin.table.status.unknown')}</Badge>;
  }
}

export function AdminInventoryTable({ rows }: AdminInventoryTableProps) {
  const { t, i18n } = useTranslation();

  return (
    <div className="overflow-x-auto rounded-2xl border border-border/70 bg-card/70">
      <table className="w-full min-w-160 border-collapse text-sm">
        <thead>
          <tr className="border-b border-border/70 text-left text-muted-foreground">
            <th className="px-4 py-3 font-medium">
              {t('admin.table.headers.product')}
            </th>
            <th className="px-4 py-3 font-medium">
              {t('admin.table.headers.category')}
            </th>
            <th className="px-4 py-3 font-medium">
              {t('admin.table.headers.stock')}
            </th>
            <th className="px-4 py-3 font-medium">
              {t('admin.table.headers.status')}
            </th>
            <th className="px-4 py-3 font-medium">
              {t('admin.table.headers.lastUpdate')}
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.productId} className="border-b border-border/60">
              <td className="px-4 py-3 font-medium">{row.name}</td>
              <td className="px-4 py-3">{row.category}</td>
              <td className="px-4 py-3">{row.stock}</td>
              <td className="px-4 py-3">{statusLabel(row.status, t)}</td>
              <td className="px-4 py-3 text-muted-foreground">
                {new Date(row.lastUpdatedAt).toLocaleDateString(
                  i18n.resolvedLanguage === 'id' ? 'id-ID' : 'en-US',
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
