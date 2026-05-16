import { Badge } from '@/components/ui/badge';

import type { AdminInventoryRow } from '@/features/catalog/model/schemas';

type AdminInventoryTableProps = {
  rows: AdminInventoryRow[];
};

function statusLabel(status: AdminInventoryRow['status']) {
  switch (status) {
    case 'in_stock':
      return <Badge variant="secondary">In Stock</Badge>;
    case 'low_stock':
      return <Badge variant="outline">Low Stock</Badge>;
    case 'out_of_stock':
      return <Badge variant="destructive">Out of Stock</Badge>;
    default:
      return <Badge variant="outline">Unknown</Badge>;
  }
}

export function AdminInventoryTable({ rows }: AdminInventoryTableProps) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-border/70 bg-card/70">
      <table className="w-full min-w-160 border-collapse text-sm">
        <thead>
          <tr className="border-b border-border/70 text-left text-muted-foreground">
            <th className="px-4 py-3 font-medium">Product</th>
            <th className="px-4 py-3 font-medium">Category</th>
            <th className="px-4 py-3 font-medium">Stock</th>
            <th className="px-4 py-3 font-medium">Status</th>
            <th className="px-4 py-3 font-medium">Last Update</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.productId} className="border-b border-border/60">
              <td className="px-4 py-3 font-medium">{row.name}</td>
              <td className="px-4 py-3">{row.category}</td>
              <td className="px-4 py-3">{row.stock}</td>
              <td className="px-4 py-3">{statusLabel(row.status)}</td>
              <td className="px-4 py-3 text-muted-foreground">
                {new Date(row.lastUpdatedAt).toLocaleDateString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
