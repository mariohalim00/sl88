# UI Route Contract: Frontend MVP

## Scope

- Frontend-only contract for user-visible routes and route-level data expectations.
- All routes are mock-data backed and must function without production backend dependency.

## Canonical Routes

| Route | Source Variant | Purpose | Data Source |
| --- | --- | --- | --- |
| `/` | `luxeweave_landing_mobile_view_2` | Landing page and brand entry | Static/mock content |
| `/shop/all` | `shop_all_mobile_view_2` | Collections and product list browsing | `MockProduct[]`, `MockCollection[]` |
| `/products/:productId` | `product_details_mobile_view_2` | Product detail storytelling and gallery | `MockProduct` by route param |
| `/admin` | `admin_panel_mobile_view_2` | Admin inventory overview | `AdminInventoryRow[]` |

## Route Behavior Rules

- `/:productId` route param must be validated before product resolution.
- Unknown product IDs must render a typed fallback state (not crash).
- Checkout/payment UI entry points are controlled by `FeatureFlagConfig` and default disabled.
- Cart state is in-memory and resets on full page reload.

## Responsive Contract

- Mobile references are canonical source.
- Tablet and desktop layouts must preserve hierarchy and readability while adapting spacing and grid density.

## Design System Contract

- Visual tokens and style direction come from `artisan_loom/DESIGN.md`.
- Implementations must use project shadcn primitives where equivalent patterns exist.
