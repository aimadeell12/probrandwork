import { createContext, useContext, useState } from "react";

const translations = {
  en: {
    // Navigation
    home: "Home",
    cards: "Cards",
    transactions: "Transactions",
    account: "Account",
    settings: "Settings",
    logout: "Logout",
    
    // Dashboard
    welcomeBack: "Welcome Back",
    totalBalance: "Total Balance",
    availableBalance: "Available Balance",
    monthlySpending: "Monthly Spending",
    manageYourFinances: "Manage your finances with ease",
    
    // Cards
    cardBalance: "Card Balance",
    cardNumber: "Card Number",
    expiryDate: "Expiry Date",
    cvv: "CVV",
    
    // Transactions
    recentTransactions: "Recent Transactions",
    viewAll: "View All",
    deposit: "Deposit",
    withdrawal: "Withdraw",
    withdraw: "Withdraw",
    transfer: "Transfer",
    
    // Profile
    profile: "Profile",
    editProfile: "Edit Profile",
    personalInfo: "Personal Information",
    firstName: "First Name",
    lastName: "Last Name",
    fullName: "Full Name",
    email: "Email",
    phone: "Phone",
    phoneNumber: "Phone Number",
    address: "Address",
    
    // Auth
    login: "Login",
    register: "Register",
    username: "Username",
    password: "Password",
    confirmPassword: "Confirm Password",
    
    // Common
    save: "Save",
    cancel: "Cancel",
    edit: "Edit",
    delete: "Delete",
    loading: "Loading...",
    error: "Error",
    success: "Success",
    
    // KYC
    verifyIdentity: "Verify Identity",
    uploadDocuments: "Upload Documents",
    documentType: "Document Type",
    nationalId: "National ID",
    passport: "Passport",
    drivingLicense: "Driving License",
    
    // Notifications
    notifications: "Notifications",
    markAsRead: "Mark as Read",
    noNotifications: "No Notifications",
    
    // Cards section
    createCard: "Create New Card",
    virtualCard: "Virtual Card",
    physicalCard: "Physical Card",
    cardType: "Card Type",
    cardDesign: "Card Design",
    blue: "Blue",
    purple: "Purple",
    black: "Black",
    gold: "Gold",
    createCardButton: "Create Card",
    cardCreated: "Card created successfully",
    cardCreationFailed: "Failed to create card",
    
    // Deposit section
    depositMoney: "Deposit Money",
    depositAmount: "Deposit Amount",
    selectPaymentMethod: "Select Payment Method",
    paymentMethod: "Payment Method",
    creditCard: "Credit Card",
    bankTransfer: "Bank Transfer",
    depositButton: "Deposit",
    depositSuccess: "Deposit successful",
    depositFailed: "Deposit failed",
    minimumDeposit: "Minimum Deposit",
    maximumDeposit: "Maximum Deposit",
    
    // Withdraw section
    withdrawMoney: "Withdraw Money",
    withdrawAmount: "Amount to Withdraw",
    withdrawButton: "Withdraw",
    
    // Bank Transfer section
    selectBank: "Select Bank",
    bankName: "Bank Name",
    accountNumber: "Account Number",
    routingNumber: "Routing Number",
    swiftCode: "SWIFT Code",
    transferAmount: "Transfer Amount",
    transferDescription: "Transfer Description",
    submitTransfer: "Submit Transfer",
    transferSubmitted: "Transfer submitted",
    transferFailed: "Transfer failed",
    
    // Security
    security: "Security",
    twoFactorAuth: "Two-Factor Authentication",
    biometricAuth: "Biometric Authentication",
    loginNotifications: "Login Notifications",
    deviceTracking: "Device Tracking",
    changePassword: "Change Password",
    currentPassword: "Current Password",
    newPassword: "New Password",
    securitySettings: "Security Settings",
    
    // Support
    support: "Support",
    contactSupport: "Contact Support",
    faq: "FAQ",
    helpCenter: "Help Center",
    reportIssue: "Report Issue",
    
    // Language settings
    language: "Language",
    arabic: "Arabic",
    english: "English",
    selectLanguage: "Select Language",
    selectAppLanguage: "Choose your preferred app language",
    
    // Error messages
    internetConnection: "Please check your internet connection",
    serverError: "Server error",
    invalidCredentials: "Invalid credentials",
    sessionExpired: "Session expired",
    
    // Success messages
    profileUpdated: "Profile updated",
    passwordChanged: "Password changed",
    settingsSaved: "Settings saved",
    
    // User profile fields
    dateOfBirth: "Date of Birth",
    nationality: "Nationality",
    occupation: "Occupation",
    city: "City",
    postalCode: "Postal Code",
    country: "Country",
    idDocumentType: "ID Document Type",
    idDocumentNumber: "ID Document Number",
    
    // Countries
    morocco: "Morocco",
    saudiArabia: "Saudi Arabia",
    uae: "UAE",
    egypt: "Egypt",
    jordan: "Jordan",
    lebanon: "Lebanon",
    kuwait: "Kuwait",
    qatar: "Qatar",
    bahrain: "Bahrain",
    oman: "Oman",
    
    // ID Document Types
    nationalIdCard: "National ID Card",
    residencePermit: "Residence Permit",
    
    // Card status
    active: "Active",
    activeAccount: "Active Account",
    quickInfo: "Quick Info",
    inactive: "Inactive",
    blocked: "Blocked",
    expired: "Expired",
    
    // Transaction types
    income: "Income",
    expense: "Expense",
    refund: "Refund",
    
    // Verification levels
    unverified: "Unverified",
    basic: "Basic",
    enhanced: "Enhanced",
    premium: "Premium",
    
    // Bank transfer statuses
    submitted: "Submitted",
    processing: "Processing",
    approved: "Approved",
    rejected: "Rejected",
    
    // Time periods
    today: "Today",
    yesterday: "Yesterday",
    thisWeek: "This Week",
    thisMonth: "This Month",
    thisYear: "This Year",
    
    // Login and Registration
    signIn: "Sign In",
    signUp: "Sign Up",
    forgotPassword: "Forgot Password?",
    rememberMe: "Remember Me",
    alreadyHaveAccount: "Already have an account?",
    termsAndConditions: "Terms and Conditions",
    privacyPolicy: "Privacy Policy",
    agreeToTerms: "I agree to the Terms and Conditions",
    createAccount: "Create Account",
    backToLogin: "Back to Login",
    
    // Google OAuth
    continueWithGoogle: "Continue with Google",
    googleSignIn: "Sign in with Google",
    googleSignUp: "Sign up with Google",
    
    // Registration Success/Error messages
    registrationSuccess: "Account created successfully",
    registrationFailed: "Failed to create account",
    userAlreadyExists: "User already exists",
    accountCreated: "Account created",
    
    // Login Success/Error messages
    loginFailed: "Login failed",
    welcomeBackSuccess: "Welcome back!",
    loginSuccessful: "Login successful",
    loginError: "Login error",
    checkCredentials: "Please check your credentials",
    dontHaveAccount: "Don't have an account?",
    
    // Transactions translations
    allTransactions: "All Transactions",
    searchTransactions: "Search Transactions",
    filterTransactions: "Filter Transactions",
    noTransactions: "No Transactions",
    completed: "Completed",
    pending: "Pending",
    failed: "Failed",
    
    // Form validation
    fieldRequired: "This field is required",
    invalidEmail: "Please enter a valid email address",
    passwordTooShort: "Password must be at least 6 characters",
    passwordsMustMatch: "Passwords must match",
    phoneInvalid: "Please enter a valid phone number",
    enterFirstName: "Enter your first name",
    enterLastName: "Enter your last name",
    enterEmail: "Enter your email",
    enterPassword: "Enter password",
    reenterPassword: "Re-enter password",
    
    // Update messages
    updateSuccess: "Updated successfully",
    updateError: "Update failed",
    profileUpdateSuccess: "Profile updated successfully",
    profileUpdateError: "Failed to update profile",
    
    // Logout messages
    logoutSuccess: "Logged out successfully",
    logoutError: "An error occurred while logging out",
    
    // Currency
    usd: "USD"
  }
};

type Language = keyof typeof translations;
type TranslationKey = keyof typeof translations.en;

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: TranslationKey) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>("en");

  const t = (key: TranslationKey): string => {
    return translations[language][key] || translations.en[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}