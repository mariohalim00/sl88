# Quickstart: Frontend MVP (4 Canonical Pages)

## 1. Install Dependencies

```bash
bun install
```

## 2. Start Development Servers

```bash
bun run dev
```

- Frontend: `http://localhost:5173`
- Backend (unused for required MVP flows): `http://localhost:3000`

## 3. Validate Canonical Routes

Open and verify:

- `/` against `luxeweave_landing_mobile_view_2`
- `/shop/all` against `shop_all_mobile_view_2`
- `/products/:productId` against `product_details_mobile_view_2`
- `/admin` against `admin_panel_mobile_view_2`

## 4. Verify Scope Rules

- Mock data only; no production backend dependency for primary flows.
- Cart resets on full reload.
- Checkout/payment controls disabled by default via feature flags.
- Styling follows `artisan_loom/DESIGN.md` tokens and guidance.

## 5. Quality Gates

```bash
bun run lint
bun run typecheck
bun run check
```

## 6. Responsive Review

Manually review all routes at representative widths:

- Mobile: ~390px
- Tablet: ~768px
- Desktop: ~1280px

Confirm typography, spacing, hierarchy, and interactive affordances remain coherent.

## 7. Landing Route Validation (`/`)

- At ~390px: verify hero title wraps to 2-4 lines and CTA buttons remain fully visible without overflow.
- At ~768px: verify hero content width remains legible and CTA row remains aligned without clipping.
- At ~1280px: verify hero card remains visually centered with gradient background intact and section cards displayed in three columns.

## 8. Shop All Interaction Script (`/shop/all`)

1. Load `/shop/all` and confirm mock-mode notice is visible above product interactions.
2. Search for `wool` and verify the product grid narrows to matching entries.
3. Click Add to Cart on any visible product twice and confirm cart counter increments by 2.
4. Remove the same product from the cart and verify subtotal and item counter update immediately.
5. Refresh the page and verify cart state resets to empty (MVP non-persistent behavior).

## 9. Product Details Route Script (`/products/:productId`)

1. Open `/products/c1` and verify title, badge, image gallery, price, and stock render correctly.
2. Resize viewport to ~390px, ~768px, and ~1280px; verify image gallery remains readable and non-overlapping.
3. Open `/products/does-not-exist` and verify graceful fallback message appears with link back to `/shop/all`.

## 10. Admin Action Flag Script (`/admin`)

1. Open `/admin` and verify inventory rows and status badges render.
2. Verify non-priority action buttons are disabled by default.
3. At ~390px viewport, verify the inventory table can be horizontally scrolled without overlap.

## 11. Quality Gate Execution Log

- Command run: `bun run check`
- Result: failed due repository-wide formatting drift in both legacy and newly touched files.
- Follow-up: lint and typecheck still pass (`bun run lint`, `bun run typecheck`), but full check remains blocked until formatting baseline is reconciled.

## 12. Full Route Verification Summary

- `/`: renders `LandingPage` with responsive hero, CTA actions, and source-variant badge.
- `/shop/all`: renders `ShopAllPage` with local-only cart interactions and mock-mode disclosure.
- `/products/:productId`: renders `ProductDetailsPage` with typed fallback for invalid IDs.
- `/admin`: renders `AdminPage` with inventory table and disabled-by-default non-priority actions.
- `/products/does-not-exist`: renders graceful fallback and return link to `/shop/all`.
- Manual verification run completed against local dev server (`http://localhost:5173`) on 2026-05-16.

## 13. Backend-Independence Evidence (T054)

- Primary route components (`LandingPage`, `ShopAllPage`, `ProductDetailsPage`, `AdminPage`) do not call treaty/api clients.
- Mock datasets are loaded from `apps/web/src/features/catalog/data/mock-catalog.ts`.
- Legacy scaffold API ping behavior was retired in `apps/web/src/pages/ScaffoldDemo.tsx`.

## 14. i18n Scope Evidence (T055)

- No runtime i18n libraries are imported in `apps/web/src`.
- No i18n provider/switching setup is introduced in route pages.
- MVP scope remains single-locale runtime as specified by FR-015.
