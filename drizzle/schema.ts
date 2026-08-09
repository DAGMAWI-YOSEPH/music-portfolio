import { pgTable, index, uniqueIndex, foreignKey, unique, text, boolean, timestamp, integer } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"



export const apiKeys = pgTable("api_keys", {
	id: text().primaryKey().notNull(),
	merchantId: text("merchant_id").notNull(),
	publicKey: text("public_key").notNull(),
	secretPrefix: text("secret_prefix").notNull(),
	secretHash: text("secret_hash").notNull(),
	label: text(),
	revoked: boolean().default(false).notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	businessId: text("business_id"),
}, (table) => [
	index("apikey_merchant_idx").using("btree", table.merchantId.asc().nullsLast().op("text_ops")),
	uniqueIndex("apikey_public_idx").using("btree", table.publicKey.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.merchantId],
			foreignColumns: [merchants.id],
			name: "api_keys_merchant_id_merchants_id_fk"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.businessId],
			foreignColumns: [businesses.id],
			name: "api_keys_business_id_businesses_id_fk"
		}).onDelete("set null"),
	unique("api_keys_public_key_unique").on(table.publicKey),
]);

export const webhookDeliveries = pgTable("webhook_deliveries", {
	id: text().primaryKey().notNull(),
	transactionId: text("transaction_id").notNull(),
	endpointId: text("endpoint_id"),
	url: text().notNull(),
	event: text().notNull(),
	payload: text().notNull(),
	status: text().default('pending').notNull(),
	attempts: integer().default(0).notNull(),
	responseCode: integer("response_code"),
	lastAttemptAt: timestamp("last_attempt_at", { withTimezone: true, mode: 'string' }),
	nextAttemptAt: timestamp("next_attempt_at", { withTimezone: true, mode: 'string' }),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("delivery_txn_idx").using("btree", table.transactionId.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.transactionId],
			foreignColumns: [transactions.id],
			name: "webhook_deliveries_transaction_id_transactions_id_fk"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.endpointId],
			foreignColumns: [webhookEndpoints.id],
			name: "webhook_deliveries_endpoint_id_webhook_endpoints_id_fk"
		}).onDelete("set null"),
]);

export const telegramOrderCards = pgTable("telegram_order_cards", {
	id: text().primaryKey().notNull(),
	transactionId: text("transaction_id").notNull(),
	chatId: text("chat_id").notNull(),
	messageId: text("message_id").notNull(),
	isPhoto: boolean("is_photo").default(false).notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	stage: text().default('created').notNull(),
}, (table) => [
	uniqueIndex("telegram_card_chat_msg_idx").using("btree", table.chatId.asc().nullsLast().op("text_ops"), table.messageId.asc().nullsLast().op("text_ops")),
	index("telegram_card_txn_idx").using("btree", table.transactionId.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.transactionId],
			foreignColumns: [transactions.id],
			name: "telegram_order_cards_transaction_id_fkey"
		}).onDelete("cascade"),
]);

export const transactions = pgTable("transactions", {
	id: text().primaryKey().notNull(),
	txRef: text("tx_ref").notNull(),
	merchantId: text("merchant_id").notNull(),
	baseAmount: integer("base_amount").notNull(),
	matchDelta: integer("match_delta").default(0).notNull(),
	amount: integer().notNull(),
	matchRef: text("match_ref").notNull(),
	currency: text().default('ETB').notNull(),
	status: text().default('pending').notNull(),
	payoutAccountId: text("payout_account_id"),
	paymentTxnId: text("payment_txn_id"),
	verificationMethod: text("verification_method"),
	customerEmail: text("customer_email"),
	customerName: text("customer_name"),
	customerPhone: text("customer_phone"),
	callbackUrl: text("callback_url"),
	returnUrl: text("return_url"),
	title: text(),
	description: text(),
	meta: text(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	paidAt: timestamp("paid_at", { withTimezone: true, mode: 'string' }),
	expiresAt: timestamp("expires_at", { withTimezone: true, mode: 'string' }),
	businessId: text("business_id"),
	paidPlace: text("paid_place"),
	paidNote: text("paid_note"),
	idempotencyKey: text("idempotency_key"),
	autoRejectedReason: text("auto_rejected_reason"),
	rejectedAttempts: integer("rejected_attempts").default(0).notNull(),
	referenceSubmittedAt: timestamp("reference_submitted_at", { withTimezone: true, mode: 'string' }),
}, (table) => [
	uniqueIndex("txn_idempotency_idx").using("btree", table.merchantId.asc().nullsLast().op("text_ops"), table.idempotencyKey.asc().nullsLast().op("text_ops")),
	index("txn_merchant_idx").using("btree", table.merchantId.asc().nullsLast().op("text_ops")),
	uniqueIndex("txn_merchant_ref_idx").using("btree", table.merchantId.asc().nullsLast().op("text_ops"), table.txRef.asc().nullsLast().op("text_ops")),
	index("txn_pending_reference_idx").using("btree", table.referenceSubmittedAt.asc().nullsLast().op("timestamptz_ops")).where(sql`(status = 'pending'::text)`),
	index("txn_status_idx").using("btree", table.status.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.merchantId],
			foreignColumns: [merchants.id],
			name: "transactions_merchant_id_merchants_id_fk"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.businessId],
			foreignColumns: [businesses.id],
			name: "transactions_business_id_businesses_id_fk"
		}).onDelete("set null"),
	foreignKey({
			columns: [table.payoutAccountId],
			foreignColumns: [payoutAccounts.id],
			name: "transactions_payout_account_id_payout_accounts_id_fk"
		}).onDelete("set null"),
]);

export const payoutAccounts = pgTable("payout_accounts", {
	id: text().primaryKey().notNull(),
	merchantId: text("merchant_id").notNull(),
	channel: text().notNull(),
	accountName: text("account_name").notNull(),
	accountNumber: text("account_number").notNull(),
	instructions: text(),
	isActive: boolean("is_active").default(true).notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	businessId: text("business_id"),
	qrCode: text("qr_code"),
}, (table) => [
	index("payout_merchant_idx").using("btree", table.merchantId.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.merchantId],
			foreignColumns: [merchants.id],
			name: "payout_accounts_merchant_id_merchants_id_fk"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.businessId],
			foreignColumns: [businesses.id],
			name: "payout_accounts_business_id_businesses_id_fk"
		}).onDelete("set null"),
]);

export const webhookEndpoints = pgTable("webhook_endpoints", {
	id: text().primaryKey().notNull(),
	merchantId: text("merchant_id").notNull(),
	url: text().notNull(),
	secret: text().notNull(),
	isActive: boolean("is_active").default(true).notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	businessId: text("business_id"),
}, (table) => [
	index("webhook_merchant_idx").using("btree", table.merchantId.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.merchantId],
			foreignColumns: [merchants.id],
			name: "webhook_endpoints_merchant_id_merchants_id_fk"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.businessId],
			foreignColumns: [businesses.id],
			name: "webhook_endpoints_business_id_businesses_id_fk"
		}).onDelete("set null"),
]);

export const emailTokens = pgTable("email_tokens", {
	id: text().primaryKey().notNull(),
	merchantId: text("merchant_id").notNull(),
	tokenHash: text("token_hash").notNull(),
	expiresAt: timestamp("expires_at", { withTimezone: true, mode: 'string' }).notNull(),
	usedAt: timestamp("used_at", { withTimezone: true, mode: 'string' }),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("email_token_merchant_idx").using("btree", table.merchantId.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.merchantId],
			foreignColumns: [merchants.id],
			name: "email_tokens_merchant_id_merchants_id_fk"
		}).onDelete("cascade"),
]);

export const pendingSignups = pgTable("pending_signups", {
	id: text().primaryKey().notNull(),
	name: text().notNull(),
	email: text().notNull(),
	passwordHash: text("password_hash").notNull(),
	tokenHash: text("token_hash").notNull(),
	expiresAt: timestamp("expires_at", { withTimezone: true, mode: 'string' }).notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	businessName: text("business_name"),
	businessLogo: text("business_logo"),
}, (table) => [
	index("pending_signup_email_idx").using("btree", table.email.asc().nullsLast().op("text_ops")),
]);

export const pushSubscriptions = pgTable("push_subscriptions", {
	id: text().primaryKey().notNull(),
	merchantId: text("merchant_id").notNull(),
	endpoint: text().notNull(),
	p256Dh: text().notNull(),
	auth: text().notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("push_merchant_idx").using("btree", table.merchantId.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.merchantId],
			foreignColumns: [merchants.id],
			name: "push_subscriptions_merchant_id_merchants_id_fk"
		}).onDelete("cascade"),
	unique("push_subscriptions_endpoint_unique").on(table.endpoint),
]);

export const inventoryItems = pgTable("inventory_items", {
	id: text().primaryKey().notNull(),
	merchantId: text("merchant_id").notNull(),
	businessId: text("business_id").notNull(),
	externalId: text("external_id").notNull(),
	name: text().notNull(),
	sku: text(),
	price: integer(),
	stockQty: integer("stock_qty"),
	inStock: boolean("in_stock").default(true).notNull(),
	imageUrl: text("image_url"),
	productUrl: text("product_url"),
	isActive: boolean("is_active").default(true).notNull(),
	syncedAt: timestamp("synced_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	uniqueIndex("inventory_business_external_idx").using("btree", table.businessId.asc().nullsLast().op("text_ops"), table.externalId.asc().nullsLast().op("text_ops")),
	index("inventory_business_idx").using("btree", table.businessId.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.merchantId],
			foreignColumns: [merchants.id],
			name: "inventory_items_merchant_id_merchants_id_fk"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.businessId],
			foreignColumns: [businesses.id],
			name: "inventory_items_business_id_businesses_id_fk"
		}).onDelete("cascade"),
]);

export const businesses = pgTable("businesses", {
	id: text().primaryKey().notNull(),
	merchantId: text("merchant_id").notNull(),
	name: text().notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	logo: text(),
	slug: text(),
	tagline: text(),
	verifiedAt: timestamp("verified_at", { withTimezone: true, mode: 'string' }),
	storefrontEnabled: boolean("storefront_enabled").default(false).notNull(),
	storeAbout: text("store_about"),
	storeUrl: text("store_url"),
	uniqueAmounts: boolean("unique_amounts").default(false).notNull(),
}, (table) => [
	index("business_merchant_idx").using("btree", table.merchantId.asc().nullsLast().op("text_ops")),
	uniqueIndex("business_slug_idx").using("btree", table.slug.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.merchantId],
			foreignColumns: [merchants.id],
			name: "businesses_merchant_id_merchants_id_fk"
		}).onDelete("cascade"),
]);

export const paymentLinks = pgTable("payment_links", {
	id: text().primaryKey().notNull(),
	merchantId: text("merchant_id").notNull(),
	businessId: text("business_id").notNull(),
	slug: text().notNull(),
	title: text(),
	description: text(),
	mode: text().default('fixed').notNull(),
	baseAmount: integer("base_amount"),
	presetAmounts: text("preset_amounts"),
	minAmount: integer("min_amount"),
	maxUses: integer("max_uses"),
	useCount: integer("use_count").default(0).notNull(),
	isActive: boolean("is_active").default(true).notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("plink_merchant_idx").using("btree", table.merchantId.asc().nullsLast().op("text_ops")),
	uniqueIndex("plink_slug_idx").using("btree", table.slug.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.merchantId],
			foreignColumns: [merchants.id],
			name: "payment_links_merchant_id_merchants_id_fk"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.businessId],
			foreignColumns: [businesses.id],
			name: "payment_links_business_id_businesses_id_fk"
		}).onDelete("cascade"),
]);

export const telegramChats = pgTable("telegram_chats", {
	id: text().primaryKey().notNull(),
	merchantId: text("merchant_id").notNull(),
	chatId: text("chat_id").notNull(),
	username: text(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	dailyDigest: boolean("daily_digest").default(true).notNull(),
	stockAlerts: boolean("stock_alerts").default(true).notNull(),
	expiryAlerts: boolean("expiry_alerts").default(true).notNull(),
}, (table) => [
	index("telegram_merchant_idx").using("btree", table.merchantId.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.merchantId],
			foreignColumns: [merchants.id],
			name: "telegram_chats_merchant_id_fkey"
		}).onDelete("cascade"),
	unique("telegram_chats_chat_id_key").on(table.chatId),
]);

export const ledgerEntries = pgTable("ledger_entries", {
	id: text().primaryKey().notNull(),
	merchantId: text("merchant_id").notNull(),
	businessId: text("business_id").notNull(),
	customerName: text("customer_name").notNull(),
	customerPhone: text("customer_phone"),
	kind: text().notNull(),
	amount: integer().notNull(),
	note: text(),
	transactionId: text("transaction_id"),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("ledger_business_idx").using("btree", table.businessId.asc().nullsLast().op("text_ops")),
	index("ledger_customer_idx").using("btree", table.businessId.asc().nullsLast().op("text_ops"), table.customerPhone.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.merchantId],
			foreignColumns: [merchants.id],
			name: "ledger_entries_merchant_id_fkey"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.businessId],
			foreignColumns: [businesses.id],
			name: "ledger_entries_business_id_fkey"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.transactionId],
			foreignColumns: [transactions.id],
			name: "ledger_entries_transaction_id_fkey"
		}).onDelete("set null"),
]);

export const merchantAlerts = pgTable("merchant_alerts", {
	id: text().primaryKey().notNull(),
	merchantId: text("merchant_id").notNull(),
	kind: text().notNull(),
	dedupeKey: text("dedupe_key").notNull(),
	sentAt: timestamp("sent_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	uniqueIndex("merchant_alert_idx").using("btree", table.merchantId.asc().nullsLast().op("text_ops"), table.kind.asc().nullsLast().op("text_ops"), table.dedupeKey.asc().nullsLast().op("text_ops")),
	index("merchant_alert_sent_idx").using("btree", table.sentAt.asc().nullsLast().op("timestamptz_ops")),
	foreignKey({
			columns: [table.merchantId],
			foreignColumns: [merchants.id],
			name: "merchant_alerts_merchant_id_fkey"
		}).onDelete("cascade"),
]);

export const adminAudit = pgTable("admin_audit", {
	id: text().primaryKey().notNull(),
	actorSubject: text("actor_subject").notNull(),
	actorEmail: text("actor_email").notNull(),
	action: text().notNull(),
	targetType: text("target_type"),
	targetId: text("target_id"),
	reason: text(),
	detail: text(),
	ip: text(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("admin_audit_actor_idx").using("btree", table.actorEmail.asc().nullsLast().op("text_ops")),
	index("admin_audit_created_idx").using("btree", table.createdAt.asc().nullsLast().op("timestamptz_ops")),
	index("admin_audit_target_idx").using("btree", table.targetType.asc().nullsLast().op("text_ops"), table.targetId.asc().nullsLast().op("text_ops")),
]);

export const merchants = pgTable("merchants", {
	id: text().primaryKey().notNull(),
	name: text().notNull(),
	email: text().notNull(),
	passwordHash: text("password_hash").notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	avatar: text(),
	emailVerifiedAt: timestamp("email_verified_at", { withTimezone: true, mode: 'string' }),
	totpSecret: text("totp_secret"),
	totpEnabledAt: timestamp("totp_enabled_at", { withTimezone: true, mode: 'string' }),
	totpBackupCodes: text("totp_backup_codes"),
	suspendedAt: timestamp("suspended_at", { withTimezone: true, mode: 'string' }),
	suspendedReason: text("suspended_reason"),
	approvedAt: timestamp("approved_at", { withTimezone: true, mode: 'string' }),
	deletedAt: timestamp("deleted_at", { withTimezone: true, mode: 'string' }),
	flaggedAt: timestamp("flagged_at", { withTimezone: true, mode: 'string' }),
	flaggedReason: text("flagged_reason"),
}, (table) => [
	index("merchant_approved_idx").using("btree", table.approvedAt.asc().nullsLast().op("timestamptz_ops")),
	index("merchant_deleted_idx").using("btree", table.deletedAt.asc().nullsLast().op("timestamptz_ops")),
	index("merchant_flagged_idx").using("btree", table.flaggedAt.asc().nullsLast().op("timestamptz_ops")),
	index("merchant_suspended_idx").using("btree", table.suspendedAt.asc().nullsLast().op("timestamptz_ops")),
	unique("merchants_email_unique").on(table.email),
]);

export const verificationAttempts = pgTable("verification_attempts", {
	id: text().primaryKey().notNull(),
	transactionId: text("transaction_id").notNull(),
	channel: text().notNull(),
	reference: text(),
	outcome: text().notNull(),
	reason: text(),
	verifier: text(),
	durationMs: integer("duration_ms"),
	raw: text(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("verification_attempt_created_idx").using("btree", table.createdAt.asc().nullsLast().op("timestamptz_ops")),
	index("verification_attempt_txn_idx").using("btree", table.transactionId.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.transactionId],
			foreignColumns: [transactions.id],
			name: "verification_attempts_transaction_id_fkey"
		}).onDelete("cascade"),
]);

export const supportTickets = pgTable("support_tickets", {
	id: text().primaryKey().notNull(),
	reference: text().notNull(),
	source: text().notNull(),
	transactionId: text("transaction_id"),
	merchantId: text("merchant_id"),
	category: text().default('other').notNull(),
	message: text().notNull(),
	contactName: text("contact_name"),
	contactPhone: text("contact_phone"),
	contactEmail: text("contact_email"),
	status: text().default('open').notNull(),
	resolution: text(),
	resolvedBy: text("resolved_by"),
	resolvedAt: timestamp("resolved_at", { withTimezone: true, mode: 'string' }),
	acknowledgedBy: text("acknowledged_by"),
	acknowledgedAt: timestamp("acknowledged_at", { withTimezone: true, mode: 'string' }),
	ip: text(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("ticket_created_idx").using("btree", table.createdAt.asc().nullsLast().op("timestamptz_ops")),
	index("ticket_merchant_idx").using("btree", table.merchantId.asc().nullsLast().op("text_ops")),
	index("ticket_status_idx").using("btree", table.status.asc().nullsLast().op("text_ops")),
	index("ticket_txn_idx").using("btree", table.transactionId.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.transactionId],
			foreignColumns: [transactions.id],
			name: "support_tickets_transaction_id_fkey"
		}).onDelete("set null"),
	foreignKey({
			columns: [table.merchantId],
			foreignColumns: [merchants.id],
			name: "support_tickets_merchant_id_fkey"
		}).onDelete("set null"),
	unique("support_tickets_reference_key").on(table.reference),
]);

export const adminPushSubscriptions = pgTable("admin_push_subscriptions", {
	id: text().primaryKey().notNull(),
	actorSubject: text("actor_subject").notNull(),
	actorEmail: text("actor_email").notNull(),
	endpoint: text().notNull(),
	p256Dh: text().notNull(),
	auth: text().notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("admin_push_actor_idx").using("btree", table.actorSubject.asc().nullsLast().op("text_ops")),
	unique("admin_push_subscriptions_endpoint_key").on(table.endpoint),
]);

export const verificationApplications = pgTable("verification_applications", {
	id: text().primaryKey().notNull(),
	businessId: text("business_id").notNull(),
	merchantId: text("merchant_id").notNull(),
	status: text().default('pending').notNull(),
	legalName: text("legal_name").notNull(),
	tin: text(),
	licenceNumber: text("licence_number"),
	address: text().notNull(),
	phone: text().notNull(),
	website: text(),
	licenceDocPath: text("licence_doc_path"),
	licenceDocName: text("licence_doc_name"),
	licenceDocSize: integer("licence_doc_size"),
	idDocPath: text("id_doc_path"),
	idDocName: text("id_doc_name"),
	idDocSize: integer("id_doc_size"),
	reviewerEmail: text("reviewer_email"),
	reviewNote: text("review_note"),
	reviewedAt: timestamp("reviewed_at", { withTimezone: true, mode: 'string' }),
	submittedAt: timestamp("submitted_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("verification_app_business_idx").using("btree", table.businessId.asc().nullsLast().op("text_ops")),
	index("verification_app_merchant_idx").using("btree", table.merchantId.asc().nullsLast().op("text_ops")),
	index("verification_app_status_idx").using("btree", table.status.asc().nullsLast().op("text_ops")),
	index("verification_app_submitted_idx").using("btree", table.submittedAt.asc().nullsLast().op("timestamptz_ops")),
	foreignKey({
			columns: [table.businessId],
			foreignColumns: [businesses.id],
			name: "verification_applications_business_id_fkey"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.merchantId],
			foreignColumns: [merchants.id],
			name: "verification_applications_merchant_id_fkey"
		}).onDelete("cascade"),
]);
