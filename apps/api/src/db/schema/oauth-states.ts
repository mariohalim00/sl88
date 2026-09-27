import { text, pgTable, timestamp } from 'drizzle-orm/pg-core';

/**
 * Short-lived OAuth transaction rows: state -> PKCE code verifier.
 * Deleted as soon as the callback consumes them.
 */
export const customerOAuthStates = pgTable('customer_oauth_states', {
  state: text('state').primaryKey(),
  codeVerifier: text('code_verifier').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
});
