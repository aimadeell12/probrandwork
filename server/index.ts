import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";

// Set WhatsApp environment variables directly
process.env.WHATSAPP_ACCESS_TOKEN = "EAAQrRrLPFnMBOZCjlicG9mv99Sq4iESVFfZBc57wQtZCPGQGnSR14qCw7QNIg7i1Gfhun81GxOQo96M9ILlgr0geX5NrhD19w8BXZCCKHGSxeqzoRaTsAVJwbTrQZCx5EBgVVITAPOxdnqBZBfDUxikrCuwMCNli31nfghrEIuy6qV5ec07ZCWXhFhSUXZAc8JFLZB37BvOOTa1cr6W9uTDY6PkZCeXPmreVKzpD64qhXMZCyUOMO8KH3JkWmkmkDMfKwZDZD";
process.env.WHATSAPP_PHONE_NUMBER_ID = "637387286132641";
process.env.WHATSAPP_BUSINESS_ACCOUNT_ID = "576288461869738";
process.env.WHATSAPP_VERIFY_TOKEN = "paydota_webhook_verify_token_2025";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Add JSON response headers
app.use((req, res, next) => {
  if (req.path.startsWith('/api/')) {
    res.setHeader('Content-Type', 'application/json');
  }
  next();
});

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    if (!res.headersSent) {
      res.status(status).json({ message });
    }
    console.error("Error:", err);
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // ALWAYS serve the app on port 5000
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = 5000;
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true,
  }, () => {
    log(`serving on port ${port}`);
  });
})();
