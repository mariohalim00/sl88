import { AdminActions } from "@/components/sections/admin/AdminActions";
import { AdminInventoryTable } from "@/components/sections/admin/AdminInventoryTable";
import { PageHeader } from "@/components/sections/shared/PageHeader";
import { mockCatalog } from "@/features/catalog/data/mock-catalog";

export function AdminPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Admin Panel"
        description="Inventory snapshot for MVP preview. Non-priority operations remain disabled by default."
      />

      <AdminActions />
      <AdminInventoryTable rows={mockCatalog.adminInventory} />
    </div>
  );
}
