# PayDota - Digital Banking Platform

## Overview

PayDota is a modern digital banking application built with a full-stack TypeScript architecture. The platform provides comprehensive financial services including wallet management, card services, KYC verification, and payment processing through multiple providers like Stripe, Binance Pay, and Lithic.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side routing
- **Styling**: Tailwind CSS with shadcn/ui component library
- **State Management**: TanStack Query (React Query) for server state
- **Form Handling**: React Hook Form with Zod validation
- **Build Tool**: Vite with custom configuration

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ESM modules
- **Authentication**: Multiple strategies (Local, Google OAuth, Replit Auth)
- **Session Management**: Express-session with PostgreSQL store
- **API Design**: RESTful endpoints with JSON responses

### Database Architecture
- **Primary Database**: PostgreSQL via Neon serverless
- **ORM**: Drizzle ORM with TypeScript schema definitions
- **Connection**: Neon serverless driver with WebSocket support
- **Migrations**: Drizzle Kit for schema management

## Key Components

### Authentication System
The application supports multiple authentication methods:
- **Local Authentication**: Username/password with bcrypt hashing
- **Google OAuth**: Using Passport.js Google Strategy
- **Replit Auth**: OpenID Connect integration for Replit environment
- **Session Management**: PostgreSQL-backed sessions with configurable TTL

### Payment Integration
- **Stripe Issuing**: Primary card issuing and management platform
- **Stripe**: Card payments and subscription management
- **Binance Pay**: Cryptocurrency payment processing
- **Lithic**: Legacy card issuing platform (deprecated)
- **Reap**: Legacy card services provider (deprecated)

### KYC System
- **Document Verification**: Multi-step process with image capture
- **Status Tracking**: Pending, verified, rejected states with admin review
- **Document Types**: ID front/back, selfie verification
- **Admin Review**: Backend approval/rejection workflow

### Card Management
- **Virtual Cards**: Instant issuance through Lithic/Reap
- **Physical Cards**: Traditional card ordering with delivery tracking
- **Transaction Monitoring**: Real-time transaction processing
- **Security Features**: Card controls, limits, and notifications

### Wallet System
- **Multi-currency Support**: USD, USDT, and other digital assets
- **Transaction Types**: Deposits, withdrawals, transfers, payments
- **Balance Management**: Real-time balance updates with transaction history
- **Fee Structure**: Configurable fee system for different operations

## Data Flow

### User Registration Flow
1. User submits registration form with personal details
2. Password hashed using bcrypt (12 rounds)
3. User account created in PostgreSQL with default role
4. Welcome email/notification sent
5. Redirect to KYC verification process

### Transaction Processing Flow
1. User initiates transaction (deposit/withdrawal/transfer)
2. Balance validation and fraud checks
3. External payment provider integration
4. Database transaction with rollback capability
5. Real-time notification to user
6. Transaction history update

### KYC Verification Flow
1. User uploads required documents (ID, selfie)
2. Images stored and processed
3. Admin review interface for approval/rejection
4. Status updates with email notifications
5. Account limit adjustments based on verification level

## External Dependencies

### Payment Providers
- **Stripe**: Card processing, subscriptions
- **Binance Pay**: Crypto payments with QR codes
- **Lithic**: Card issuing platform
- **Reap**: Alternative card services

### Infrastructure
- **Neon Database**: Serverless PostgreSQL hosting
- **Replit**: Development and deployment platform
- **Google OAuth**: Third-party authentication
- **Node Fetch**: HTTP client for external APIs

### Frontend Libraries
- **shadcn/ui**: Pre-built accessible components
- **Radix UI**: Headless UI primitives
- **Framer Motion**: Animation library
- **React Hook Form**: Form state management
- **Zod**: Runtime type validation

## Deployment Strategy

### Development Environment
- **Platform**: Replit with Node.js 20 runtime
- **Database**: PostgreSQL 16 module
- **Hot Reload**: Vite dev server with HMR
- **Environment Variables**: Secure storage for API keys

### Production Build
- **Frontend**: Vite build with tree-shaking
- **Backend**: ESBuild bundling for Node.js
- **Static Assets**: Served from dist/public
- **Deployment**: Autoscale deployment target

### Configuration
- **Port Mapping**: Internal 5000 → External 80
- **Environment**: Production/development mode switching
- **SSL**: Automatic HTTPS termination
- **Database**: Connection pooling with Neon

## Changelog

```
Changelog:
- June 17, 2025. Initial setup
- June 17, 2025. Integrated Stripe Issuing for card creation and management
  * Added Stripe Issuing service for virtual and physical card creation
  * Updated database schema with Stripe card fields
  * Created comprehensive Stripe Cards management interface
  * Implemented card status management (freeze/unfreeze)
  * Added real-time transaction monitoring through Stripe
  * Deprecated Lithic and Reap integrations in favor of Stripe Issuing
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
```