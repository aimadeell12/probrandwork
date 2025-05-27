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
      color: "from-blue-500 to-blue-600",
      action: () => toast({ title: "Coming Soon", description: "Referral program will be available soon" })
    },
    {
      icon: Gift,
      title: "Gift",
      description: "Send gifts to friends", 
      color: "from-red-500 to-pink-600",
      action: () => toast({ title: "Coming Soon", description: "Gift feature will be available soon" })
    },
    {
      icon: Ticket,
      title: "Vouchers",
      description: "Redeem vouchers and coupons",
      color: "from-orange-500 to-amber-600",
      action: () => toast({ title: "Coming Soon", description: "Vouchers will be available soon" })
    }
  ];

  const cardServices = [
    {
      icon: CreditCard,
      title: "Apply",
      description: "Apply for new cards",
      color: "from-purple-500 to-indigo-600",
      href: "/cards"
    },
    {
      icon: Crown,
      title: "Priority",
      description: "Priority card services",
      color: "from-yellow-500 to-orange-600",
      action: () => toast({ title: "Coming Soon", description: "Priority services will be available soon" })
    }
  ];

  const transactionServices = [
    {
      icon: ArrowDownToLine,
      title: "Deposit",
      description: "Add money to wallet",
      color: "from-green-500 to-emerald-600",
      href: "/deposit"
    },
    {
      icon: ArrowUpFromLine,
      title: "Withdraw",
      description: "Withdraw money",
      color: "from-red-500 to-rose-600",
      href: "/withdraw"
    },
    {
      icon: Send,
      title: "Send",
      description: "Send money to others",
      color: "from-blue-500 to-cyan-600",
      href: "/send"
    },
    {
      icon: ArrowDown,
      title: "Receive",
      description: "Receive payments",
      color: "from-purple-500 to-violet-600",
      action: () => toast({ title: "Coming Soon", description: "Receive feature will be available soon" })
    },
    {
      icon: RefreshCw,
      title: "Convert",
      description: "Currency conversion",
      color: "from-orange-500 to-yellow-600",
      action: () => toast({ title: "Coming Soon", description: "Currency conversion will be available soon" })
    },
    {
      icon: Bell,
      title: "Alert",
      description: "Transaction alerts",
      color: "from-amber-500 to-orange-600",
      href: "/account/notifications"
    }
  ];

  const supportServices = [
    {
      icon: GraduationCap,
      title: "Learn",
      description: "Educational resources",
      color: "from-indigo-500 to-blue-600",
      action: () => toast({ title: "Coming Soon", description: "Learning center will be available soon" })
    },
    {
      icon: Users,
      title: "Community",
      description: "Join our community",
      color: "from-pink-500 to-rose-600",
      action: () => toast({ title: "Coming Soon", description: "Community features will be available soon" })
    },
    {
      icon: MessageCircle,
      title: "Chat",
      description: "Customer support",
      color: "from-teal-500 to-cyan-600",
      href: "/support"
    }
  ];

  const ServiceCard = ({ service, href }: { service: any; href?: string }) => {
    const Icon = service.icon;
    
    if (href) {
      return (
        <Link href={href}>
          <div className="flex flex-col items-center p-4 rounded-3xl bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm border border-white/30 dark:border-gray-700/30 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 cursor-pointer group">
            <div className={`w-14 h-14 bg-gradient-to-r ${service.color} rounded-3xl flex items-center justify-center mb-3 shadow-lg group-hover:shadow-xl transition-all duration-300`}>
              <Icon className="h-7 w-7 text-white" />
            </div>
            <span className="text-sm font-semibold text-gray-900 dark:text-white text-center leading-tight">
              {service.title}
            </span>
          </div>
        </Link>
      );
    }

    return (
      <div 
        onClick={service.action}
        className="flex flex-col items-center p-4 rounded-3xl bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm border border-white/30 dark:border-gray-700/30 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 cursor-pointer group"
      >
        <div className={`w-14 h-14 bg-gradient-to-r ${service.color} rounded-3xl flex items-center justify-center mb-3 shadow-lg group-hover:shadow-xl transition-all duration-300`}>
          <Icon className="h-7 w-7 text-white" />
        </div>
        <span className="text-sm font-semibold text-gray-900 dark:text-white text-center leading-tight">
          {service.title}
        </span>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-gray-900 to-indigo-900 relative overflow-hidden">
      
      {/* Background decorative elements */}
      <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-60 h-60 bg-gradient-to-tr from-blue-400/20 to-purple-400/20 rounded-full blur-3xl"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-r from-indigo-400/10 to-purple-400/10 rounded-full blur-3xl"></div>
      
      {/* Header */}
      <div className="bg-black/30 backdrop-blur-xl border-b border-white/10 p-4 relative z-10">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setLocation("/dashboard")}
            className="p-2 hover:bg-white/10 text-white border-0"
          >
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <h1 className="text-xl font-bold text-white">
            Services Hub
          </h1>
        </div>
      </div>

      <div className="p-6 space-y-8 relative z-10 pb-20">
        
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
                color: "from-blue-500 to-indigo-600"
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