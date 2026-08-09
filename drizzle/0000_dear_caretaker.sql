-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
/*
CREATE TABLE "api_keys" (
	"id" text PRIMARY KEY NOT NULL,
	"merchant_id" text NOT NULL,
	"public_key" text NOT NULL,
	"secret_prefix" text NOT NULL,
	"secret_hash" text NOT NULL,
	"label" text,
	"revoked" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"business_id" text,
	CONSTRAINT "api_keys_public_key_unique" UNIQUE("public_key")
);
--> statement-breakpoint
CREATE TABLE "webhook_deliveries" (
	"id" text PRIMARY KEY NOT NULL,
	"transaction_id" text NOT NULL,
	"endpoint_id" text,
	"url" text NOT NULL,
	"event" text NOT NULL,
	"payload" text NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL,
	"attempts" integer DEFAULT 0 NOT NULL,
	"response_code" integer,
	"last_attempt_at" timestamp with time zone,
	"next_attempt_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "telegram_order_cards" (
	"id" text PRIMARY KEY NOT NULL,
	"transaction_id" text NOT NULL,
	"chat_id" text NOT NULL,
	"message_id" text NOT NULL,
	"is_photo" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"stage" text DEFAULT 'created' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "transactions" (
	"id" text PRIMARY KEY NOT NULL,
	"tx_ref" text NOT NULL,
	"merchant_id" text NOT NULL,
	"base_amount" integer NOT NULL,
	"match_delta" integer DEFAULT 0 NOT NULL,
	"amount" integer NOT NULL,
	"match_ref" text NOT NULL,
	"currency" text DEFAULT 'ETB' NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL,
	"payout_account_id" text,
	"payment_txn_id" text,
	"verification_method" text,
	"customer_email" text,
	"customer_name" text,
	"customer_phone" text,
	"callback_url" text,
	"return_url" text,
	"title" text,
	"description" text,
	"meta" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"paid_at" timestamp with time zone,
	"expires_at" timestamp with time zone,
	"business_id" text,
	"paid_place" text,
	"paid_note" text,
	"idempotency_key" text,
	"auto_rejected_reason" text,
	"rejected_attempts" integer DEFAULT 0 NOT NULL,
	"reference_submitted_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "payout_accounts" (
	"id" text PRIMARY KEY NOT NULL,
	"merchant_id" text NOT NULL,
	"channel" text NOT NULL,
	"account_name" text NOT NULL,
	"account_number" text NOT NULL,
	"instructions" text,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"business_id" text,
	"qr_code" text
);
--> statement-breakpoint
CREATE TABLE "webhook_endpoints" (
	"id" text PRIMARY KEY NOT NULL,
	"merchant_id" text NOT NULL,
	"url" text NOT NULL,
	"secret" text NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"business_id" text
);
--> statement-breakpoint
CREATE TABLE "email_tokens" (
	"id" text PRIMARY KEY NOT NULL,
	"merchant_id" text NOT NULL,
	"token_hash" text NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"used_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "pending_signups" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"password_hash" text NOT NULL,
	"token_hash" text NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"business_name" text,
	"business_logo" text
);
--> statement-breakpoint
CREATE TABLE "push_subscriptions" (
	"id" text PRIMARY KEY NOT NULL,
	"merchant_id" text NOT NULL,
	"endpoint" text NOT NULL,
	"p256dh" text NOT NULL,
	"auth" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "push_subscriptions_endpoint_unique" UNIQUE("endpoint")
);
--> statement-breakpoint
CREATE TABLE "inventory_items" (
	"id" text PRIMARY KEY NOT NULL,
	"merchant_id" text NOT NULL,
	"business_id" text NOT NULL,
	"external_id" text NOT NULL,
	"name" text NOT NULL,
	"sku" text,
	"price" integer,
	"stock_qty" integer,
	"in_stock" boolean DEFAULT true NOT NULL,
	"image_url" text,
	"product_url" text,
	"is_active" boolean DEFAULT true NOT NULL,
	"synced_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "businesses" (
	"id" text PRIMARY KEY NOT NULL,
	"merchant_id" text NOT NULL,
	"name" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"logo" text,
	"slug" text,
	"tagline" text,
	"verified_at" timestamp with time zone,
	"storefront_enabled" boolean DEFAULT false NOT NULL,
	"store_about" text,
	"store_url" text,
	"unique_amounts" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE "payment_links" (
	"id" text PRIMARY KEY NOT NULL,
	"merchant_id" text NOT NULL,
	"business_id" text NOT NULL,
	"slug" text NOT NULL,
	"title" text,
	"description" text,
	"mode" text DEFAULT 'fixed' NOT NULL,
	"base_amount" integer,
	"preset_amounts" text,
	"min_amount" integer,
	"max_uses" integer,
	"use_count" integer DEFAULT 0 NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "telegram_chats" (
	"id" text PRIMARY KEY NOT NULL,
	"merchant_id" text NOT NULL,
	"chat_id" text NOT NULL,
	"username" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"daily_digest" boolean DEFAULT true NOT NULL,
	"stock_alerts" boolean DEFAULT true NOT NULL,
	"expiry_alerts" boolean DEFAULT true NOT NULL,
	CONSTRAINT "telegram_chats_chat_id_key" UNIQUE("chat_id")
);
--> statement-breakpoint
CREATE TABLE "ledger_entries" (
	"id" text PRIMARY KEY NOT NULL,
	"merchant_id" text NOT NULL,
	"business_id" text NOT NULL,
	"customer_name" text NOT NULL,
	"customer_phone" text,
	"kind" text NOT NULL,
	"amount" integer NOT NULL,
	"note" text,
	"transaction_id" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "merchant_alerts" (
	"id" text PRIMARY KEY NOT NULL,
	"merchant_id" text NOT NULL,
	"kind" text NOT NULL,
	"dedupe_key" text NOT NULL,
	"sent_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "admin_audit" (
	"id" text PRIMARY KEY NOT NULL,
	"actor_subject" text NOT NULL,
	"actor_email" text NOT NULL,
	"action" text NOT NULL,
	"target_type" text,
	"target_id" text,
	"reason" text,
	"detail" text,
	"ip" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "merchants" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"password_hash" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"avatar" text,
	"email_verified_at" timestamp with time zone,
	"totp_secret" text,
	"totp_enabled_at" timestamp with time zone,
	"totp_backup_codes" text,
	"suspended_at" timestamp with time zone,
	"suspended_reason" text,
	"approved_at" timestamp with time zone,
	"deleted_at" timestamp with time zone,
	"flagged_at" timestamp with time zone,
	"flagged_reason" text,
	CONSTRAINT "merchants_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "verification_attempts" (
	"id" text PRIMARY KEY NOT NULL,
	"transaction_id" text NOT NULL,
	"channel" text NOT NULL,
	"reference" text,
	"outcome" text NOT NULL,
	"reason" text,
	"verifier" text,
	"duration_ms" integer,
	"raw" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "support_tickets" (
	"id" text PRIMARY KEY NOT NULL,
	"reference" text NOT NULL,
	"source" text NOT NULL,
	"transaction_id" text,
	"merchant_id" text,
	"category" text DEFAULT 'other' NOT NULL,
	"message" text NOT NULL,
	"contact_name" text,
	"contact_phone" text,
	"contact_email" text,
	"status" text DEFAULT 'open' NOT NULL,
	"resolution" text,
	"resolved_by" text,
	"resolved_at" timestamp with time zone,
	"acknowledged_by" text,
	"acknowledged_at" timestamp with time zone,
	"ip" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "support_tickets_reference_key" UNIQUE("reference")
);
--> statement-breakpoint
CREATE TABLE "admin_push_subscriptions" (
	"id" text PRIMARY KEY NOT NULL,
	"actor_subject" text NOT NULL,
	"actor_email" text NOT NULL,
	"endpoint" text NOT NULL,
	"p256dh" text NOT NULL,
	"auth" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "admin_push_subscriptions_endpoint_key" UNIQUE("endpoint")
);
--> statement-breakpoint
CREATE TABLE "verification_applications" (
	"id" text PRIMARY KEY NOT NULL,
	"business_id" text NOT NULL,
	"merchant_id" text NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL,
	"legal_name" text NOT NULL,
	"tin" text,
	"licence_number" text,
	"address" text NOT NULL,
	"phone" text NOT NULL,
	"website" text,
	"licence_doc_path" text,
	"licence_doc_name" text,
	"licence_doc_size" integer,
	"id_doc_path" text,
	"id_doc_name" text,
	"id_doc_size" integer,
	"reviewer_email" text,
	"review_note" text,
	"reviewed_at" timestamp with time zone,
	"submitted_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "api_keys" ADD CONSTRAINT "api_keys_merchant_id_merchants_id_fk" FOREIGN KEY ("merchant_id") REFERENCES "public"."merchants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "api_keys" ADD CONSTRAINT "api_keys_business_id_businesses_id_fk" FOREIGN KEY ("business_id") REFERENCES "public"."businesses"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "webhook_deliveries" ADD CONSTRAINT "webhook_deliveries_transaction_id_transactions_id_fk" FOREIGN KEY ("transaction_id") REFERENCES "public"."transactions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "webhook_deliveries" ADD CONSTRAINT "webhook_deliveries_endpoint_id_webhook_endpoints_id_fk" FOREIGN KEY ("endpoint_id") REFERENCES "public"."webhook_endpoints"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "telegram_order_cards" ADD CONSTRAINT "telegram_order_cards_transaction_id_fkey" FOREIGN KEY ("transaction_id") REFERENCES "public"."transactions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_merchant_id_merchants_id_fk" FOREIGN KEY ("merchant_id") REFERENCES "public"."merchants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_business_id_businesses_id_fk" FOREIGN KEY ("business_id") REFERENCES "public"."businesses"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_payout_account_id_payout_accounts_id_fk" FOREIGN KEY ("payout_account_id") REFERENCES "public"."payout_accounts"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payout_accounts" ADD CONSTRAINT "payout_accounts_merchant_id_merchants_id_fk" FOREIGN KEY ("merchant_id") REFERENCES "public"."merchants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payout_accounts" ADD CONSTRAINT "payout_accounts_business_id_businesses_id_fk" FOREIGN KEY ("business_id") REFERENCES "public"."businesses"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "webhook_endpoints" ADD CONSTRAINT "webhook_endpoints_merchant_id_merchants_id_fk" FOREIGN KEY ("merchant_id") REFERENCES "public"."merchants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "webhook_endpoints" ADD CONSTRAINT "webhook_endpoints_business_id_businesses_id_fk" FOREIGN KEY ("business_id") REFERENCES "public"."businesses"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "email_tokens" ADD CONSTRAINT "email_tokens_merchant_id_merchants_id_fk" FOREIGN KEY ("merchant_id") REFERENCES "public"."merchants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "push_subscriptions" ADD CONSTRAINT "push_subscriptions_merchant_id_merchants_id_fk" FOREIGN KEY ("merchant_id") REFERENCES "public"."merchants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "inventory_items" ADD CONSTRAINT "inventory_items_merchant_id_merchants_id_fk" FOREIGN KEY ("merchant_id") REFERENCES "public"."merchants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "inventory_items" ADD CONSTRAINT "inventory_items_business_id_businesses_id_fk" FOREIGN KEY ("business_id") REFERENCES "public"."businesses"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "businesses" ADD CONSTRAINT "businesses_merchant_id_merchants_id_fk" FOREIGN KEY ("merchant_id") REFERENCES "public"."merchants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payment_links" ADD CONSTRAINT "payment_links_merchant_id_merchants_id_fk" FOREIGN KEY ("merchant_id") REFERENCES "public"."merchants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payment_links" ADD CONSTRAINT "payment_links_business_id_businesses_id_fk" FOREIGN KEY ("business_id") REFERENCES "public"."businesses"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "telegram_chats" ADD CONSTRAINT "telegram_chats_merchant_id_fkey" FOREIGN KEY ("merchant_id") REFERENCES "public"."merchants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ledger_entries" ADD CONSTRAINT "ledger_entries_merchant_id_fkey" FOREIGN KEY ("merchant_id") REFERENCES "public"."merchants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ledger_entries" ADD CONSTRAINT "ledger_entries_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "public"."businesses"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ledger_entries" ADD CONSTRAINT "ledger_entries_transaction_id_fkey" FOREIGN KEY ("transaction_id") REFERENCES "public"."transactions"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "merchant_alerts" ADD CONSTRAINT "merchant_alerts_merchant_id_fkey" FOREIGN KEY ("merchant_id") REFERENCES "public"."merchants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "verification_attempts" ADD CONSTRAINT "verification_attempts_transaction_id_fkey" FOREIGN KEY ("transaction_id") REFERENCES "public"."transactions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "support_tickets" ADD CONSTRAINT "support_tickets_transaction_id_fkey" FOREIGN KEY ("transaction_id") REFERENCES "public"."transactions"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "support_tickets" ADD CONSTRAINT "support_tickets_merchant_id_fkey" FOREIGN KEY ("merchant_id") REFERENCES "public"."merchants"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "verification_applications" ADD CONSTRAINT "verification_applications_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "public"."businesses"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "verification_applications" ADD CONSTRAINT "verification_applications_merchant_id_fkey" FOREIGN KEY ("merchant_id") REFERENCES "public"."merchants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "apikey_merchant_idx" ON "api_keys" USING btree ("merchant_id" text_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "apikey_public_idx" ON "api_keys" USING btree ("public_key" text_ops);--> statement-breakpoint
CREATE INDEX "delivery_txn_idx" ON "webhook_deliveries" USING btree ("transaction_id" text_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "telegram_card_chat_msg_idx" ON "telegram_order_cards" USING btree ("chat_id" text_ops,"message_id" text_ops);--> statement-breakpoint
CREATE INDEX "telegram_card_txn_idx" ON "telegram_order_cards" USING btree ("transaction_id" text_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "txn_idempotency_idx" ON "transactions" USING btree ("merchant_id" text_ops,"idempotency_key" text_ops);--> statement-breakpoint
CREATE INDEX "txn_merchant_idx" ON "transactions" USING btree ("merchant_id" text_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "txn_merchant_ref_idx" ON "transactions" USING btree ("merchant_id" text_ops,"tx_ref" text_ops);--> statement-breakpoint
CREATE INDEX "txn_pending_reference_idx" ON "transactions" USING btree ("reference_submitted_at" timestamptz_ops) WHERE (status = 'pending'::text);--> statement-breakpoint
CREATE INDEX "txn_status_idx" ON "transactions" USING btree ("status" text_ops);--> statement-breakpoint
CREATE INDEX "payout_merchant_idx" ON "payout_accounts" USING btree ("merchant_id" text_ops);--> statement-breakpoint
CREATE INDEX "webhook_merchant_idx" ON "webhook_endpoints" USING btree ("merchant_id" text_ops);--> statement-breakpoint
CREATE INDEX "email_token_merchant_idx" ON "email_tokens" USING btree ("merchant_id" text_ops);--> statement-breakpoint
CREATE INDEX "pending_signup_email_idx" ON "pending_signups" USING btree ("email" text_ops);--> statement-breakpoint
CREATE INDEX "push_merchant_idx" ON "push_subscriptions" USING btree ("merchant_id" text_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "inventory_business_external_idx" ON "inventory_items" USING btree ("business_id" text_ops,"external_id" text_ops);--> statement-breakpoint
CREATE INDEX "inventory_business_idx" ON "inventory_items" USING btree ("business_id" text_ops);--> statement-breakpoint
CREATE INDEX "business_merchant_idx" ON "businesses" USING btree ("merchant_id" text_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "business_slug_idx" ON "businesses" USING btree ("slug" text_ops);--> statement-breakpoint
CREATE INDEX "plink_merchant_idx" ON "payment_links" USING btree ("merchant_id" text_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "plink_slug_idx" ON "payment_links" USING btree ("slug" text_ops);--> statement-breakpoint
CREATE INDEX "telegram_merchant_idx" ON "telegram_chats" USING btree ("merchant_id" text_ops);--> statement-breakpoint
CREATE INDEX "ledger_business_idx" ON "ledger_entries" USING btree ("business_id" text_ops);--> statement-breakpoint
CREATE INDEX "ledger_customer_idx" ON "ledger_entries" USING btree ("business_id" text_ops,"customer_phone" text_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "merchant_alert_idx" ON "merchant_alerts" USING btree ("merchant_id" text_ops,"kind" text_ops,"dedupe_key" text_ops);--> statement-breakpoint
CREATE INDEX "merchant_alert_sent_idx" ON "merchant_alerts" USING btree ("sent_at" timestamptz_ops);--> statement-breakpoint
CREATE INDEX "admin_audit_actor_idx" ON "admin_audit" USING btree ("actor_email" text_ops);--> statement-breakpoint
CREATE INDEX "admin_audit_created_idx" ON "admin_audit" USING btree ("created_at" timestamptz_ops);--> statement-breakpoint
CREATE INDEX "admin_audit_target_idx" ON "admin_audit" USING btree ("target_type" text_ops,"target_id" text_ops);--> statement-breakpoint
CREATE INDEX "merchant_approved_idx" ON "merchants" USING btree ("approved_at" timestamptz_ops);--> statement-breakpoint
CREATE INDEX "merchant_deleted_idx" ON "merchants" USING btree ("deleted_at" timestamptz_ops);--> statement-breakpoint
CREATE INDEX "merchant_flagged_idx" ON "merchants" USING btree ("flagged_at" timestamptz_ops);--> statement-breakpoint
CREATE INDEX "merchant_suspended_idx" ON "merchants" USING btree ("suspended_at" timestamptz_ops);--> statement-breakpoint
CREATE INDEX "verification_attempt_created_idx" ON "verification_attempts" USING btree ("created_at" timestamptz_ops);--> statement-breakpoint
CREATE INDEX "verification_attempt_txn_idx" ON "verification_attempts" USING btree ("transaction_id" text_ops);--> statement-breakpoint
CREATE INDEX "ticket_created_idx" ON "support_tickets" USING btree ("created_at" timestamptz_ops);--> statement-breakpoint
CREATE INDEX "ticket_merchant_idx" ON "support_tickets" USING btree ("merchant_id" text_ops);--> statement-breakpoint
CREATE INDEX "ticket_status_idx" ON "support_tickets" USING btree ("status" text_ops);--> statement-breakpoint
CREATE INDEX "ticket_txn_idx" ON "support_tickets" USING btree ("transaction_id" text_ops);--> statement-breakpoint
CREATE INDEX "admin_push_actor_idx" ON "admin_push_subscriptions" USING btree ("actor_subject" text_ops);--> statement-breakpoint
CREATE INDEX "verification_app_business_idx" ON "verification_applications" USING btree ("business_id" text_ops);--> statement-breakpoint
CREATE INDEX "verification_app_merchant_idx" ON "verification_applications" USING btree ("merchant_id" text_ops);--> statement-breakpoint
CREATE INDEX "verification_app_status_idx" ON "verification_applications" USING btree ("status" text_ops);--> statement-breakpoint
CREATE INDEX "verification_app_submitted_idx" ON "verification_applications" USING btree ("submitted_at" timestamptz_ops);
*/