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
- **Mobile Framework**: Capacitor for native mobile app conversion
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

## Mobile App Architecture

### Capacitor Integration
- **Native Wrapper**: Capacitor for iOS and Android app conversion
- **Build Target**: `dist/public` directory for web assets
- **Native Plugins**: Status bar, splash screen, keyboard, haptics, device info, network status
- **Mobile Features**: Touch feedback, safe area handling, native navigation

### Mobile-Specific Features
- **Status Bar Management**: Custom styling and background colors
- **Splash Screen**: Auto-hide with customizable duration
- **Keyboard Handling**: Automatic viewport adjustment
- **Haptic Feedback**: Touch response for payment and card operations
- **Native Toast**: System-level notifications
- **Share Integration**: Native sharing capabilities

### Build Configuration
- **Mobile Build**: Separate Vite config for optimized mobile assets
- **App Configuration**: `capacitor.config.ts` with app ID and platform settings
- **Asset Management**: Icons and splash screens in `resources/` directory

## Deployment Strategy

### Web Application
- **Frontend**: Vite builds optimized static assets to `dist/public`
- **Backend**: esbuild bundles server code to `dist/index.js`
- **Database**: Migrations applied via `drizzle-kit push`

### Mobile Application
- **GitHub Actions**: Automated CI/CD for Android and iOS builds
- **Android**: APK generation with signing and Google Play upload
- **iOS**: Archive creation with App Store Connect integration
- **Release Management**: Automated versioning and distribution

### Environment Configuration
- **Development**: `npm run dev` runs TSX with hot reload
- **Production**: `npm run start` serves built application
- **Mobile Development**: Platform-specific IDEs (Android Studio/Xcode)
- **Database**: Environment-based connection string configuration

### Hosting Platform
- **Web Platform**: Replit with autoscale deployment
- **Port Configuration**: Internal port 5000, external port 80
- **Static Assets**: Served from built `dist/public` directory
- **Mobile Stores**: Google Play Store and Apple App Store distribution

## Changelog
- June 25, 2025: Fixed pull-to-refresh component to keep content visible at all times - no more disappearing content during refresh
- June 25, 2025: Improved pull-to-refresh to show only a minimal loading indicator at the top when refreshing
- June 25, 2025: Fixed Cards page layout - made header elements (Cards, Add Card, Virtual Cards, Physical Cards) completely fixed and non-scrollable with proper touch handling
- June 25, 2025: Fixed motion import error in dashboard component that was causing JavaScript runtime errors
- June 24, 2025: Fixed transactions page to be completely static with only transaction list scrollable, matching dashboard design
- June 24, 2025: Fixed cards page layout to be completely static with sticky header and fixed sections like dashboard
- June 24, 2025: Updated account page to show full user name in header, changed to white background like dashboard, and added pull-to-refresh functionality
- June 24, 2025: Updated dashboard greeting to show actual user name and replaced ":)" with purple heart icon
- June 24, 2025: Added purple spinning refresh icon for pull-to-refresh functionality across all pages
- June 24, 2025: Updated dashboard design - changed green ACCOUNT button to purple, "Compte chèque" to "Balance account", and currency from DH to USD
- June 24, 2025: Added Identity Verification (KYC) link in account page settings for all users
- June 24, 2025: Added admin panel access button in account page - only visible to users with admin role
- June 24, 2025: Removed /admin route from application per user request - users now access admin panel only through /admin-panel
- June 24, 2025: Added comprehensive offline error screen with Arabic/English support for mobile app internet connectivity issues
- June 24, 2025: Implemented network status monitoring with automatic offline detection and retry functionality
- June 24, 2025: Created responsive offline error page matching native mobile app design patterns
- June 24, 2025: Updated app icon with new PayDota logo for Android build
- June 24, 2025: Changed dashboard to show only 2 recent transactions instead of 4 per user request
- June 24, 2025: Fixed dashboard layout to be completely static with sticky header and balance sections
- June 24, 2025: Added pin_enabled column to users table schema to fix database authentication errors
- June 24, 2025: Removed "Refreshing..." text and purple color from pull-to-refresh component per user request
- June 24, 2025: Changed all page backgrounds to pure white color without gradients or dark mode variants per user request
- June 24, 2025: Fixed background display issue - ensured full screen coverage using dynamic viewport height and proper CSS styling
- June 24, 2025: Updated transaction currency display to USD instead of SAR per user request
- June 24, 2025: Reverted dashboard to show real Stripe transactions instead of platform features per user request
- June 24, 2025: Created clean banking dashboard design matching user-provided image with Account/Card toggle and platform advantages
- June 24, 2025: Added comprehensive safe area handling for mobile status bar to prevent UI overlap on all pages
- June 24, 2025: Updated status bar configuration to light style with proper overlay settings for better mobile UX
- June 24, 2025: Configured mobile app to connect to production server https://paydota.replit.app instead of localhost
- June 24, 2025: Updated Capacitor configuration with secure HTTPS connection and proper server URL
- June 24, 2025: Updated keystore configuration to use signing_1750726650743.keystore with password protection and my-key-alias
- June 24, 2025: Modified all build scripts and GitHub Actions workflows to use new keystore with authentication
- June 24, 2025: Created comprehensive GitHub Actions workflows for automated Android APK building and Google Play Store deployment
- June 24, 2025: Added automated CI/CD pipeline with artifact upload, release creation, and Play Store publishing
- June 24, 2025: Implemented bilingual (Arabic/English) release notes and metadata for app store deployment
- June 24, 2025: Final resolution - Fixed Android platform conflicts by complete removal and clean re-initialization
- June 24, 2025: Successfully configured capacitor.config.json (JSON format) instead of TypeScript configuration
- June 24, 2025: Completed keystore integration and Android signing configuration for production deployment
- June 24, 2025: Successfully resolved Capacitor configuration conflicts and completed final mobile app setup
- June 24, 2025: Fixed "Cannot run init for a project using a non-JSON configuration file" error by complete reset and clean initialization
- June 24, 2025: Finalized Android platform integration with all 9 Capacitor plugins working properly
- June 24, 2025: Completed keystore integration with signing_1750723138194.keystore for production builds
- June 24, 2025: Added comprehensive mobile app configuration with splash screen, status bar, and haptic feedback settings
- June 24, 2025: Created final build script (build-apk.sh) and documentation (MOBILE_APP_READY.md) for deployment
- June 23, 2025: Successfully configured Android APK signing with custom keystore (signing_1750723138194.keystore)
- June 23, 2025: Created production-ready build configuration for signed Android release APK
- June 23, 2025: Updated GitHub Actions workflow to use custom keystore for automated Android builds
- June 23, 2025: Added comprehensive Android signing documentation and build scripts
- June 23, 2025: Successfully implemented Capacitor mobile app conversion with complete GitHub Actions CI/CD pipeline
- June 23, 2025: Added native mobile features including haptic feedback, status bar management, and keyboard handling
- June 23, 2025: Created comprehensive mobile build scripts and automated deployment workflows for Android and iOS
- June 23, 2025: Integrated Capacitor plugins for enhanced mobile user experience (toast, share, device info, network status)
- June 23, 2025: Added mobile-specific CSS styles for safe areas, touch interactions, and native scrolling
- June 18, 2025: Successfully fixed card number display issue - real Stripe card numbers (4000009990000146) now display when eye icon is clicked
- June 18, 2025: Fixed API response handling in card details fetching logic
- June 18, 2025: Implemented proper state management for card visibility toggle functionality
- June 18, 2025: Enhanced card components with improved debugging and error handling
- June 17, 2025: Implemented automatic card activation - new cards are now set to "active" status upon creation
- June 17, 2025: Added Arabic translations for card statuses (نشطة, مجمدة, محجوبة) with proper display across all card interfaces
- June 17, 2025: Enhanced card status management with real-time updates and Arabic language support
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