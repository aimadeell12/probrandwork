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
      color: "from-purple-600 to-purple-700",
      action: () => toast({ title: "Coming Soon", description: "Referral program will be available soon" })
    },
    {
      icon: Gift,
      title: "Gift",
      description: "Send gifts to friends", 
      color: "from-purple-500 to-purple-600",
      action: () => toast({ title: "Coming Soon", description: "Gift feature will be available soon" })
    },
    {
      icon: Ticket,
      title: "Vouchers",
      description: "Redeem vouchers and coupons",
      color: "from-purple-400 to-purple-500",
      action: () => toast({ title: "Coming Soon", description: "Vouchers will be available soon" })
    }
  ];

  const cardServices = [
    {
      icon: CreditCard,
      title: "Apply",
      description: "Apply for new cards",
      color: "from-indigo-600 to-indigo-700",
      href: "/cards"
    },
    {
      icon: Crown,
      title: "Priority",
      description: "Priority card services",
      color: "from-indigo-500 to-indigo-600",
      action: () => toast({ title: "Coming Soon", description: "Priority services will be available soon" })
    }
  ];

  const transactionServices = [
    {
      icon: ArrowDownToLine,
      title: "Deposit",
      description: "Add money to wallet",
      color: "from-emerald-600 to-emerald-700",
      href: "/deposit"
    },
    {
      icon: ArrowUpFromLine,
      title: "Withdraw",
      description: "Withdraw money",
      color: "from-rose-600 to-rose-700",
      href: "/withdraw"
    },
    {
      icon: Send,
      title: "Send",
      description: "Send money to others",
      color: "from-blue-600 to-blue-700",
      href: "/send"
    },
    {
      icon: ArrowDown,
      title: "Receive",
      description: "Receive payments",
      color: "from-violet-600 to-violet-700",
      action: () => toast({ title: "Coming Soon", description: "Receive feature will be available soon" })
    },
    {
      icon: RefreshCw,
      title: "Convert",
      description: "Currency conversion",
      color: "from-amber-600 to-amber-700",
      action: () => toast({ title: "Coming Soon", description: "Currency conversion will be available soon" })
    },
    {
      icon: Bell,
      title: "Alert",
      description: "Transaction alerts",
      color: "from-orange-600 to-orange-700",
      href: "/account/notifications"
    }
  ];

  const supportServices = [
    {
      icon: GraduationCap,
      title: "Learn",
      description: "Educational resources",
      color: "from-slate-600 to-slate-700",
      action: () => toast({ title: "Coming Soon", description: "Learning center will be available soon" })
    },
    {
      icon: Users,
      title: "Community",
      description: "Join our community",
      color: "from-slate-500 to-slate-600",
      action: () => toast({ title: "Coming Soon", description: "Community features will be available soon" })
    },
    {
      icon: MessageCircle,
      title: "Chat",
      description: "Customer support",
      color: "from-slate-700 to-slate-800",
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      
      {/* Background decorative elements */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-500/15 to-indigo-500/15 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-purple-500/10 to-slate-500/10 rounded-full blur-3xl"></div>
      <div className="absolute top-1/3 right-1/3 w-64 h-64 bg-gradient-to-r from-indigo-500/8 to-purple-500/8 rounded-full blur-3xl"></div>
      
      {/* Header */}
      <div className="bg-slate-900/80 backdrop-blur-xl border-b border-white/5 p-4 relative z-10">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setLocation("/dashboard")}
            className="p-2 hover:bg-white/5 text-white border-0 rounded-xl"
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
                color: "from-cyan-600 to-cyan-700"
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