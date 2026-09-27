CREATE TABLE "customer_oauth_states" (
	"state" text PRIMARY KEY NOT NULL,
	"code_verifier" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "customer_sessions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"shopify_customer_id" text NOT NULL,
	"access_token" text NOT NULL,
	"access_token_expires_at" timestamp with time zone NOT NULL,
	"refresh_token" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "customer_carts" (
	"shopify_customer_id" text PRIMARY KEY NOT NULL,
	"cart_id" text NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
