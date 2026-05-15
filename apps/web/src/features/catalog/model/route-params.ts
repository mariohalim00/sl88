import { z } from "zod";
import { getCatalogProductById } from "@/features/catalog/model/selectors";

const productRouteParamSchema = z.object({
  productId: z.string().min(1),
});

export function parseProductRouteParams(params: Record<string, string | undefined>) {
  return productRouteParamSchema.safeParse({ productId: params.productId });
}

export function resolveProductFromRoute(params: Record<string, string | undefined>) {
  const parsed = parseProductRouteParams(params);
  if (!parsed.success) {
    return null;
  }

  return getCatalogProductById(parsed.data.productId) ?? null;
}
