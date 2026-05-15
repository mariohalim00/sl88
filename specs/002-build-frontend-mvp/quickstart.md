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
