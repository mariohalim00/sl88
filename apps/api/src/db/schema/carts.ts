import { pgTable, text, timestamp } from 'drizzle-orm/pg-core';

/**
 * Cross-device cart: one saved Shopify cart id per customer.
 * Shopify's cart remains the source of truth; we only remember the pointer.
 */
export const customerCarts = pgTable('customer_carts', {
  shopifyCustomerId: text('shopify_customer_id').primaryKey(),
  cartId: text('cart_id').notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
});
