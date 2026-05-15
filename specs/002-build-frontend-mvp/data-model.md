# Data Model: Frontend MVP (4 Canonical Pages)

## Entity: MockProduct

- Purpose: Product data used by `/shop/all` and `/products/:productId`.
- Fields:
  - `id`: string (non-empty, unique)
  - `slug`: string (URL-safe identifier)
  - `name`: string
  - `category`: enum (`wool`, `silk`, `modern`, `persian`, `outdoor`, `other`)
  - `price`: number (positive)
  - `currency`: enum (`IDR`, `USD`)
  - `description`: string
  - `imageUrl`: string (URL)
  - `gallery`: string[] (URL list)
  - `stock`: integer (>= 0)
  - `rating`: number (0 to 5)
- Validation rules:
  - Parse with Zod on mock load.
  - Reject records missing id/name/price/imageUrl.

## Entity: MockCollection

- Purpose: Grouping and filter metadata for `/shop/all`.
- Fields:
  - `id`: string
  - `title`: string
  - `description`: string
  - `productIds`: string[]
  - `featured`: boolean
- Relationships:
  - One collection references many `MockProduct` ids.

## Entity: CartItemViewModel

- Purpose: Non-persistent cart item state for shopper actions.
- Fields:
  - `productId`: string
  - `quantity`: integer (>= 1)
  - `unitPrice`: number (positive)
  - `lineTotal`: number (derived)
- Relationships:
  - Many cart items map to one `CartSummaryState`.

## Entity: CartSummaryState

- Purpose: Display totals and item count for shopper UI.
- Fields:
  - `items`: CartItemViewModel[]
  - `itemCount`: integer (derived)
  - `subtotal`: number (derived)
  - `currency`: enum (`IDR`, `USD`)
- State transitions:
  - `EMPTY -> ACTIVE` on add-to-cart.
  - `ACTIVE -> ACTIVE` on quantity update.
  - `ACTIVE -> EMPTY` when all items removed.
  - `ACTIVE|EMPTY -> EMPTY` on full page reload (MVP rule).

## Entity: AdminInventoryRow

- Purpose: Represents inventory data displayed on `/admin`.
- Fields:
  - `productId`: string
  - `name`: string
  - `category`: string
  - `stock`: integer
  - `status`: enum (`in_stock`, `low_stock`, `out_of_stock`)
  - `lastUpdatedAt`: ISO datetime string

## Entity: FeatureFlagConfig

- Purpose: Toggle non-priority commerce actions in UI.
- Fields:
  - `checkoutEnabled`: boolean (default `false`)
  - `paymentEnabled`: boolean (default `false`)
  - `adminActionsEnabled`: boolean (default `false` for non-MVP actions)
- Validation rules:
  - Parse config at app start with Zod.

## Entity: RouteVariantMapping

- Purpose: Canonical mapping between route and stitch source variant.
- Fields:
  - `route`: enum (`/`, `/shop/all`, `/products/:productId`, `/admin`)
  - `sourceVariant`: enum (
    `luxeweave_landing_mobile_view_2`,
    `shop_all_mobile_view_2`,
    `product_details_mobile_view_2`,
    `admin_panel_mobile_view_2`
    )
  - `notes`: string (optional documented deviations)
