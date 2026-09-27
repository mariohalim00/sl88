import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

/**
 * One row per signed-in customer session. The browser only ever sees the
 * opaque session id (in an HttpOnly cookie); tokens live here.
 */
export const customerSessions = pgTable('customer_sessions', {
  id: uuid('id').primaryKey().defaultRandom(),
  shopifyCustomerId: text('shopify_customer_id').notNull(),
  accessToken: text('access_token').notNull(),
  accessTokenExpiresAt: timestamp('access_token_expires_at', {
    withTimezone: true,
  }).notNull(),
  // Headless storefront clients receive a refresh token; null for others.
  refreshToken: text('refresh_token'),
  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
});
