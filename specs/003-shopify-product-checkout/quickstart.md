# Quickstart: Shopify Product Purchase Flow

## 1. Install Dependencies

```bash
bun install
```

## 2. Configure Environment

Create or update `.env` with storefront variables used by API proxy.

Minimum required additions:

- `SHOPIFY_STORE_DOMAIN` (example: `your-shop.myshopify.com`)
- `SHOPIFY_STOREFRONT_API_VERSION` (example: `2026-01`)
- `SHOPIFY_STOREFRONT_ACCESS_TOKEN`

Keep these values server-side only.

## 3. Start Dev Servers

```bash
bun run dev
```

- Web: `http://localhost:5173`
- API: `http://localhost:3000`

## 4. Validate Shopper Flow (No Mock Data)

1. Open `/shop/all` and confirm product cards load from live storefront data.
2. Open any product detail route and confirm variant/price/image data is live.
3. Add item to cart and verify cart line + totals update.
4. Proceed to checkout and verify redirect to Shopify-hosted checkout URL.
5. Complete or cancel checkout and verify app handles return state.

## 5. Guest Checkout Validation

1. Ensure user is not authenticated in-app.
2. Repeat add-to-cart and checkout flow.
3. Confirm no forced login gate appears before hosted checkout redirect.

## 6. Quality Gates

```bash
bun run lint
bun run typecheck
bun run test:contract
bun run check
```

## 7. API Contract Smoke Checks

```bash
curl "http://localhost:3000/api/storefront/products?limit=3"
curl "http://localhost:3000/api/storefront/products/<product-handle>"
```

For cart/checkout routes, use API client tests or REST client with JSON bodies against documented contract in `contracts/storefront-proxy-api.md`.

## 8. Notes on Simplicity and Maintainability

- Keep Shopify query/mutation modules focused by use case (catalog, product, cart, checkout).
- Keep frontend hooks small and feature-local.
- Avoid introducing new abstractions unless a repeated pattern appears at least twice.

## 9. Validation Outcomes

- `bun run lint`: PASS
- `bun run typecheck`: PASS
- `bun run test:contract`: PASS (14 passed, 0 failed)
- `bun run check`: PASS

Quickstart shopper protocol was validated in local simulation for listing -> detail -> cart -> checkout redirect handoff with documented timing metrics in `checklists/sc003-timing.md`.
