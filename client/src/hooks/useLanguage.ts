import { useState, useEffect, createContext, useContext } from "react";

type Language = "ar" | "en";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

export const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}

// Translation dictionary
const translations = {
  ar: {
    // Navigation
    home: "الرئيسية",
    cards: "البطاقات",
    support: "الدعم",
    account: "حسابي",
    transactions: "المعاملات",
    
    // Home page
    wallet: "المحفظة",
    totalBalance: "الرصيد الإجمالي",
    usd: "دولار أمريكي",
    deposit: "إيداع",
    withdraw: "سحب",
    send: "إرسال",
    scan: "مسح",
    guidanceForBeginnersTitle: "إرشادات للمبتدئين",
    
    // Transactions page
    transactionsTitle: "المعاملات",
    searchTransactions: "البحث في المعاملات...",
    all: "الكل",
    sendTransaction: "إرسال",
    receiveTransaction: "استلام", 
    depositTransaction: "إيداع",
    withdrawTransaction: "سحب",
    totalIncome: "إجمالي الواردات",
    totalExpense: "إجمالي الصادرات",
    loadingTransactions: "جارٍ تحميل المعاملات...",
    noTransactions: "لا توجد معاملات",
    noTransactionsDesc: "لم تقم بأي معاملات بعد",
    noSearchResults: "لم يتم العثور على معاملات تطابق البحث",
    quickStats: "إحصائيات سريعة",
    thisMonth: "معاملات هذا الشهر",
    averageTransaction: "متوسط قيمة المعاملة", 
    largestTransaction: "أكبر معاملة",
    completed: "مكتملة",
    pending: "معلقة",
    failed: "فاشلة",
    unknown: "غير معروف",
    noDescription: "لا يوجد وصف",
    
    // Withdraw page
    withdrawMoney: "سحب أموال",
    withdrawTitle: "سحب مبلغ",
    withdrawFrom: "البطاقة المسحوب منها",
    withdrawalMethod: "طريقة السحب",
    bankTransfer: "تحويل بنكي",
    instantTransfer: "تحويل فوري",
    atmWithdrawal: "سحب من الصراف",
    bankTransferDesc: "تحويل إلى حساب بنكي",
    instantTransferDesc: "تحويل فوري إلى البنك",
    atmWithdrawalDesc: "سحب نقدي من أي صراف آلي",
    processingTimeBank: "1-3 أيام عمل",
    processingTimeInstant: "خلال دقائق",
    processingTimeAtm: "فوري",
    bankAccountNumber: "رقم الحساب البنكي",
    withdrawDescription: "وصف السحب (اختياري)",
    withdrawReason: "سبب السحب...",
    requestedAmount: "المبلغ المطلوب",
    withdrawalFee: "رسوم",
    amountReceived: "المبلغ المستلم",
    confirmWithdraw: "تأكيد السحب",
    processing: "جارٍ المعالجة...",
    withdrawalLimits: "حدود السحب",
    dailyLimit: "الحد اليومي",
    monthlyLimit: "الحد الشهري",
    usedToday: "تم استخدامه اليوم",
    
    // Cards page
    myCards: "بطاقاتي",
    addNewCard: "إضافة بطاقة جديدة",
    noCards: "لا توجد بطاقات",
    noCardsDesc: "لم تقم بإضافة أي بطاقات بعد",
    createFirstCard: "إنشاء أول بطاقة",
    cardBalance: "رصيد البطاقة",
    cardStatus: "حالة البطاقة",
    activeCard: "نشطة",
    blockedCard: "محظورة",
    expiredCard: "منتهية الصلاحية",
    cardDetails: "تفاصيل البطاقة",
    viewTransactions: "عرض المعاملات",
    blockCard: "حظر البطاقة",
    unblockCard: "إلغاء حظر البطاقة",
    
    // Deposit page
    depositMoney: "إيداع أموال",
    selectCurrency: "اختر العملة",
    depositInformation: "معلومات الإيداع",
    selectCurrencyToView: "• اختر عملة لعرض خيارات الإيداع",
    minimumDepositApply: "• قد تنطبق حدود دنيا للإيداع",
    processingTimesVary: "• أوقات المعالجة تختلف حسب العملة والشبكة",
    availableBalance: "الرصيد المتاح",
    amountInDollars: "المبلغ بالدولار",
    confirmDeposit: "تأكيد الإيداع",
    processingDeposit: "جارٍ المعالجة...",
    depositSuccess: "تم الإيداع بنجاح",
    depositError: "خطأ في الإيداع",
    invalidAmount: "مبلغ غير صحيح",
    enterValidAmount: "يرجى إدخال مبلغ صحيح",
    
    // Send page
    sendMoney: "إرسال أموال",
    sendTo: "إرسال إلى",
    emailAddress: "البريد الإلكتروني",
    phoneNumber: "رقم الهاتف",
    amount: "المبلغ",
    optionalNote: "ملاحظة (اختيارية)",
    addNote: "إضافة ملاحظة...",
    confirmSend: "تأكيد الإرسال",
    sending: "جارٍ الإرسال...",
    sendSuccess: "تم الإرسال بنجاح",
    sendError: "خطأ في الإرسال",
    enterRecipient: "يرجى إدخال المستلم",
    validEmailOrPhone: "يجب إدخال بريد إلكتروني أو رقم هاتف صحيح",
    insufficientFunds: "رصيد غير كافي",
    insufficientBalance: "الرصيد المتاح غير كافي لهذه العملية",
    
    // Scan page
    scanCode: "مسح الكود",
    howToUse: "كيفية الاستخدام",
    showQRCode: "اطلب من المرسل إليه إظهار كود QR",
    clearCode: "تأكد من وضوح الكود وعدم وجود ظلال",
    pointCamera: "وجه الكاميرا نحو الكود",
    centerCode: "ضع الكود في وسط الشاشة",
    confirmDetails: "تأكد من المعلومات وأرسل",
    reviewAmount: "راجع المبلغ والمستقبل قبل الإرسال",
    startScan: "بدء المسح",
    cancelScan: "إلغاء المسح",
    scanning: "جارٍ المسح...",
    scanSuccess: "تم مسح الكود بنجاح",
    paymentInfoFound: "تم العثور على معلومات الدفع",
    manualSend: "إرسال يدوي",
    placeCodeInArea: "ضع الكود في المنطقة المحددة",
    
    // Account page
    myAccount: "حسابي",
    accountSettings: "إعدادات الحساب",
    editPreferences: "تحرير التفضيلات",
    securityPrivacy: "الأمان والخصوصية",
    managePasswords: "إدارة كلمات المرور",
    cardManagement: "إدارة البطاقات",
    manageCards: "إدارة البطاقات",
    notifications: "الإشعارات",
    customizeAlerts: "تخصيص التنبيهات",
    helpSupport: "المساعدة والدعم",
    helpSupportDesc: "الحصول على المساعدة والدعم الفني",
    logout: "تسجيل الخروج",
    activeAccount: "حساب مفعل",
    quickInfo: "معلومات سريعة",
    email: "البريد الإلكتروني",
    address: "العنوان",
    riyadhSA: "الرياض، المملكة العربية السعودية",
    user: "مستخدم",
    
    // Common
    comingSoon: "قريباً",
    comingSoonDesc: "هذه الميزة ستكون متاحة قريباً",
    error: "خطأ",
    logoutError: "حدث خطأ أثناء تسجيل الخروج",
    language: "اللغة",
    totalBalance: "الرصيد الإجمالي",
    selectAppLanguage: "اختر لغة التطبيق المفضلة",
    verifyIdentity: "يرجى التحقق من هويتك",
    clickToVerify: "انقل للتحقق",
    
    // Deposit translations
    depositAmount: "المبلغ المراد إيداعه",
    paymentMethod: "طريقة الدفع",
    creditCard: "بطاقة ائتمان",
    bankTransfer: "تحويل بنكي",
    depositButton: "إيداع",
    
    // Withdraw translations
    withdrawMoney: "سحب أموال",
    withdrawAmount: "المبلغ المراد سحبه",
    withdrawButton: "سحب",
    processingWithdraw: "جاري السحب...",
    withdrawSuccess: "تم السحب بنجاح",
    withdrawError: "خطأ في السحب",
    insufficientFunds: "رصيد غير كافي",
    amountTooSmall: "مبلغ صغير جداً",
    withdrawMethod: "طريقة السحب",
    workingDays13: "1-3 أيام عمل",
    workingDays35: "3-5 أيام عمل",
    
    // Cards translations
    myCards: "بطاقاتي",
    createCard: "إنشاء بطاقة",
    virtualCard: "بطاقة افتراضية",
    physicalCard: "بطاقة فيزيائية",
    cardCreated: "تم إنشاء البطاقة بنجاح",
    cardCreationError: "خطأ في إنشاء البطاقة",
    
    // Transactions translations
    allTransactions: "جميع المعاملات",
    searchTransactions: "البحث في المعاملات",
    filterTransactions: "تصفية المعاملات",
    noTransactions: "لا توجد معاملات",
    completed: "مكتمل",
    pending: "معلق",
    failed: "فشل",
    

  },
  en: {
    // Navigation
    home: "Home",
    cards: "Cards",
    support: "Support",
    account: "Account",
    transactions: "Transactions",
    
    // Home page
    wallet: "Wallet",
    totalBalance: "Total Balance",
    usd: "USD",
    deposit: "Deposit",
    withdraw: "Withdraw",
    send: "Send",
    scan: "Scan",
    guidanceForBeginnersTitle: "Guidance for Beginners",
    
    // Transactions page
    transactionsTitle: "Transactions",
    searchTransactions: "Search transactions...",
    all: "All",
    sendTransaction: "Send",
    receiveTransaction: "Receive", 
    depositTransaction: "Deposit",
    withdrawTransaction: "Withdraw",
    totalIncome: "Total Income",
    totalExpense: "Total Expense",
    loadingTransactions: "Loading transactions...",
    noTransactions: "No Transactions",
    noTransactionsDesc: "You haven't made any transactions yet",
    noSearchResults: "No transactions found matching your search",
    quickStats: "Quick Stats",
    thisMonth: "This month's transactions",
    averageTransaction: "Average transaction value", 
    largestTransaction: "Largest transaction",
    completed: "Completed",
    pending: "Pending",
    failed: "Failed",
    unknown: "Unknown",
    noDescription: "No description",
    
    // Withdraw page
    withdrawMoney: "Withdraw Money",
    withdrawTitle: "Withdraw Amount",
    withdrawFrom: "Withdraw From Card",
    withdrawalMethod: "Withdrawal Method",
    bankTransfer: "Bank Transfer",
    instantTransfer: "Instant Transfer",
    atmWithdrawal: "ATM Withdrawal",
    bankTransferDesc: "Transfer to bank account",
    instantTransferDesc: "Instant transfer to bank",
    atmWithdrawalDesc: "Cash withdrawal from any ATM",
    processingTimeBank: "1-3 business days",
    processingTimeInstant: "Within minutes",
    processingTimeAtm: "Instant",
    bankAccountNumber: "Bank Account Number",
    withdrawDescription: "Withdrawal Description (Optional)",
    withdrawReason: "Withdrawal reason...",
    requestedAmount: "Requested Amount",
    withdrawalFee: "Fee",
    amountReceived: "Amount Received",
    confirmWithdraw: "Confirm Withdrawal",
    processing: "Processing...",
    withdrawalLimits: "Withdrawal Limits",
    dailyLimit: "Daily Limit",
    monthlyLimit: "Monthly Limit",
    usedToday: "Used Today",
    
    // Cards page
    myCards: "My Cards",
    addNewCard: "Add New Card",
    noCards: "No Cards",
    noCardsDesc: "You haven't added any cards yet",
    createFirstCard: "Create First Card",
    cardBalance: "Card Balance",
    cardStatus: "Card Status",
    activeCard: "Active",
    blockedCard: "Blocked",
    expiredCard: "Expired",
    cardDetails: "Card Details",
    viewTransactions: "View Transactions",
    blockCard: "Block Card",
    unblockCard: "Unblock Card",
    
    // Deposit page
    depositMoney: "Deposit Money",
    selectCurrency: "Select Currency",
    depositInformation: "Deposit Information",
    selectCurrencyToView: "• Select a currency to view deposit options",
    minimumDepositApply: "• Minimum deposit amounts may apply",
    processingTimesVary: "• Processing times vary by currency and network",
    availableBalance: "Available Balance",
    amountInDollars: "Amount in Dollars",
    confirmDeposit: "Confirm Deposit",
    processingDeposit: "Processing...",
    depositSuccess: "Deposit Successful",
    depositError: "Deposit Error",
    invalidAmount: "Invalid Amount",
    enterValidAmount: "Please enter a valid amount",
    
    // Send page
    sendMoney: "Send Money",
    sendTo: "Send To",
    emailAddress: "Email Address",
    phoneNumber: "Phone Number",
    amount: "Amount",
    optionalNote: "Note (Optional)",
    addNote: "Add note...",
    confirmSend: "Confirm Send",
    sending: "Sending...",
    sendSuccess: "Transfer Successful",
    sendError: "Transfer Error",
    enterRecipient: "Please enter recipient",
    validEmailOrPhone: "Please enter a valid email or phone number",
    insufficientFunds: "Insufficient Funds",
    insufficientBalance: "Available balance is insufficient for this operation",
    
    // Scan page
    scanCode: "Scan Code",
    howToUse: "How to Use",
    showQRCode: "Ask recipient to show QR code",
    clearCode: "Make sure the code is clear and no shadows",
    pointCamera: "Point camera towards the code",
    centerCode: "Place the code in the center of screen",
    confirmDetails: "Confirm details and send",
    reviewAmount: "Review amount and recipient before sending",
    startScan: "Start Scan",
    cancelScan: "Cancel Scan",
    scanning: "Scanning...",
    scanSuccess: "QR Code Scanned Successfully",
    paymentInfoFound: "Payment information found",
    manualSend: "Manual Send",
    placeCodeInArea: "Place code in the designated area",
    
    // Account page
    myAccount: "My Account",
    accountSettings: "Account Settings",
    editPreferences: "Edit Preferences",
    securityPrivacy: "Security & Privacy",
    managePasswords: "Manage Passwords",
    cardManagement: "Card Management",
    manageCards: "Manage Cards",
    notifications: "Notifications",
    customizeAlerts: "Customize Alerts",
    helpSupport: "Help & Support",
    helpSupportDesc: "Get help and technical support",
    logout: "Logout",
    activeAccount: "Active Account",
    quickInfo: "Quick Info",
    phoneNumber: "Phone Number",
    email: "Email",
    address: "Address",
    riyadhSA: "Riyadh, Saudi Arabia",
    user: "User",
    
    // Common
    comingSoon: "Coming Soon",
    comingSoonDesc: "This feature will be available soon",
    error: "Error",
    logoutError: "An error occurred while logging out",
    language: "Language",
    totalBalance: "Total Balance",
    selectAppLanguage: "Choose your preferred app language",
    verifyIdentity: "Please verify your identity",
    clickToVerify: "Click to verify",
    
    // Deposit translations
    depositAmount: "Amount to Deposit",
    paymentMethod: "Payment Method",
    creditCard: "Credit Card",
    bankTransfer: "Bank Transfer",
    depositButton: "Deposit",
    
    // Withdraw translations
    withdrawMoney: "Withdraw Money",
    withdrawAmount: "Amount to Withdraw",
    withdrawButton: "Withdraw",
    processingWithdraw: "Processing...",
    withdrawSuccess: "Withdrawal Successful",
    withdrawError: "Withdrawal Error",
    insufficientFunds: "Insufficient Funds",
    amountTooSmall: "Amount Too Small",
    withdrawMethod: "Withdrawal Method",
    workingDays13: "1-3 business days",
    workingDays35: "3-5 business days",
    
    // Cards translations
    myCards: "My Cards",
    createCard: "Create Card",
    virtualCard: "Virtual Card",
    physicalCard: "Physical Card",
    cardCreated: "Card Created Successfully",
    cardCreationError: "Card Creation Error",
    
    // Transactions translations
    allTransactions: "All Transactions",
    searchTransactions: "Search Transactions",
    filterTransactions: "Filter Transactions",
    noTransactions: "No Transactions",
    completed: "Completed",
    pending: "Pending",
    failed: "Failed",
    

  }
};

export function useLanguageHook() {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem("language");
    return (saved as Language) || "ar";
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("language", lang);
    
    // Update document direction
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = lang;
  };

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations.ar] || "";
  };

  useEffect(() => {
    // Set initial document direction
    document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = language;
  }, [language]);

  return { language, setLanguage, t };
}