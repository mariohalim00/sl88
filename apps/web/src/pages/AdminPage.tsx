import { useTranslation } from 'react-i18next';
import { AdminActions } from '@/components/sections/admin/AdminActions';
import { AdminInventoryTable } from '@/components/sections/admin/AdminInventoryTable';
import { PageHeader } from '@/components/sections/shared/PageHeader';
import { mockCatalog } from '@/features/catalog/data/mock-catalog';

export function AdminPage() {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('admin.pageTitle')}
        description={t('admin.pageDescription')}
      />

      <AdminActions />
      <AdminInventoryTable rows={mockCatalog.adminInventory} />
    </div>
  );
}
