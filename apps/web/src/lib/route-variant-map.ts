export type CanonicalRoute =
  | '/'
  | '/shop/all'
  | '/products/:productId'
  | '/admin';

export type RouteVariantMapEntry = {
  route: CanonicalRoute;
  sourceVariant:
    | 'luxeweave_landing_mobile_view_2'
    | 'shop_all_mobile_view_2'
    | 'product_details_mobile_view_2'
    | 'admin_panel_mobile_view_2';
  notes?: string;
};

export const routeVariantMap: Record<CanonicalRoute, RouteVariantMapEntry> = {
  '/': {
    route: '/',
    sourceVariant: 'luxeweave_landing_mobile_view_2',
    notes:
      'CTA labels adapted for clearer navigation while preserving hero hierarchy and visual tone.',
  },
  '/shop/all': {
    route: '/shop/all',
    sourceVariant: 'shop_all_mobile_view_2',
    notes:
      'Mock-mode disclosure banner added near cart interactions per FR-004.',
  },
  '/products/:productId': {
    route: '/products/:productId',
    sourceVariant: 'product_details_mobile_view_2',
    notes:
      'Fallback empty state added for invalid product IDs to preserve route safety.',
  },
  '/admin': {
    route: '/admin',
    sourceVariant: 'admin_panel_mobile_view_2',
    notes:
      'Non-priority action controls are present but disabled by default via feature flags.',
  },
};
