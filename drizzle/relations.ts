import { relations } from "drizzle-orm/relations";
import { merchants, apiKeys, businesses, transactions, webhookDeliveries, webhookEndpoints, telegramOrderCards, payoutAccounts, emailTokens, pushSubscriptions, inventoryItems, paymentLinks, telegramChats, ledgerEntries, merchantAlerts, verificationAttempts, supportTickets, verificationApplications } from "./schema";

export const apiKeysRelations = relations(apiKeys, ({one}) => ({
	merchant: one(merchants, {
		fields: [apiKeys.merchantId],
		references: [merchants.id]
	}),
	business: one(businesses, {
		fields: [apiKeys.businessId],
		references: [businesses.id]
	}),
}));

export const merchantsRelations = relations(merchants, ({many}) => ({
	apiKeys: many(apiKeys),
	transactions: many(transactions),
	payoutAccounts: many(payoutAccounts),
	webhookEndpoints: many(webhookEndpoints),
	emailTokens: many(emailTokens),
	pushSubscriptions: many(pushSubscriptions),
	inventoryItems: many(inventoryItems),
	businesses: many(businesses),
	paymentLinks: many(paymentLinks),
	telegramChats: many(telegramChats),
	ledgerEntries: many(ledgerEntries),
	merchantAlerts: many(merchantAlerts),
	supportTickets: many(supportTickets),
	verificationApplications: many(verificationApplications),
}));

export const businessesRelations = relations(businesses, ({one, many}) => ({
	apiKeys: many(apiKeys),
	transactions: many(transactions),
	payoutAccounts: many(payoutAccounts),
	webhookEndpoints: many(webhookEndpoints),
	inventoryItems: many(inventoryItems),
	merchant: one(merchants, {
		fields: [businesses.merchantId],
		references: [merchants.id]
	}),
	paymentLinks: many(paymentLinks),
	ledgerEntries: many(ledgerEntries),
	verificationApplications: many(verificationApplications),
}));

export const webhookDeliveriesRelations = relations(webhookDeliveries, ({one}) => ({
	transaction: one(transactions, {
		fields: [webhookDeliveries.transactionId],
		references: [transactions.id]
	}),
	webhookEndpoint: one(webhookEndpoints, {
		fields: [webhookDeliveries.endpointId],
		references: [webhookEndpoints.id]
	}),
}));

export const transactionsRelations = relations(transactions, ({one, many}) => ({
	webhookDeliveries: many(webhookDeliveries),
	telegramOrderCards: many(telegramOrderCards),
	merchant: one(merchants, {
		fields: [transactions.merchantId],
		references: [merchants.id]
	}),
	business: one(businesses, {
		fields: [transactions.businessId],
		references: [businesses.id]
	}),
	payoutAccount: one(payoutAccounts, {
		fields: [transactions.payoutAccountId],
		references: [payoutAccounts.id]
	}),
	ledgerEntries: many(ledgerEntries),
	verificationAttempts: many(verificationAttempts),
	supportTickets: many(supportTickets),
}));

export const webhookEndpointsRelations = relations(webhookEndpoints, ({one, many}) => ({
	webhookDeliveries: many(webhookDeliveries),
	merchant: one(merchants, {
		fields: [webhookEndpoints.merchantId],
		references: [merchants.id]
	}),
	business: one(businesses, {
		fields: [webhookEndpoints.businessId],
		references: [businesses.id]
	}),
}));

export const telegramOrderCardsRelations = relations(telegramOrderCards, ({one}) => ({
	transaction: one(transactions, {
		fields: [telegramOrderCards.transactionId],
		references: [transactions.id]
	}),
}));

export const payoutAccountsRelations = relations(payoutAccounts, ({one, many}) => ({
	transactions: many(transactions),
	merchant: one(merchants, {
		fields: [payoutAccounts.merchantId],
		references: [merchants.id]
	}),
	business: one(businesses, {
		fields: [payoutAccounts.businessId],
		references: [businesses.id]
	}),
}));

export const emailTokensRelations = relations(emailTokens, ({one}) => ({
	merchant: one(merchants, {
		fields: [emailTokens.merchantId],
		references: [merchants.id]
	}),
}));

export const pushSubscriptionsRelations = relations(pushSubscriptions, ({one}) => ({
	merchant: one(merchants, {
		fields: [pushSubscriptions.merchantId],
		references: [merchants.id]
	}),
}));

export const inventoryItemsRelations = relations(inventoryItems, ({one}) => ({
	merchant: one(merchants, {
		fields: [inventoryItems.merchantId],
		references: [merchants.id]
	}),
	business: one(businesses, {
		fields: [inventoryItems.businessId],
		references: [businesses.id]
	}),
}));

export const paymentLinksRelations = relations(paymentLinks, ({one}) => ({
	merchant: one(merchants, {
		fields: [paymentLinks.merchantId],
		references: [merchants.id]
	}),
	business: one(businesses, {
		fields: [paymentLinks.businessId],
		references: [businesses.id]
	}),
}));

export const telegramChatsRelations = relations(telegramChats, ({one}) => ({
	merchant: one(merchants, {
		fields: [telegramChats.merchantId],
		references: [merchants.id]
	}),
}));

export const ledgerEntriesRelations = relations(ledgerEntries, ({one}) => ({
	merchant: one(merchants, {
		fields: [ledgerEntries.merchantId],
		references: [merchants.id]
	}),
	business: one(businesses, {
		fields: [ledgerEntries.businessId],
		references: [businesses.id]
	}),
	transaction: one(transactions, {
		fields: [ledgerEntries.transactionId],
		references: [transactions.id]
	}),
}));

export const merchantAlertsRelations = relations(merchantAlerts, ({one}) => ({
	merchant: one(merchants, {
		fields: [merchantAlerts.merchantId],
		references: [merchants.id]
	}),
}));

export const verificationAttemptsRelations = relations(verificationAttempts, ({one}) => ({
	transaction: one(transactions, {
		fields: [verificationAttempts.transactionId],
		references: [transactions.id]
	}),
}));

export const supportTicketsRelations = relations(supportTickets, ({one}) => ({
	transaction: one(transactions, {
		fields: [supportTickets.transactionId],
		references: [transactions.id]
	}),
	merchant: one(merchants, {
		fields: [supportTickets.merchantId],
		references: [merchants.id]
	}),
}));

export const verificationApplicationsRelations = relations(verificationApplications, ({one}) => ({
	business: one(businesses, {
		fields: [verificationApplications.businessId],
		references: [businesses.id]
	}),
	merchant: one(merchants, {
		fields: [verificationApplications.merchantId],
		references: [merchants.id]
	}),
}));