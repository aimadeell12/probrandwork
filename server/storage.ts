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
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, count, sql } from "drizzle-orm";
import { randomUUID } from 'crypto';

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
  deleteUser(userId: string): Promise<void>;
  
  // Card operations
  getCardsByUserId(userId: string): Promise<Card[]>;
  getCard(id: string): Promise<Card | undefined>;
  createCard(card: InsertCard): Promise<Card>;
  updateCard(id: string, updates: Partial<Card>): Promise<Card>;
  deleteCard(id: string): Promise<void>;
  
  // Transaction operations
  getTransactionsByCardId(cardId: string): Promise<Transaction[]>;
  createTransaction(transaction: InsertTransaction): Promise<Transaction>;
  
  // Support ticket operations
  getSupportTicketsByUserId(userId: string): Promise<SupportTicket[]>;
  createSupportTicket(ticket: InsertSupportTicket): Promise<SupportTicket>;
  
  // Notification operations
  getNotificationsByUserId(userId: string): Promise<Notification[]>;
  getUnreadNotificationsCount(userId: string): Promise<number>;
  createNotification(notification: InsertNotification): Promise<Notification>;
  markNotificationAsRead(id: string): Promise<Notification>;
  markAllNotificationsAsRead(userId: string): Promise<void>;
  deleteNotification(id: string): Promise<void>;
  
  // Notification settings operations
  getNotificationSettings(userId: string): Promise<NotificationSettings | undefined>;
  createNotificationSettings(settings: InsertNotificationSettings): Promise<NotificationSettings>;
  updateNotificationSettings(userId: string, updates: Partial<NotificationSettings>): Promise<NotificationSettings>;
  
  // Wallet operations
  getWalletBalance(userId: string): Promise<number>;
  updateWalletBalance(userId: string, newBalance: number): Promise<void>;
  getPendingBalance(userId: string): Promise<number>;
  updatePendingBalance(userId: string, newPendingBalance: number): Promise<void>;
  
  // Pending Balance operations
  createPendingBalance(data: { userId: string; transactionId: string; amount: string; currency: string; releaseDate: Date; description?: string }): Promise<any>;
  getPendingBalancesByUserId(userId: string): Promise<any[]>;
  releasePendingBalance(id: string): Promise<void>;
  getTotalPendingBalance(userId: string): Promise<number>;
  
  // KYC operations
  getKycVerificationByUserId(userId: string): Promise<KycVerification | undefined>;
  createKycVerification(kycData: InsertKycVerification): Promise<KycVerification>;
  updateKycVerification(id: string, updates: Partial<KycVerification>): Promise<KycVerification>;
  createKycDocument(documentData: InsertKycDocument): Promise<KycDocument>;
  getKycDocumentsByKycId(kycId: string): Promise<KycDocument[]>;
  getAllKycVerifications(): Promise<KycVerification[]>;
  updateKycStatus(id: string, status: string, rejectionReason?: string): Promise<KycVerification>;
  
  // Payment link operations
  createPaymentLink(linkData: InsertPaymentLink): Promise<PaymentLink>;
  getPaymentLinksByUserId(userId: string): Promise<PaymentLink[]>;
  getPaymentLinkByTxRef(txRef: string): Promise<PaymentLink | undefined>;
  updatePaymentLink(id: string, updates: Partial<PaymentLink>): Promise<PaymentLink>;
  disablePaymentLink(id: string): Promise<void>;
  createPaymentTransaction(transactionData: InsertPaymentTransaction): Promise<PaymentTransaction>;
  getPaymentTransactionsByLinkId(linkId: string): Promise<PaymentTransaction[]>;
  getPaymentTransactionByTxRef(txRef: string): Promise<PaymentTransaction | undefined>;
  updatePaymentTransaction(id: string, updates: Partial<PaymentTransaction>): Promise<PaymentTransaction>;
  updatePaymentTransactionToSuccessful(id: string, updates: Partial<PaymentTransaction>): Promise<PaymentTransaction | null>;

}

export class DatabaseStorage implements IStorage {
  // User operations (mandatory for Replit Auth)
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserById(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async getUserByGoogleId(googleId: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.googleId, googleId));
    return user;
  }

  async createGoogleUser(userData: any): Promise<User> {
    const [user] = await db.insert(users).values(userData).returning();
    return user;
  }

  async linkGoogleAccount(userId: string, googleId: string): Promise<void> {
    await db.update(users)
      .set({ googleId, updatedAt: new Date() })
      .where(eq(users.id, userId));
  }

  async createLocalUser(userData: any): Promise<User> {
    const [user] = await db.insert(users).values(userData).returning();
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
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
    console.log("📝 [STORAGE] updateUserProfile called with:", { userId, updates });
    
    // Ensure we're not updating sensitive fields unexpectedly
    const { id, password, authType, role, createdAt, ...safeUpdates } = updates;
    
    console.log("📝 [STORAGE] Safe updates to apply:", safeUpdates);
    
    try {
      const [updatedUser] = await db
        .update(users)
        .set({
          ...safeUpdates,
          updatedAt: new Date(),
        })
        .where(eq(users.id, userId))
        .returning();
      
      if (!updatedUser) {
        throw new Error(`No user found with ID: ${userId}`);
      }
      
      console.log("✅ [STORAGE] User updated successfully:", updatedUser);
      return updatedUser;
      
    } catch (dbError: any) {
      console.error("❌ [STORAGE] Database error during profile update:", dbError);
      console.error("❌ [STORAGE] Error details:", {
        userId,
        updates: safeUpdates,
        error: dbError?.message,
        stack: dbError?.stack
      });
      throw new Error(`Database update failed: ${dbError?.message || 'Unknown error'}`);
    }
  }

  async deleteUser(userId: string): Promise<void> {
    console.log("🗑️ [STORAGE] deleteUser called for:", userId);
    
    try {
      // Delete all related data first (in order of dependencies)
      await db.delete(notifications).where(eq(notifications.userId, userId));
      await db.delete(notificationSettings).where(eq(notificationSettings.userId, userId));
      await db.delete(supportTickets).where(eq(supportTickets.userId, userId));
      await db.delete(pendingBalances).where(eq(pendingBalances.userId, userId));
      
      // Delete KYC documents and verifications
      const kycVerification = await this.getKycVerificationByUserId(userId);
      if (kycVerification) {
        await db.delete(kycDocuments).where(eq(kycDocuments.kycVerificationId, kycVerification.id));
        await db.delete(kycVerifications).where(eq(kycVerifications.userId, userId));
      }
      
      // Delete payment links and transactions
      const userPaymentLinks = await this.getPaymentLinksByUserId(userId);
      for (const link of userPaymentLinks) {
        await db.delete(paymentTransactions).where(eq(paymentTransactions.paymentLinkId, link.id));
      }
      await db.delete(paymentLinks).where(eq(paymentLinks.userId, userId));
      
      // Delete cards and their transactions
      const userCards = await this.getCardsByUserId(userId);
      for (const card of userCards) {
        await db.delete(transactions).where(eq(transactions.cardId, card.id));
      }
      await db.delete(cards).where(eq(cards.userId, userId));
      
      // Finally delete the user
      await db.delete(users).where(eq(users.id, userId));
      
      console.log("✅ [STORAGE] User and all related data deleted successfully:", userId);
    } catch (error: any) {
      console.error("❌ [STORAGE] Error deleting user:", error);
      throw new Error(`Failed to delete user: ${error?.message || 'Unknown error'}`);
    }
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
    return card;
  }

  async createCard(card: any): Promise<Card> {
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

  async createTransaction(transaction: InsertTransaction): Promise<Transaction> {
    const [newTransaction] = await db
      .insert(transactions)
      .values(transaction)
      .returning();
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

  async createSupportTicket(ticket: InsertSupportTicket): Promise<SupportTicket> {
    const [newTicket] = await db
      .insert(supportTickets)
      .values(ticket)
      .returning();
    return newTicket;
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
      .where(and(
        eq(notifications.userId, userId),
        eq(notifications.isRead, false)
      ));
    return result.count;
  }

  async createNotification(notification: InsertNotification): Promise<Notification> {
    const [newNotification] = await db
      .insert(notifications)
      .values(notification)
      .returning();
    return newNotification;
  }

  async markNotificationAsRead(id: string): Promise<Notification> {
    const [updatedNotification] = await db
      .update(notifications)
      .set({ isRead: true, readAt: new Date() })
      .where(eq(notifications.id, id))
      .returning();
    return updatedNotification;
  }

  async markAllNotificationsAsRead(userId: string): Promise<void> {
    await db
      .update(notifications)
      .set({ isRead: true, readAt: new Date() })
      .where(and(
        eq(notifications.userId, userId),
        eq(notifications.isRead, false)
      ));
  }

  async deleteNotification(id: string): Promise<void> {
    await db
      .delete(notifications)
      .where(eq(notifications.id, id));
  }

  // Notification settings operations
  async getNotificationSettings(userId: string): Promise<NotificationSettings | undefined> {
    const [settings] = await db
      .select()
      .from(notificationSettings)
      .where(eq(notificationSettings.userId, userId));
    return settings;
  }

  async createNotificationSettings(settings: InsertNotificationSettings): Promise<NotificationSettings> {
    const [newSettings] = await db
      .insert(notificationSettings)
      .values(settings)
      .returning();
    return newSettings;
  }

  async updateNotificationSettings(userId: string, updates: Partial<NotificationSettings>): Promise<NotificationSettings> {
    const [updatedSettings] = await db
      .update(notificationSettings)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(notificationSettings.userId, userId))
      .returning();
    return updatedSettings;
  }

  // Admin operations
  async getAllUsers(): Promise<User[]> {
    return await db
      .select()
      .from(users)
      .orderBy(desc(users.createdAt));
  }

  async getAllCards(): Promise<Card[]> {
    return await db
      .select()
      .from(cards)
      .orderBy(desc(cards.createdAt));
  }

  async updateUserRole(userId: string, role: string): Promise<User> {
    const [updatedUser] = await db
      .update(users)
      .set({ role, updatedAt: new Date() })
      .where(eq(users.id, userId))
      .returning();
    return updatedUser;
  }

  async getRecentActivities(): Promise<any[]> {
    // Get recent user registrations
    const recentUsers = await db
      .select({
        id: users.id,
        type: sql<string>`'user_registered'`,
        data: sql<string>`json_build_object('name', ${users.firstName} || ' ' || ${users.lastName}, 'email', ${users.email})`,
        createdAt: users.createdAt
      })
      .from(users)
      .orderBy(desc(users.createdAt))
      .limit(5);

    // Get recent card creations
    const recentCards = await db
      .select({
        id: cards.id,
        type: sql<string>`'card_created'`,
        data: sql<string>`json_build_object('type', ${cards.type}, 'status', ${cards.status})`,
        createdAt: cards.createdAt
      })
      .from(cards)
      .orderBy(desc(cards.createdAt))
      .limit(5);

    // Combine and sort by date
    const activities = [...recentUsers, ...recentCards]
      .sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime())
      .slice(0, 10);

    return activities;
  }

  async getSystemStats(): Promise<{
    totalUsers: number;
    totalCards: number;
    totalTransactions: number;
    totalVolume: string;
  }> {
    const [userCount] = await db.select({ count: count() }).from(users);
    const [cardCount] = await db.select({ count: count() }).from(cards);
    const [transactionCount] = await db.select({ count: count() }).from(transactions);
    
    return {
      totalUsers: userCount.count,
      totalCards: cardCount.count,
      totalTransactions: transactionCount.count,
      totalVolume: "0", // TODO: Calculate actual volume
    };
  }

  // KYC operations
  async getKycVerificationByUserId(userId: string): Promise<KycVerification | undefined> {
    const [kyc] = await db.select()
      .from(kycVerifications)
      .where(eq(kycVerifications.userId, userId))
      .limit(1);
    return kyc;
  }

  async createKycVerification(kycData: InsertKycVerification): Promise<KycVerification> {
    const [kyc] = await db.insert(kycVerifications)
      .values(kycData)
      .returning();
    return kyc;
  }

  async updateKycVerification(id: string, updates: Partial<KycVerification>): Promise<KycVerification> {
    const [kyc] = await db.update(kycVerifications)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(kycVerifications.id, id))
      .returning();
    return kyc;
  }

  async createKycDocument(documentData: InsertKycDocument): Promise<KycDocument> {
    const [document] = await db.insert(kycDocuments)
      .values(documentData)
      .returning();
    return document;
  }

  async getKycDocumentsByKycId(kycId: string): Promise<KycDocument[]> {
    return await db.select()
      .from(kycDocuments)
      .where(eq(kycDocuments.kycId, kycId));
  }

  async getAllKycVerifications(): Promise<KycVerification[]> {
    return await db.select()
      .from(kycVerifications)
      .orderBy(desc(kycVerifications.submittedAt));
  }

  async updateKycStatus(id: string, status: string, rejectionReason?: string): Promise<KycVerification> {
    const updates: Partial<KycVerification> = {
      status: status as "pending" | "verified" | "rejected",
      reviewedAt: new Date(),
    };

    if (rejectionReason) {
      updates.rejectionReason = rejectionReason;
    }

    const [updatedKyc] = await db.update(kycVerifications)
      .set(updates)
      .where(eq(kycVerifications.id, id))
      .returning();

    return updatedKyc;
  }

  // Wallet operations
  async getWalletBalance(userId: string): Promise<number> {
    const user = await db.select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);
    
    return parseFloat(user[0]?.walletBalance || "0");
  }

  async updateWalletBalance(userId: string, newBalance: number): Promise<void> {
    await db.update(users)
      .set({ walletBalance: newBalance.toString() })
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

  // Payment link operations
  async createPaymentLink(linkData: InsertPaymentLink): Promise<PaymentLink> {
    const [link] = await db.insert(paymentLinks)
      .values(linkData)
      .returning();
    return link;
  }

  async getPaymentLinksByUserId(userId: string): Promise<PaymentLink[]> {
    return await db.select()
      .from(paymentLinks)
      .where(eq(paymentLinks.userId, userId))
      .orderBy(desc(paymentLinks.createdAt));
  }

  async getPaymentLinkByTxRef(txRef: string): Promise<PaymentLink | undefined> {
    const [link] = await db.select()
      .from(paymentLinks)
      .where(eq(paymentLinks.txRef, txRef));
    return link;
  }

  async updatePaymentLink(id: string, updates: Partial<PaymentLink>): Promise<PaymentLink> {
    const [link] = await db.update(paymentLinks)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(paymentLinks.id, id))
      .returning();
    return link;
  }

  async disablePaymentLink(id: string): Promise<void> {
    await db.update(paymentLinks)
      .set({ status: 'disabled', updatedAt: new Date() })
      .where(eq(paymentLinks.id, id));
  }

  async createPaymentTransaction(transactionData: InsertPaymentTransaction): Promise<PaymentTransaction> {
    const [transaction] = await db.insert(paymentTransactions)
      .values(transactionData)
      .returning();
    return transaction;
  }

  async getPaymentTransactionsByLinkId(linkId: string): Promise<PaymentTransaction[]> {
    return await db.select()
      .from(paymentTransactions)
      .where(eq(paymentTransactions.paymentLinkId, linkId))
      .orderBy(desc(paymentTransactions.createdAt));
  }

  async getPaymentTransactionByTxRef(txRef: string): Promise<PaymentTransaction | undefined> {
    const [transaction] = await db.select()
      .from(paymentTransactions)
      .where(eq(paymentTransactions.txRef, txRef));
    return transaction;
  }

  async updatePaymentTransaction(id: string, updates: Partial<PaymentTransaction>): Promise<PaymentTransaction> {
    const [transaction] = await db.update(paymentTransactions)
      .set(updates)
      .where(eq(paymentTransactions.id, id))
      .returning();
    return transaction;
  }

  async updatePaymentTransactionToSuccessful(id: string, updates: Partial<PaymentTransaction>): Promise<PaymentTransaction | null> {
    const [transaction] = await db.update(paymentTransactions)
      .set(updates)
      .where(and(
        eq(paymentTransactions.id, id),
        sql`${paymentTransactions.status} != 'successful'`
      ))
      .returning();
    return transaction || null;
  }
}

export const storage = new DatabaseStorage();
