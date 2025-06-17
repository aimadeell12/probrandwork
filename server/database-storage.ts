import {
  users,
  cards,
  transactions,
  supportTickets,
  notifications,
  notificationSettings,
  kycVerifications,
  kycDocuments,
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

  async updateCardStripeInfo(cardId: string, stripeCardId: string, stripeCardholderId: string): Promise<Card> {
    const [updatedCard] = await db
      .update(cards)
      .set({ 
        stripeCardId, 
        stripeCardholderId,
        updatedAt: new Date() 
      })
      .where(eq(cards.id, cardId))
      .returning();
    return updatedCard;
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
}

export const storage = new DatabaseStorage();