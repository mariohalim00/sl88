import type { CanonicalRoute } from "@/lib/route-variant-map";

export const canonicalRoutes: CanonicalRoute[] = ["/", "/shop/all", "/products/:productId", "/admin"];

export const productDetailsRoute = "/products/:productId" as const;

export type CanonicalRoutePattern = (typeof canonicalRoutes)[number];
