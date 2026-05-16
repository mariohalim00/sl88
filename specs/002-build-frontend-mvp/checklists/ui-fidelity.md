# UI Fidelity Checklist (MVP)

## Landing (`/`)

- [X] Layout reflects `luxeweave_landing_mobile_view_2` intent.
- [X] Hero hierarchy is preserved from mobile to desktop.
- [X] Typography and spacing follow Artisan Loom tokens.
- [X] Hero CTA area exposes primary browse action and secondary product drill-in action.
- [X] Route/source traceability is documented in route-source mapping notes.

## Shop All (`/shop/all`)

- [X] Layout reflects `shop_all_mobile_view_2` intent.
- [X] Product list and cart interactions work in mock mode.
- [X] Mock-mode disclosure is visible near shopping/cart affordances.
- [X] Search input filters products by name, category, or description.
- [X] Cart item counter updates immediately after add/remove actions.

## Product Details (`/products/:productId`)

- [X] Layout reflects `product_details_mobile_view_2` intent.
- [X] Invalid product IDs show graceful fallback state.
- [X] Gallery/detail modules remain responsive at mobile/tablet/desktop widths.
- [X] Product badge/title/description hierarchy is preserved across breakpoints.
- [X] Product detail section displays price and stock using mock dataset values.

## Admin (`/admin`)

- [X] Layout reflects `admin_panel_mobile_view_2` intent.
- [X] Inventory status badges and table hierarchy are readable.
- [X] Non-priority actions stay feature-flag gated by default.
- [X] Disabled action controls are visibly non-interactive by default.
- [X] Table remains horizontally scrollable and readable on ~390px viewport.

## Cross-Cutting Quality

- [X] No `any` added in changed files.
- [X] Route pages are decomposed into feature/shared modules.
- [X] Route-level pages stay under 250 lines.
- [X] Shared feature components stay under 180 lines.
- [X] Intentional deviations are documented in route-source mapping notes.

## Architecture Gate (US5)

- [X] Shared header/layout modules are reused across route pages where applicable.
- [X] shadcn/base-ui primitives are used before custom control re-implementation.
- [X] Lint and typecheck are green for touched frontend files.

## Acceptance Coverage Matrix (US5)

| Scenario | Route | Validation Type | Status |
|---|---|---|---|
| Landing hero and CTA fidelity | `/` | Manual checklist | [X] |
| Shop search and cart interactions | `/shop/all` | Manual script | [X] |
| Product detail valid/invalid behavior | `/products/:productId` | Manual script | [X] |
| Admin inventory and disabled actions | `/admin` | Manual script | [X] |
| Mock-only runtime safeguards | Cross-route | Manual + code inspection | [X] |

Pass-rate target: >=95% complete/passing scenarios before feature completion.
