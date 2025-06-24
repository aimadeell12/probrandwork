import {
  pgTable,
  text,
  varchar,
  timestamp,
  jsonb,
  index,
  serial,
  integer,
  decimal,
  boolean,
  uuid,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// Session storage table for Replit Auth
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table for Replit Auth and local auth
export const users = pgTable("users", {
  id: varchar("id").primaryKey().notNull(),
  email: varchar("email").unique(),
  username: varchar("username").unique(),
  password: varchar("password"), // for local auth
  googleId: varchar("google_id").unique(), // for Google OAuth
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  phone: varchar("phone"),
  address: varchar("address"),
  dateOfBirth: varchar("date_of_birth"),
  nationality: varchar("nationality"),
  idDocumentNumber: varchar("id_document_number"),
  idDocumentType: varchar("id_document_type"),
  occupation: varchar("occupation"),
  city: varchar("city"),
  postalCode: varchar("postal_code"),
  country: varchar("country").default("MAR"),
  role: varchar("role").notNull().default("user"), // user, admin
  authType: varchar("auth_type").notNull().default("local"), // replit, local
  // Security settings
  twoFactorEnabled: boolean("two_factor_enabled").default(false),
  biometricEnabled: boolean("biometric_enabled").default(false),
  loginNotifications: boolean("login_notifications").default(true),
  deviceTracking: boolean("device_tracking").default(false),
  // Notification settings
  emailNotifications: boolean("email_notifications").default(true),
  smsNotifications: boolean("sms_notifications").default(false),
  pushNotifications: boolean("push_notifications").default(true),
  transactionAlerts: boolean("transaction_alerts").default(true),
  marketingEmails: boolean("marketing_emails").default(false),
  // Wallet
  walletBalance: decimal("wallet_balance", { precision: 10, scale: 2 }).default("100.00"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Cards table
export const cards = pgTable("cards", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: varchar("user_id").notNull().references(() => users.id),
  // External provider IDs
  lithicCardId: varchar("lithic_card_id").unique(),
  reapCardId: varchar("reap_card_id").unique(),
  stripeCardId: varchar("stripe_card_id").unique(),
  stripeCardHolderId: varchar("stripe_cardholder_id"),
  // Card details
  holderName: varchar("holder_name"),
  cardNumber: varchar("card_number"), // Full card number (encrypted in production)
  lastFour: varchar("last_four", { length: 4 }),
  cvv: varchar("cvv", { length: 4 }),
  type: varchar("type").notNull(), // virtual, physical
  cardType: varchar("card_type").notNull().default("debit"), // debit, credit, prepaid
  brand: varchar("brand").default("visa"), // visa, mastercard
  status: varchar("status").notNull().default("pending"), // pending, active, suspended, closed, inactive
  balance: decimal("balance", { precision: 12, scale: 2 }).default("0.00"),
  spendingLimit: decimal("spending_limit", { precision: 12, scale: 2 }),
  currency: varchar("currency", { length: 3 }).notNull().default("USD"),
  design: varchar("design").notNull().default("blue"),
  expiryMonth: integer("expiry_month").notNull(),
  expiryYear: integer("expiry_year").notNull(),
  // Card controls
  internationalEnabled: boolean("international_enabled").default(true),
  onlineEnabled: boolean("online_enabled").default(true),
  contactlessEnabled: boolean("contactless_enabled").default(true),
  atmWithdrawalsEnabled: boolean("atm_withdrawals_enabled").default(true),
  notificationsEnabled: boolean("notifications_enabled").default(true),
  // Shipping info for physical cards
  shippingAddress: jsonb("shipping_address"),
  trackingNumber: varchar("tracking_number"),
  shipmentStatus: varchar("shipment_status"), // pending, shipped, delivered
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Transactions table
export const transactions = pgTable("transactions", {
  id: uuid("id").primaryKey().defaultRandom(),
  cardId: uuid("card_id").notNull().references(() => cards.id),
  lithicTransactionId: varchar("lithic_transaction_id").unique(),
  amount: decimal("amount", { precision: 12, scale: 2 }).notNull(),
  currency: varchar("currency", { length: 3 }).notNull(),
  merchant: varchar("merchant"),
  description: text("description"),
  status: varchar("status").notNull(), // pending, completed, failed, declined
  type: varchar("type").notNull(), // purchase, refund, transfer, fee
  createdAt: timestamp("created_at").defaultNow(),
});

// Support tickets table
export const supportTickets = pgTable("support_tickets", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: varchar("user_id").notNull().references(() => users.id),
  subject: varchar("subject").notNull(),
  message: text("message").notNull(),
  status: varchar("status").notNull().default("open"), // open, in_progress, closed
  priority: varchar("priority").notNull().default("medium"), // low, medium, high
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// KYC Verification table
export const kycVerifications = pgTable("kyc_verifications", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: varchar("user_id").notNull().references(() => users.id),
  nationality: varchar("nationality").notNull(),
  firstName: varchar("first_name").notNull(),
  lastName: varchar("last_name").notNull(),
  dateOfBirth: timestamp("date_of_birth").notNull(),
  documentType: varchar("document_type").notNull(), // passport, national_id, driving_license, residence_permit
  idNumber: varchar("id_number").notNull(),
  phoneNumber: varchar("phone_number"),
  email: varchar("email"),
  status: varchar("status").notNull().default("pending"), // pending, under_review, approved, rejected
  submittedAt: timestamp("submitted_at").defaultNow(),
  reviewedAt: timestamp("reviewed_at"),
  rejectionReason: text("rejection_reason"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// KYC Documents table
export const kycDocuments = pgTable("kyc_documents", {
  id: uuid("id").primaryKey().defaultRandom(),
  kycId: uuid("kyc_id").notNull().references(() => kycVerifications.id),
  documentType: varchar("document_type").notNull(), // id-front, id-back, selfie
  fileName: varchar("file_name").notNull(),
  fileUrl: text("file_url").notNull(),
  fileSize: integer("file_size"),
  mimeType: varchar("mime_type"),
  uploadedAt: timestamp("uploaded_at").defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  cards: many(cards),
  supportTickets: many(supportTickets),
  kycVerifications: many(kycVerifications),
  bankTransfers: many(bankTransfers),
  referrals: many(referrals),
  vouchers: many(vouchers),
  discussions: many(discussions),
  discussionReplies: many(discussionReplies),
  eventAttendees: many(eventAttendees),
  currencyConversions: many(currencyConversions),
}));

export const cardsRelations = relations(cards, ({ one, many }) => ({
  user: one(users, {
    fields: [cards.userId],
    references: [users.id],
  }),
  transactions: many(transactions),
}));

export const transactionsRelations = relations(transactions, ({ one }) => ({
  card: one(cards, {
    fields: [transactions.cardId],
    references: [cards.id],
  }),
}));

export const supportTicketsRelations = relations(supportTickets, ({ one }) => ({
  user: one(users, {
    fields: [supportTickets.userId],
    references: [users.id],
  }),
}));

// Banks table
export const banks = pgTable("banks", {
  id: uuid("id").primaryKey().defaultRandom(),
  code: varchar("code").notNull().unique(), // e.g., "cih", "attijari", "sgm"
  name: varchar("name").notNull(), // Arabic name
  nameEn: varchar("name_en").notNull(), // English name
  country: varchar("country").notNull(), // ISO country code e.g., "MAR"
  currency: varchar("currency", { length: 3 }).notNull(), // e.g., "MAD"
  iban: varchar("iban").notNull(), // Bank's IBAN
  accountNumber: varchar("account_number").notNull(),
  swiftCode: varchar("swift_code").notNull(),
  logoUrl: text("logo_url"), // Path to bank logo
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Bank Transfers table
export const bankTransfers = pgTable("bank_transfers", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: varchar("user_id").notNull().references(() => users.id),
  bankId: uuid("bank_id").references(() => banks.id),
  type: varchar("type").notNull(), // incoming, outgoing
  amount: decimal("amount", { precision: 12, scale: 2 }).notNull(),
  currency: varchar("currency", { length: 3 }).notNull().default("USD"),
  recipientName: varchar("recipient_name"),
  recipientBank: varchar("recipient_bank"),
  recipientAccount: varchar("recipient_account"),
  senderName: varchar("sender_name"),
  senderBank: varchar("sender_bank"),
  senderAccount: varchar("sender_account"),
  reference: varchar("reference"),
  description: text("description"),
  status: varchar("status").notNull().default("pending"), // pending, processing, completed, failed, cancelled
  feeAmount: decimal("fee_amount", { precision: 12, scale: 2 }).default("0.00"),
  createdAt: timestamp("created_at").defaultNow(),
  processedAt: timestamp("processed_at"),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Notifications table
export const notifications = pgTable("notifications", {
  id: text("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: text("user_id").notNull().references(() => users.id),
  type: text("type").notNull(), // "transaction", "security", "system", "promotion", "card"
  title: text("title").notNull(),
  message: text("message").notNull(),
  data: jsonb("data"), // Additional data for the notification
  isRead: boolean("is_read").default(false).notNull(),
  priority: text("priority").default("normal").notNull(), // "low", "normal", "high", "urgent"
  actionUrl: text("action_url"), // URL to navigate when notification is clicked
  actionLabel: text("action_label"), // Text for action button
  expiresAt: timestamp("expires_at"), // Optional expiration date
  createdAt: timestamp("created_at").defaultNow().notNull(),
  readAt: timestamp("read_at"),
});

// Notification settings table
export const notificationSettings = pgTable("notification_settings", {
  id: text("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: text("user_id").notNull().references(() => users.id),
  
  // Transaction notifications
  transactionAlerts: boolean("transaction_alerts").default(true).notNull(),
  largeTransactions: boolean("large_transactions").default(true).notNull(),
  failedTransactions: boolean("failed_transactions").default(true).notNull(),
  
  // Security notifications
  loginAlerts: boolean("login_alerts").default(true).notNull(),
  passwordChanges: boolean("password_changes").default(true).notNull(),
  accountChanges: boolean("account_changes").default(true).notNull(),
  
  // Marketing notifications
  promotions: boolean("promotions").default(false).notNull(),
  newsletters: boolean("newsletters").default(true).notNull(),
  productUpdates: boolean("product_updates").default(true).notNull(),
  
  // Delivery preferences
  emailNotifications: boolean("email_notifications").default(true).notNull(),
  pushNotifications: boolean("push_notifications").default(true).notNull(),
  smsNotifications: boolean("sms_notifications").default(false).notNull(),
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const notificationsRelations = relations(notifications, ({ one }) => ({
  user: one(users, {
    fields: [notifications.userId],
    references: [users.id],
  }),
}));

export const notificationSettingsRelations = relations(notificationSettings, ({ one }) => ({
  user: one(users, {
    fields: [notificationSettings.userId],
    references: [users.id],
  }),
}));

export const banksRelations = relations(banks, ({ many }) => ({
  bankTransfers: many(bankTransfers),
}));

export const bankTransfersRelations = relations(bankTransfers, ({ one }) => ({
  user: one(users, {
    fields: [bankTransfers.userId],
    references: [users.id],
  }),
  bank: one(banks, {
    fields: [bankTransfers.bankId],
    references: [banks.id],
  }),
}));

// Schemas
export const insertUserSchema = createInsertSchema(users).omit({
  createdAt: true,
  updatedAt: true,
});

export const loginSchema = z.object({
  username: z.string().min(1, "اسم المستخدم مطلوب"),
  password: z.string().min(6, "كلمة المرور يجب أن تكون 6 أحرف على الأقل"),
});

export const registerSchema = z.object({
  username: z.string().min(3, "اسم المستخدم يجب أن يكون 3 أحرف على الأقل"),
  email: z.string().email("البريد الإلكتروني غير صحيح"),
  password: z.string().min(6, "كلمة المرور يجب أن تكون 6 أحرف على الأقل"),
  firstName: z.string().min(1, "الاسم الأول مطلوب"),
  lastName: z.string().min(1, "الاسم الأخير مطلوب"),
});

export const insertCardSchema = createInsertSchema(cards).omit({
  id: true,
  lithicCardId: true,
  holderName: true,
  lastFour: true,
  status: true,
  balance: true,
  expiryMonth: true,
  expiryYear: true,
  createdAt: true,
  updatedAt: true,
});

export const insertTransactionSchema = createInsertSchema(transactions).omit({
  id: true,
  lithicTransactionId: true,
  createdAt: true,
});

export const insertSupportTicketSchema = createInsertSchema(supportTickets).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertNotificationSchema = createInsertSchema(notifications).omit({
  id: true,
  createdAt: true,
  readAt: true,
});

export const insertNotificationSettingsSchema = createInsertSchema(notificationSettings).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertKycVerificationSchema = createInsertSchema(kycVerifications).omit({
  id: true,
  submittedAt: true,
  reviewedAt: true,
  createdAt: true,
  updatedAt: true,
});

export const insertKycDocumentSchema = createInsertSchema(kycDocuments).omit({
  id: true,
  uploadedAt: true,
});

export const insertBankSchema = createInsertSchema(banks).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertBankTransferSchema = createInsertSchema(bankTransfers).omit({
  id: true,
  createdAt: true,
  processedAt: true,
  updatedAt: true,
});

// Enhanced KYC schema with address fields
export const kycVerificationFormSchema = z.object({
  nationality: z.string().min(1, "الجنسية مطلوبة"),
  firstName: z.string().min(1, "الاسم الأول مطلوب"),
  lastName: z.string().min(1, "الاسم الأخير مطلوب"),
  dateOfBirth: z.string().refine((date) => {
    const birthDate = new Date(date);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      return age - 1 >= 18;
    }
    return age >= 18;
  }, "يجب أن يكون عمرك 18 سنة أو أكثر"),
  documentType: z.string().min(1, "نوع الوثيقة مطلوب"),
  idNumber: z.string().min(1, "رقم الهوية مطلوب"),
  phoneNumber: z.string().optional(),
  email: z.string().email("البريد الإلكتروني غير صحيح").optional(),
  streetAddress: z.string().min(1, "عنوان الشارع مطلوب"),
  city: z.string().min(1, "المدينة مطلوبة"),
  postalCode: z.string().min(1, "الرمز البريدي مطلوب"),
});

// Types
export type UpsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertCard = z.infer<typeof insertCardSchema>;
export type Card = typeof cards.$inferSelect;
export type InsertTransaction = z.infer<typeof insertTransactionSchema>;
export type Transaction = typeof transactions.$inferSelect;
export type InsertSupportTicket = z.infer<typeof insertSupportTicketSchema>;
export type SupportTicket = typeof supportTickets.$inferSelect;
export type InsertNotification = z.infer<typeof insertNotificationSchema>;
export type Notification = typeof notifications.$inferSelect;
export type InsertNotificationSettings = z.infer<typeof insertNotificationSettingsSchema>;
export type NotificationSettings = typeof notificationSettings.$inferSelect;
export type InsertKycVerification = z.infer<typeof insertKycVerificationSchema>;
export type KycVerification = typeof kycVerifications.$inferSelect;
export type InsertKycDocument = z.infer<typeof insertKycDocumentSchema>;
export type KycDocument = typeof kycDocuments.$inferSelect;
export type KycVerificationForm = z.infer<typeof kycVerificationFormSchema>;

export type InsertBank = z.infer<typeof insertBankSchema>;
export type Bank = typeof banks.$inferSelect;
export type InsertBankTransfer = z.infer<typeof insertBankTransferSchema>;
export type BankTransfer = typeof bankTransfers.$inferSelect;

// Referral Program table
export const referrals = pgTable("referrals", {
  id: uuid("id").primaryKey().defaultRandom(),
  referrerId: varchar("referrer_id").notNull().references(() => users.id),
  refereeId: varchar("referee_id").references(() => users.id),
  referralCode: varchar("referral_code").notNull().unique(),
  status: varchar("status").notNull().default("pending"), // pending, completed, rewarded
  rewardAmount: decimal("reward_amount", { precision: 10, scale: 2 }).default("25.00"),
  createdAt: timestamp("created_at").defaultNow(),
  completedAt: timestamp("completed_at"),
});

// Vouchers table
export const vouchers = pgTable("vouchers", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: varchar("user_id").references(() => users.id),
  code: varchar("code").notNull().unique(),
  title: varchar("title").notNull(),
  description: text("description"),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  type: varchar("type").notNull().default("discount"), // discount, cashback, bonus
  status: varchar("status").notNull().default("active"), // active, used, expired
  expiresAt: timestamp("expires_at").notNull(),
  usedAt: timestamp("used_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Community discussions table
export const discussions = pgTable("discussions", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: varchar("user_id").notNull().references(() => users.id),
  title: varchar("title").notNull(),
  content: text("content").notNull(),
  category: varchar("category").notNull(),
  status: varchar("status").notNull().default("active"), // active, locked, archived
  isPopular: boolean("is_popular").default(false),
  likes: integer("likes").default(0),
  replies: integer("replies").default(0),
  viewCount: integer("view_count").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Discussion replies table
export const discussionReplies = pgTable("discussion_replies", {
  id: uuid("id").primaryKey().defaultRandom(),
  discussionId: uuid("discussion_id").notNull().references(() => discussions.id),
  userId: varchar("user_id").notNull().references(() => users.id),
  content: text("content").notNull(),
  likes: integer("likes").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

// Community events table
export const events = pgTable("events", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: varchar("title").notNull(),
  description: text("description"),
  eventDate: timestamp("event_date").notNull(),
  eventTime: varchar("event_time").notNull(),
  maxAttendees: integer("max_attendees"),
  currentAttendees: integer("current_attendees").default(0),
  status: varchar("status").notNull().default("upcoming"), // upcoming, ongoing, completed, cancelled
  createdAt: timestamp("created_at").defaultNow(),
});

// Event attendees table
export const eventAttendees = pgTable("event_attendees", {
  id: uuid("id").primaryKey().defaultRandom(),
  eventId: uuid("event_id").notNull().references(() => events.id),
  userId: varchar("user_id").notNull().references(() => users.id),
  registeredAt: timestamp("registered_at").defaultNow(),
});

// User contributions (for community ranking)
export const userContributions = pgTable("user_contributions", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: varchar("user_id").notNull().references(() => users.id),
  points: integer("points").default(0),
  badge: varchar("badge").default("New Member"),
  helpfulAnswers: integer("helpful_answers").default(0),
  discussionsCreated: integer("discussions_created").default(0),
  repliesPosted: integer("replies_posted").default(0),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Currency exchange rates table
export const exchangeRates = pgTable("exchange_rates", {
  id: uuid("id").primaryKey().defaultRandom(),
  fromCurrency: varchar("from_currency", { length: 3 }).notNull(),
  toCurrency: varchar("to_currency", { length: 3 }).notNull(),
  rate: decimal("rate", { precision: 12, scale: 6 }).notNull(),
  lastUpdated: timestamp("last_updated").defaultNow(),
});

// Currency conversions history table
export const currencyConversions = pgTable("currency_conversions", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: varchar("user_id").notNull().references(() => users.id),
  fromCurrency: varchar("from_currency", { length: 3 }).notNull(),
  toCurrency: varchar("to_currency", { length: 3 }).notNull(),
  fromAmount: decimal("from_amount", { precision: 12, scale: 2 }).notNull(),
  toAmount: decimal("to_amount", { precision: 12, scale: 2 }).notNull(),
  exchangeRate: decimal("exchange_rate", { precision: 12, scale: 6 }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Relations for new tables
export const referralsRelations = relations(referrals, ({ one }) => ({
  referrer: one(users, {
    fields: [referrals.referrerId],
    references: [users.id],
  }),
  referee: one(users, {
    fields: [referrals.refereeId],
    references: [users.id],
  }),
}));

export const vouchersRelations = relations(vouchers, ({ one }) => ({
  user: one(users, {
    fields: [vouchers.userId],
    references: [users.id],
  }),
}));

export const discussionsRelations = relations(discussions, ({ one, many }) => ({
  user: one(users, {
    fields: [discussions.userId],
    references: [users.id],
  }),
  replies: many(discussionReplies),
}));

export const discussionRepliesRelations = relations(discussionReplies, ({ one }) => ({
  discussion: one(discussions, {
    fields: [discussionReplies.discussionId],
    references: [discussions.id],
  }),
  user: one(users, {
    fields: [discussionReplies.userId],
    references: [users.id],
  }),
}));

export const eventsRelations = relations(events, ({ many }) => ({
  attendees: many(eventAttendees),
}));

export const eventAttendeesRelations = relations(eventAttendees, ({ one }) => ({
  event: one(events, {
    fields: [eventAttendees.eventId],
    references: [events.id],
  }),
  user: one(users, {
    fields: [eventAttendees.userId],
    references: [users.id],
  }),
}));

export const userContributionsRelations = relations(userContributions, ({ one }) => ({
  user: one(users, {
    fields: [userContributions.userId],
    references: [users.id],
  }),
}));

export const currencyConversionsRelations = relations(currencyConversions, ({ one }) => ({
  user: one(users, {
    fields: [currencyConversions.userId],
    references: [users.id],
  }),
}));

// Insert schemas for new tables
export const insertReferralSchema = createInsertSchema(referrals).omit({
  id: true,
  createdAt: true,
  completedAt: true,
});

export const insertVoucherSchema = createInsertSchema(vouchers).omit({
  id: true,
  createdAt: true,
  usedAt: true,
});

export const insertDiscussionSchema = createInsertSchema(discussions).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertDiscussionReplySchema = createInsertSchema(discussionReplies).omit({
  id: true,
  createdAt: true,
});

export const insertEventSchema = createInsertSchema(events).omit({
  id: true,
  createdAt: true,
});

export const insertEventAttendeeSchema = createInsertSchema(eventAttendees).omit({
  id: true,
  registeredAt: true,
});

export const insertUserContributionSchema = createInsertSchema(userContributions).omit({
  id: true,
  updatedAt: true,
});

export const insertExchangeRateSchema = createInsertSchema(exchangeRates).omit({
  id: true,
  lastUpdated: true,
});

export const insertCurrencyConversionSchema = createInsertSchema(currencyConversions).omit({
  id: true,
  createdAt: true,
});

// Types for new tables
export type InsertReferral = z.infer<typeof insertReferralSchema>;
export type Referral = typeof referrals.$inferSelect;
export type InsertVoucher = z.infer<typeof insertVoucherSchema>;
export type Voucher = typeof vouchers.$inferSelect;
export type InsertDiscussion = z.infer<typeof insertDiscussionSchema>;
export type Discussion = typeof discussions.$inferSelect;
export type InsertDiscussionReply = z.infer<typeof insertDiscussionReplySchema>;
export type DiscussionReply = typeof discussionReplies.$inferSelect;
export type InsertEvent = z.infer<typeof insertEventSchema>;
export type Event = typeof events.$inferSelect;
export type InsertEventAttendee = z.infer<typeof insertEventAttendeeSchema>;
export type EventAttendee = typeof eventAttendees.$inferSelect;
export type InsertUserContribution = z.infer<typeof insertUserContributionSchema>;
export type UserContribution = typeof userContributions.$inferSelect;
export type InsertExchangeRate = z.infer<typeof insertExchangeRateSchema>;
export type ExchangeRate = typeof exchangeRates.$inferSelect;
export type InsertCurrencyConversion = z.infer<typeof insertCurrencyConversionSchema>;
export type CurrencyConversion = typeof currencyConversions.$inferSelect;

// Deposit requests table
export const depositRequests = pgTable("deposit_requests", {
  id: text("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: text("user_id").notNull().references(() => users.id),
  amount: decimal("amount", { precision: 12, scale: 2 }).notNull(),
  method: varchar("method").notNull(), // card, bank, crypto
  status: varchar("status").notNull().default("pending"), // pending, approved, rejected
  adminNotes: text("admin_notes"),
  processedBy: text("processed_by").references(() => users.id),
  transactionReference: varchar("transaction_reference"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  processedAt: timestamp("processed_at"),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Relations for deposit requests
export const depositRequestsRelations = relations(depositRequests, ({ one }) => ({
  user: one(users, {
    fields: [depositRequests.userId],
    references: [users.id],
  }),
  processedByUser: one(users, {
    fields: [depositRequests.processedBy],
    references: [users.id],
  }),
}));

// Insert schema for deposit requests
export const insertDepositRequestSchema = createInsertSchema(depositRequests).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Types for deposit requests
export type InsertDepositRequest = z.infer<typeof insertDepositRequestSchema>;
export type DepositRequest = typeof depositRequests.$inferSelect;
