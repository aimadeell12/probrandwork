import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupSimpleAuth, requireAuth } from "./simpleAuth";
import { lithicService } from "./lithic";
import { insertCardSchema, insertSupportTicketSchema } from "@shared/schema";
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
      const cardData = insertCardSchema.parse({
        ...req.body,
        userId,
      });

      // Create card with Lithic
      const lithicCard = await lithicService.createCard({
        holderName: cardData.holderName || "Card Holder",
        type: cardData.type,
        creditLimit: Number(cardData.creditLimit) || 5000,
        currency: cardData.currency,
      });

      // Save to database
      const card = await storage.createCard({
        ...cardData,
        lithicCardId: lithicCard.token,
        lastFour: lithicCard.last_four,
        expiryMonth: lithicCard.exp_month,
        expiryYear: lithicCard.exp_year,
        status: lithicCard.state === "OPEN" ? "active" : "pending",
      });

      res.json(card);
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

      // Suspend with Lithic
      if (card.lithicCardId) {
        await lithicService.suspendCard(card.lithicCardId);
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

      // Activate with Lithic
      if (card.lithicCardId) {
        await lithicService.activateCard(card.lithicCardId);
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
      const transfer = await lithicService.deposit(card.lithicCardId || "", amount);

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
      const balance = await lithicService.getBalance(card.lithicCardId || "");
      if (balance < amount) {
        return res.status(400).json({ message: "Insufficient funds" });
      }

      // Process withdrawal with Lithic
      const transfer = await lithicService.withdraw(card.lithicCardId || "", amount);

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

      const balance = await lithicService.getBalance(card.lithicCardId || "");
      
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

      // Get user's first card for balance
      const cards = await storage.getCardsByUserId(userId);
      if (cards.length === 0) {
        return res.json({ balance: 0 });
      }

      const primaryCard = cards[0];
      let balance = 0;

      try {
        if (primaryCard.lithicCardId) {
          balance = await lithicService.getBalance(primaryCard.lithicCardId);
        }
      } catch (error) {
        console.log("Using default balance due to Lithic service unavailable");
        balance = 1250.75; // Default balance for demo
      }

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

  const httpServer = createServer(app);
  return httpServer;
}
