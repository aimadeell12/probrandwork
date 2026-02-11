import { ArrowLeft, Info, Shield, Zap, Globe, Users, Heart, CreditCard } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLocation } from "wouter";

export default function About() {
  const { t } = useLanguage();
  const [, setLocation] = useLocation();

  const features = [
    {
      icon: Shield,
      title: "Secure wallet",
      description: "Bank-level security with 256-bit encryption"
    },
    {
      icon: CreditCard,
      title: "Payment Link Acceptance",
      description: "Accept payments easily via bank card payment links"
    },
    {
      icon: Zap,
      title: "Instant Transfers",
      description: "Send money instantly to anyone, anywhere"
    },
    {
      icon: Globe,
      title: "International Support",
      description: "Support for multiple currencies and countries"
    },
    {
      icon: Users,
      title: "24/7 Support",
      description: "Round-the-clock customer service"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-pink-50 to-blue-50 dark:from-gray-900 dark:via-red-900 dark:to-blue-900 relative overflow-hidden pb-20">
      
      {/* Background decorative elements */}
      <div className="absolute top-0 right-0 w-32 h-32 sm:w-48 sm:h-48 lg:w-64 lg:h-64 bg-gradient-to-br from-red-200/30 to-pink-200/30 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-48 h-48 sm:w-72 sm:h-72 lg:w-96 lg:h-96 bg-gradient-to-tr from-blue-200/20 to-red-200/20 rounded-full blur-3xl"></div>
      
      {/* Header */}
      <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-red-200/30 dark:border-red-700/30 p-4 relative z-10">
        <div className="flex items-center space-x-4 space-x-reverse">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setLocation("/account")}
            className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20"
          >
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">
            About <span className="text-red-600">AppsPay</span>
          </h1>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-6 relative z-10 max-w-md space-y-6">
        
        {/* App Info */}
        <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-red-200/30 dark:border-red-700/30 shadow-lg">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-red-600 to-pink-600 rounded-2xl flex items-center justify-center mb-4">
              <Heart className="h-8 w-8 text-white" />
            </div>
            <CardTitle className="text-gray-900 dark:text-white">
              AppsPay v2.0.21
            </CardTitle>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Your trusted digital wallet companion
            </p>
          </CardHeader>
        </Card>

        {/* Features */}
        <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-red-200/30 dark:border-red-700/30 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-3 space-x-reverse text-gray-900 dark:text-white">
              <Info className="h-5 w-5 text-red-600 dark:text-red-400" />
              <span>Features</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {features.map((feature, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div className="rounded-lg p-2 bg-gradient-to-br from-red-100 to-red-200 dark:from-red-900/40 dark:to-red-800/40">
                  <feature.icon className="h-4 w-4 text-red-600 dark:text-red-300" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white text-sm">
                    {feature.title}
                  </h4>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Company Info */}
        <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-red-200/30 dark:border-red-700/30 shadow-lg">
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-white">
              About Us
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white text-sm">Developer</h4>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                APPS PAY TECHNOLOGY FOUNDATION
              </p>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white text-sm">Mission</h4>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                To provide secure, fast, and accessible digital wallet services for everyone.
              </p>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white text-sm">Vision</h4>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                A world where financial services are accessible to all, regardless of location.
              </p>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white text-sm">Contact</h4>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Email: sohaybmercury@gmail.com<br />
                Phone: +19134278758<br />
                Address: 920 N Tyler Rd Ste 304, Wichita, KS 67212, US
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Legal */}
        <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-red-200/30 dark:border-red-700/30 shadow-lg">
          <CardContent className="p-4 space-y-3">
            <Button
              variant="ghost"
              className="w-full justify-start text-sm text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400"
              onClick={() => setLocation("/legal/privacy")}
            >
              Privacy Policy
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start text-sm text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400"
              onClick={() => {/* Handle terms of service */}}
            >
              Terms of Service
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start text-sm text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400"
              onClick={() => {/* Handle licenses */}}
            >
              Open Source Licenses
            </Button>
          </CardContent>
        </Card>

        {/* Copyright */}
        <div className="text-center text-xs text-gray-500 dark:text-gray-400">
          © 2024 <span className="text-red-600">AppsPay</span>. All rights reserved.
        </div>
      </div>
    </div>
  );
}