import { CheckCircle2 } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { ProductGallery } from "@/components/sections/product-details/ProductGallery";
import { getCatalogProducts } from "@/features/catalog/model/selectors";
import { resolveProductFromRoute } from "@/features/catalog/model/route-params";

export function ProductDetailsPage() {
  const params = useParams();
  const product = resolveProductFromRoute(params);

  if (product == null) {
    return (
      <section className="rounded border border-dashed border-[#d4c4ac] p-8 text-center">
        <h1 className="font-heading text-3xl font-semibold text-[#1c1c15]">Product not found</h1>
        <p className="mt-2 text-sm text-[#504533]">The selected piece is not available in this collection.</p>
        <Link
          className="mt-4 inline-block text-sm font-semibold tracking-[0.08em] text-[#1c1c15] underline uppercase"
          to="/shop/all"
        >
          Return to Shop All
        </Link>
      </section>
    );
  }

  const relatedProducts = getCatalogProducts()
    .filter((item) => item.id !== product.id)
    .slice(0, 3);

  return (
    <div className="space-y-12 md:space-y-16">
      <section className="grid gap-8 md:grid-cols-2 md:gap-10">
        <ProductGallery product={product} />

        <div className="pt-2 md:px-3 md:pt-6">
          <span className="inline-block rounded-full border border-[#d4c4ac] bg-[#f1eee3] px-3 py-1 text-xs font-semibold tracking-[0.08em] text-[#504533] uppercase">
            Handcrafted {product.category}
          </span>
          <h1 className="mt-4 font-heading text-3xl font-semibold text-[#1c1c15] md:text-4xl">{product.name}</h1>
          <div className="mt-4 flex items-end gap-3">
            <p className="text-3xl font-semibold text-[#7a5900]">${product.price}</p>
            <p className="pb-1 text-sm text-[#504533] line-through">${Math.round(product.price * 1.2)}</p>
          </div>

          <div className="mt-5 flex items-center gap-2 text-[#7a5900]">
            <CheckCircle2 className="size-4" />
            <span className="text-sm font-semibold">In stock and ready to ship</span>
          </div>

          <p className="mt-6 border-l-2 border-[#d4c4ac] pl-4 text-sm leading-relaxed text-[#504533] md:text-base">
            {product.description} Crafted for comfort and visual clarity, this piece adds quiet luxury to
            everyday spaces.
          </p>

          <div className="mt-8 space-y-3">
            <button
              type="button"
              className="w-full rounded bg-[#f4b400] px-5 py-3 text-sm font-semibold tracking-[0.08em] text-[#1c1c15] uppercase transition hover:brightness-95"
            >
              Add to Bag
            </button>
            <button
              type="button"
              className="w-full rounded border border-[#1c1c15] px-5 py-3 text-sm font-semibold tracking-[0.08em] text-[#1c1c15] uppercase transition hover:bg-[#f7f4e9]"
            >
              Inquire Now
            </button>
          </div>

          <section className="mt-8 border-t border-[#d4c4ac] pt-6">
            <div className="grid grid-cols-2 gap-y-3 text-sm text-[#504533]">
              <span className="font-semibold text-[#1c1c15]">Origin:</span>
              <span>Indonesia</span>
              <span className="font-semibold text-[#1c1c15]">Material:</span>
              <span>{product.category} blend</span>
              <span className="font-semibold text-[#1c1c15]">Stock:</span>
              <span>{product.stock} available</span>
              <span className="font-semibold text-[#1c1c15]">Rating:</span>
              <span>{product.rating.toFixed(1)} / 5</span>
            </div>
          </section>
        </div>
      </section>

      <section className="border-t border-[#d4c4ac] pt-10 md:pt-14">
        <h2 className="mb-8 text-center font-heading text-3xl font-semibold text-[#1c1c15]">You May Also Like</h2>
        <div className="grid gap-6 md:grid-cols-3">
          {relatedProducts.map((item) => (
            <article key={item.id} className="group">
              <div className="relative mb-4 aspect-3/4 overflow-hidden rounded border border-[#d4c4ac] bg-[#f1eee3]">
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />
              </div>
              <h3 className="font-heading text-xl text-[#1c1c15]">{item.name}</h3>
              <p className="text-sm text-[#504533]">${item.price}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
