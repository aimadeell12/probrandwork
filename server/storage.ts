import {
  users,
  cards,
  transactions,
  supportTickets,
  notifications,
  notificationSettings,
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
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, count } from "drizzle-orm";

// Interface for storage operations
export interface IStorage {
  // User operations (mandatory for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  getUserById(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  createLocalUser(user: any): Promise<User>;
  updateUserProfile(userId: string, updates: Partial<User>): Promise<User>;
  
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
  
  // Admin operations
  getAllUsers(): Promise<User[]>;
  getAllCards(): Promise<Card[]>;
  getSystemStats(): Promise<{
    totalUsers: number;
    totalCards: number;
    totalTransactions: number;
    totalVolume: string;
  }>;
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
    console.log("updateUserProfile called with:", { userId, updates });
    
    // Ensure we're not updating sensitive fields unexpectedly
    const { id, password, authType, role, createdAt, ...safeUpdates } = updates;
    
    console.log("Safe updates to apply:", safeUpdates);
    
    const [updatedUser] = await db
      .update(users)
      .set({
        ...safeUpdates,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId))
      .returning();
    
    console.log("User updated successfully:", updatedUser);
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
    return card;
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
}

export const storage = new DatabaseStorage();
