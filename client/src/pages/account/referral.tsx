import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Copy, Share, Users, DollarSign, Gift } from "lucide-react";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

export default function Referral() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { user } = useAuth();
  const [referralCode, setReferralCode] = useState("");

  // Get user's referral data
  const { data: referralData, isLoading } = useQuery({
    queryKey: ['/api/referrals/my-data'],
    queryFn: () => apiRequest('GET', '/api/referrals/my-data').then(res => res.json())
  });

  // Get referral statistics
  const { data: stats } = useQuery({
    queryKey: ['/api/referrals/stats'],
    queryFn: () => apiRequest('GET', '/api/referrals/stats').then(res => res.json())
  });

  useEffect(() => {
    if (referralData?.referralCode) {
      setReferralCode(referralData.referralCode);
    }
  }, [referralData]);

  const copyReferralCode = () => {
    navigator.clipboard.writeText(referralCode);
    toast({
      title: "Copied!",
      description: "Referral code copied to clipboard",
    });
  };

  const shareReferral = () => {
    const shareText = `Join me on this amazing wallet platform! Use my referral code: ${referralCode}`;
    
    if (navigator.share) {
      navigator.share({
        title: "Join My wallet Platform",
        text: shareText,
        url: window.location.origin,
      });
    } else {
      navigator.clipboard.writeText(shareText);
      toast({
        title: "Shared!",
        description: "Referral link copied to clipboard",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-pink-50 to-red-100 dark:from-gray-900 dark:via-red-900 dark:to-red-900 relative overflow-hidden">
      
      {/* Background decorative elements */}
      <div className="absolute top-0 right-0 w-32 h-32 sm:w-48 sm:h-48 lg:w-64 lg:h-64 bg-gradient-to-br from-red-200/30 to-pink-200/30 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-48 h-48 sm:w-72 sm:h-72 lg:w-96 lg:h-96 bg-gradient-to-tr from-red-200/20 to-pink-200/20 rounded-full blur-3xl"></div>
      
      <div className="px-4 sm:px-6 lg:px-8 py-6 pb-20 relative z-10">
        
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setLocation("/services")}
            className="p-2 hover:bg-red-100 dark:hover:bg-red-900/30"
          >
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">
            Referral Program
          </h1>
        </div>

        {/* Referral Stats */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <Card className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm border border-white/30">
            <CardContent className="p-4 text-center">
              <Users className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats?.friendsReferred || 0}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Friends Referred</p>
            </CardContent>
          </Card>
          
          <Card className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm border border-white/30">
            <CardContent className="p-4 text-center">
              <DollarSign className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900 dark:text-white">${stats?.totalEarnings || 0}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Earned</p>
            </CardContent>
          </Card>
        </div>

        {/* Referral Code Card */}
        <Card className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm border border-white/30 mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
              <Gift className="h-5 w-5" />
              Your Referral Code
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                value={referralCode}
                readOnly
                className="flex-1 text-center font-mono text-lg"
              />
              <Button onClick={copyReferralCode} variant="outline" size="icon">
                <Copy className="h-4 w-4" />
              </Button>
            </div>
            
            <Button 
              onClick={shareReferral}
              className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800"
            >
              <Share className="h-4 w-4 mr-2" />
              Share with Friends
            </Button>
          </CardContent>
        </Card>

        {/* How it Works */}
        <Card className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm border border-white/30">
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-white">How it Works</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-red-600 font-bold text-sm">1</span>
              </div>
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Share your code</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Send your referral code to friends</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-red-600 font-bold text-sm">2</span>
              </div>
              <div>
                <p className="font-medium text-gray-900 dark:text-white">They sign up</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Friend uses your code to create account</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-red-600 font-bold text-sm">3</span>
              </div>
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Earn rewards</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Get $25 for each successful referral</p>
              </div>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}