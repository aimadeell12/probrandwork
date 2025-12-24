import {
  users,
  cards,
  transactions,
  supportTickets,
  notifications,
  notificationSettings,
  kycVerifications,
  kycDocuments,
  paymentLinks,
  paymentTransactions,
  pendingBalances,
  type User,
  type UpsertUser,
  type Card,
  type InsertCard,
  type Transaction,
  type InsertTransaction,
  type SupportTicket,
  type InsertSupportTicket,
  type Notification,
  type InsertNotification,
  type NotificationSettings,
  type InsertNotificationSettings,
  type KycVerification,
  type InsertKycVerification,
  type KycDocument,
  type InsertKycDocument,
  type PaymentLink,
  type InsertPaymentLink,
  type PaymentTransaction,
  type InsertPaymentTransaction,
} from "../shared/schema";
import { db } from "./db";
import { eq, desc, and, count, sql } from "drizzle-orm";

// Interface for storage operations
export interface IStorage {
  // User operations (mandatory for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  getUserById(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserByGoogleId(googleId: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  createLocalUser(user: any): Promise<User>;
  createGoogleUser(user: any): Promise<User>;
  linkGoogleAccount(userId: string, googleId: string): Promise<void>;
  updateUserProfile(userId: string, updates: Partial<User>): Promise<User>;
  getAllUsers(): Promise<User[]>;
  getWalletBalance(userId: string): Promise<number>;
  updateWalletBalance(userId: string, amount: number): Promise<void>;
  getPendingBalance(userId: string): Promise<number>;
  updatePendingBalance(userId: string, newPendingBalance: number): Promise<void>;
  
  // Pending Balance operations
  createPendingBalance(data: { userId: string; transactionId: string; amount: string; currency: string; releaseDate: Date; description?: string }): Promise<any>;
  getPendingBalancesByUserId(userId: string): Promise<any[]>;
  releasePendingBalance(id: string): Promise<void>;
  getTotalPendingBalance(userId: string): Promise<number>;
  
  // Card operations
  getCardsByUserId(userId: string): Promise<Card[]>;
  getCard(id: string): Promise<Card | undefined>;
  createCard(card: InsertCard): Promise<Card>;
  updateCard(id: string, updates: Partial<Card>): Promise<Card>;
  deleteCard(id: string): Promise<void>;
  
  // Transaction operations
  getTransactionsByCardId(cardId: string): Promise<Transaction[]>;
  getTransaction(id: string): Promise<Transaction | undefined>;
  createTransaction(transaction: InsertTransaction): Promise<Transaction>;
  
  // Support ticket operations
  getSupportTicketsByUserId(userId: string): Promise<SupportTicket[]>;
  getSupportTicket(id: string): Promise<SupportTicket | undefined>;
  createSupportTicket(ticket: InsertSupportTicket): Promise<SupportTicket>;
  updateSupportTicket(id: string, updates: Partial<SupportTicket>): Promise<SupportTicket>;
  
  // Notification operations
  getNotificationsByUserId(userId: string): Promise<Notification[]>;
  getUnreadNotificationsCount(userId: string): Promise<number>;
  createNotification(notification: InsertNotification): Promise<Notification>;
  markNotificationAsRead(id: string): Promise<void>;
  
  // Notification settings operations
  getNotificationSettings(userId: string): Promise<NotificationSettings | undefined>;
  upsertNotificationSettings(settings: InsertNotificationSettings): Promise<NotificationSettings>;
  
  // KYC operations
  getKycVerificationByUserId(userId: string): Promise<KycVerification | undefined>;
  createKycVerification(kyc: InsertKycVerification): Promise<KycVerification>;
  updateKycVerification(id: string, updates: Partial<KycVerification>): Promise<KycVerification>;
  
  // KYC document operations
  getKycDocumentsByKycId(kycId: string): Promise<KycDocument[]>;
  createKycDocument(document: InsertKycDocument): Promise<KycDocument>;
  
  // Payment Link operations
  createPaymentLink(link: InsertPaymentLink): Promise<PaymentLink>;
  getPaymentLinksByUserId(userId: string): Promise<PaymentLink[]>;
  getPaymentLinkByTxRef(txRef: string): Promise<PaymentLink | undefined>;
  disablePaymentLink(txRef: string): Promise<void>;
  
  // Payment Transaction operations
  createPaymentTransaction(transaction: InsertPaymentTransaction): Promise<PaymentTransaction>;
  getPaymentTransactionsByLinkId(linkId: string): Promise<PaymentTransaction[]>;
  getPaymentTransactionByTxRef(txRef: string): Promise<PaymentTransaction | undefined>;
  updatePaymentTransaction(id: string, updates: Partial<PaymentTransaction>): Promise<PaymentTransaction>;
  
  // Admin operations
  getAllKycVerifications(): Promise<KycVerification[]>;
  updateKycStatus(id: string, status: string, reviewedBy: string, comments?: string): Promise<KycVerification>;
  getUserByPhone(phone: string): Promise<User | undefined>;
  markAllNotificationsAsRead(userId: string): Promise<void>;
  deleteNotification(id: string): Promise<void>;
  createNotificationSettings(settings: InsertNotificationSettings): Promise<NotificationSettings>;
  updateNotificationSettings(userId: string, settings: Partial<NotificationSettings>): Promise<NotificationSettings>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserById(id: string): Promise<User | undefined> {
    return this.getUser(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async getUserByGoogleId(googleId: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.googleId, googleId));
    return user || undefined;
  }

  async getAllUsers(): Promise<User[]> {
    return await db.select().from(users).orderBy(desc(users.createdAt));
  }

  async createLocalUser(userData: any): Promise<User> {
    const [user] = await db.insert(users).values({
      id: userData.id || crypto.randomUUID(),
      username: userData.username,
      email: userData.email,
      phone: userData.phone,
      password: userData.password,
      firstName: userData.firstName,
      lastName: userData.lastName,
      authType: 'local',
      role: 'user',
      createdAt: new Date(),
      updatedAt: new Date()
    }).returning();
    return user;
  }

  async createGoogleUser(userData: any): Promise<User> {
    const [user] = await db.insert(users).values({
      id: userData.id || crypto.randomUUID(),
      googleId: userData.googleId,
      email: userData.email,
      firstName: userData.firstName,
      lastName: userData.lastName,
      profileImageUrl: userData.profileImageUrl,
      authType: 'google',
      role: 'user',
      createdAt: new Date(),
      updatedAt: new Date()
    }).returning();
    return user;
  }

  async linkGoogleAccount(userId: string, googleId: string): Promise<void> {
    await db.update(users)
      .set({ googleId, updatedAt: new Date() })
      .where(eq(users.id, userId));
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values({
        ...userData,
        id: userData.id || crypto.randomUUID(),
        createdAt: new Date(),
        updatedAt: new Date()
      })
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }
  
  async updateUserProfile(userId: string, updates: Partial<User>): Promise<User> {
    const { id, password, authType, role, createdAt, ...safeUpdates } = updates;
    
    const [updatedUser] = await db
      .update(users)
      .set({
        ...safeUpdates,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId))
      .returning();
    
    return updatedUser;
  }

  // Card operations
  async getCardsByUserId(userId: string): Promise<Card[]> {
    return await db
      .select()
      .from(cards)
      .where(eq(cards.userId, userId))
      .orderBy(desc(cards.createdAt));
  }

  async getCard(id: string): Promise<Card | undefined> {
    const [card] = await db.select().from(cards).where(eq(cards.id, id));
    return card || undefined;
  }

  async createCard(card: InsertCard): Promise<Card> {
    const [newCard] = await db.insert(cards).values(card).returning();
    return newCard;
  }

  async updateCard(id: string, updates: Partial<Card>): Promise<Card> {
    const [updatedCard] = await db
      .update(cards)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(cards.id, id))
      .returning();
    return updatedCard;
  }

  async deleteCard(id: string): Promise<void> {
    await db.delete(cards).where(eq(cards.id, id));
  }

  // Transaction operations
  async getTransactionsByCardId(cardId: string): Promise<Transaction[]> {
    return await db
      .select()
      .from(transactions)
      .where(eq(transactions.cardId, cardId))
      .orderBy(desc(transactions.createdAt));
  }

  async getTransaction(id: string): Promise<Transaction | undefined> {
    const [transaction] = await db.select().from(transactions).where(eq(transactions.id, id));
    return transaction || undefined;
  }

  async createTransaction(transaction: InsertTransaction): Promise<Transaction> {
    const [newTransaction] = await db.insert(transactions).values({
      ...transaction,
      id: crypto.randomUUID(),
      createdAt: new Date()
    }).returning();
    return newTransaction;
  }

  // Support ticket operations
  async getSupportTicketsByUserId(userId: string): Promise<SupportTicket[]> {
    return await db
      .select()
      .from(supportTickets)
      .where(eq(supportTickets.userId, userId))
      .orderBy(desc(supportTickets.createdAt));
  }

  async getSupportTicket(id: string): Promise<SupportTicket | undefined> {
    const [ticket] = await db.select().from(supportTickets).where(eq(supportTickets.id, id));
    return ticket || undefined;
  }

  async createSupportTicket(ticket: InsertSupportTicket): Promise<SupportTicket> {
    const [newTicket] = await db.insert(supportTickets).values({
      ...ticket,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date()
    }).returning();
    return newTicket;
  }

  async updateSupportTicket(id: string, updates: Partial<SupportTicket>): Promise<SupportTicket> {
    const [updatedTicket] = await db
      .update(supportTickets)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(supportTickets.id, id))
      .returning();
    return updatedTicket;
  }

  // Notification operations
  async getNotificationsByUserId(userId: string): Promise<Notification[]> {
    return await db
      .select()
      .from(notifications)
      .where(eq(notifications.userId, userId))
      .orderBy(desc(notifications.createdAt));
  }

  async getUnreadNotificationsCount(userId: string): Promise<number> {
    const [result] = await db
      .select({ count: count() })
      .from(notifications)
      .where(and(eq(notifications.userId, userId), eq(notifications.isRead, false)));
    return result.count;
  }

  async createNotification(notification: InsertNotification): Promise<Notification> {
    const [newNotification] = await db.insert(notifications).values({
      ...notification,
      id: crypto.randomUUID(),
      createdAt: new Date()
    }).returning();
    return newNotification;
  }

  async markNotificationAsRead(id: string): Promise<void> {
    await db
      .update(notifications)
      .set({ isRead: true, readAt: new Date() })
      .where(eq(notifications.id, id));
  }

  // Notification settings operations
  async getNotificationSettings(userId: string): Promise<NotificationSettings | undefined> {
    const [settings] = await db.select().from(notificationSettings).where(eq(notificationSettings.userId, userId));
    return settings || undefined;
  }

  async upsertNotificationSettings(settings: InsertNotificationSettings): Promise<NotificationSettings> {
    const [upsertedSettings] = await db
      .insert(notificationSettings)
      .values({
        ...settings,
        id: crypto.randomUUID(),
        createdAt: new Date(),
        updatedAt: new Date()
      })
      .onConflictDoUpdate({
        target: notificationSettings.userId,
        set: {
          ...settings,
          updatedAt: new Date(),
        },
      })
      .returning();
    return upsertedSettings;
  }

  // KYC operations
  async getKycVerificationByUserId(userId: string): Promise<KycVerification | undefined> {
    const [kyc] = await db.select().from(kycVerifications).where(eq(kycVerifications.userId, userId));
    return kyc || undefined;
  }

  async createKycVerification(kyc: InsertKycVerification): Promise<KycVerification> {
    const [newKyc] = await db.insert(kycVerifications).values({
      ...kyc,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date()
    }).returning();
    return newKyc;
  }

  async updateKycVerification(id: string, updates: Partial<KycVerification>): Promise<KycVerification> {
    const [updatedKyc] = await db
      .update(kycVerifications)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(kycVerifications.id, id))
      .returning();
    return updatedKyc;
  }

  // KYC document operations
  async getKycDocumentsByKycId(kycId: string): Promise<KycDocument[]> {
    return await db
      .select()
      .from(kycDocuments)
      .where(eq(kycDocuments.kycId, kycId))
      .orderBy(desc(kycDocuments.uploadedAt));
  }

  async createKycDocument(document: InsertKycDocument): Promise<KycDocument> {
    const [newDocument] = await db.insert(kycDocuments).values({
      ...document,
      id: crypto.randomUUID(),
      uploadedAt: new Date()
    }).returning();
    return newDocument;
  }

  // Wallet operations
  async getWalletBalance(userId: string): Promise<number> {
    const user = await this.getUser(userId);
    return user ? parseFloat(user.walletBalance || "0") : 0;
  }

  async updateWalletBalance(userId: string, amount: number): Promise<void> {
    await db
      .update(users)
      .set({ 
        walletBalance: amount.toString(),
        updatedAt: new Date() 
      })
      .where(eq(users.id, userId));
  }

  async getPendingBalance(userId: string): Promise<number> {
    const user = await db.select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);
    
    return parseFloat(user[0]?.pendingBalance || "0");
  }

  async updatePendingBalance(userId: string, newPendingBalance: number): Promise<void> {
    await db.update(users)
      .set({ pendingBalance: newPendingBalance.toString() })
      .where(eq(users.id, userId));
  }

  // Pending Balance operations
  async createPendingBalance(data: { userId: string; transactionId: string; amount: string; currency: string; releaseDate: Date; description?: string }): Promise<any> {
    const [pendingBalance] = await db.insert(pendingBalances)
      .values({
        userId: data.userId,
        transactionId: data.transactionId,
        amount: data.amount,
        currency: data.currency,
        status: 'pending',
        releaseDate: data.releaseDate,
        description: data.description,
      })
      .returning();
    
    // Update user's pending balance
    const currentPending = await this.getPendingBalance(data.userId);
    const newPending = currentPending + parseFloat(data.amount);
    await this.updatePendingBalance(data.userId, newPending);
    
    return pendingBalance;
  }

  async getPendingBalancesByUserId(userId: string): Promise<any[]> {
    return await db.select()
      .from(pendingBalances)
      .where(and(
        eq(pendingBalances.userId, userId),
        eq(pendingBalances.status, 'pending')
      ))
      .orderBy(desc(pendingBalances.createdAt));
  }

  async releasePendingBalance(id: string): Promise<void> {
    const [pendingBalance] = await db.select()
      .from(pendingBalances)
      .where(eq(pendingBalances.id, id))
      .limit(1);
    
    if (!pendingBalance) {
      throw new Error('Pending balance not found');
    }

    if (pendingBalance.status !== 'pending') {
      throw new Error('Pending balance already processed');
    }

    // Update pending balance status
    await db.update(pendingBalances)
      .set({ 
        status: 'released',
        releasedAt: new Date()
      })
      .where(eq(pendingBalances.id, id));
    
    // Update user's balances
    const currentWallet = await this.getWalletBalance(pendingBalance.userId);
    const currentPending = await this.getPendingBalance(pendingBalance.userId);
    const amount = parseFloat(pendingBalance.amount);
    
    await this.updateWalletBalance(pendingBalance.userId, currentWallet + amount);
    await this.updatePendingBalance(pendingBalance.userId, Math.max(0, currentPending - amount));
    
    console.log(`✅ Released ${amount} ${pendingBalance.currency} to user ${pendingBalance.userId} wallet`);
  }

  async getTotalPendingBalance(userId: string): Promise<number> {
    const result = await db.select({
      total: sql<string>`COALESCE(SUM(${pendingBalances.amount}::numeric), 0)`
    })
      .from(pendingBalances)
      .where(and(
        eq(pendingBalances.userId, userId),
        eq(pendingBalances.status, 'pending')
      ));
    
    return parseFloat(result[0]?.total || "0");
  }

  // Payment Link operations
  async createPaymentLink(link: InsertPaymentLink): Promise<PaymentLink> {
    const [newLink] = await db.insert(paymentLinks).values({
      ...link,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date()
    }).returning();
    return newLink;
  }

  async getPaymentLinksByUserId(userId: string): Promise<PaymentLink[]> {
    return await db
      .select()
      .from(paymentLinks)
      .where(eq(paymentLinks.userId, userId))
      .orderBy(desc(paymentLinks.createdAt));
  }

  async getPaymentLinkByTxRef(txRef: string): Promise<PaymentLink | undefined> {
    const [link] = await db
      .select()
      .from(paymentLinks)
      .where(eq(paymentLinks.txRef, txRef));
    return link || undefined;
  }

  async disablePaymentLink(txRef: string): Promise<void> {
    await db
      .update(paymentLinks)
      .set({ status: 'disabled', updatedAt: new Date() })
      .where(eq(paymentLinks.txRef, txRef));
  }

  // Payment Transaction operations
  async createPaymentTransaction(transaction: InsertPaymentTransaction): Promise<PaymentTransaction> {
    const [newTransaction] = await db.insert(paymentTransactions).values({
      ...transaction,
      id: crypto.randomUUID(),
      createdAt: new Date()
    }).returning();
    return newTransaction;
  }

  async getPaymentTransactionsByLinkId(linkId: string): Promise<PaymentTransaction[]> {
    return await db
      .select()
      .from(paymentTransactions)
      .where(eq(paymentTransactions.paymentLinkId, linkId))
      .orderBy(desc(paymentTransactions.createdAt));
  }

  async getPaymentTransactionByTxRef(txRef: string): Promise<PaymentTransaction | undefined> {
    const [transaction] = await db
      .select()
      .from(paymentTransactions)
      .where(eq(paymentTransactions.txRef, txRef));
    return transaction || undefined;
  }

  async updatePaymentTransaction(id: string, updates: Partial<PaymentTransaction>): Promise<PaymentTransaction> {
    const [updatedTransaction] = await db
      .update(paymentTransactions)
      .set({ ...updates })
      .where(eq(paymentTransactions.id, id))
      .returning();
    return updatedTransaction;
  }

  // Admin operations
  async getAllKycVerifications(): Promise<KycVerification[]> {
    return await db.select().from(kycVerifications).orderBy(desc(kycVerifications.createdAt));
  }

  async updateKycStatus(id: string, status: string, reviewedBy: string, comments?: string): Promise<KycVerification> {
    const [updatedKyc] = await db
      .update(kycVerifications)
      .set({
        status,
        reviewComments: comments,
        reviewedAt: new Date(),
        updatedAt: new Date()
      })
      .where(eq(kycVerifications.id, id))
      .returning();
    return updatedKyc;
  }

  async getUserByPhone(phone: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.phone, phone));
    return user || undefined;
  }

  async markAllNotificationsAsRead(userId: string): Promise<void> {
    await db
      .update(notifications)
      .set({ readAt: new Date() })
      .where(eq(notifications.userId, userId));
  }

  async deleteNotification(id: string): Promise<void> {
    await db.delete(notifications).where(eq(notifications.id, id));
  }

  async createNotificationSettings(settings: InsertNotificationSettings): Promise<NotificationSettings> {
    const [newSettings] = await db.insert(notificationSettings).values({
      ...settings,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date()
    }).returning();
    return newSettings;
  }

  async updateNotificationSettings(userId: string, settings: Partial<NotificationSettings>): Promise<NotificationSettings> {
    const [updatedSettings] = await db
      .update(notificationSettings)
      .set({ ...settings, updatedAt: new Date() })
      .where(eq(notificationSettings.userId, userId))
      .returning();
    return updatedSettings;
  }
}

export const storage = new DatabaseStorage();