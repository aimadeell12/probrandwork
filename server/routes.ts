import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupLocalAuth, requireAuth } from "./auth";
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
    cookie: {
      httpOnly: true,
      secure: false, // Set to true in production with HTTPS
      maxAge: sessionTtl,
    },
  }));

  // Auth middleware
  setupLocalAuth(app);

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
      const userId = req.user.id;
      const cardData = insertCardSchema.parse({
        ...req.body,
        userId,
      });

      // Create card with Lithic
      const lithicCard = await lithicService.createCard({
        holderName: cardData.holderName,
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

  // Support routes
  app.post("/api/support/tickets", requireAuth, async (req: any, res) => {
    try {
      const userId = req.user.id;
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
      const userId = req.user.id;
      const tickets = await storage.getSupportTicketsByUserId(userId);
      res.json(tickets);
    } catch (error) {
      console.error("Error fetching support tickets:", error);
      res.status(500).json({ message: "Failed to fetch support tickets" });
    }
  });

  // Admin routes
  app.get("/api/admin/users", requireAuth, async (req: any, res) => {
    try {
      const user = await storage.getUser(req.user.id);
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
      const user = await storage.getUser(req.user.id);
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
