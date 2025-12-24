import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { storage } from "./storage";
import type { Express } from "express";

export function setupGoogleAuth(app: Express) {
  // Check if Google OAuth credentials are available
  if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
    console.warn("Google OAuth credentials not configured. Google authentication will be disabled.");
    return;
  }
  
  console.log("✅ Google OAuth credentials found. Setting up Google authentication...");
  console.log(`📍 Callback URL: ${process.env.NODE_ENV === 'production' ? 'https://appsfondation.com/api/auth/google/callback' : 'http://localhost:5000/api/auth/google/callback'}`);

  // Configure Google OAuth strategy
  const callbackURL = process.env.NODE_ENV === 'production' 
    ? 'https://appsfondation.com/api/auth/google/callback'
    : 'http://localhost:5000/api/auth/google/callback';
    
  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: callbackURL
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      // Check if user already exists with this Google ID
      let user = await storage.getUserByGoogleId(profile.id);
      
      if (user) {
        // User exists, return user
        return done(null, user);
      }

      // Check if user exists with same email
      const email = profile.emails?.[0]?.value;
      if (email) {
        const existingUser = await storage.getUserByEmail(email);
        if (existingUser) {
          // Link Google account to existing user
          await storage.linkGoogleAccount(existingUser.id, profile.id);
          return done(null, existingUser);
        }
      }

      // Create new user
      const newUser = await storage.createGoogleUser({
        id: `google_${profile.id}_${Date.now()}`,
        googleId: profile.id,
        email: email || "",
        firstName: profile.name?.givenName || "",
        lastName: profile.name?.familyName || "",
        profileImageUrl: profile.photos?.[0]?.value || null,
        authType: "google"
      });

      return done(null, newUser);
    } catch (error) {
      console.error("Google OAuth error:", error);
      return done(error, undefined);
    }
  }));

  // Serialize user for session
  passport.serializeUser((user: any, done) => {
    done(null, user.id);
  });

  // Deserialize user from session
  passport.deserializeUser(async (id: string, done) => {
    try {
      const user = await storage.getUserById(id);
      done(null, user);
    } catch (error) {
      done(error, null);
    }
  });

  // Initialize passport
  app.use(passport.initialize());
  app.use(passport.session());

  // Google OAuth routes
  app.get("/api/auth/google", 
    passport.authenticate("google", { 
      scope: ["profile", "email"] 
    })
  );

  app.get("/api/auth/google/callback", 
    passport.authenticate("google", { 
      failureRedirect: "/login?error=google_auth_failed" 
    }),
    async (req: any, res) => {
      try {
        // Set session
        req.session.userId = req.user.id;
        req.session.save((err: any) => {
          if (err) {
            console.error("Session save error:", err);
            return res.redirect("/login?error=session_error");
          }
          
          // Redirect to dashboard on success
          res.redirect("/dashboard");
        });
      } catch (error) {
        console.error("Google callback error:", error);
        res.redirect("/login?error=callback_error");
      }
    }
  );
}