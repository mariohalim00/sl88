# Contract: Storefront Proxy API

## Scope

Frontend (`apps/web`) consumes only internal Elysia routes under `/api/storefront/*`. These routes proxy and normalize Shopify Storefront GraphQL operations.

## Endpoints

### 1. List Products

- Method: `GET`
- Path: `/api/storefront/products`
- Query:
  - `cursor?`: string
  - `limit?`: integer (default 20, max 50)
- Response 200:

```json
{
  "products": [
    {
      "id": "gid://shopify/Product/123",
      "handle": "wool-runner",
      "title": "Wool Runner",
      "featuredImageUrl": "https://...",
      "priceMin": "125.00",
      "priceMax": "199.00",
      "currencyCode": "USD",
      "availableForSale": true
    }
  ],
  "pageInfo": {
    "hasNextPage": true,
    "endCursor": "opaque-cursor"
  }
}
```

### 2. Product Detail

- Method: `GET`
- Path: `/api/storefront/products/:handle`
- Response 200:

```json
{
  "product": {
    "id": "gid://shopify/Product/123",
    "handle": "wool-runner",
    "title": "Wool Runner",
    "descriptionHtml": "<p>...</p>",
    "images": [{ "url": "https://...", "altText": "Front" }],
    "variants": [
      {
        "id": "gid://shopify/ProductVariant/456",
        "title": "Default",
        "availableForSale": true,
        "price": "125.00",
        "currencyCode": "USD",
        "selectedOptions": []
      }
    ],
    "selectedOrFirstAvailableVariantId": "gid://shopify/ProductVariant/456"
  }
}
```

- Response 404: RFC 9457 problem+json payload for unknown handle.

### 3. Create Cart

- Method: `POST`
- Path: `/api/storefront/cart`
- Request body:

```json
{
  "lines": [
    {
      "merchandiseId": "gid://shopify/ProductVariant/456",
      "quantity": 1
    }
  ]
}
```

- Response 201:

```json
{
  "cart": {
    "id": "gid://shopify/Cart/789",
    "checkoutUrl": "https://shop.example.com/cart/c/...",
    "totalQuantity": 1,
    "cost": {
      "subtotalAmount": "125.00",
      "totalAmount": "125.00",
      "totalTaxAmount": null,
      "currencyCode": "USD"
    },
    "lines": []
  }
}
```

### 4. Add Cart Lines

- Method: `POST`
- Path: `/api/storefront/cart/:cartId/lines`
- Request body:

```json
{
  "lines": [
    {
      "merchandiseId": "gid://shopify/ProductVariant/456",
      "quantity": 2
    }
  ]
}
```

- Response 200: `{ "cart": StorefrontCart }`

### 5. Update Cart Lines

- Method: `PATCH`
- Path: `/api/storefront/cart/:cartId/lines`
- Request body:

```json
{
  "lines": [
    {
      "id": "gid://shopify/CartLine/line-1",
      "quantity": 3
    }
  ]
}
```

- Response 200: `{ "cart": StorefrontCart }`

### 6. Remove Cart Lines

- Method: `DELETE`
- Path: `/api/storefront/cart/:cartId/lines`
- Request body:

```json
{
  "lineIds": ["gid://shopify/CartLine/line-1"]
}
```

- Response 200: `{ "cart": StorefrontCart }`

### 7. Checkout Redirect URL

- Method: `POST`
- Path: `/api/storefront/cart/:cartId/checkout`
- Request body: `{}`
- Response 200:

```json
{
  "checkoutUrl": "https://shop.example.com/cart/c/...",
  "mode": "hosted_redirect"
}
```

## Error Contract

- Content type: `application/problem+json`
- Required fields: `type`, `title`, `status`, `detail`, `instance`
- Upstream Shopify errors must be mapped to shopper-safe messages and stable status codes.

## Security Contract

- Browser never receives Shopify private credentials.
- API routes enforce request shape validation before upstream calls.
- Checkout payment collection is always delegated to Shopify-hosted pages.
