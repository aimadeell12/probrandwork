import bcrypt from "bcryptjs";
import { storage } from "./storage";
import { loginSchema, registerSchema } from "@shared/schema";
import type { Express, RequestHandler } from "express";

// Middleware to check if user is authenticated (local auth)
export const requireAuth: RequestHandler = async (req, res, next) => {
  if (!req.session?.userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  
  try {
    const user = await storage.getUserById(req.session.userId);
    if (!user) {
      req.session.destroy((err) => {});
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    req.user = user;
    next();
  } catch (error) {
    console.error("Error in requireAuth:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export function setupLocalAuth(app: Express) {
  // Login endpoint
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { username, password } = loginSchema.parse(req.body);
      
      const user = await storage.getUserByUsername(username);
      if (!user || !user.password) {
        return res.status(401).json({ message: "اسم المستخدم أو كلمة المرور غير صحيحة" });
      }
      
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ message: "اسم المستخدم أو كلمة المرور غير صحيحة" });
      }
      
      // Create session
      req.session.userId = user.id;
      req.session.save((err) => {
        if (err) {
          console.error("Session save error:", err);
          return res.status(500).json({ message: "خطأ في الخادم" });
        }
        
        // Return user data without password
        const { password: _, ...userWithoutPassword } = user;
        res.json({ user: userWithoutPassword, message: "تم تسجيل الدخول بنجاح" });
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(400).json({ message: "بيانات غير صحيحة" });
    }
  });

  // Register endpoint
  app.post("/api/auth/register", async (req, res) => {
    try {
      const userData = registerSchema.parse(req.body);
      
      // Check if username or email already exists
      const existingUser = await storage.getUserByUsername(userData.username);
      if (existingUser) {
        return res.status(400).json({ message: "اسم المستخدم مستخدم بالفعل" });
      }
      
      const existingEmail = await storage.getUserByEmail(userData.email);
      if (existingEmail) {
        return res.status(400).json({ message: "البريد الإلكتروني مستخدم بالفعل" });
      }
      
      // Hash password
      const hashedPassword = await bcrypt.hash(userData.password, 12);
      
      // Create user
      const user = await storage.createLocalUser({
        id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        username: userData.username,
        email: userData.email,
        password: hashedPassword,
        firstName: userData.firstName,
        lastName: userData.lastName,
        authType: "local",
      });
      
      // Create session
      req.session.userId = user.id;
      req.session.save((err) => {
        if (err) {
          console.error("Session save error:", err);
          return res.status(500).json({ message: "خطأ في الخادم" });
        }
        
        // Return user data without password
        const { password: _, ...userWithoutPassword } = user;
        res.json({ user: userWithoutPassword, message: "تم إنشاء الحساب بنجاح" });
      });
    } catch (error) {
      console.error("Register error:", error);
      res.status(400).json({ message: "بيانات غير صحيحة" });
    }
  });

  // Logout endpoint
  app.post("/api/auth/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        console.error("Logout error:", err);
        return res.status(500).json({ message: "خطأ في تسجيل الخروج" });
      }
      res.json({ message: "تم تسجيل الخروج بنجاح" });
    });
  });

  // Get current user endpoint
  app.get("/api/auth/user", requireAuth, async (req: any, res) => {
    try {
      const { password: _, ...userWithoutPassword } = req.user;
      res.json(userWithoutPassword);
    } catch (error) {
      console.error("Get user error:", error);
      res.status(500).json({ message: "خطأ في الخادم" });
    }
  });
}