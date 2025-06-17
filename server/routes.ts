import express, { type Express } from "express";
import { createServer, type Server } from "http";
import path from "path";
import { storage } from "./database-storage";
import { setupSimpleAuth, requireAuth } from "./simpleAuth";
import { setupGoogleAuth } from "./googleAuth";
import { binancePayService } from "./binance";
import { stripeIssuingService } from "./stripe-issuing";
import { insertCardSchema, insertSupportTicketSchema, insertNotificationSchema, insertNotificationSettingsSchema, kycVerificationFormSchema, insertKycVerificationSchema } from "@shared/schema";
import { z } from "zod";
import session from "express-session";
import connectPg from "connect-pg-simple";
import { db } from "./db";
import * as schema from "@shared/schema";
import { eq, desc, and, sql, isNull } from "drizzle-orm";

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
  setupGoogleAuth(app);

  // Banks routes
  app.get("/api/banks", async (req, res) => {
    try {
      const { country } = req.query;
      
      let banks;
      if (country) {
        // Get both country-specific banks AND global banks
        banks = await db
          .select()
          .from(schema.banks)
          .where(and(
            sql`(${schema.banks.country} = ${country} OR ${schema.banks.country} = 'GLOBAL')`,
            eq(schema.banks.isActive, true)
          ))
          .orderBy(schema.banks.name);
      } else {
        // Get all banks if no country specified
        banks = await db
          .select()
          .from(schema.banks)
          .where(eq(schema.banks.isActive, true))
          .orderBy(schema.banks.name);
      }
      
      res.json(banks);
    } catch (error) {
      console.error("Error fetching banks:", error);
      res.status(500).json({ message: "Error fetching banks" });
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

      console.log("📋 Received card creation request body:", req.body);
      
      const cardData = insertCardSchema.parse({
        ...req.body,
        userId,
      });
      
      console.log("📋 Parsed card data:", cardData);

      // Get user data for real KYC information
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Create card with Stripe Issuing
      try {
        console.log("Creating card with Stripe Issuing...");
        
        const holderName = user.firstName && user.lastName 
          ? `${user.firstName} ${user.lastName}`.trim()
          : user.username || "Card Holder";

        const stripeCardData = {
          holderName,
          type: cardData.type as 'virtual' | 'physical',
          currency: cardData.currency || "USD"
        };

        console.log("📋 Creating Stripe Issuing card:", JSON.stringify(stripeCardData, null, 2));
        
        const stripeCard = await stripeIssuingService.createCard(stripeCardData);
        
        const newCard = await storage.createCard({
          userId,
          type: cardData.type,
          holderName,
          currency: cardData.currency || "USD",
          design: cardData.design || "blue",
          expiryMonth: stripeCard.exp_month,
          expiryYear: stripeCard.exp_year,
          lastFour: stripeCard.last4,
          brand: stripeCard.brand,
          status: "active"
        });

        // Update card with Stripe information
        await storage.updateCardStripeInfo(newCard.id, stripeCard.id, stripeCard.cardholder.id);
        
        // Deduct cost from wallet balance
        const cardCost = cardData.type === "virtual" ? 50 : 100;
        if (currentBalance >= cardCost) {
          await storage.updateWalletBalance(userId, currentBalance - cardCost);
        }
        
        return res.status(201).json({
          ...newCard,
          stripeCardId: stripeCard.id,
          stripeCardholderId: stripeCard.cardholder.id
        });
      } catch (error: any) {
        console.error("Error creating Stripe card:", error);
        return res.status(500).json({ message: "Failed to create card with Stripe Issuing" });
      }
    } catch (error) {
      console.error("Error creating card:", error);
      res.status(500).json({ message: "Failed to create card" });
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

      // Activate with Stripe Issuing API
      if (card.stripeCardId) {
        await stripeIssuingService.updateCardStatus(card.stripeCardId, 'active');
      }

      // Update database
      const updatedCard = await storage.updateCard(cardId, { status: "active" });
      res.json(updatedCard);
    } catch (error) {
      console.error("Error activating card:", error);
      res.status(500).json({ message: "Failed to activate card" });
    }
  });

  app.patch("/api/cards/:id/block", async (req: any, res) => {
    const cardId = req.params.id;
    console.log(`🔒 BLOCK CARD ROUTE HIT! Card ID: ${cardId}`);
    
    try {
      console.log(`🔍 Looking for card with ID: ${cardId}`);
      const card = await storage.getCard(cardId);
      
      if (!card) {
        console.log(`❌ Card not found: ${cardId}`);
        return res.status(404).json({ message: "Card not found" });
      }
      
      console.log(`📋 Found card:`, card);
      console.log(`💾 Updating card status to blocked...`);
      
      const updatedCard = await storage.updateCard(cardId, { status: "blocked" });
      console.log(`✅ Successfully updated card to blocked:`, updatedCard);
      
      res.json(updatedCard);
    } catch (error) {
      console.error("❌ Error in block card route:", error);
      res.status(500).json({ 
        message: "Failed to block card",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  app.patch("/api/cards/:id/freeze", async (req: any, res) => {
    try {
      const cardId = req.params.id;
      console.log(`🧊 FREEZE CARD ROUTE HIT! Card ID: ${cardId}`);
      
      const card = await storage.getCard(cardId);
      
      if (!card) {
        console.log(`❌ Card not found: ${cardId}`);
        return res.status(404).json({ message: "Card not found" });
      }

      console.log(`📋 Found card for freezing:`, card);

      // Freeze with Stripe Issuing API
      if (card.stripeCardId) {
        console.log(`🌐 Freezing card in Stripe: ${card.stripeCardId}`);
        await stripeIssuingService.updateCardStatus(card.stripeCardId, 'inactive');
      }

      // Update database
      console.log(`💾 Updating card status to frozen...`);
      const updatedCard = await storage.updateCard(cardId, { status: "frozen" });
      console.log(`✅ Successfully updated card to frozen:`, updatedCard);
      
      res.json(updatedCard);
    } catch (error) {
      console.error("❌ Error in freeze card route:", error);
      res.status(500).json({ 
        message: "Failed to freeze card",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  app.patch("/api/cards/:id/unfreeze", async (req: any, res) => {
    try {
      const cardId = req.params.id;
      console.log(`🔥 UNFREEZE CARD ROUTE HIT! Card ID: ${cardId}`);
      
      const card = await storage.getCard(cardId);
      
      if (!card) {
        console.log(`❌ Card not found: ${cardId}`);
        return res.status(404).json({ message: "Card not found" });
      }

      console.log(`📋 Found card for unfreezing:`, card);

      // Unfreeze with Stripe Issuing API
      if (card.stripeCardId) {
        console.log(`🌐 Unfreezing card in Stripe: ${card.stripeCardId}`);
        await stripeIssuingService.updateCardStatus(card.stripeCardId, 'active');
      }

      // Update database to active status
      console.log(`💾 Updating card status to active...`);
      const updatedCard = await storage.updateCard(cardId, { status: "active" });
      console.log(`✅ Successfully updated card to active:`, updatedCard);
      
      res.json(updatedCard);
    } catch (error) {
      console.error("❌ Error in unfreeze card route:", error);
      res.status(500).json({ 
        message: "Failed to unfreeze card",
        error: error instanceof Error ? error.message : "Unknown error"
      });
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

      // Skip user validation for now to allow viewing transactions
      // if (card.userId !== req.session.userId) {
      //   return res.status(403).json({ message: "Access denied" });
      // }

      // Fetch transactions from Stripe Issuing or Reap API
      if (card.stripeCardId) {
        try {
          const stripeTransactions = await stripeIssuingService.getCardTransactions(card.stripeCardId);
          const formattedTransactions = stripeTransactions.map(tx => ({
            id: tx.id,
            amount: (tx.amount / 100).toString(), // Convert from cents
            currency: tx.currency.toUpperCase(),
            merchant: tx.merchant?.name || 'Unknown Merchant',
            description: tx.description || '',
            status: tx.status,
            type: tx.type,
            createdAt: new Date(tx.created * 1000).toISOString()
          }));
          res.json(formattedTransactions);
        } catch (error) {
          console.error("Error fetching Stripe transactions:", error);
          res.json([]);
        }
      } else {
        res.json([]);
      }
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

      // Process deposit with Stripe Issuing (funding through authorization controls)
      // Create transaction record
      await storage.createTransaction({
        cardId: cardId,
        amount: amount.toString(),
        type: "deposit",
        currency: "USD",
        description: "Wallet deposit",
        status: "completed",
        merchant: "Wallet System",
      });

      res.json({
        success: true,
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

      // Check balance first (simplified for Stripe Issuing)
      const currentBalance = parseFloat(card.balance || "0");
      if (currentBalance < amount) {
        return res.status(400).json({ message: "Insufficient funds" });
      }

      // Process withdrawal with Stripe Issuing (authorization controls)
      // Create transaction record
      await storage.createTransaction({
        cardId: cardId,
        amount: (-amount).toString(), // Negative for withdrawal
        type: "withdrawal",
        currency: "USD",
        description: "Wallet withdrawal",
        status: "completed",
        merchant: "Wallet System",
      });

      res.json({
        success: true,
        message: "Withdrawal processed successfully"
      });
    } catch (error) {
      console.error("Error processing withdrawal:", error);
      res.status(500).json({ message: "Failed to process withdrawal" });
    }
  });

  // Card-specific transfer endpoint
  app.post("/api/cards/:cardId/transfer", async (req: any, res) => {
    try {
      const { cardId } = req.params;
      const { amount } = req.body;
      
      console.log("🎯 Transfer request:", { cardId, amount, sessionId: req.session?.userId });
      
      // Check authentication
      if (!req.session?.userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      if (!amount || amount === 0) {
        return res.status(400).json({ message: "Invalid amount" });
      }

      const card = await storage.getCard(cardId);
      if (!card) {
        return res.status(404).json({ message: "Card not found" });
      }

      if (card.userId !== req.session.userId) {
        return res.status(403).json({ message: "Access denied" });
      }

      console.log("💳 Processing Reap API call for card:", card.reapCardId);
      
      // Process with Reap API
      const transfer = await reapService.addFunds(card.reapCardId || "", amount);
      
      console.log("✅ Reap API response:", transfer);

      // Create transaction record
      await storage.createTransaction({
        cardId: cardId,
        amount: amount.toString(),
        type: amount > 0 ? "deposit" : "withdrawal",
        description: amount > 0 ? "Add funds" : "Withdraw funds",
        status: "completed",
        currency: "USD",
        merchant: "Card Transfer System",
      });

      res.json({
        success: true,
        transfer,
        message: amount > 0 ? "Funds added successfully" : "Funds withdrawn successfully"
      });
    } catch (error) {
      console.error("❌ Error processing card transfer:", error);
      res.status(500).json({ message: "Failed to process transfer" });
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

  // KYC routes
  app.get("/api/kyc/status", requireAuth, async (req: any, res) => {
    try {
      const userId = req.session?.userId;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      const kycData = await storage.getKycVerificationByUserId(userId);
      res.json(kycData || null);
    } catch (error) {
      console.error("Error fetching KYC status:", error);
      res.status(500).json({ message: "Failed to fetch KYC status" });
    }
  });

  app.post("/api/kyc/submit", requireAuth, async (req: any, res) => {
    try {
      const userId = req.session?.userId;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      // Validate form data
      const formData = kycVerificationFormSchema.parse(req.body);
      
      // Convert form data to KYC verification data
      const kycData = insertKycVerificationSchema.parse({
        userId,
        nationality: formData.nationality,
        firstName: formData.firstName,
        lastName: formData.lastName,
        dateOfBirth: new Date(formData.dateOfBirth),
        documentType: formData.documentType,
        idNumber: formData.idNumber,
        phoneNumber: formData.phoneNumber,
        email: formData.email,
        status: "pending" // Pending review by admin
      });

      // Check if KYC already exists
      const existingKyc = await storage.getKycVerificationByUserId(userId);
      let result;
      
      if (existingKyc) {
        // Update existing KYC
        result = await storage.updateKycVerification(existingKyc.id, {
          ...kycData,
          reviewedAt: new Date()
        });
      } else {
        // Create new KYC
        result = await storage.createKycVerification(kycData);
      }

      // Update user profile with address information
      await storage.updateUserProfile(userId, {
        address: formData.streetAddress,
        city: formData.city,
        postalCode: formData.postalCode,
        dateOfBirth: formData.dateOfBirth,
        nationality: formData.nationality,
        idDocumentType: formData.documentType,
        idDocumentNumber: formData.idNumber
      });

      console.log("✅ KYC verification saved successfully:", result);
      res.json({ success: true, kyc: result });
    } catch (error) {
      console.error("Error submitting KYC:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Validation error", 
          errors: error.errors 
        });
      }
      res.status(500).json({ message: "Failed to submit KYC verification" });
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

  // Webhook routes for Reap API
  app.post("/api/webhooks/subscribe", requireAuth, async (req: any, res) => {
    try {
      const { subscribeUrl } = req.body;
      
      if (!subscribeUrl) {
        return res.status(400).json({ message: "Subscribe URL is required" });
      }

      const subscription = await reapService.subscribeToWebhook(subscribeUrl);
      res.json({
        message: "Webhook subscription successful",
        subscription
      });
    } catch (error) {
      console.error("Error subscribing to webhook:", error);
      res.status(500).json({ 
        message: "Failed to subscribe to webhook",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  app.get("/api/webhooks", requireAuth, async (req: any, res) => {
    try {
      const subscriptions = await reapService.getWebhookSubscriptions();
      res.json(subscriptions);
    } catch (error) {
      console.error("Error fetching webhook subscriptions:", error);
      res.status(500).json({ 
        message: "Failed to fetch webhook subscriptions",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  app.delete("/api/webhooks/:id", requireAuth, async (req: any, res) => {
    try {
      const { id } = req.params;
      await reapService.deleteWebhookSubscription(id);
      res.json({ message: "Webhook subscription deleted successfully" });
    } catch (error) {
      console.error("Error deleting webhook subscription:", error);
      res.status(500).json({ 
        message: "Failed to delete webhook subscription",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // Webhook endpoint to receive notifications from Reap
  app.post("/api/webhooks/reap", async (req, res) => {
    try {
      console.log("🔔 Received Reap webhook:", req.body);
      
      // Process webhook data based on event type
      const webhookData = req.body;
      
      // Example webhook processing - you can customize this based on your needs
      if (webhookData.event_type === 'transaction.created') {
        // Handle transaction webhook
        console.log("Processing transaction webhook:", webhookData);
        
        // You could create notifications, update balances, etc.
        // Example: Create notification for the user
        // await storage.createNotification({
        //   userId: webhookData.user_id,
        //   type: 'transaction',
        //   title: 'Transaction Alert',
        //   message: `Transaction of ${webhookData.amount} processed`,
        //   data: webhookData
        // });
      } else if (webhookData.event_type === 'card.status_changed') {
        // Handle card status change webhook
        console.log("Processing card status webhook:", webhookData);
      }
      
      // Always respond with 200 to acknowledge receipt
      res.status(200).json({ message: "Webhook received and processed" });
    } catch (error) {
      console.error("Error processing webhook:", error);
      res.status(500).json({ message: "Error processing webhook" });
    }
  });



  // Admin routes - Users management
  app.get("/api/admin/users", requireAuth, async (req: any, res) => {
    try {
      const user = await storage.getUser(req.session?.userId!);
      if (!user || user.role !== "admin") {
        return res.status(403).json({ message: "Admin access required" });
      }

      const users = await storage.getAllUsers();
      res.json(users);
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ message: "Failed to fetch users" });
    }
  });

  // Admin KYC management routes
  app.get("/api/admin/kyc", requireAuth, async (req: any, res) => {
    try {
      const user = await storage.getUser(req.session?.userId!);
      if (!user || user.role !== "admin") {
        return res.status(403).json({ message: "Admin access required" });
      }

      const kycRequests = await storage.getAllKycVerifications();
      res.json(kycRequests);
    } catch (error) {
      console.error("Error fetching KYC requests:", error);
      res.status(500).json({ message: "Failed to fetch KYC requests" });
    }
  });

  app.patch("/api/admin/kyc/:kycId/status", requireAuth, async (req: any, res) => {
    try {
      const user = await storage.getUser(req.session?.userId!);
      if (!user || user.role !== "admin") {
        return res.status(403).json({ message: "Admin access required" });
      }

      const { kycId } = req.params;
      const { status, rejectionReason } = req.body;

      if (!["pending", "verified", "rejected"].includes(status)) {
        return res.status(400).json({ message: "Invalid status" });
      }

      const updatedKyc = await storage.updateKycStatus(kycId, status, rejectionReason);
      res.json(updatedKyc);
    } catch (error) {
      console.error("Error updating KYC status:", error);
      res.status(500).json({ message: "Failed to update KYC status" });
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

  // Bank transfer routes
  app.get("/api/bank-transfers", requireAuth, async (req: any, res) => {
    try {
      const userId = req.session?.userId;
      const transfers = await db.select()
        .from(schema.bankTransfers)
        .where(eq(schema.bankTransfers.userId, userId))
        .orderBy(desc(schema.bankTransfers.createdAt));

      res.json(transfers);
    } catch (error) {
      console.error("Error fetching bank transfers:", error);
      res.status(500).json({ error: "Failed to fetch bank transfers" });
    }
  });

  // Admin bank transfer routes
  app.get("/api/admin/bank-transfers", requireAuth, async (req: any, res) => {
    try {
      const user = await storage.getUser(req.session?.userId!);
      if (!user || user.role !== "admin") {
        return res.status(403).json({ message: "Admin access required" });
      }

      const transfers = await db.select({
        id: schema.bankTransfers.id,
        type: schema.bankTransfers.type,
        amount: schema.bankTransfers.amount,
        currency: schema.bankTransfers.currency,
        recipientName: schema.bankTransfers.recipientName,
        recipientBank: schema.bankTransfers.recipientBank,
        recipientAccount: schema.bankTransfers.recipientAccount,
        senderName: schema.bankTransfers.senderName,
        senderBank: schema.bankTransfers.senderBank,
        senderAccount: schema.bankTransfers.senderAccount,
        reference: schema.bankTransfers.reference,
        description: schema.bankTransfers.description,
        status: schema.bankTransfers.status,
        feeAmount: schema.bankTransfers.feeAmount,
        createdAt: schema.bankTransfers.createdAt,
        processedAt: schema.bankTransfers.processedAt,
        userId: schema.bankTransfers.userId,
        userFirstName: schema.users.firstName,
        userLastName: schema.users.lastName,
        userEmail: schema.users.email
      })
      .from(schema.bankTransfers)
      .leftJoin(schema.users, eq(schema.bankTransfers.userId, schema.users.id))
      .orderBy(desc(schema.bankTransfers.createdAt));

      res.json(transfers);
    } catch (error) {
      console.error("Error fetching admin bank transfers:", error);
      res.status(500).json({ error: "Failed to fetch bank transfers" });
    }
  });

  app.patch("/api/admin/bank-transfers/:id/status", requireAuth, async (req: any, res) => {
    try {
      const user = await storage.getUser(req.session?.userId!);
      if (!user || user.role !== "admin") {
        return res.status(403).json({ message: "Admin access required" });
      }

      const { id } = req.params;
      const { status, adminNote } = req.body;

      if (!["pending", "processing", "completed", "failed", "cancelled"].includes(status)) {
        return res.status(400).json({ error: "Invalid status" });
      }

      const [transfer] = await db.update(schema.bankTransfers)
        .set({ 
          status, 
          processedAt: status === 'completed' ? new Date() : null,
          updatedAt: new Date()
        })
        .where(eq(schema.bankTransfers.id, id))
        .returning();

      if (!transfer) {
        return res.status(404).json({ error: "Transfer not found" });
      }

      res.json(transfer);
    } catch (error) {
      console.error("Error updating bank transfer status:", error);
      res.status(500).json({ error: "Failed to update transfer status" });
    }
  });

  app.post("/api/bank-transfers", requireAuth, async (req: any, res) => {
    try {
      const userId = req.session?.userId;
      const parsedData = schema.insertBankTransferSchema.parse(req.body);
      
      const [transfer] = await db.insert(schema.bankTransfers)
        .values({
          ...parsedData,
          userId,
        })
        .returning();

      res.json(transfer);
    } catch (error) {
      console.error("Error creating bank transfer:", error);
      res.status(500).json({ error: "Failed to create bank transfer" });
    }
  });

  app.patch("/api/bank-transfers/:id/status", requireAuth, async (req: any, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const userId = req.session?.userId;

      const [transfer] = await db.update(schema.bankTransfers)
        .set({ 
          status, 
          processedAt: status === 'completed' ? new Date() : null,
          updatedAt: new Date()
        })
        .where(and(
          eq(schema.bankTransfers.id, id),
          eq(schema.bankTransfers.userId, userId)
        ))
        .returning();

      if (!transfer) {
        return res.status(404).json({ error: "Transfer not found" });
      }

      res.json(transfer);
    } catch (error) {
      console.error("Error updating bank transfer status:", error);
      res.status(500).json({ error: "Failed to update transfer status" });
    }
  });

  // ==================== ADMIN REFERRAL MANAGEMENT APIs ====================
  
  // Get all referrals for admin
  app.get("/api/admin/referrals", requireAuth, async (req: any, res) => {
    try {
      const user = await storage.getUser(req.session?.userId!);
      if (!user || user.role !== "admin") {
        return res.status(403).json({ message: "Admin access required" });
      }

      const referrals = await db.select().from(schema.referrals).orderBy(desc(schema.referrals.createdAt));

      res.json(referrals);
    } catch (error: any) {
      res.status(500).json({ message: "Error fetching referrals: " + error.message });
    }
  });

  // Get referral statistics for admin
  app.get("/api/admin/referrals/stats", requireAuth, async (req: any, res) => {
    try {
      const user = await storage.getUser(req.session?.userId!);
      if (!user || user.role !== "admin") {
        return res.status(403).json({ message: "Admin access required" });
      }

      const totalReferrals = await db.select({ count: sql`count(*)` }).from(schema.referrals);
      const successfulReferrals = await db.select({ count: sql`count(*)` }).from(schema.referrals).where(eq(schema.referrals.status, 'completed'));
      const pendingReferrals = await db.select({ count: sql`count(*)` }).from(schema.referrals).where(eq(schema.referrals.status, 'pending'));
      const totalRewards = await db.select({ sum: sql`sum(CAST(${schema.referrals.rewardAmount} AS DECIMAL))` }).from(schema.referrals).where(eq(schema.referrals.status, 'completed'));

      res.json({
        totalReferrals: totalReferrals[0]?.count || 0,
        successfulReferrals: successfulReferrals[0]?.count || 0,
        pendingReferrals: pendingReferrals[0]?.count || 0,
        totalRewards: totalRewards[0]?.sum || 0
      });
    } catch (error: any) {
      res.status(500).json({ message: "Error fetching referral stats: " + error.message });
    }
  });

  // Update referral status
  app.patch("/api/admin/referrals/:id", requireAuth, async (req: any, res) => {
    try {
      const user = await storage.getUser(req.session?.userId!);
      if (!user || user.role !== "admin") {
        return res.status(403).json({ message: "Admin access required" });
      }

      const { id } = req.params;
      const { status } = req.body;
      
      const updateData: any = { status };
      if (status === 'completed') {
        updateData.completedAt = new Date();
      }

      await db.update(schema.referrals)
        .set(updateData)
        .where(eq(schema.referrals.id, id));
      
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ message: "Error updating referral: " + error.message });
    }
  });

  // ==================== REFERRAL PROGRAM APIs ====================
  
  // Get user's referral data
  app.get("/api/referrals/my-data", requireAuth, async (req: any, res) => {
    try {
      const userId = req.session?.userId;
      const [referralData] = await db.select().from(schema.referrals).where(eq(schema.referrals.referrerId, userId));
      
      if (!referralData) {
        // Create referral code if doesn't exist
        const newCode = 'REF' + Math.random().toString(36).substr(2, 8).toUpperCase();
        const [newReferral] = await db.insert(schema.referrals).values({
          referrerId: userId,
          referralCode: newCode,
          status: 'pending'
        }).returning();
        return res.json(newReferral);
      }
      
      res.json(referralData);
    } catch (error) {
      console.error("Error fetching referral data:", error);
      res.status(500).json({ message: "Failed to fetch referral data" });
    }
  });

  // Get referral statistics
  app.get("/api/referrals/stats", requireAuth, async (req: any, res) => {
    try {
      const userId = req.session?.userId;
      
      // Count completed referrals
      const completedReferrals = await db.select().from(schema.referrals)
        .where(and(eq(schema.referrals.referrerId, userId), eq(schema.referrals.status, 'completed')));
      
      // Calculate total earnings
      const totalEarnings = completedReferrals.reduce((sum, ref) => sum + parseFloat(ref.rewardAmount || '0'), 0);
      
      res.json({
        friendsReferred: completedReferrals.length,
        totalEarnings: totalEarnings
      });
    } catch (error) {
      console.error("Error fetching referral stats:", error);
      res.status(500).json({ message: "Failed to fetch referral stats" });
    }
  });

  // Apply referral code
  app.post("/api/referrals/apply", requireAuth, async (req: any, res) => {
    try {
      const userId = req.session?.userId;
      const { referralCode } = req.body;
      
      if (!referralCode) {
        return res.status(400).json({ message: "Referral code is required" });
      }
      
      // Find referral
      const [referral] = await db.select().from(schema.referrals)
        .where(eq(schema.referrals.referralCode, referralCode));
      
      if (!referral) {
        return res.status(404).json({ message: "Invalid referral code" });
      }
      
      if (referral.referrerId === userId) {
        return res.status(400).json({ message: "Cannot use your own referral code" });
      }
      
      // Update referral with referee
      await db.update(schema.referrals)
        .set({ 
          refereeId: userId, 
          status: 'completed',
          completedAt: new Date()
        })
        .where(eq(schema.referrals.id, referral.id));
      
      res.json({ message: "Referral code applied successfully", reward: referral.rewardAmount });
    } catch (error) {
      console.error("Error applying referral code:", error);
      res.status(500).json({ message: "Failed to apply referral code" });
    }
  });

  // ==================== VOUCHERS APIs ====================
  
  // Get user's vouchers
  app.get("/api/vouchers/my-vouchers", requireAuth, async (req: any, res) => {
    try {
      const userId = req.session?.userId;
      const vouchers = await db.select().from(schema.vouchers)
        .where(eq(schema.vouchers.userId, userId))
        .orderBy(desc(schema.vouchers.createdAt));
      
      res.json(vouchers);
    } catch (error) {
      console.error("Error fetching user vouchers:", error);
      res.status(500).json({ message: "Failed to fetch vouchers" });
    }
  });

  // Get available vouchers
  app.get("/api/vouchers/available", requireAuth, async (req: any, res) => {
    try {
      const vouchers = await db.select().from(schema.vouchers)
        .where(and(
          eq(schema.vouchers.status, 'active'),
          isNull(schema.vouchers.userId) // Public vouchers
        ))
        .orderBy(desc(schema.vouchers.createdAt));
      
      res.json(vouchers);
    } catch (error) {
      console.error("Error fetching available vouchers:", error);
      res.status(500).json({ message: "Failed to fetch available vouchers" });
    }
  });

  // Redeem voucher
  app.post("/api/vouchers/redeem", requireAuth, async (req: any, res) => {
    try {
      const userId = req.session?.userId;
      const { voucherCode } = req.body;
      
      if (!voucherCode) {
        return res.status(400).json({ message: "Voucher code is required" });
      }
      
      // Find voucher
      const [voucher] = await db.select().from(schema.vouchers)
        .where(and(
          eq(schema.vouchers.code, voucherCode),
          eq(schema.vouchers.status, 'active')
        ));
      
      if (!voucher) {
        return res.status(404).json({ message: "Invalid or expired voucher code" });
      }
      
      // Check if voucher is expired
      if (new Date() > new Date(voucher.expiresAt)) {
        await db.update(schema.vouchers)
          .set({ status: 'expired' })
          .where(eq(schema.vouchers.id, voucher.id));
        return res.status(400).json({ message: "Voucher has expired" });
      }
      
      // Apply voucher to user
      await db.update(schema.vouchers)
        .set({ 
          userId: userId,
          status: 'used',
          usedAt: new Date()
        })
        .where(eq(schema.vouchers.id, voucher.id));
      
      // Add amount to user wallet
      await db.update(schema.users)
        .set({ 
          walletBalance: sql`wallet_balance + ${voucher.amount}`
        })
        .where(eq(schema.users.id, userId));
      
      res.json({ 
        message: "Voucher redeemed successfully", 
        amount: voucher.amount,
        type: voucher.type
      });
    } catch (error) {
      console.error("Error redeeming voucher:", error);
      res.status(500).json({ message: "Failed to redeem voucher" });
    }
  });

  // ==================== CURRENCY CONVERTER APIs ====================
  
  // Get exchange rates
  app.get("/api/currency/rates", requireAuth, async (req: any, res) => {
    try {
      const rates = await db.select().from(schema.exchangeRates)
        .orderBy(desc(schema.exchangeRates.lastUpdated));
      
      res.json(rates);
    } catch (error) {
      console.error("Error fetching exchange rates:", error);
      res.status(500).json({ message: "Failed to fetch exchange rates" });
    }
  });

  // Convert currency
  app.post("/api/currency/convert", requireAuth, async (req: any, res) => {
    try {
      const userId = req.session?.userId;
      const { fromCurrency, toCurrency, amount } = req.body;
      
      if (!fromCurrency || !toCurrency || !amount) {
        return res.status(400).json({ message: "Missing required parameters" });
      }
      
      // Get exchange rate
      const [rate] = await db.select().from(schema.exchangeRates)
        .where(and(
          eq(schema.exchangeRates.fromCurrency, fromCurrency),
          eq(schema.exchangeRates.toCurrency, toCurrency)
        ));
      
      if (!rate) {
        return res.status(404).json({ message: "Exchange rate not found" });
      }
      
      const convertedAmount = parseFloat(amount) * parseFloat(rate.rate.toString());
      
      // Save conversion history
      await db.insert(schema.currencyConversions).values({
        userId,
        fromCurrency,
        toCurrency,
        fromAmount: amount.toString(),
        toAmount: convertedAmount.toString(),
        exchangeRate: rate.rate.toString()
      });
      
      res.json({
        fromAmount: amount,
        toAmount: convertedAmount,
        exchangeRate: rate.rate,
        fromCurrency,
        toCurrency
      });
    } catch (error) {
      console.error("Error converting currency:", error);
      res.status(500).json({ message: "Failed to convert currency" });
    }
  });

  // Get conversion history
  app.get("/api/currency/history", requireAuth, async (req: any, res) => {
    try {
      const userId = req.session?.userId;
      const conversions = await db.select().from(schema.currencyConversions)
        .where(eq(schema.currencyConversions.userId, userId))
        .orderBy(desc(schema.currencyConversions.createdAt))
        .limit(10);
      
      res.json(conversions);
    } catch (error) {
      console.error("Error fetching conversion history:", error);
      res.status(500).json({ message: "Failed to fetch conversion history" });
    }
  });

  // ==================== COMMUNITY APIs ====================
  
  // Get discussions
  app.get("/api/community/discussions", requireAuth, async (req: any, res) => {
    try {
      const discussions = await db.select({
        id: schema.discussions.id,
        title: schema.discussions.title,
        category: schema.discussions.category,
        isPopular: schema.discussions.isPopular,
        likes: schema.discussions.likes,
        replies: schema.discussions.replies,
        createdAt: schema.discussions.createdAt,
        author: schema.users.firstName,
        userId: schema.discussions.userId
      })
      .from(schema.discussions)
      .leftJoin(schema.users, eq(schema.discussions.userId, schema.users.id))
      .where(eq(schema.discussions.status, 'active'))
      .orderBy(desc(schema.discussions.createdAt));
      
      res.json(discussions);
    } catch (error) {
      console.error("Error fetching discussions:", error);
      res.status(500).json({ message: "Failed to fetch discussions" });
    }
  });

  // Get community stats
  app.get("/api/community/stats", requireAuth, async (req: any, res) => {
    try {
      const totalMembers = await db.select().from(schema.users);
      const todayDiscussions = await db.select().from(schema.discussions)
        .where(sql`DATE(created_at) = DATE(NOW())`);
      
      res.json({
        totalMembers: totalMembers.length,
        onlineNow: Math.floor(totalMembers.length * 0.02), // Simulate 2% online
        postsToday: todayDiscussions.length,
        helpfulAnswers: 1250 // Static for now
      });
    } catch (error) {
      console.error("Error fetching community stats:", error);
      res.status(500).json({ message: "Failed to fetch community stats" });
    }
  });

  // Get events
  app.get("/api/community/events", requireAuth, async (req: any, res) => {
    try {
      const events = await db.select().from(schema.events)
        .where(eq(schema.events.status, 'upcoming'))
        .orderBy(schema.events.eventDate);
      
      res.json(events);
    } catch (error) {
      console.error("Error fetching events:", error);
      res.status(500).json({ message: "Failed to fetch events" });
    }
  });

  // Join event
  app.post("/api/community/events/:eventId/join", requireAuth, async (req: any, res) => {
    try {
      const userId = req.session?.userId;
      const { eventId } = req.params;
      
      // Check if already registered
      const [existing] = await db.select().from(schema.eventAttendees)
        .where(and(
          eq(schema.eventAttendees.eventId, eventId),
          eq(schema.eventAttendees.userId, userId)
        ));
      
      if (existing) {
        return res.status(400).json({ message: "Already registered for this event" });
      }
      
      // Register for event
      await db.insert(schema.eventAttendees).values({
        eventId,
        userId
      });
      
      // Update attendee count
      await db.update(schema.events)
        .set({ 
          currentAttendees: sql`current_attendees + 1`
        })
        .where(eq(schema.events.id, eventId));
      
      res.json({ message: "Successfully registered for event" });
    } catch (error) {
      console.error("Error joining event:", error);
      res.status(500).json({ message: "Failed to join event" });
    }
  });

  // Get top contributors
  app.get("/api/community/contributors", requireAuth, async (req: any, res) => {
    try {
      const contributors = await db.select({
        name: sql`CONCAT(${schema.users.firstName}, ' ', ${schema.users.lastName})`,
        points: schema.userContributions.points,
        badge: schema.userContributions.badge
      })
      .from(schema.userContributions)
      .leftJoin(schema.users, eq(schema.userContributions.userId, schema.users.id))
      .orderBy(desc(schema.userContributions.points))
      .limit(10);
      
      res.json(contributors);
    } catch (error) {
      console.error("Error fetching contributors:", error);
      res.status(500).json({ message: "Failed to fetch contributors" });
    }
  });

  // Admin: Get all deposit requests
  app.get("/api/admin/deposit-requests", requireAuth, async (req: any, res) => {
    try {
      const userId = req.session?.userId;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      // Check if user is admin
      const user = await db.select().from(schema.users).where(eq(schema.users.id, userId)).limit(1);
      if (!user[0] || user[0].role !== 'admin') {
        return res.status(403).json({ message: "Admin access required" });
      }

      const requests = await db
        .select({
          id: schema.depositRequests.id,
          userId: schema.depositRequests.userId,
          userEmail: schema.users.email,
          userName: sql`CONCAT(${schema.users.firstName}, ' ', ${schema.users.lastName})`,
          amount: schema.depositRequests.amount,
          method: schema.depositRequests.method,
          status: schema.depositRequests.status,
          adminNotes: schema.depositRequests.adminNotes,
          createdAt: schema.depositRequests.createdAt,
          updatedAt: schema.depositRequests.updatedAt,
        })
        .from(schema.depositRequests)
        .leftJoin(schema.users, eq(schema.depositRequests.userId, schema.users.id))
        .orderBy(desc(schema.depositRequests.createdAt));

      res.json(requests);
    } catch (error) {
      console.error("Error fetching deposit requests:", error);
      res.status(500).json({ message: "Failed to fetch deposit requests" });
    }
  });

  // Admin: Approve deposit request
  app.post("/api/admin/deposit-requests/:id/approve", requireAuth, async (req: any, res) => {
    try {
      const userId = req.session?.userId;
      const requestId = req.params.id;
      
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      // Check if user is admin
      const user = await db.select().from(schema.users).where(eq(schema.users.id, userId)).limit(1);
      if (!user[0] || user[0].role !== 'admin') {
        return res.status(403).json({ message: "Admin access required" });
      }

      // Get the deposit request
      const [request] = await db
        .select()
        .from(schema.depositRequests)
        .where(eq(schema.depositRequests.id, requestId))
        .limit(1);

      if (!request) {
        return res.status(404).json({ message: "Deposit request not found" });
      }

      if (request.status !== 'pending') {
        return res.status(400).json({ message: "Request already processed" });
      }

      // Update deposit request status
      await db
        .update(schema.depositRequests)
        .set({
          status: 'approved',
          processedBy: userId,
          processedAt: new Date(),
          updatedAt: new Date(),
        })
        .where(eq(schema.depositRequests.id, requestId));

      // Add amount to user's wallet
      await db
        .update(schema.wallets)
        .set({
          balance: sql`${schema.wallets.balance} + ${request.amount}`,
          updatedAt: new Date(),
        })
        .where(eq(schema.wallets.userId, request.userId));

      // Create transaction record
      await db.insert(schema.transactions).values({
        userId: request.userId,
        type: 'deposit',
        amount: request.amount,
        status: 'completed',
        description: `Deposit approved by admin`,
        method: request.method,
      });

      res.json({ message: "Deposit request approved successfully" });
    } catch (error) {
      console.error("Error approving deposit request:", error);
      res.status(500).json({ message: "Failed to approve deposit request" });
    }
  });

  // Admin: Reject deposit request
  app.post("/api/admin/deposit-requests/:id/reject", requireAuth, async (req: any, res) => {
    try {
      const userId = req.session?.userId;
      const requestId = req.params.id;
      const { notes } = req.body;
      
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      // Check if user is admin
      const user = await db.select().from(schema.users).where(eq(schema.users.id, userId)).limit(1);
      if (!user[0] || user[0].role !== 'admin') {
        return res.status(403).json({ message: "Admin access required" });
      }

      // Get the deposit request
      const [request] = await db
        .select()
        .from(schema.depositRequests)
        .where(eq(schema.depositRequests.id, requestId))
        .limit(1);

      if (!request) {
        return res.status(404).json({ message: "Deposit request not found" });
      }

      if (request.status !== 'pending') {
        return res.status(400).json({ message: "Request already processed" });
      }

      // Update deposit request status
      await db
        .update(schema.depositRequests)
        .set({
          status: 'rejected',
          processedBy: userId,
          processedAt: new Date(),
          adminNotes: notes || 'Request rejected by admin',
          updatedAt: new Date(),
        })
        .where(eq(schema.depositRequests.id, requestId));

      res.json({ message: "Deposit request rejected" });
    } catch (error) {
      console.error("Error rejecting deposit request:", error);
      res.status(500).json({ message: "Failed to reject deposit request" });
    }
  });

  // Submit deposit request (update existing deposit endpoint)
  app.post("/api/wallet/deposit", requireAuth, async (req: any, res) => {
    try {
      const userId = req.session?.userId;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const { amount, method } = req.body;

      if (!amount || amount <= 0) {
        return res.status(400).json({ message: "Invalid amount" });
      }

      if (!method || !['card', 'bank', 'crypto', 'binance'].includes(method)) {
        return res.status(400).json({ message: "Invalid payment method" });
      }

      // Create deposit request instead of directly adding to wallet
      const [depositRequest] = await db
        .insert(schema.depositRequests)
        .values({
          userId,
          amount: amount.toString(),
          method,
          status: 'pending',
        })
        .returning();

      res.json({ 
        message: "Deposit request submitted successfully", 
        requestId: depositRequest.id,
        status: "pending"
      });
    } catch (error) {
      console.error("Error submitting deposit request:", error);
      res.status(500).json({ message: "Failed to submit deposit request" });
    }
  });

  // Binance Pay: Create payment order
  app.post("/api/binance/create-order", requireAuth, async (req: any, res) => {
    try {
      const userId = req.session?.userId;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      if (!binancePayService.isConfigured()) {
        return res.status(503).json({ 
          message: "Binance Pay is not configured. Please contact administrator." 
        });
      }

      const { amount, currency = 'USDT' } = req.body;

      if (!amount || amount <= 0) {
        return res.status(400).json({ message: "Invalid amount" });
      }

      // Generate unique merchant trade number
      const merchantTradeNo = binancePayService.generateMerchantTradeNo(userId);

      // Create Binance Pay order
      const orderData = {
        merchantTradeNo,
        totalFee: amount.toString(),
        currency,
        productType: 'Digital Asset',
        productName: 'Wallet Deposit',
        productDetail: `Deposit $${amount} to wallet`,
        returnUrl: `${process.env.BASE_URL || 'https://your-domain.com'}/deposit/success`,
        cancelUrl: `${process.env.BASE_URL || 'https://your-domain.com'}/deposit/cancel`,
      };

      const paymentOrder = await binancePayService.createOrder(orderData);

      // Store order information in database
      await db
        .insert(schema.depositRequests)
        .values({
          userId,
          amount: amount.toString(),
          method: 'binance',
          status: 'pending',
          transactionReference: merchantTradeNo,
        });

      res.json({
        success: true,
        orderId: merchantTradeNo,
        paymentUrl: paymentOrder.checkoutUrl,
        qrCode: paymentOrder.qrContent,
        deeplink: paymentOrder.deeplink,
        universalUrl: paymentOrder.universalUrl,
        expireTime: paymentOrder.expireTime,
      });
    } catch (error) {
      console.error("Error creating Binance Pay order:", error);
      res.status(500).json({ 
        message: "Failed to create payment order",
        error: error.message 
      });
    }
  });

  // Binance Pay: Query order status
  app.post("/api/binance/query-order", requireAuth, async (req: any, res) => {
    try {
      const userId = req.session?.userId;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      if (!binancePayService.isConfigured()) {
        return res.status(503).json({ 
          message: "Binance Pay is not configured. Please contact administrator." 
        });
      }

      const { merchantTradeNo } = req.body;

      if (!merchantTradeNo) {
        return res.status(400).json({ message: "Merchant trade number is required" });
      }

      const orderStatus = await binancePayService.queryOrder(merchantTradeNo);

      // Update local deposit request status based on Binance Pay status
      if (orderStatus.status === 'PAY_SUCCESS') {
        await db
          .update(schema.depositRequests)
          .set({
            status: 'approved',
            processedAt: new Date(),
            updatedAt: new Date(),
          })
          .where(eq(schema.depositRequests.transactionReference, merchantTradeNo));

        // Add amount to user's wallet
        const [request] = await db
          .select()
          .from(schema.depositRequests)
          .where(eq(schema.depositRequests.transactionReference, merchantTradeNo))
          .limit(1);

        if (request) {
          await db.insert(schema.transactions).values({
            userId: request.userId,
            type: 'deposit',
            amount: request.amount,
            status: 'completed',
            description: `Binance Pay deposit completed`,
            method: 'binance',
          });
        }
      }

      res.json({
        success: true,
        status: orderStatus.status,
        orderInfo: orderStatus,
      });
    } catch (error) {
      console.error("Error querying Binance Pay order:", error);
      res.status(500).json({ 
        message: "Failed to query order status",
        error: error.message 
      });
    }
  });

  // Binance Pay: Webhook endpoint for payment notifications
  app.post("/api/binance/webhook", async (req: any, res) => {
    try {
      // Verify webhook signature here if needed
      const { merchantTradeNo, status, totalFee } = req.body;

      if (status === 'PAY_SUCCESS') {
        // Find the deposit request
        const [request] = await db
          .select()
          .from(schema.depositRequests)
          .where(eq(schema.depositRequests.transactionReference, merchantTradeNo))
          .limit(1);

        if (request && request.status === 'pending') {
          // Update deposit request status
          await db
            .update(schema.depositRequests)
            .set({
              status: 'approved',
              processedAt: new Date(),
              updatedAt: new Date(),
            })
            .where(eq(schema.depositRequests.id, request.id));

          // Add amount to user's wallet (you'll need to implement wallet logic)
          await db.insert(schema.transactions).values({
            userId: request.userId,
            type: 'deposit',
            amount: request.amount,
            status: 'completed',
            description: `Binance Pay deposit completed - ${merchantTradeNo}`,
            method: 'binance',
          });

          console.log(`Binance Pay payment successful for order: ${merchantTradeNo}`);
        }
      }

      res.json({ success: true });
    } catch (error) {
      console.error("Error processing Binance Pay webhook:", error);
      res.status(500).json({ message: "Webhook processing failed" });
    }
  });

  // Profile update endpoint - using same auth as other working endpoints
  app.patch("/api/auth/profile", requireAuth, async (req: any, res) => {
    try {
      const userId = req.session?.userId;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      const updateData = req.body;
      const updatedUser = await storage.updateUserProfile(userId, updateData);
      
      // Return updated user without sensitive fields
      const { password, ...userWithoutPassword } = updatedUser;
      res.json(userWithoutPassword);
    } catch (error) {
      console.error("Error updating profile:", error);
      res.status(500).json({ message: "Failed to update profile" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
