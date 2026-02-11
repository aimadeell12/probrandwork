# LM WORK PAY - Digital Banking Platform

## Overview
LM WORK PAY is a comprehensive digital banking platform designed to offer secure banking services, card management, and financial transactions. It provides a full-stack solution with both user-facing features and administrative capabilities, aiming to simplify digital finance for its users. The platform supports virtual and physical cards, various payment processing methods, and a robust notification system, all within a modern, user-friendly interface.

## User Preferences
Preferred communication style: Simple, everyday language.
Company Email: Contact@brandsoftapps.com
Developer: LMWORK MA LIMITED
Address: 2 Frederick Street, Kings Cross, LONDON - WC1X 0ND, United Kingdom (GB)

## System Architecture

### Frontend
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter
- **State Management**: TanStack Query (React Query)
- **UI Framework**: Tailwind CSS with shadcn/ui components
- **Build Tool**: Vite
- **Mobile Integration**: Capacitor for native mobile app conversion
- **Form Handling**: React Hook Form with Zod validation

### Backend
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript (ES modules)
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Multi-provider (Local, Google OAuth, Replit Auth)
- **Session Management**: Express-session with PostgreSQL store

### Key Features
- **Authentication**: Multi-provider support, secure session management, bcryptjs for password hashing, role-based access control.
- **Card Management**: Supports virtual and physical cards, integration with Lithic and Reap for provisioning, real-time transaction tracking.
- **Payment Processing**: Binance Pay for crypto, traditional bank transfers, internal wallet system.
- **Admin Dashboard**: User management, KYC verification, transaction monitoring, system reports, content management.
- **Notification System**: Real-time in-app notifications, email, SMS, and push notification support, customizable settings.
- **UI/UX Decisions**: Consistent purple branding, clean white backgrounds, responsive design for all screen sizes, static page layouts with scrollable content areas, enhanced loading screens, sticky headers, and safe area handling for mobile.

### Mobile App Architecture
- **Capacitor Integration**: Native wrapper for iOS/Android, build targets `dist/public`, includes native plugins for status bar, splash screen, keyboard, haptics, device info, network status.
- **Mobile Features**: Touch feedback, safe area handling, native navigation, status bar management, haptic feedback, native toast notifications, and share integration.

### Deployment Strategy
- **Web Application**: Vite for frontend assets, esbuild for backend code, Drizzle Kit for database migrations, hosted on Replit with autoscale.
- **Mobile Application**: GitHub Actions for CI/CD, APK generation for Android (Google Play), archive creation for iOS (App Store Connect), automated versioning and distribution.
- **Environment**: Development with hot reload, production via `npm run start`, mobile development using platform-specific IDEs.

## External Dependencies

- **Database**: Neon serverless PostgreSQL, `@neondatabase/serverless`
- **ORM**: `drizzle-orm`, `drizzle-kit`
- **Authentication**: `passport` with various strategies
- **UI Components**: `@radix-ui` with `shadcn/ui`
- **Payment Processing**: `Lithic`, `Reap`, `Binance Pay` (custom integration), `@stripe/stripe-js`
- **Security**: `bcryptjs`
- **Mobile Development**: `Capacitor` plugins (e.g., Status Bar, Keyboard, Haptics)