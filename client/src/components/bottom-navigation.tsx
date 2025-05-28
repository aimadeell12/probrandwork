import { Link, useLocation } from "wouter";
import { Home, CreditCard, BarChart3, Receipt, User } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";

export default function BottomNavigation() {
  const [location] = useLocation();
  const { t } = useLanguage();

  const navItems = [
    { path: "/dashboard", label: t("home"), icon: Home },
    { path: "/cards", label: t("cards"), icon: CreditCard },
    { path: "/transactions", label: t("transactions"), icon: BarChart3 },
    { path: "/account", label: t("account"), icon: User },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-purple-50/95 via-pink-50/95 to-purple-100/95 dark:bg-gradient-to-r dark:from-gray-900/95 dark:via-purple-900/95 dark:to-purple-900/95 ios-blur border-t border-purple-200/20 dark:border-purple-700/30 z-50 shadow-2xl bottom-nav-safe" style={{ position: 'fixed', bottom: 0 }}>
      <div className="flex justify-around py-3">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location === item.path || (item.path === "/dashboard" && location === "/");
          
          return (
            <Link key={item.path} href={item.path}>
              <div className="flex flex-col items-center gap-1 cursor-pointer native-button haptic-light touch-target">
                <div className={`p-2 rounded-xl transition-all duration-200 ${isActive ? 'bg-gradient-to-br from-purple-600 to-purple-700 shadow-lg scale-110' : 'bg-gray-100/50 dark:bg-gray-800/50 hover:bg-gray-200/70 dark:hover:bg-gray-700/70'}`}>
                  <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-gray-500 dark:text-gray-400'}`} />
                </div>
                <span className={`text-xs font-medium transition-colors ${isActive ? 'text-purple-600 dark:text-purple-400 font-semibold' : 'text-gray-500 dark:text-gray-400'}`}>{item.label}</span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}