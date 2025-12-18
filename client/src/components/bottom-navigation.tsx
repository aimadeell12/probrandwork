import { Link, useLocation } from "wouter";
import { Home, CreditCard, BarChart3, FileText, User, Link2 } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";

export default function BottomNavigation() {
  const [location] = useLocation();
  const { t } = useLanguage();

  const navItems = [
    { path: "/dashboard", label: t("home"), icon: Home },
    { path: "/cards", label: t("cards"), icon: CreditCard },
    { path: "/payment-links", label: t("payments"), icon: Link2 },
    { path: "/transactions", label: t("transactions"), icon: BarChart3 },
    { path: "/account", label: t("account"), icon: User },
  ];

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 bottom-nav-blur z-50 bottom-nav-safe">
      <div className="flex justify-around items-center py-3 px-2 gap-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location === item.path || (item.path === "/dashboard" && location === "/");
          
          return (
            <Link key={item.path} href={item.path}>
              <div className="flex flex-col items-center justify-center flex-1 cursor-pointer native-button haptic-light touch-target py-2 px-1 rounded-2xl transition-all duration-300 hover:bg-white/5 dark:hover:bg-white/10">
                <div className={`p-3 rounded-2xl nav-icon-container transition-all duration-300 ${isActive ? 'active' : 'inactive-nav'}`}>
                  <Icon className={`w-6 h-6 transition-all duration-300 ${isActive ? 'text-white scale-110' : 'text-gray-600 dark:text-gray-400'}`} />
                </div>
                <span className={`text-[11px] font-semibold transition-all duration-300 mt-1.5 whitespace-nowrap ${isActive ? 'text-purple-600 dark:text-purple-400 scale-105' : 'text-gray-600 dark:text-gray-500'}`}>
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