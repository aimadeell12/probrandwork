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
    
    // Account page
    myAccount: "حسابي",
    accountSettings: "إعدادات الحساب",
    accountSettingsDesc: "تعديل المعلومات الشخصية والتفضيلات",
    securityPrivacy: "الأمان والخصوصية",
    securityPrivacyDesc: "إدارة كلمات المرور والحماية",
    cardManagement: "إدارة البطاقات",
    cardManagementDesc: "عرض وإدارة جميع البطاقات",
    notifications: "الإشعارات",
    notificationsDesc: "تخصيص الإشعارات والتنبيهات",
    helpSupport: "المساعدة والدعم",
    helpSupportDesc: "الحصول على المساعدة والدعم الفني",
    logout: "تسجيل الخروج",
    activeAccount: "حساب مفعل",
    quickInfo: "معلومات سريعة",
    phoneNumber: "رقم الهاتف",
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
  },
  en: {
    // Navigation
    home: "Home",
    cards: "Cards",
    support: "Support",
    account: "Account",
    
    // Account page
    myAccount: "My Account",
    accountSettings: "Account Settings",
    accountSettingsDesc: "Edit personal information and preferences",
    securityPrivacy: "Security & Privacy",
    securityPrivacyDesc: "Manage passwords and protection",
    cardManagement: "Card Management",
    cardManagementDesc: "View and manage all cards",
    notifications: "Notifications",
    notificationsDesc: "Customize notifications and alerts",
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
    return translations[language][key as keyof typeof translations.ar] || key;
  };

  useEffect(() => {
    // Set initial document direction
    document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = language;
  }, [language]);

  return { language, setLanguage, t };
}