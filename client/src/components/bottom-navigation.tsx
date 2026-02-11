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
      <div className="flex justify-around py-2 px-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location === item.path || (item.path === "/dashboard" && location === "/");
          
          return (
            <Link key={item.path} href={item.path}>
              <div className="flex flex-col items-center gap-1 cursor-pointer native-button haptic-light touch-target min-w-[50px]">
                <div className={`p-2 rounded-xl nav-icon-container ${isActive ? 'active' : ''}`}>
                  <Icon className={`w-5 h-5 transition-colors ${isActive ? 'text-white' : 'text-gray-600 dark:text-gray-300'}`} />
                </div>
                <span className={`text-[10px] font-medium transition-all duration-300 ${isActive ? 'text-primary dark:text-red-400 font-semibold' : 'text-gray-500 dark:text-gray-400'}`}>
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