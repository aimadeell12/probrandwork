import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { 
  CreditCard, 
  Bell, 
  BarChart3, 
  Users, 
  Headphones, 
  Home,
  LogOut 
} from "lucide-react";

export default function Navigation() {
  const { user } = useAuth();
  const [location] = useLocation();

  const handleLogout = () => {
    window.location.href = "/api/logout";
  };

  const navItems = [
    { path: "/", label: "الرئيسية", icon: Home },
    { path: "/dashboard", label: "لوحة التحكم", icon: BarChart3 },
    { path: "/cards", label: "البطاقات", icon: CreditCard },
    { path: "/support", label: "الدعم", icon: Headphones },
  ];

  if (user?.role === "admin") {
    navItems.splice(3, 0, { path: "/admin", label: "الإدارة", icon: Users });
  }

  return (
    <nav className="bg-card shadow-sm border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4 space-x-reverse">
            <Link href="/">
              <div className="flex items-center cursor-pointer">
                <CreditCard className="h-8 w-8 text-primary ml-3" />
                <span className="text-xl font-bold text-primary">منصة البطاقات</span>
              </div>
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-6 space-x-reverse">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location === item.path;
              
              return (
                <Link key={item.path} href={item.path}>
                  <div className={`flex items-center space-x-2 space-x-reverse px-3 py-2 rounded-lg transition-colors cursor-pointer ${
                    isActive 
                      ? "text-primary bg-primary/10" 
                      : "text-muted-foreground hover:text-primary hover:bg-muted/50"
                  }`}>
                    <Icon className="h-4 w-4" />
                    <span className="font-medium">{item.label}</span>
                  </div>
                </Link>
              );
            })}
          </div>

          <div className="flex items-center space-x-4 space-x-reverse">
            <Button variant="ghost" size="sm" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 bg-accent text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                3
              </span>
            </Button>
            
            <div className="flex items-center space-x-2 space-x-reverse">
              <img 
                src={user?.profileImageUrl || "/placeholder-avatar.png"} 
                alt="صورة المستخدم" 
                className="w-8 h-8 rounded-full object-cover" 
              />
              <span className="font-medium text-foreground hidden sm:block">
                {user?.firstName} {user?.lastName}
              </span>
            </div>

            <Button 
              variant="outline" 
              size="sm"
              onClick={handleLogout}
              className="hidden sm:flex"
            >
              <LogOut className="h-4 w-4 ml-2" />
              تسجيل الخروج
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
