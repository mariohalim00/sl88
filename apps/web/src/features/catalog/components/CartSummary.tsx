import { Trash2 } from "lucide-react";

type CatalogProduct = {
  id: string;
  name: string;
};

type CartLineItem = {
  product: CatalogProduct;
  quantity: number;
  subtotal: number;
};

type CartSummaryProps = {
  items: CartLineItem[];
  subtotal: number;
  onRemoveItem: (productId: string) => void;
};

export function CartSummary({ items, subtotal, onRemoveItem }: CartSummaryProps) {
  return (
    <section className="rounded border border-[#d4c4ac] bg-white p-5">
      <header className="mb-4">
        <h2 className="font-heading text-2xl font-medium text-[#1c1c15]">Your Bag</h2>
        <p className="text-sm text-[#504533]">Review selected pieces before checkout becomes available.</p>
      </header>

      {items.length === 0 ? (
        <p className="text-sm text-[#504533]">No items yet. Add products from the collection.</p>
      ) : (
        <ul className="space-y-3">
          {items.map((item) => {
            return (
              <li
                key={item.product.id}
                className="flex items-start justify-between gap-2 rounded border border-[#e5e2d8] p-3"
              >
                <div>
                  <p className="text-sm font-medium text-[#1c1c15]">{item.product.name}</p>
                  <p className="text-xs text-[#504533]">
                    Qty {item.quantity} • ${item.subtotal}
                  </p>
                </div>
                <button
                  type="button"
                  className="rounded border border-[#d4c4ac] p-1.5 text-[#504533] transition hover:bg-[#f7f4e9]"
                  onClick={() => onRemoveItem(item.product.id)}
                  aria-label={`Remove ${item.product.name}`}
                >
                  <Trash2 className="size-4" />
                </button>
              </li>
            );
          })}
        </ul>
      )}

      <div className="mt-4 flex items-center justify-between border-t border-[#e5e2d8] pt-3 text-sm">
        <span className="text-[#504533]">Subtotal</span>
        <span className="font-semibold text-[#1c1c15]">${subtotal}</span>
      </div>
    </section>
  );
}
