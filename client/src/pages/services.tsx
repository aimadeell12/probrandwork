import { Button } from "@/components/ui/button";
import { ArrowLeft, Gift, Mail, CreditCard, 
         ArrowDownLeft, Banknote, 
         Send, ArrowUpRight, RefreshCw, Bell,
         GraduationCap, Users, MessageCircle, Building2,
         Ticket, Crown } from "lucide-react";
import { Link, useLocation } from "wouter";

export default function Services() {
  const [, setLocation] = useLocation();

  const popularServices = [
    {
      icon: Mail,
      title: "Referral",
      href: "/account/referral"
    },
    {
      icon: Gift,
      title: "Gift",
      href: "/send"
    },
    {
      icon: Ticket,
      title: "Vouchers",
      href: "/account/vouchers"
    }
  ];

  const cardServices = [
    {
      icon: CreditCard,
      title: "Apply",
      href: "/cards"
    },
    {
      icon: Crown,
      title: "Priority",
      href: "/cards/priority"
    }
  ];

  const transactionServices = [
    {
      icon: ArrowDownLeft,
      title: "Deposit",
      href: "/deposit"
    },
    {
      icon: Banknote,
      title: "Withdraw",
      href: "/withdraw"
    },
    {
      icon: ArrowUpRight,
      title: "Send",
      href: "/send"
    },
    {
      icon: RefreshCw,
      title: "Convert",
      href: "/account/currency"
    },
    {
      icon: Bell,
      title: "Alert",
      href: "/account/notifications"
    },
    {
      icon: Building2,
      title: "Bank Transfer",
      href: "/bank-transfer"
    }
  ];

  const supportServices = [
    {
      icon: GraduationCap,
      title: "Learn",
      href: "/account/help"
    },
    {
      icon: Users,
      title: "Community",
      href: "/account/community"
    },
    {
      icon: MessageCircle,
      title: "Chat",
      href: "/support"
    }
  ];

  const ServiceCard = ({ service }: { service: any }) => {
    const Icon = service.icon;
    
    return (
      <Link href={service.href}>
        <div className="text-center cursor-pointer hover:opacity-80 transition-opacity">
          <div className="w-16 h-16 bg-purple-100/80 rounded-full flex items-center justify-center mb-2 shadow-sm mx-auto">
            <Icon className="h-6 w-6 text-purple-600" />
          </div>
          <span className="text-xs text-gray-700 font-medium block">
            {service.title}
          </span>
        </div>
      </Link>
    );
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="px-4 py-6 pb-20">
        
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setLocation("/dashboard")}
            className="p-2 hover:bg-purple-100 text-gray-700"
          >
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <h1 className="text-xl font-bold text-gray-900">
            Services Hub
          </h1>
        </div>
        
        {/* Popular Services */}
        <div className="mb-8">
          <h2 className="text-lg font-bold text-gray-900 mb-4">
            Popular
          </h2>
          <div className="grid grid-cols-3 gap-4">
            {popularServices.map((service, index) => (
              <ServiceCard key={index} service={service} />
            ))}
          </div>
        </div>

        {/* Card Services */}
        <div className="mb-8">
          <h2 className="text-lg font-bold text-gray-900 mb-4">
            Card
          </h2>
          <div className="grid grid-cols-2 gap-4">
            {cardServices.map((service, index) => (
              <ServiceCard key={index} service={service} />
            ))}
          </div>
        </div>

        {/* Transaction Services */}
        <div className="mb-8">
          <h2 className="text-lg font-bold text-gray-900 mb-4">
            Transaction
          </h2>
          <div className="grid grid-cols-3 gap-4">
            {transactionServices.map((service, index) => (
              <ServiceCard key={index} service={service} />
            ))}
          </div>
        </div>

        {/* Support Services */}
        <div className="mb-8">
          <h2 className="text-lg font-bold text-gray-900 mb-4">
            Support
          </h2>
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