import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Gift, Mail, CreditCard, Wallet, 
         ArrowUpDown, ArrowDownToLine, ArrowUpFromLine, 
         Send, ArrowDown, QrCode, RefreshCw, Bell,
         GraduationCap, Users, MessageCircle, Building2,
         Ticket, Crown, DollarSign, Star } from "lucide-react";
import { Link, useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/hooks/useLanguage";

export default function Services() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { t, isArabic } = useLanguage();

  const popularServices = [
    {
      icon: Mail,
      title: isArabic ? "إحالة" : "Referral",
      description: isArabic ? "ادع الأصدقاء واكسب مكافآت" : "Invite friends and earn rewards",
      color: "from-blue-500 to-blue-600",
      action: () => toast({ title: t("comingSoon"), description: isArabic ? "برنامج الإحالة متاح قريباً" : "Referral program will be available soon" })
    },
    {
      icon: Gift,
      title: isArabic ? "هدايا" : "Gift",
      description: isArabic ? "أرسل هدايا للأصدقاء" : "Send gifts to friends", 
      color: "from-red-500 to-pink-600",
      action: () => toast({ title: t("comingSoon"), description: isArabic ? "ميزة الهدايا متاحة قريباً" : "Gift feature will be available soon" })
    },
    {
      icon: Ticket,
      title: isArabic ? "قسائم" : "Vouchers",
      description: isArabic ? "استبدل القسائم والكوبونات" : "Redeem vouchers and coupons",
      color: "from-orange-500 to-amber-600",
      action: () => toast({ title: t("comingSoon"), description: isArabic ? "القسائم متاحة قريباً" : "Vouchers will be available soon" })
    }
  ];

  const cardServices = [
    {
      icon: CreditCard,
      title: isArabic ? "طلب بطاقة" : "Apply",
      description: isArabic ? "تقدم بطلب للحصول على بطاقات جديدة" : "Apply for new cards",
      color: "from-purple-500 to-indigo-600",
      href: "/cards"
    },
    {
      icon: Crown,
      title: isArabic ? "مميز" : "Priority",
      description: isArabic ? "خدمات البطاقات المميزة" : "Priority card services",
      color: "from-yellow-500 to-orange-600",
      action: () => toast({ title: t("comingSoon"), description: isArabic ? "الخدمات المميزة متاحة قريباً" : "Priority services will be available soon" })
    }
  ];

  const transactionServices = [
    {
      icon: ArrowDownToLine,
      title: isArabic ? "إيداع" : "Deposit",
      description: isArabic ? "أضف أموال للمحفظة" : "Add money to wallet",
      color: "from-green-500 to-emerald-600",
      href: "/deposit"
    },
    {
      icon: ArrowUpFromLine,
      title: isArabic ? "سحب" : "Withdraw",
      description: isArabic ? "اسحب الأموال" : "Withdraw money",
      color: "from-red-500 to-rose-600",
      href: "/withdraw"
    },
    {
      icon: Send,
      title: isArabic ? "إرسال" : "Send",
      description: isArabic ? "أرسل أموال للآخرين" : "Send money to others",
      color: "from-blue-500 to-cyan-600",
      href: "/send"
    },
    {
      icon: ArrowDown,
      title: isArabic ? "استقبال" : "Receive",
      description: isArabic ? "استقبل المدفوعات" : "Receive payments",
      color: "from-purple-500 to-violet-600",
      action: () => toast({ title: t("comingSoon"), description: isArabic ? "ميزة الاستقبال متاحة قريباً" : "Receive feature will be available soon" })
    },
    {
      icon: RefreshCw,
      title: isArabic ? "تحويل" : "Convert",
      description: isArabic ? "تحويل العملات" : "Currency conversion",
      color: "from-orange-500 to-yellow-600",
      action: () => toast({ title: t("comingSoon"), description: isArabic ? "تحويل العملات متاح قريباً" : "Currency conversion will be available soon" })
    },
    {
      icon: Bell,
      title: isArabic ? "تنبيهات" : "Alert",
      description: isArabic ? "تنبيهات المعاملات" : "Transaction alerts",
      color: "from-amber-500 to-orange-600",
      href: "/account/notifications"
    }
  ];

  const supportServices = [
    {
      icon: GraduationCap,
      title: isArabic ? "تعلم" : "Learn",
      description: isArabic ? "موارد تعليمية" : "Educational resources",
      color: "from-indigo-500 to-blue-600",
      action: () => toast({ title: t("comingSoon"), description: isArabic ? "مركز التعلم متاح قريباً" : "Learning center will be available soon" })
    },
    {
      icon: Users,
      title: isArabic ? "مجتمع" : "Community",
      description: isArabic ? "انضم لمجتمعنا" : "Join our community",
      color: "from-pink-500 to-rose-600",
      action: () => toast({ title: t("comingSoon"), description: isArabic ? "ميزات المجتمع متاحة قريباً" : "Community features will be available soon" })
    },
    {
      icon: MessageCircle,
      title: isArabic ? "دردشة" : "Chat",
      description: isArabic ? "دعم العملاء" : "Customer support",
      color: "from-teal-500 to-cyan-600",
      href: "/support"
    }
  ];

  const ServiceCard = ({ service, href }: { service: any; href?: string }) => {
    const Icon = service.icon;
    
    if (href) {
      return (
        <Link href={href}>
          <div className="flex flex-col items-center p-4 rounded-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/30 dark:border-gray-700/30 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 cursor-pointer">
            <div className={`w-12 h-12 ${service.color} dark:bg-opacity-20 rounded-2xl flex items-center justify-center mb-3`}>
              <Icon className="h-6 w-6" />
            </div>
            <span className="text-sm font-medium text-gray-900 dark:text-white text-center">
              {service.title}
            </span>
          </div>
        </Link>
      );
    }

    return (
      <div 
        onClick={service.action}
        className="flex flex-col items-center p-4 rounded-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/30 dark:border-gray-700/30 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 cursor-pointer"
      >
        <div className={`w-12 h-12 ${service.color} dark:bg-opacity-20 rounded-2xl flex items-center justify-center mb-3`}>
          <Icon className="h-6 w-6" />
        </div>
        <span className="text-sm font-medium text-gray-900 dark:text-white text-center">
          {service.title}
        </span>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 relative overflow-hidden">
      
      {/* Background decorative elements */}
      <div className="absolute top-0 right-0 w-32 h-32 sm:w-48 sm:h-48 lg:w-64 lg:h-64 bg-gradient-to-br from-purple-200/10 to-pink-200/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-48 h-48 sm:w-72 sm:h-72 lg:w-96 lg:h-96 bg-gradient-to-tr from-blue-200/10 to-purple-200/10 rounded-full blur-3xl"></div>
      
      {/* Header */}
      <div className="bg-gray-900/80 backdrop-blur-sm border-b border-gray-700/30 p-4 relative z-10">
        <div className="flex items-center space-x-4 space-x-reverse">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setLocation("/dashboard")}
            className="p-2 hover:bg-gray-800/50 text-white"
          >
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <h1 className="text-xl font-bold text-white">
            Services Hub
          </h1>
        </div>
      </div>

      <div className="p-4 space-y-8 relative z-10 pb-20">
        
        {/* Popular Services */}
        <div>
          <h2 className="text-lg font-bold text-white mb-4">Popular</h2>
          <div className="grid grid-cols-3 gap-4">
            {popularServices.map((service, index) => (
              <ServiceCard key={index} service={service} />
            ))}
          </div>
        </div>

        {/* Card Services */}
        <div>
          <h2 className="text-lg font-bold text-white mb-4">Card</h2>
          <div className="grid grid-cols-3 gap-4">
            {cardServices.map((service, index) => (
              <ServiceCard 
                key={index} 
                service={service} 
                href={service.href}
              />
            ))}
          </div>
        </div>

        {/* Transaction Services */}
        <div>
          <h2 className="text-lg font-bold text-white mb-4">Transaction</h2>
          <div className="grid grid-cols-3 gap-4">
            {transactionServices.map((service, index) => (
              <ServiceCard 
                key={index} 
                service={service} 
                href={service.href}
              />
            ))}
          </div>
        </div>

        {/* Support Services */}
        <div>
          <h2 className="text-lg font-bold text-white mb-4">Support</h2>
          <div className="grid grid-cols-3 gap-4">
            {supportServices.map((service, index) => (
              <ServiceCard 
                key={index} 
                service={service} 
                href={service.href}
              />
            ))}
          </div>
        </div>

        {/* Bank Transfer Service */}
        <div>
          <h2 className="text-lg font-bold text-white mb-4">Banking</h2>
          <div className="grid grid-cols-3 gap-4">
            <ServiceCard 
              service={{
                icon: Building2,
                title: "Bank Transfer",
                description: "Transfer to bank accounts",
                color: "bg-blue-100 text-blue-600"
              }}
              href="/bank-transfer"
            />
          </div>
        </div>

      </div>
    </div>
  );
}