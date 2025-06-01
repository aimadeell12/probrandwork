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
    <div className="fixed bottom-0 left-0 right-0 bottom-nav-blur z-50 bottom-nav-safe">
      <div className="flex justify-around py-4 px-6">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location === item.path || (item.path === "/dashboard" && location === "/");
          
          return (
            <Link key={item.path} href={item.path}>
              <div className="flex flex-col items-center gap-2 cursor-pointer native-button haptic-light touch-target">
                <div className={`p-3 rounded-2xl nav-icon-container ${isActive ? 'active' : ''}`}>
                  <Icon className={`w-6 h-6 transition-colors ${isActive ? 'text-white' : 'text-gray-600 dark:text-gray-300'}`} />
                </div>
                <span className={`text-xs font-medium transition-all duration-300 ${isActive ? 'text-purple-600 dark:text-purple-400 font-semibold scale-105' : 'text-gray-500 dark:text-gray-400'}`}>
                  {item.label}
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}