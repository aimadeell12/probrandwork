import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupSimpleAuth, requireAuth } from "./simpleAuth";
import { reapService } from "./reap";
import { insertCardSchema, insertSupportTicketSchema, insertNotificationSchema, insertNotificationSettingsSchema } from "@shared/schema";
import { z } from "zod";
import session from "express-session";
import connectPg from "connect-pg-simple";

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup session middleware first
  const sessionTtl = 7 * 24 * 60 * 60 * 1000; // 1 week
  const pgStore = connectPg(session);
  const sessionStore = new pgStore({
    conString: process.env.DATABASE_URL,
    createTableIfMissing: true,
    ttl: sessionTtl,
    tableName: "sessions",
  });
  
  app.use(session({
    secret: process.env.SESSION_SECRET || "fallback-secret-key-for-development",
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    name: 'sessionId',
    cookie: {
      httpOnly: true,
      secure: false, // Set to true in production with HTTPS
      maxAge: sessionTtl,
      sameSite: 'lax',
    },
  }));

  // Auth middleware
  setupSimpleAuth(app);

  // Profile update route
  app.patch("/api/auth/profile", requireAuth, async (req: any, res) => {
    try {
      const userId = req.session?.userId;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      const updateData = req.body;
      
      const updatedUser = await storage.updateUserProfile(userId, updateData);
      res.json(updatedUser);
    } catch (error) {
      console.error("Error updating profile:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Cards routes
  app.get("/api/cards", requireAuth, async (req: any, res) => {
    try {
      const userId = req.session?.userId;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      const cards = await storage.getCardsByUserId(userId);
      res.json(cards);
    } catch (error) {
      console.error("Error fetching cards:", error);
      res.status(500).json({ message: "Failed to fetch cards" });
    }
  });

  app.post("/api/cards", requireAuth, async (req: any, res) => {
    try {
      const userId = req.session?.userId;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const cardCost = req.body.cost || (req.body.type === "virtual" ? 8 : 90);
      
      // Check user balance first
      const currentBalance = await storage.getWalletBalance(userId);
      if (currentBalance < cardCost) {
        return res.status(400).json({ 
          message: "Insufficient balance",
          required: cardCost,
          current: currentBalance
        });
      }

      const cardData = insertCardSchema.parse({
        ...req.body,
        userId,
      });

      // Get user data for real KYC information
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Create card with Reap API using real user data
      try {
        console.log("Creating card with Reap API using real user data...");
        const reapCard = await reapService.createCard({
          cardType: cardData.type === "virtual" ? "Virtual" : "Physical",
          customerType: "Consumer",
          kyc: {
            firstName: user.firstName || cardData.holderName?.split(' ')[0] || "User",
            lastName: user.lastName || cardData.holderName?.split(' ')[1] || "Name",
            dob: user.dateOfBirth || "1990-01-01",
            residentialAddress: {
              line1: user.address || "Default Address",
              line2: user.city || "Suite 1",
              city: user.city || "Casablanca",
              country: user.country || "MAR"
            },
            idDocumentType: user.idDocumentType || "TaxIDNumber",
            idDocumentNumber: user.idDocumentNumber || "123456"
          },
          preferredCardName: `${user.firstName || ""} ${user.lastName || ""}`.trim() || cardData.holderName || "Card Holder",
          meta: {
            otpPhoneNumber: {
              dialCode: "212",
              phoneNumber: user.phone?.replace("+212", "") || "663381823"
            },
            id: userId,
            email: user.email || "user@example.com"
          }
        });

        // Generate last four digits for display
        const lastFour = Math.floor(1000 + Math.random() * 9000).toString();

        // Save to database with Reap data
        const card = await storage.createCard({
          userId: cardData.userId,
          type: cardData.type,
          holderName: cardData.holderName,
          reapCardId: reapCard.id,
          lastFour: lastFour,
          status: "active",
          currency: cardData.currency || "USD",
          design: cardData.design || "blue",
        });

        // Deduct cost from wallet balance
        await storage.updateWalletBalance(userId, currentBalance - cardCost);

        res.json(card);
      } catch (reapError) {
        console.error("Error creating Reap card:", reapError);
        return res.status(500).json({ message: "Failed to create card with Reap API" });
      }
    } catch (error) {
      console.error("Error creating card:", error);
      res.status(500).json({ message: "Failed to create card" });
    }
  });

  app.patch("/api/cards/:id/suspend", requireAuth, async (req: any, res) => {
    try {
      const cardId = req.params.id;
      const card = await storage.getCard(cardId);
      
      if (!card) {
        return res.status(404).json({ message: "Card not found" });
      }

      if (card.userId !== req.user.id) {
        return res.status(403).json({ message: "Access denied" });
      }

      // Suspend with Reap API
      if (card.reapCardId) {
        await reapService.updateCardStatus(card.reapCardId, "suspended");
      }

      // Update database
      const updatedCard = await storage.updateCard(cardId, { status: "suspended" });
      res.json(updatedCard);
    } catch (error) {
      console.error("Error suspending card:", error);
      res.status(500).json({ message: "Failed to suspend card" });
    }
  });

  app.patch("/api/cards/:id/activate", requireAuth, async (req: any, res) => {
    try {
      const cardId = req.params.id;
      const card = await storage.getCard(cardId);
      
      if (!card) {
        return res.status(404).json({ message: "Card not found" });
      }

      if (card.userId !== req.user.id) {
        return res.status(403).json({ message: "Access denied" });
      }

      // Activate with Reap API
      if (card.reapCardId) {
        await reapService.updateCardStatus(card.reapCardId, "active");
      }

      // Update database
      const updatedCard = await storage.updateCard(cardId, { status: "active" });
      res.json(updatedCard);
    } catch (error) {
      console.error("Error activating card:", error);
      res.status(500).json({ message: "Failed to activate card" });
    }
  });

  // Transactions routes
  app.get("/api/cards/:id/transactions", requireAuth, async (req: any, res) => {
    try {
      const cardId = req.params.id;
      const card = await storage.getCard(cardId);
      
      if (!card) {
        return res.status(404).json({ message: "Card not found" });
      }

      if (card.userId !== req.user.id) {
        return res.status(403).json({ message: "Access denied" });
      }

      const transactions = await storage.getTransactionsByCardId(cardId);
      res.json(transactions);
    } catch (error) {
      console.error("Error fetching transactions:", error);
      res.status(500).json({ message: "Failed to fetch transactions" });
    }
  });

  // Wallet operations
  app.post("/api/wallet/deposit", requireAuth, async (req: any, res) => {
    try {
      const { cardId, amount } = req.body;
      
      if (!amount || amount <= 0) {
        return res.status(400).json({ message: "Invalid amount" });
      }

      const card = await storage.getCard(cardId);
      if (!card) {
        return res.status(404).json({ message: "Card not found" });
      }

      if (card.userId !== req.user.id) {
        return res.status(403).json({ message: "Access denied" });
      }

      // Process deposit with Lithic
      const transfer = await reapService.addFunds(card.reapCardId || "", amount);

      // Create transaction record
      await storage.createTransaction({
        cardId: cardId,
        amount: amount,
        type: "deposit",
        description: "Wallet deposit",
        status: "completed",
        merchantName: "Wallet System",
      });

      res.json({
        success: true,
        transfer,
        message: "Deposit processed successfully"
      });
    } catch (error) {
      console.error("Error processing deposit:", error);
      res.status(500).json({ message: "Failed to process deposit" });
    }
  });

  app.post("/api/wallet/withdraw", requireAuth, async (req: any, res) => {
    try {
      const { cardId, amount } = req.body;
      
      if (!amount || amount <= 0) {
        return res.status(400).json({ message: "Invalid amount" });
      }

      const card = await storage.getCard(cardId);
      if (!card) {
        return res.status(404).json({ message: "Card not found" });
      }

      if (card.userId !== req.user.id) {
        return res.status(403).json({ message: "Access denied" });
      }

      // Check balance first
      const balance = await reapService.getCardBalance(card.reapCardId || "");
      if (balance < amount) {
        return res.status(400).json({ message: "Insufficient funds" });
      }

      // Process withdrawal with Reap
      const transfer = await reapService.addFunds(card.reapCardId || "", -amount);

      // Create transaction record
      await storage.createTransaction({
        cardId: cardId,
        amount: -amount, // Negative for withdrawal
        type: "withdrawal",
        description: "Wallet withdrawal",
        status: "completed",
        merchantName: "Wallet System",
      });

      res.json({
        success: true,
        transfer,
        message: "Withdrawal processed successfully"
      });
    } catch (error) {
      console.error("Error processing withdrawal:", error);
      res.status(500).json({ message: "Failed to process withdrawal" });
    }
  });

  app.get("/api/wallet/balance/:cardId", requireAuth, async (req: any, res) => {
    try {
      const { cardId } = req.params;
      
      const card = await storage.getCard(cardId);
      if (!card) {
        return res.status(404).json({ message: "Card not found" });
      }

      if (card.userId !== req.user.id) {
        return res.status(403).json({ message: "Access denied" });
      }

      const balance = await reapService.getCardBalance(card.reapCardId || "");
      
      res.json({ balance });
    } catch (error) {
      console.error("Error fetching balance:", error);
      res.status(500).json({ message: "Failed to fetch balance" });
    }
  });

  // Support routes
  app.post("/api/support/tickets", requireAuth, async (req: any, res) => {
    try {
      const userId = req.session?.userId;
      const ticketData = insertSupportTicketSchema.parse({
        ...req.body,
        userId,
      });

      const ticket = await storage.createSupportTicket(ticketData);
      res.json(ticket);
    } catch (error) {
      console.error("Error creating support ticket:", error);
      res.status(500).json({ message: "Failed to create support ticket" });
    }
  });

  app.get("/api/support/tickets", requireAuth, async (req: any, res) => {
    try {
      const userId = req.session?.userId;
      const tickets = await storage.getSupportTicketsByUserId(userId);
      res.json(tickets);
    } catch (error) {
      console.error("Error fetching support tickets:", error);
      res.status(500).json({ message: "Failed to fetch support tickets" });
    }
  });

  // Wallet balance and transactions
  app.get("/api/wallet/balance", requireAuth, async (req: any, res) => {
    try {
      const userId = req.session?.userId;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const balance = await storage.getWalletBalance(userId);
      
      // Prevent caching
      res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
      res.set('Pragma', 'no-cache');
      res.set('Expires', '0');
      
      res.json({ balance });
    } catch (error) {
      console.error("Error fetching wallet balance:", error);
      res.status(500).json({ message: "Failed to fetch balance" });
    }
  });

  app.post("/api/wallet/deposit", requireAuth, async (req: any, res) => {
    try {
      const userId = req.session?.userId;
      const { amount } = req.body;
      
      if (!amount || amount <= 0) {
        return res.status(400).json({ message: "Invalid amount" });
      }

      // Get user's primary card
      const cards = await storage.getCardsByUserId(userId);
      if (cards.length === 0) {
        return res.status(400).json({ message: "No card found for deposit" });
      }

      const primaryCard = cards[0];

      // Create transaction record
      await storage.createTransaction({
        cardId: primaryCard.id,
        amount: amount,
        type: "deposit",
        description: "Wallet deposit",
        status: "completed",
        merchantName: "Deposit System",
      });

      res.json({
        success: true,
        message: "Deposit processed successfully",
        amount: amount
      });
    } catch (error) {
      console.error("Error processing deposit:", error);
      res.status(500).json({ message: "Failed to process deposit" });
    }
  });

  app.post("/api/wallet/withdraw", requireAuth, async (req: any, res) => {
    try {
      const userId = req.session?.userId;
      const { amount } = req.body;
      
      if (!amount || amount <= 0) {
        return res.status(400).json({ message: "Invalid amount" });
      }

      // Get user's primary card
      const cards = await storage.getCardsByUserId(userId);
      if (cards.length === 0) {
        return res.status(400).json({ message: "No card found for withdrawal" });
      }

      const primaryCard = cards[0];

      // Create transaction record
      await storage.createTransaction({
        cardId: primaryCard.id,
        amount: -amount, // Negative for withdrawal
        type: "withdrawal",
        description: "Wallet withdrawal",
        status: "completed",
        merchantName: "Withdrawal System",
      });

      res.json({
        success: true,
        message: "Withdrawal processed successfully",
        amount: amount
      });
    } catch (error) {
      console.error("Error processing withdrawal:", error);
      res.status(500).json({ message: "Failed to process withdrawal" });
    }
  });

  app.post("/api/wallet/send", requireAuth, async (req: any, res) => {
    try {
      const userId = req.session?.userId;
      const { amount, recipient, type, note } = req.body;
      
      if (!amount || amount <= 0) {
        return res.status(400).json({ message: "Invalid amount" });
      }

      if (!recipient) {
        return res.status(400).json({ message: "Recipient is required" });
      }

      // Get user's primary card
      const cards = await storage.getCardsByUserId(userId);
      if (cards.length === 0) {
        return res.status(400).json({ message: "No card found for sending" });
      }

      const primaryCard = cards[0];

      // Create transaction record
      await storage.createTransaction({
        cardId: primaryCard.id,
        amount: -amount, // Negative for sending
        type: "transfer",
        description: `Transfer to ${recipient}${note ? `: ${note}` : ''}`,
        status: "completed",
        merchantName: "Transfer System",
      });

      res.json({
        success: true,
        message: "Transfer sent successfully",
        amount: amount,
        recipient: recipient
      });
    } catch (error) {
      console.error("Error processing transfer:", error);
      res.status(500).json({ message: "Failed to process transfer" });
    }
  });

  app.get("/api/transactions", requireAuth, async (req: any, res) => {
    try {
      const userId = req.session?.userId;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      // Get all user's cards and their transactions
      const cards = await storage.getCardsByUserId(userId);
      let allTransactions = [];

      for (const card of cards) {
        const transactions = await storage.getTransactionsByCardId(card.id);
        allTransactions.push(...transactions);
      }

      // Sort by date (newest first)
      allTransactions.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

      res.json(allTransactions);
    } catch (error) {
      console.error("Error fetching transactions:", error);
      res.status(500).json({ message: "Failed to fetch transactions" });
    }
  });
  
  // User profile and settings routes
  app.get("/api/user/profile", requireAuth, async (req: any, res) => {
    try {
      const userId = req.session?.userId;
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Don't return sensitive information
      // Handle case where password might be undefined
      const userObj = {...user};
      delete userObj.password;
      
      res.json(userObj);
    } catch (error) {
      console.error("Error fetching user profile:", error);
      res.status(500).json({ message: "Failed to fetch user profile" });
    }
  });
  
  app.patch("/api/user/profile", requireAuth, async (req: any, res) => {
    try {
      const userId = req.session?.userId;
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Update user profile
      const updatedUser = await storage.updateUserProfile(userId, req.body);
      
      // Don't return sensitive information
      const { password, ...userProfile } = updatedUser;
      res.json(userProfile);
    } catch (error) {
      console.error("Error updating user profile:", error);
      res.status(500).json({ message: "Failed to update user profile" });
    }
  });
  
  app.patch("/api/user/security", requireAuth, async (req: any, res) => {
    try {
      const userId = req.session?.userId;
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Update security settings
      const securitySettings = {
        twoFactorEnabled: req.body.twoFactorEnabled,
        biometricEnabled: req.body.biometricEnabled,
        loginNotifications: req.body.loginNotifications,
        deviceTracking: req.body.deviceTracking
      };
      
      const updatedUser = await storage.updateUserProfile(userId, securitySettings);
      
      // Don't return sensitive information
      const { password, ...userProfile } = updatedUser;
      res.json(userProfile);
    } catch (error) {
      console.error("Error updating security settings:", error);
      res.status(500).json({ message: "Failed to update security settings" });
    }
  });
  
  app.patch("/api/user/notifications", requireAuth, async (req: any, res) => {
    try {
      const userId = req.session?.userId;
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Update notification settings
      const notificationSettings = {
        emailNotifications: req.body.emailNotifications,
        smsNotifications: req.body.smsNotifications,
        pushNotifications: req.body.pushNotifications,
        transactionAlerts: req.body.transactionAlerts,
        marketingEmails: req.body.marketingEmails
      };
      
      const updatedUser = await storage.updateUserProfile(userId, notificationSettings);
      
      // Don't return sensitive information
      const { password, ...userProfile } = updatedUser;
      res.json(userProfile);
    } catch (error) {
      console.error("Error updating notification settings:", error);
      res.status(500).json({ message: "Failed to update notification settings" });
    }
  });

  // Admin routes
  app.get("/api/admin/users", requireAuth, async (req: any, res) => {
    try {
      const user = await storage.getUser(req.session?.userId!);
      if (!user || user.role !== "admin") {
        return res.status(403).json({ message: "Admin access required" });
      }

      const users = await storage.getAllUsers();
      res.json(users);
    } catch (error) {
      console.error("Error fetching admin users:", error);
      res.status(500).json({ message: "Failed to fetch users" });
    }
  });

  app.get("/api/admin/stats", requireAuth, async (req: any, res) => {
    try {
      const user = await storage.getUser(req.session?.userId!);
      if (!user || user.role !== "admin") {
        return res.status(403).json({ message: "Admin access required" });
      }

      const stats = await storage.getSystemStats();
      res.json(stats);
    } catch (error) {
      console.error("Error fetching admin stats:", error);
      res.status(500).json({ message: "Failed to fetch stats" });
    }
  });

  // KYC routes
  app.get("/api/kyc/verification", requireAuth, async (req: any, res) => {
    try {
      const kyc = await storage.getKycVerificationByUserId(req.session?.userId!);
      res.json(kyc || null);
    } catch (error) {
      console.error("Error fetching KYC verification:", error);
      res.status(500).json({ error: "Failed to fetch KYC verification" });
    }
  });

  app.post("/api/kyc/verification", requireAuth, async (req: any, res) => {
    try {
      const kycData = {
        ...req.body,
        userId: req.session?.userId!,
      };
      
      const kyc = await storage.createKycVerification(kycData);
      res.json(kyc);
    } catch (error) {
      console.error("Error creating KYC verification:", error);
      res.status(400).json({ error: "Failed to create KYC verification" });
    }
  });

  app.post("/api/kyc/documents", requireAuth, async (req: any, res) => {
    try {
      const { kycId, documentType, fileName, fileUrl, fileSize, mimeType } = req.body;
      
      const document = await storage.createKycDocument({
        kycId,
        documentType,
        fileName,
        fileUrl,
        fileSize,
        mimeType,
      });
      
      res.json(document);
    } catch (error) {
      console.error("Error uploading KYC document:", error);
      res.status(400).json({ error: "Failed to upload document" });
    }
  });

  app.get("/api/kyc/documents/:kycId", requireAuth, async (req: any, res) => {
    try {
      const { kycId } = req.params;
      const documents = await storage.getKycDocumentsByKycId(kycId);
      res.json(documents);
    } catch (error) {
      console.error("Error fetching KYC documents:", error);
      res.status(500).json({ error: "Failed to fetch documents" });
    }
  });

  // Notifications routes
  app.get("/api/notifications", requireAuth, async (req: any, res) => {
    try {
      const userId = req.session?.userId;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      const notifications = await storage.getNotificationsByUserId(userId);
      res.json(notifications);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      res.status(500).json({ message: "Failed to fetch notifications" });
    }
  });

  app.get("/api/notifications/unread-count", requireAuth, async (req: any, res) => {
    try {
      const userId = req.session?.userId;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      const count = await storage.getUnreadNotificationsCount(userId);
      res.json({ count });
    } catch (error) {
      console.error("Error fetching unread notifications count:", error);
      res.status(500).json({ message: "Failed to fetch unread count" });
    }
  });

  app.post("/api/notifications", requireAuth, async (req: any, res) => {
    try {
      const userId = req.session?.userId;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const validationResult = insertNotificationSchema.safeParse(req.body);
      if (!validationResult.success) {
        return res.status(400).json({
          message: "Invalid notification data",
          errors: validationResult.error.issues,
        });
      }

      const notificationData = {
        ...validationResult.data,
        userId,
      };

      const notification = await storage.createNotification(notificationData);
      res.status(201).json(notification);
    } catch (error) {
      console.error("Error creating notification:", error);
      res.status(500).json({ message: "Failed to create notification" });
    }
  });

  app.patch("/api/notifications/:id/read", requireAuth, async (req: any, res) => {
    try {
      const { id } = req.params;
      const notification = await storage.markNotificationAsRead(id);
      res.json(notification);
    } catch (error) {
      console.error("Error marking notification as read:", error);
      res.status(500).json({ message: "Failed to mark notification as read" });
    }
  });

  app.patch("/api/notifications/mark-all-read", requireAuth, async (req: any, res) => {
    try {
      const userId = req.session?.userId;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      await storage.markAllNotificationsAsRead(userId);
      res.json({ message: "All notifications marked as read" });
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
      res.status(500).json({ message: "Failed to mark all notifications as read" });
    }
  });

  app.delete("/api/notifications/:id", requireAuth, async (req: any, res) => {
    try {
      const { id } = req.params;
      await storage.deleteNotification(id);
      res.json({ message: "Notification deleted successfully" });
    } catch (error) {
      console.error("Error deleting notification:", error);
      res.status(500).json({ message: "Failed to delete notification" });
    }
  });

  // Notification settings routes
  app.get("/api/notification-settings", requireAuth, async (req: any, res) => {
    try {
      const userId = req.session?.userId;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      const settings = await storage.getNotificationSettings(userId);
      
      // If no settings exist, create default settings
      if (!settings) {
        const defaultSettings = {
          userId,
          transactionAlerts: true,
          largeTransactions: true,
          failedTransactions: true,
          loginAlerts: true,
          passwordChanges: true,
          accountChanges: true,
          promotions: false,
          newsletters: true,
          productUpdates: true,
          emailNotifications: true,
          pushNotifications: true,
          smsNotifications: false,
        };
        
        const newSettings = await storage.createNotificationSettings(defaultSettings);
        return res.json(newSettings);
      }
      
      res.json(settings);
    } catch (error) {
      console.error("Error fetching notification settings:", error);
      res.status(500).json({ message: "Failed to fetch notification settings" });
    }
  });

  app.patch("/api/notification-settings", requireAuth, async (req: any, res) => {
    try {
      const userId = req.session?.userId;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const settings = await storage.updateNotificationSettings(userId, req.body);
      res.json(settings);
    } catch (error) {
      console.error("Error updating notification settings:", error);
      res.status(500).json({ message: "Failed to update notification settings" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
