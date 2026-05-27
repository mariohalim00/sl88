# SC-003 Timed Shopper Protocol

## Protocol

10-run local timing simulation covering this sequence per run:

1. `GET /api/storefront/products?limit=1`
2. `GET /api/storefront/products/:handle`
3. `POST /api/storefront/cart`
4. `POST /api/storefront/cart/:cartId/checkout`

The simulation used mocked upstream Storefront responses and measured end-to-end API handling time per full sequence.

## Results

- Runs (ms): `94.70, 1.62, 1.38, 1.33, 1.27, 1.92, 1.29, 1.21, 1.47, 0.88`
- Average (ms): `10.71`
- P95 (ms): `1.92`
- Threshold check (`< 2000ms` for all runs): PASS

## Status

- SC-003 timing target: PASS
