import React, { createContext, useContext, useState } from "react";

const translations = {
  en: {
    // Navigation
    home: "Home",
    cards: "Cards",
    payments: "Payments",
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
    completeVerification: "Complete verification to unlock all features",
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
    
    // 404 Page
    pageNotFound: "Page Not Found",
    pageNotFoundDescription: "Sorry, the page you are looking for does not exist or has been moved",
    goHome: "Go Home",
    goBack: "Go Back",
    
    // Send Money Page
    sendMoney: "Send Money",
    sendTo: "Send To",
    emailAddress: "Email Address",
    amount: "Amount",
    amountInDollars: "Amount in Dollars",
    optionalNote: "Note (Optional)",
    addNote: "Add a note...",
    sending: "Sending...",
    sendAmount: "Send",
    sentSuccessfully: "Sent Successfully",
    sendError: "Send Error",
    invalidAmount: "Invalid Amount",
    enterValidAmount: "Please enter a valid amount",
    insufficientBalance: "Insufficient Balance",
    insufficientBalanceDesc: "Your balance is not enough for this transaction",
    enterRecipient: "Please enter recipient",
    enterValidEmailOrPhone: "Please enter a valid email or phone number",
    
    // Withdraw Page
    withdrawMethod: "Withdrawal Method",
    workingDays13: "1-3 working days",
    workingDays35: "3-5 working days",
    withdrawSuccess: "Withdrawal Successful",
    withdrawError: "Withdrawal Error",
    insufficientFunds: "Insufficient Funds",
    amountTooSmall: "Amount Too Small",
    processingWithdraw: "Processing...",
    
    // Support Page
    supportCenter: "Support Center",
    supportSubtitle: "We're here to help you anytime",
    liveChat: "Live Chat",
    liveChatDesc: "Talk to our support team instantly",
    startChat: "Start Chat",
    phoneCall: "Phone Call",
    phoneCallDesc: "Available 24/7 for emergencies",
    callUs: "Call Us",
    supportTicket: "Support Ticket",
    supportTicketDesc: "For detailed inquiries",
    createTicket: "Create Ticket",
    newSupportTicket: "Create New Support Ticket",
    ticketSubject: "Ticket Subject",
    ticketSubjectPlaceholder: "Write your inquiry subject",
    problemDetails: "Problem Details",
    problemDetailsPlaceholder: "Explain your problem in detail...",
    sendTicket: "Send Ticket",
    sendingTicket: "Sending...",
    ticketCreated: "Ticket Created",
    ticketCreatedDesc: "We will respond as soon as possible",
    ticketError: "Error",
    ticketErrorDesc: "Failed to create support ticket",
    faqQuestion1: "How can I create a new card?",
    faqAnswer1: "You can create a new card from the dashboard by clicking the 'Create New Card' button and following the simple steps.",
    faqQuestion2: "What are the daily spending limits?",
    faqAnswer2: "The default daily spending limit is $5,000 and can be adjusted according to your needs from the card settings.",
    faqQuestion3: "How can I freeze my card?",
    faqAnswer3: "Go to the Cards page, select the desired card, then click 'Freeze' to stop all transactions immediately.",
    faqQuestion4: "Can I use the card internationally?",
    faqAnswer4: "Yes, all cards are enabled for international use by default with the option to restrict usage by region from settings.",
    faqQuestion5: "What are the transaction fees?",
    faqAnswer5: "No fees on local transactions, 1.5% fee on international transactions, with the first 10 transactions per month exempt.",
    faqQuestion6: "How can I add balance to the card?",
    faqAnswer6: "You can add balance through bank transfer, another credit card, or through available electronic payment services.",
    contactInfo: "Contact Information",
    phoneLabel: "Phone",
    emailLabel: "Email",
    workingHours: "Working Hours",
    workingHoursValue: "24/7 All Week",
    usefulResources: "Useful Resources",
    userGuide: "User Guide",
    userGuideDesc: "Learn how to use the platform",
    videoTutorials: "Video Tutorials",
    videoTutorialsDesc: "Comprehensive visual explanations",
    securityPrivacy: "Security & Privacy",
    securityPrivacyDesc: "Data protection information",
    systemStatus: "System Status",
    cardPlatform: "Card Platform",
    paymentProcessing: "Payment Processing",
    apiLithic: "Lithic API",
    workingNormally: "Working Normally",
    available: "Available",
    
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
    reenterPassword: "Re-enter password",
    
    // Update messages
    updateSuccess: "Updated successfully",
    updateError: "Update failed",
    profileUpdateSuccess: "Profile updated successfully",
    profileUpdateError: "Failed to update profile",
    
    // Logout messages
    logoutSuccess: "Logged out successfully",
    logoutError: "An error occurred while logging out",
    
    // Verification status
    verified: "Verified",
    unverified: "Unverified",
    
    // Login/Auth additional
    loginWith: "Login with",
    enterEmail: "Enter your email",
    enterPhoneNumber: "Enter your phone number",
    enterUsername: "Enter username",
    enterPassword: "Enter password",
    signingIn: "Signing in...",
    signInTitle: "Sign In",
    createNewAccount: "Create new account",
    missingData: "Missing data",
    fillAllFields: "Please fill all fields",
    
    // Registration additional
    welcome: "Welcome",
    accountCreationError: "Account creation error",
    tryAgain: "Try again",
    incompleteData: "Incomplete data",
    passwordMismatch: "Password mismatch",
    checkPasswordMatch: "Check password match",
    weakPassword: "Weak password",
    passwordMinLength: "Password minimum length",
    joinUs: "Join us",
    referralCode: "Referral code",
    optional: "Optional",
    enterReferralCode: "Enter referral code",
    referralCodeHelp: "Referral code help",
    creatingAccount: "Creating account",
    backToHome: "Back to home",
    
    // Currency
    usd: "USD",
    
    // Quick Actions
    hub: "Hub",
    
    // Cards Management
    manageCards: "Manage Cards",
    viewAndManageCards: "View and manage your cards",
    requestNewCard: "Request New Card",
    getInstantCard: "Get instant card",
    request: "Request",
    
    // Quick Services
    quickServices: "Quick Services",
    bills: "Bills",
    analytics: "Analytics",
    wallet: "Wallet",
    
    // Card Management
    addCard: "Add Card",
    virtualCards: "Virtual Cards",
    physicalCards: "Physical Cards",
    cardHolder: "Card Holder",
    expires: "Expires",
    balance: "Balance",
    noRecentTransactions: "No recent transactions",
    createTestTransactions: "Create Test Transactions",
    acceptTerms: "Accept Terms",
    noCardsYet: "No cards yet",
    noCardsDesc: "You don't have any cards yet",
    createFirstCard: "Create your first card",
    
    // Card status descriptions
    cardIsActive: "Ready to use",
    cardIsPending: "Card is pending",
    cardIsBlocked: "Card is permanently blocked",
    cardIsFrozen: "Card is temporarily frozen",
    cardIsSuspended: "Card is suspended"
  },
  ar: {
    // Navigation
    home: "الرئيسية",
    cards: "البطاقات",
    payments: "المدفوعات",
    transactions: "المعاملات",
    account: "الحساب",
    settings: "الإعدادات",
    logout: "تسجيل الخروج",
    
    // Dashboard
    welcomeBack: "مرحباً بعودتك",
    totalBalance: "الرصيد الإجمالي",
    availableBalance: "الرصيد المتاح",
    monthlySpending: "الإنفاق الشهري",
    manageYourFinances: "إدارة أموالك بسهولة",
    
    // Cards
    cardBalance: "رصيد البطاقة",
    cardNumber: "رقم البطاقة",
    expiryDate: "تاريخ الانتهاء",
    cvv: "رمز الأمان",
    
    // Transactions
    recentTransactions: "المعاملات الأخيرة",
    viewAll: "عرض الكل",
    deposit: "إيداع",
    withdrawal: "سحب",
    withdraw: "سحب",
    transfer: "تحويل",
    
    // Profile
    profile: "الملف الشخصي",
    editProfile: "تعديل الملف الشخصي",
    personalInfo: "المعلومات الشخصية",
    firstName: "الاسم الأول",
    lastName: "اسم العائلة",
    fullName: "الاسم الكامل",
    email: "البريد الإلكتروني",
    phone: "الهاتف",
    phoneNumber: "رقم الهاتف",
    address: "العنوان",
    
    // Auth
    login: "تسجيل الدخول",
    register: "إنشاء حساب",
    username: "اسم المستخدم",
    password: "كلمة المرور",
    confirmPassword: "تأكيد كلمة المرور",
    
    // Common
    save: "حفظ",
    cancel: "إلغاء",
    edit: "تعديل",
    delete: "حذف",
    loading: "جارٍ التحميل...",
    error: "خطأ",
    success: "نجح",
    
    // KYC
    verifyIdentity: "التحقق من الهوية",
    completeVerification: "أكمل التحقق لإلغاء القيود",
    uploadDocuments: "تحميل المستندات",
    documentType: "نوع المستند",
    
    // Language settings
    language: "اللغة",
    arabic: "العربية",
    english: "الإنجليزية",
    selectLanguage: "اختر اللغة",
    selectAppLanguage: "اختر لغة التطبيق المفضلة",
    languageChanged: "تم تغيير اللغة بنجاح",
    
    // 404 Page
    pageNotFound: "الصفحة غير موجودة",
    pageNotFoundDescription: "عذراً، الصفحة التي تبحث عنها غير موجودة أو تم نقلها",
    goHome: "العودة للرئيسية",
    goBack: "العودة للخلف",
    
    // Send Money Page
    sendMoney: "إرسال المال",
    sendTo: "إرسال إلى",
    emailAddress: "البريد الإلكتروني",
    amount: "المبلغ",
    amountInDollars: "المبلغ بالدولار",
    optionalNote: "ملاحظة (اختياري)",
    addNote: "أضف ملاحظة...",
    sending: "جاري الإرسال...",
    sendAmount: "إرسال",
    sentSuccessfully: "تم الإرسال بنجاح",
    sendError: "خطأ في الإرسال",
    invalidAmount: "مبلغ غير صحيح",
    enterValidAmount: "يرجى إدخال مبلغ صحيح",
    insufficientBalance: "رصيد غير كافي",
    insufficientBalanceDesc: "الرصيد المتاح غير كافي لهذه العملية",
    enterRecipient: "يرجى إدخال المستلم",
    enterValidEmailOrPhone: "يجب إدخال بريد إلكتروني أو رقم هاتف صحيح",
    
    // Withdraw Page
    withdrawMethod: "طريقة السحب",
    workingDays13: "١-٣ أيام عمل",
    workingDays35: "٣-٥ أيام عمل",
    withdrawSuccess: "تم السحب بنجاح",
    withdrawError: "خطأ في السحب",
    insufficientFunds: "رصيد غير كافي",
    amountTooSmall: "المبلغ صغير جداً",
    processingWithdraw: "جاري المعالجة...",
    withdrawButton: "سحب",
    
    // Support Page
    supportCenter: "مركز الدعم",
    supportSubtitle: "نحن هنا لمساعدتك في أي وقت",
    liveChat: "محادثة مباشرة",
    liveChatDesc: "تحدث مع فريق الدعم فوراً",
    startChat: "بدء المحادثة",
    phoneCall: "اتصال هاتفي",
    phoneCallDesc: "متاح 24/7 لحالات الطوارئ",
    callUs: "اتصل بنا",
    supportTicket: "تذكرة دعم",
    supportTicketDesc: "للاستفسارات المفصلة",
    createTicket: "إنشاء تذكرة",
    newSupportTicket: "إنشاء تذكرة دعم جديدة",
    ticketSubject: "موضوع التذكرة",
    ticketSubjectPlaceholder: "اكتب موضوع استفسارك",
    problemDetails: "تفاصيل المشكلة",
    problemDetailsPlaceholder: "اشرح مشكلتك بالتفصيل...",
    sendTicket: "إرسال التذكرة",
    sendingTicket: "جاري الإرسال...",
    ticketCreated: "تم إنشاء التذكرة",
    ticketCreatedDesc: "سيتم الرد عليك في أقرب وقت ممكن",
    ticketError: "خطأ",
    ticketErrorDesc: "فشل في إنشاء تذكرة الدعم",
    faq: "الأسئلة الشائعة",
    faqQuestion1: "كيف يمكنني إنشاء بطاقة جديدة؟",
    faqAnswer1: "يمكنك إنشاء بطاقة جديدة من خلال لوحة التحكم بالضغط على زر 'إنشاء بطاقة جديدة' واتباع الخطوات البسيطة.",
    faqQuestion2: "ما هي حدود الإنفاق اليومية؟",
    faqAnswer2: "الحد الافتراضي للإنفاق اليومي هو $5,000 ويمكن تعديله حسب احتياجاتك من إعدادات البطاقة.",
    faqQuestion3: "كيف يمكنني تجميد بطاقتي؟",
    faqAnswer3: "اذهب إلى صفحة البطاقات، اختر البطاقة المطلوبة، ثم اضغط على 'تجميد' لإيقاف جميع المعاملات فوراً.",
    faqQuestion4: "هل يمكنني استخدام البطاقة دولياً؟",
    faqAnswer4: "نعم، جميع البطاقات مفعلة للاستخدام الدولي افتراضياً مع إمكانية تقييد الاستخدام حسب المنطقة من الإعدادات.",
    faqQuestion5: "ما هي رسوم المعاملات؟",
    faqAnswer5: "لا توجد رسوم على المعاملات المحلية، ورسوم 1.5% على المعاملات الدولية، مع إعفاء أول 10 معاملات شهرياً.",
    faqQuestion6: "كيف يمكنني إضافة رصيد للبطاقة؟",
    faqAnswer6: "يمكنك إضافة رصيد من خلال التحويل البنكي، بطاقة ائتمان أخرى، أو من خلال خدمات الدفع الإلكتروني المتاحة.",
    contactInfo: "معلومات الاتصال",
    phoneLabel: "الهاتف",
    emailLabel: "البريد الإلكتروني",
    workingHours: "ساعات العمل",
    workingHoursValue: "24/7 طوال أيام الأسبوع",
    usefulResources: "مصادر مفيدة",
    userGuide: "دليل المستخدم",
    userGuideDesc: "تعلم كيفية استخدام المنصة",
    videoTutorials: "فيديوهات تعليمية",
    videoTutorialsDesc: "شروحات مرئية شاملة",
    securityPrivacy: "الأمان والخصوصية",
    securityPrivacyDesc: "معلومات حماية البيانات",
    systemStatus: "حالة النظام",
    cardPlatform: "منصة البطاقات",
    paymentProcessing: "معالجة المدفوعات",
    apiLithic: "API Lithic",
    workingNormally: "تعمل بشكل طبيعي",
    available: "متاح",
    
    // Error messages
    internetConnection: "يرجى التحقق من اتصال الإنترنت",
    serverError: "خطأ في الخادم",
    invalidCredentials: "بيانات اعتماد غير صحيحة",
    sessionExpired: "انتهت صلاحية الجلسة",
    
    // Success messages
    profileUpdated: "تم تحديث الملف الشخصي",
    passwordChanged: "تم تغيير كلمة المرور",
    settingsSaved: "تم حفظ الإعدادات",
    
    // Verification status
    verified: "محقق",
    unverified: "غير محقق",
    
    // Login/Auth additional
    loginWith: "تسجيل الدخول بواسطة",
    enterEmail: "أدخل بريدك الإلكتروني",
    enterPhoneNumber: "أدخل رقم هاتفك",
    enterUsername: "أدخل اسم المستخدم",
    enterPassword: "أدخل كلمة المرور",
    signingIn: "جاري تسجيل الدخول...",
    signInTitle: "تسجيل الدخول",
    createNewAccount: "إنشاء حساب جديد",
    missingData: "بيانات مفقودة",
    fillAllFields: "يرجى ملء جميع الحقول",
    
    // Registration additional
    welcome: "مرحباً",
    accountCreationError: "خطأ في إنشاء الحساب",
    tryAgain: "حاول مرة أخرى",
    incompleteData: "بيانات ناقصة",
    passwordMismatch: "كلمات المرور غير متطابقة",
    checkPasswordMatch: "تأكد من تطابق كلمات المرور",
    weakPassword: "كلمة مرور ضعيفة",
    passwordMinLength: "كلمة المرور قصيرة جداً",
    joinUs: "انضم إلينا",
    referralCode: "كود الإحالة",
    optional: "اختياري",
    enterReferralCode: "أدخل كود الإحالة",
    referralCodeHelp: "مساعدة كود الإحالة",
    creatingAccount: "جاري إنشاء الحساب...",
    backToHome: "العودة للرئيسية",
    
    // Currency
    usd: "دولار أمريكي",
    
    // Quick Actions
    hub: "المركز",
    
    // Cards Management
    manageCards: "إدارة البطاقات",
    viewAndManageCards: "عرض وإدارة بطاقاتك",
    requestNewCard: "طلب بطاقة جديدة",
    getInstantCard: "احصل على بطاقة فورية",
    request: "طلب",
    
    // Quick Services
    quickServices: "الخدمات السريعة",
    bills: "الفواتير",
    analytics: "تحليلات",
    wallet: "المحفظة",
    
    // Card Management
    addCard: "إضافة بطاقة",
    virtualCards: "البطاقات الافتراضية",
    physicalCards: "البطاقات الفيزيائية",
    cardHolder: "حامل البطاقة",
    expires: "انتهاء الصلاحية",
    balance: "الرصيد",
    noRecentTransactions: "لا توجد معاملات حديثة",
    createTestTransactions: "إنشاء معاملات تجريبية",
    acceptTerms: "قبول الشروط",
    noCardsYet: "لا توجد بطاقات بعد",
    noCardsDesc: "ليس لديك أي بطاقات بعد",
    createFirstCard: "إنشاء بطاقتك الأولى",
    
    // Card status descriptions
    cardIsActive: "البطاقة جاهزة للاستخدام",
    cardIsPending: "البطاقة في الانتظار",
    cardIsBlocked: "البطاقة محجوبة نهائياً",
    cardIsFrozen: "البطاقة مجمدة مؤقتاً",
    cardIsSuspended: "البطاقة معلقة"
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
    try {
      const translation = translations[language as keyof typeof translations];
      return (translation as any)?.[key] || translations.en[key] || key;
    } catch (error) {
      console.warn('Translation error for key:', key);
      return translations.en[key] || key;
    }
  };

  const value = { language, setLanguage, t };

  return React.createElement(
    LanguageContext.Provider,
    { value },
    children
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    // Return default values instead of throwing error
    return {
      language: "en" as Language,
      setLanguage: () => {},
      t: (key: TranslationKey) => translations.en[key] || key
    };
  }
  return context;
}