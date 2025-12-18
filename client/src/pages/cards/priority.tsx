import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Crown, Star, Shield, Zap, Phone, Globe, CreditCard, Check } from "lucide-react";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";

export default function PriorityCards() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  const priorityPlans = [
    {
      id: "gold",
      name: "Gold Priority",
      price: 29,
      color: "from-yellow-400 to-amber-500",
      icon: Star,
      features: [
        "24/7 Priority Support",
        "Higher Transaction Limits",
        "Reduced Fees",
        "Premium Card Design",
        "Monthly Reports",
        "Investment Insights"
      ],
      limits: {
        dailyLimit: "$25,000",
        monthlyLimit: "$100,000",
        transferFee: "0.5%"
      }
    },
    {
      id: "platinum",
      name: "Platinum Elite",
      price: 59,
      color: "from-gray-400 to-gray-600",
      icon: Crown,
      features: [
        "Everything in Gold",
        "Dedicated Account Manager",
        "Zero International Fees",
        "Airport Lounge Access",
        "Concierge Services",
        "Exclusive Investment Opportunities"
      ],
      limits: {
        dailyLimit: "$100,000",
        monthlyLimit: "Unlimited",
        transferFee: "Free"
      },
      popular: true
    },
    {
      id: "diamond",
      name: "Diamond VIP",
      price: 99,
      color: "from-blue-400 to-purple-600",
      icon: Shield,
      features: [
        "Everything in Platinum",
        "Private wallet Services",
        "Custom Card Design",
        "Personal Finance Advisor",
        "Exclusive Events Access",
        "White-glove Onboarding"
      ],
      limits: {
        dailyLimit: "Unlimited",
        monthlyLimit: "Unlimited",
        transferFee: "Free"
      }
    }
  ];

  const applyForPlan = (planId: string) => {
    setSelectedPlan(planId);
    const plan = priorityPlans.find(p => p.id === planId);
    toast({
      title: "Application Submitted",
      description: `Your application for ${plan?.name} has been submitted for review.`
    });
  };

  const bgColor = '#0f0a19';
  const cardBg = '#1a1230';
  const borderColor = '#2a2040';

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ backgroundColor: bgColor }}>
      
      <div className="px-4 sm:px-6 lg:px-8 py-6 pb-20 relative z-10">
        
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setLocation("/services")}
            className="p-2 text-purple-400 hover:bg-purple-500/20"
          >
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <h1 className="text-xl font-bold text-white">
            Priority Cards
          </h1>
        </div>

        {/* Hero Section */}
        <Card className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white mb-8 border-0">
          <CardContent className="p-6 text-center">
            <Crown className="h-12 w-12 mx-auto mb-4 text-yellow-300" />
            <h2 className="text-2xl font-bold mb-2">Unlock Premium wallet</h2>
            <p className="text-purple-100">Experience elevated wallet with priority support, exclusive benefits, and enhanced limits.</p>
          </CardContent>
        </Card>

        {/* Priority Plans */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {priorityPlans.map((plan) => {
            const Icon = plan.icon;
            return (
              <Card 
                key={plan.id} 
                className={`border relative ${plan.popular ? 'ring-2 ring-purple-500' : ''}`}
                style={{ backgroundColor: cardBg, borderColor: borderColor }}
              >
                {plan.popular && (
                  <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-purple-600">
                    Most Popular
                  </Badge>
                )}
                <CardHeader className="text-center">
                  <div className={`w-16 h-16 bg-gradient-to-r ${plan.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-white">{plan.name}</CardTitle>
                  <div className="text-3xl font-bold text-white">
                    ${plan.price}
                    <span className="text-sm font-normal text-gray-400">/month</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <h4 className="font-semibold text-white">Features:</h4>
                    <ul className="space-y-1">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-center gap-2 text-sm text-gray-400">
                          <Check className="h-4 w-4 text-green-400" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="font-semibold text-white">Limits:</h4>
                    <div className="text-sm text-gray-400 space-y-1">
                      <p>Daily: {plan.limits.dailyLimit}</p>
                      <p>Monthly: {plan.limits.monthlyLimit}</p>
                      <p>Transfer Fee: {plan.limits.transferFee}</p>
                    </div>
                  </div>
                  
                  <Button 
                    onClick={() => applyForPlan(plan.id)}
                    disabled={selectedPlan === plan.id}
                    className={`w-full ${
                      plan.popular 
                        ? 'bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 shadow-lg shadow-purple-500/30'
                        : 'bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-500 hover:to-gray-600'
                    }`}
                  >
                    {selectedPlan === plan.id ? 'Application Submitted' : 'Apply Now'}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Benefits Overview */}
        <Card className="border mb-6" style={{ backgroundColor: cardBg, borderColor: borderColor }}>
          <CardHeader>
            <CardTitle className="text-white">Priority Benefits</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Phone className="h-6 w-6 text-blue-400" />
                </div>
                <h3 className="font-semibold text-white text-sm">24/7 Support</h3>
                <p className="text-xs text-gray-400">Priority phone & chat</p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Zap className="h-6 w-6 text-green-400" />
                </div>
                <h3 className="font-semibold text-white text-sm">Fast Processing</h3>
                <p className="text-xs text-gray-400">Instant transfers</p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Globe className="h-6 w-6 text-purple-400" />
                </div>
                <h3 className="font-semibold text-white text-sm">Global Access</h3>
                <p className="text-xs text-gray-400">Worldwide benefits</p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-yellow-900/30 rounded-full flex items-center justify-center mx-auto mb-2">
                  <CreditCard className="h-6 w-6 text-yellow-400" />
                </div>
                <h3 className="font-semibold text-white text-sm">Premium Cards</h3>
                <p className="text-xs text-gray-400">Exclusive designs</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card className="border" style={{ backgroundColor: cardBg, borderColor: borderColor }}>
          <CardHeader>
            <CardTitle className="text-white">Need Help Choosing?</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-400 mb-4">
              Our priority specialists are available to help you select the perfect plan for your needs.
            </p>
            <div className="flex gap-4">
              <Button 
                variant="outline"
                onClick={() => setLocation("/support")}
                className="border-[#2a2040] text-gray-300 hover:bg-purple-500/20"
              >
                Contact Specialist
              </Button>
              <Button 
                variant="outline"
                className="border-[#2a2040] text-gray-300 hover:bg-purple-500/20"
              >
                Schedule Consultation
              </Button>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}