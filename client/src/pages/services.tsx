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
        <div className="text-center cursor-pointer group">
          <div className="w-16 h-16 lg:w-24 lg:h-24 bg-red-100/80 dark:bg-red-900/40 rounded-full flex items-center justify-center mb-2 lg:mb-4 shadow-sm mx-auto group-hover:shadow-md group-hover:bg-red-200/80 dark:group-hover:bg-red-800/60 transition-all duration-300 transform group-hover:scale-110">
            <Icon className="h-6 w-6 lg:h-8 lg:w-8 text-red-600 dark:text-red-400" />
          </div>
          <span className="text-xs lg:text-sm text-gray-700 dark:text-gray-300 font-medium block group-hover:text-red-600 dark:group-hover:text-red-300 transition-colors">
            {service.title}
          </span>
        </div>
      </Link>
    );
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 pb-24 lg:pb-6">
      <div className="max-w-md lg:max-w-6xl mx-auto px-4 lg:px-8 py-6 lg:py-10">
        
        {/* Header */}
        <div className="flex items-center gap-4 mb-8 lg:mb-12">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setLocation("/dashboard")}
            className="p-2 hover:bg-red-100 dark:hover:bg-red-900/30 text-gray-700 dark:text-gray-300"
          >
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <h1 className="text-2xl lg:text-4xl font-bold text-gray-900 dark:text-white">
            Services Hub
          </h1>
        </div>
        
        {/* Popular Services */}
        <div className="mb-10 lg:mb-14">
          <h2 className="text-lg lg:text-xl font-bold text-gray-900 dark:text-white mb-4 lg:mb-6 px-2 lg:px-0">
            Popular
          </h2>
          <div className="bg-gradient-to-br from-red-50/50 to-blue-50/50 dark:from-red-900/10 dark:to-blue-900/10 rounded-2xl lg:rounded-3xl p-6 lg:p-10">
            <div className="grid grid-cols-3 lg:grid-cols-5 gap-4 lg:gap-8">
              {popularServices.map((service, index) => (
                <ServiceCard key={index} service={service} />
              ))}
            </div>
          </div>
        </div>

        {/* Card Services */}
        <div className="mb-10 lg:mb-14">
          <h2 className="text-lg lg:text-xl font-bold text-gray-900 dark:text-white mb-4 lg:mb-6 px-2 lg:px-0">
            Card
          </h2>
          <div className="bg-gradient-to-br from-blue-50/50 to-green-50/50 dark:from-blue-900/10 dark:to-green-900/10 rounded-2xl lg:rounded-3xl p-6 lg:p-10">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-8">
              {cardServices.map((service, index) => (
                <ServiceCard key={index} service={service} />
              ))}
            </div>
          </div>
        </div>

        {/* Transaction Services */}
        <div className="mb-10 lg:mb-14">
          <h2 className="text-lg lg:text-xl font-bold text-gray-900 dark:text-white mb-4 lg:mb-6 px-2 lg:px-0">
            Transaction
          </h2>
          <div className="bg-gradient-to-br from-green-50/50 to-emerald-50/50 dark:from-green-900/10 dark:to-emerald-900/10 rounded-2xl lg:rounded-3xl p-6 lg:p-10">
            <div className="grid grid-cols-3 lg:grid-cols-6 gap-4 lg:gap-8">
              {transactionServices.map((service, index) => (
                <ServiceCard key={index} service={service} />
              ))}
            </div>
          </div>
        </div>

        {/* Support Services */}
        <div className="mb-8">
          <h2 className="text-lg lg:text-xl font-bold text-gray-900 dark:text-white mb-4 lg:mb-6 px-2 lg:px-0">
            Support
          </h2>
          <div className="bg-gradient-to-br from-orange-50/50 to-rose-50/50 dark:from-orange-900/10 dark:to-rose-900/10 rounded-2xl lg:rounded-3xl p-6 lg:p-10">
            <div className="grid grid-cols-3 lg:grid-cols-6 gap-4 lg:gap-8">
              {supportServices.map((service, index) => (
                <ServiceCard key={index} service={service} />
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}