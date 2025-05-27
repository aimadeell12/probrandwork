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

  const popularServices = [
    {
      icon: Mail,
      title: "Referral",
      description: "Invite friends and earn rewards",
      color: "bg-blue-600",
      iconColor: "text-white",
      href: "/account/referral"
    },
    {
      icon: Gift,
      title: "Gift",
      description: "Send gifts to friends", 
      color: "bg-pink-600",
      iconColor: "text-white",
      href: "/send"
    },
    {
      icon: Ticket,
      title: "Vouchers",
      description: "Redeem vouchers and coupons",
      color: "bg-orange-600",
      iconColor: "text-white",
      href: "/account/vouchers"
    }
  ];

  const cardServices = [
    {
      icon: CreditCard,
      title: "Apply",
      description: "Apply for new cards",
      color: "bg-purple-600",
      iconColor: "text-white",
      href: "/cards"
    },
    {
      icon: Crown,
      title: "Priority",
      description: "Priority card services",
      color: "bg-yellow-600",
      iconColor: "text-white",
      href: "/cards/priority"
    }
  ];

  const transactionServices = [
    {
      icon: ArrowDownToLine,
      title: "Deposit",
      description: "Add money to wallet",
      color: "bg-emerald-600",
      iconColor: "text-white",
      href: "/deposit"
    },
    {
      icon: ArrowUpFromLine,
      title: "Withdraw",
      description: "Withdraw money",
      color: "bg-rose-600",
      iconColor: "text-white",
      href: "/withdraw"
    },
    {
      icon: Send,
      title: "Send",
      description: "Send money to others",
      color: "bg-blue-600",
      iconColor: "text-white",
      href: "/send"
    },
    {
      icon: ArrowDown,
      title: "Receive",
      description: "Receive payments",
      color: "bg-purple-600",
      iconColor: "text-white",
      href: "/wallet"
    },
    {
      icon: RefreshCw,
      title: "Convert",
      description: "Currency conversion",
      color: "bg-orange-600",
      iconColor: "text-white",
      href: "/account/currency"
    },
    {
      icon: Bell,
      title: "Alert",
      description: "Transaction alerts",
      color: "bg-amber-600",
      iconColor: "text-white",
      href: "/account/notifications"
    }
  ];

  const supportServices = [
    {
      icon: GraduationCap,
      title: "Learn",
      description: "Educational resources",
      color: "bg-indigo-600",
      iconColor: "text-white",
      href: "/account/help"
    },
    {
      icon: Users,
      title: "Community",
      description: "Join our community",
      color: "bg-teal-600",
      iconColor: "text-white",
      href: "/account/community"
    },
    {
      icon: MessageCircle,
      title: "Chat",
      description: "Customer support",
      color: "bg-gray-600",
      iconColor: "text-white",
      href: "/support"
    }
  ];

  const ServiceCard = ({ service }: { service: any }) => {
    const Icon = service.icon;
    
    return (
      <Link href={service.href}>
        <div className="flex flex-col items-center cursor-pointer transform hover:scale-105 transition-all duration-200">
          <div className="w-16 h-16 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border border-purple-200/30 dark:border-purple-700/30 rounded-full flex items-center justify-center mb-2 shadow-lg hover:shadow-xl">
            <div className={`w-10 h-10 ${service.color} rounded-2xl flex items-center justify-center`}>
              <Icon className={`h-5 w-5 ${service.iconColor}`} />
            </div>
          </div>
          <span className="text-sm text-gray-700 dark:text-gray-300 font-medium text-center">
            {service.title}
          </span>
        </div>
      </Link>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-purple-100 dark:from-gray-900 dark:via-purple-900 dark:to-purple-900 relative overflow-hidden">
      
      {/* Background decorative elements */}
      <div className="absolute top-0 right-0 w-32 h-32 sm:w-48 sm:h-48 lg:w-64 lg:h-64 bg-gradient-to-br from-purple-200/30 to-pink-200/30 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-48 h-48 sm:w-72 sm:h-72 lg:w-96 lg:h-96 bg-gradient-to-tr from-purple-200/20 to-pink-200/20 rounded-full blur-3xl"></div>
      
      <div className="px-4 sm:px-6 lg:px-8 py-6 pb-20 relative z-10">
        
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setLocation("/dashboard")}
            className="p-2 hover:bg-purple-100 dark:hover:bg-purple-900/30 text-gray-700 dark:text-gray-300"
          >
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">
            Services Hub
          </h1>
        </div>
        
        {/* Popular Services */}
        <div className="mb-8">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Popular</h2>
          <div className="grid grid-cols-3 gap-4">
            {popularServices.map((service, index) => (
              <ServiceCard key={index} service={service} />
            ))}
          </div>
        </div>

        {/* Card Services */}
        <div className="mb-8">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Card</h2>
          <div className="grid grid-cols-2 gap-4">
            {cardServices.map((service, index) => (
              <ServiceCard key={index} service={service} />
            ))}
          </div>
        </div>

        {/* Transaction Services */}
        <div className="mb-8">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Transaction</h2>
          <div className="grid grid-cols-3 gap-4">
            {transactionServices.map((service, index) => (
              <ServiceCard key={index} service={service} />
            ))}
          </div>
        </div>

        {/* Banking Services */}
        <div className="mb-8">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Banking</h2>
          <div className="grid grid-cols-3 gap-4">
            <ServiceCard 
              service={{
                icon: Building2,
                title: "Bank Transfer",
                description: "Transfer to bank accounts",
                color: "bg-cyan-600",
                iconColor: "text-white",
                href: "/bank-transfer"
              }}
            />
          </div>
        </div>

        {/* Support Services */}
        <div className="mb-8">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Support</h2>
          <div className="grid grid-cols-3 gap-4">
            {supportServices.map((service, index) => (
              <ServiceCard key={index} service={service} />
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}