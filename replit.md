# PayDota - Digital Banking Platform

## Overview

PayDota is a comprehensive digital banking platform built with modern web technologies, offering secure banking services, card management, and financial transactions. The application provides a full-stack solution with both user-facing features and administrative capabilities.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side routing
- **State Management**: TanStack Query (React Query) for server state management
- **UI Framework**: Tailwind CSS with shadcn/ui components
- **Build Tool**: Vite for fast development and optimized builds
- **Form Handling**: React Hook Form with Zod validation

### Backend Architecture
- **Runtime**: Node.js with Express.js server
- **Language**: TypeScript with ES modules
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Multiple auth strategies (Local, Google OAuth, Replit Auth)
- **Session Management**: Express-session with PostgreSQL store

### Database Architecture
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Migration System**: Drizzle Kit for schema migrations
- **Connection**: Neon serverless PostgreSQL with connection pooling

## Key Components

### Authentication System
- **Multi-provider Auth**: Supports local authentication, Google OAuth, and Replit authentication
- **Session Management**: Secure session handling with PostgreSQL storage
- **Password Security**: bcryptjs for password hashing
- **Authorization**: Role-based access control (user/admin)

### Card Management
- **Virtual & Physical Cards**: Support for both card types with different designs
- **Card Providers**: Integration with Lithic and Reap for card provisioning
- **Transaction Tracking**: Real-time transaction monitoring and notifications

### Payment Processing
- **Binance Pay Integration**: Cryptocurrency payment processing
- **Bank Transfers**: Traditional banking integration
- **Wallet System**: Internal balance management with transaction history

### Admin Dashboard
- **User Management**: Admin interface for managing users and KYC verification
- **Transaction Monitoring**: Real-time transaction oversight
- **System Reports**: Comprehensive reporting and analytics
- **Content Management**: Bank information, currency rates, and system settings

### Notification System
- **Real-time Notifications**: In-app notification center
- **Multiple Channels**: Email, SMS, and push notification support
- **Customizable Settings**: User-configurable notification preferences

## Data Flow

### User Registration/Authentication
1. User submits credentials through frontend form
2. Backend validates and processes authentication
3. Session created and stored in PostgreSQL
4. User data cached in React Query for optimal performance

### Transaction Processing
1. User initiates transaction through UI
2. Frontend validates input and submits to API
3. Backend processes transaction with appropriate provider (Binance, Lithic, etc.)
4. Database updated with transaction record
5. Real-time notifications sent to user
6. Frontend state updated via React Query invalidation

### KYC Verification
1. User submits personal information and documents
2. Documents processed and stored securely
3. Admin reviews submission through admin dashboard
4. Status updates propagated to user interface
5. Notifications sent based on verification outcome

## External Dependencies

### Core Dependencies
- **Database**: @neondatabase/serverless for PostgreSQL connection
- **ORM**: drizzle-orm and drizzle-kit for database operations
- **Authentication**: passport with multiple strategies
- **UI Components**: @radix-ui components with shadcn/ui styling
- **Payment Processing**: @stripe/stripe-js, custom Binance Pay integration

### Development Dependencies
- **Build Tools**: Vite, esbuild for production builds
- **Type Safety**: TypeScript with strict configuration
- **Code Quality**: ESLint configuration (implicit)
- **Styling**: PostCSS with Tailwind CSS and autoprefixer

## Deployment Strategy

### Production Build
- **Frontend**: Vite builds optimized static assets to `dist/public`
- **Backend**: esbuild bundles server code to `dist/index.js`
- **Database**: Migrations applied via `drizzle-kit push`

### Environment Configuration
- **Development**: `npm run dev` runs TSX with hot reload
- **Production**: `npm run start` serves built application
- **Database**: Environment-based connection string configuration

### Hosting Platform
- **Platform**: Replit with autoscale deployment
- **Port Configuration**: Internal port 5000, external port 80
- **Static Assets**: Served from built `dist/public` directory

## Changelog
- June 17, 2025: Fixed transaction display to show real merchant names from Stripe API (tttt, facebook, Rocket Rides, Apple Store)
- June 17, 2025: Added Arabic category translations for merchant types (نقل ومواصلات, متجر إلكترونيات)
- June 17, 2025: Updated all transaction displays across cards, stripe-cards, and transactions pages
- June 17, 2025: Removed "Create Test Transactions" and "Accept Terms" buttons from cards interface per user request
- June 17, 2025: Successfully implemented card creation with real user information - confirmed working with user "Aimad Aimad"
- June 17, 2025: Fixed Stripe card creation to use real user information (name, phone, email, date of birth)
- June 17, 2025: Fixed country code issue - now uses US address for all virtual cards (8206 Louisiana Blvd Ne, Albuquerque, NM 87113, US)
- June 17, 2025: Updated cardholder creation with actual user data instead of hardcoded test values
- June 17, 2025: Fixed card number display - now shows proper Stripe card numbers without random placeholders
- June 17, 2025: Enabled real Stripe transactions display in both transactions page and cards page
- June 17, 2025: Fixed transaction display issues - handle string/number amounts from Stripe API
- June 17, 2025: Improved Stripe cardholder verification with better error handling
- June 17, 2025: Added Accept Terms button for manual terms acceptance
- June 17, 2025: Integrated Stripe Issuing with real card numbers and transactions
- June 17, 2025: Added automatic terms acceptance for Stripe card creation
- June 17, 2025: Implemented real-time transaction fetching from Stripe API
- June 17, 2025: Added test transaction creation functionality
- June 17, 2025: Initial setup

## User Preferences

Preferred communication style: Simple, everyday language.