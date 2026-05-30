# Data Model: Shopify Product Purchase Flow

## Entity: StorefrontProduct

- Purpose: Product summary displayed in product listing.
- Fields:
  - `id`: string (Shopify global ID)
  - `handle`: string
  - `title`: string
  - `featuredImageUrl`: string (URL)
  - `priceMin`: string (decimal money string)
  - `priceMax`: string (decimal money string)
  - `currencyCode`: string
  - `availableForSale`: boolean
- Validation rules:
  - Parse mapped API response with Zod before sending to frontend.
  - Reject missing `id`, `handle`, `title`, or invalid money/image shapes.

## Entity: StorefrontProductDetail

- Purpose: Detailed product data for product detail page.
- Fields:
  - `id`: string
  - `handle`: string
  - `title`: string
  - `descriptionHtml`: string
  - `images`: array of `{ url: string; altText?: string }`
  - `variants`: array of `StorefrontVariant`
  - `selectedOrFirstAvailableVariantId`: string | null
- Validation rules:
  - Product handle path param validated before query.
  - Unknown handle returns typed not-found response.

## Entity: StorefrontVariant

- Purpose: Purchasable variant used for cart line operations.
- Fields:
  - `id`: string
  - `title`: string
  - `availableForSale`: boolean
  - `price`: string
  - `currencyCode`: string
  - `selectedOptions`: array of `{ name: string; value: string }`
- Validation rules:
  - Add-to-cart only allowed for `availableForSale = true`.

## Entity: StorefrontCart

- Purpose: Canonical cart state mirrored from Shopify cart object.
- Fields:
  - `id`: string
  - `checkoutUrl`: string
  - `totalQuantity`: integer
  - `cost`: `CartCostSummary`
  - `lines`: array of `StorefrontCartLine`
- Validation rules:
  - Cart ID required for line update/remove operations.
  - Checkout URL required before redirect action is exposed.

## Entity: StorefrontCartLine

- Purpose: Single cart line entry shown in UI and updated by shopper actions.
- Fields:
  - `id`: string
  - `quantity`: integer (>= 1)
  - `merchandiseId`: string (variant ID)
  - `title`: string
  - `imageUrl`: string | null
  - `unitAmount`: string
  - `lineAmount`: string
  - `currencyCode`: string

## Entity: CartCostSummary

- Purpose: Aggregated cart totals displayed in cart and checkout entry points.
- Fields:
  - `subtotalAmount`: string
  - `totalAmount`: string
  - `totalTaxAmount`: string | null
  - `currencyCode`: string

## Entity: CheckoutRedirectState

- Purpose: Frontend navigation state for checkout completion lifecycle.
- Fields:
  - `cartId`: string
  - `checkoutUrl`: string
  - `mode`: enum (`hosted_redirect`)
  - `result`: enum (`pending`, `success`, `cancel`, `failed`)

## State Transitions

- Catalog:
  - `idle -> loading -> loaded | failed`
- Product detail:
  - `idle -> loading -> loaded | not_found | failed`
- Cart:
  - `empty -> active` on first add
  - `active -> active` on quantity updates/removals with remaining lines
  - `active -> empty` when all lines removed
- Checkout:
  - `active cart -> redirecting -> success | cancel | failed`
