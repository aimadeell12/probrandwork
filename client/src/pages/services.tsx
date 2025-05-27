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
      action: () => toast({ title: "Coming Soon", description: "Referral program will be available soon" })
    },
    {
      icon: Gift,
      title: "Gift",
      description: "Send gifts to friends", 
      color: "bg-pink-600",
      iconColor: "text-white",
      action: () => toast({ title: "Coming Soon", description: "Gift feature will be available soon" })
    },
    {
      icon: Ticket,
      title: "Vouchers",
      description: "Redeem vouchers and coupons",
      color: "bg-orange-600",
      iconColor: "text-white",
      action: () => toast({ title: "Coming Soon", description: "Vouchers will be available soon" })
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
      action: () => toast({ title: "Coming Soon", description: "Priority services will be available soon" })
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
      action: () => toast({ title: "Coming Soon", description: "Receive feature will be available soon" })
    },
    {
      icon: RefreshCw,
      title: "Convert",
      description: "Currency conversion",
      color: "bg-orange-600",
      iconColor: "text-white",
      action: () => toast({ title: "Coming Soon", description: "Currency conversion will be available soon" })
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
      action: () => toast({ title: "Coming Soon", description: "Learning center will be available soon" })
    },
    {
      icon: Users,
      title: "Community",
      description: "Join our community",
      color: "bg-teal-600",
      iconColor: "text-white",
      action: () => toast({ title: "Coming Soon", description: "Community features will be available soon" })
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

  const ServiceCard = ({ service, href }: { service: any; href?: string }) => {
    const Icon = service.icon;
    
    if (href) {
      return (
        <Link href={href}>
          <div className="flex flex-col items-center p-6 rounded-2xl bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 cursor-pointer">
            <div className={`w-16 h-16 ${service.color} rounded-2xl flex items-center justify-center mb-4 shadow-md`}>
              <Icon className={`h-8 w-8 ${service.iconColor}`} />
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
        className="flex flex-col items-center p-6 rounded-2xl bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 cursor-pointer"
      >
        <div className={`w-16 h-16 ${service.color} rounded-2xl flex items-center justify-center mb-4 shadow-md`}>
          <Icon className={`h-8 w-8 ${service.iconColor}`} />
        </div>
        <span className="text-sm font-medium text-gray-900 dark:text-white text-center">
          {service.title}
        </span>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 sticky top-0 z-10">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setLocation("/dashboard")}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl"
          >
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">
            Services Hub
          </h1>
        </div>
      </div>

      <div className="p-6 space-y-8 pb-20">
        
        {/* Popular Services */}
        <div>
          <h2 className="text-lg font-bold text-white mb-6">Popular</h2>
          <div className="grid grid-cols-3 gap-4">
            {popularServices.map((service, index) => (
              <ServiceCard key={index} service={service} />
            ))}
          </div>
        </div>

        {/* Card Services */}
        <div>
          <h2 className="text-lg font-bold text-white mb-6">Card</h2>
          <div className="grid grid-cols-2 gap-4">
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
          <h2 className="text-lg font-bold text-white mb-6">Transaction</h2>
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

        {/* Banking Services */}
        <div>
          <h2 className="text-lg font-bold text-white mb-6">Banking</h2>
          <div className="grid grid-cols-3 gap-4">
            <ServiceCard 
              service={{
                icon: Building2,
                title: "Bank Transfer",
                description: "Transfer to bank accounts",
                color: "bg-cyan-600",
                iconColor: "text-white"
              }}
              href="/bank-transfer"
            />
          </div>
        </div>

        {/* Support Services */}
        <div>
          <h2 className="text-lg font-bold text-white mb-6">Support</h2>
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

      </div>
    </div>
  );
}