import { Link, useLocation } from "wouter";
import { Home, CreditCard, BarChart3, Headphones } from "lucide-react";

export default function BottomNavigation() {
  const [location] = useLocation();

  const navItems = [
    { path: "/", label: "الرئيسية", icon: Home },
    { path: "/cards", label: "البطاقات", icon: CreditCard },
    { path: "/support", label: "الدعم", icon: Headphones },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-black border-t border-gray-200 dark:border-gray-800 z-50">
      <div className="flex justify-around py-3">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location === item.path;
          
          return (
            <Link key={item.path} href={item.path}>
              <div className="flex flex-col items-center gap-1 cursor-pointer">
                <Icon className={`w-5 h-5 ${isActive ? 'text-primary dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'}`} />
                <span className={`text-xs ${isActive ? 'text-primary dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'}`}>{item.label}</span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}