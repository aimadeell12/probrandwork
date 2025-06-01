import bcrypt from "bcryptjs";
import { storage } from "./storage";
import type { Express, RequestHandler } from "express";

// Extend session data type
declare module "express-session" {
  interface SessionData {
    userId: string;
  }
}

// Simple auth middleware
export const requireAuth: RequestHandler = async (req, res, next) => {
  if (!req.session?.userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  next();
};

export function setupSimpleAuth(app: Express) {
  // Login route
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ message: "Username and password required" });
      }

      // Try to find user by username, email, or phone
      let user = await storage.getUserByUsername(username);
      
      // If not found by username, try email (case insensitive)
      if (!user) {
        user = await storage.getUserByEmail(username);
        if (!user) {
          // Try case insensitive email search
          try {
            const users = await storage.getAllUsers();
            user = users.find(u => u.email && u.email.toLowerCase() === username.toLowerCase());
          } catch (error) {
            console.error("Error searching by email:", error);
          }
        }
      }
      
      // If not found by email, try phone
      if (!user) {
        try {
          const users = await storage.getAllUsers();
          user = users.find(u => u.phone === username);
        } catch (error) {
          console.error("Error searching by phone:", error);
        }
      }

      if (!user || !user.password) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const isValid = await bcrypt.compare(password, user.password);
      if (!isValid) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      req.session.userId = user.id;
      await new Promise<void>((resolve, reject) => {
        req.session.save((err) => {
          if (err) reject(err);
          else resolve();
        });
      });
      res.json({ message: "Login successful", user: { id: user.id, username: user.username } });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ message: "Login failed" });
    }
  });

  // Register route
  app.post("/api/auth/register", async (req, res) => {
    try {
      const { username, password, email } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ message: "Username and password required" });
      }

      // Check if user exists
      const existingUser = await storage.getUserByUsername(username);
      if (existingUser) {
        return res.status(400).json({ message: "Username already exists" });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create user
      const user = await storage.createLocalUser({
        id: crypto.randomUUID(),
        username,
        password: hashedPassword,
        email: email || null,
        authType: "local",
        role: "user"
      });

      req.session.userId = user.id;
      await new Promise<void>((resolve, reject) => {
        req.session.save((err) => {
          if (err) reject(err);
          else resolve();
        });
      });
      res.status(200).json({ message: "Registration successful", user: { id: user.id, username: user.username } });
    } catch (error) {
      console.error("Registration error:", error);
      res.status(500).json({ message: "Registration failed" });
    }
  });

  // Get current user
  app.get("/api/auth/user", requireAuth, async (req, res) => {
    try {
      const userId = req.session?.userId;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      // Force fresh data - disable all caching
      res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate, private');
      res.set('Pragma', 'no-cache');
      res.set('Expires', '0');
      res.set('Last-Modified', new Date().toUTCString());
      res.set('ETag', `"${Date.now()}"`);
      res.set('Vary', '*');
      
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      console.log("📋 [GET USER] Returning fresh user data:", {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        updatedAt: user.updatedAt
      });
      
      // Return all user data except sensitive fields
      const { password, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      console.error("Get user error:", error);
      res.status(500).json({ message: "Failed to get user" });
    }
  });

  // Update user profile
  app.patch("/api/auth/profile", requireAuth, async (req: any, res) => {
    console.log("🚀 [PROFILE UPDATE] Route handler called");
    console.log("🚀 [PROFILE UPDATE] Request body:", JSON.stringify(req.body, null, 2));
    
    try {
      const userId = req.session?.userId;
      console.log("🚀 [PROFILE UPDATE] User ID from session:", userId);
      
      if (!userId) {
        console.log("❌ [PROFILE UPDATE] No user ID in session");
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      const updateData = req.body;
      console.log("🚀 [PROFILE UPDATE] Calling storage.updateUserProfile...");
      
      const updatedUser = await storage.updateUserProfile(userId, updateData);
      
      console.log("✅ [PROFILE UPDATE] Success! Updated user:", JSON.stringify(updatedUser, null, 2));
      res.json(updatedUser);
    } catch (error) {
      console.error("❌ [PROFILE UPDATE] Error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Logout route
  app.post("/api/auth/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "Logout failed" });
      }
      res.json({ message: "Logout successful" });
    });
  });
}