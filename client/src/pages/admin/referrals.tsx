import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Users, Trophy, Search, Gift, TrendingUp } from "lucide-react";
import { useLocation } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function AdminReferrals() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");

  // Get all referrals
  const { data: referrals = [] } = useQuery({
    queryKey: ['/api/admin/referrals'],
    queryFn: () => apiRequest('GET', '/api/admin/referrals').then(res => res.json())
  });

  // Get referral statistics
  const { data: stats } = useQuery({
    queryKey: ['/api/admin/referrals/stats'],
    queryFn: () => apiRequest('GET', '/api/admin/referrals/stats').then(res => res.json())
  });

  // Update referral status
  const updateReferralMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      apiRequest('PATCH', `/api/admin/referrals/${id}`, { status }).then(res => res.json()),
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Referral status updated successfully"
      });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/referrals'] });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/referrals/stats'] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update referral status",
        variant: "destructive"
      });
    }
  });

  const filteredReferrals = referrals.filter((referral: any) =>
    referral.referrerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    referral.referredEmail?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-red-100 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900 relative overflow-hidden">
      
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-red-300 dark:bg-primary rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-300 dark:bg-blue-600 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-indigo-300 dark:bg-indigo-600 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 p-4 space-y-6">
        
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setLocation("/admin")}
            className="shrink-0 hover:bg-white/20 dark:hover:bg-gray-800/20"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Referral Management
          </h1>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm border border-white/30">
            <CardContent className="p-4 text-center">
              <Users className="h-6 w-6 text-blue-600 mx-auto mb-2" />
              <p className="text-lg font-bold text-gray-900 dark:text-white">{stats?.totalReferrals || 0}</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">Total Referrals</p>
            </CardContent>
          </Card>
          
          <Card className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm border border-white/30">
            <CardContent className="p-4 text-center">
              <Trophy className="h-6 w-6 text-primary mx-auto mb-2" />
              <p className="text-lg font-bold text-gray-900 dark:text-white">{stats?.successfulReferrals || 0}</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">Successful</p>
            </CardContent>
          </Card>
          
          <Card className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm border border-white/30">
            <CardContent className="p-4 text-center">
              <Gift className="h-6 w-6 text-primary mx-auto mb-2" />
              <p className="text-lg font-bold text-gray-900 dark:text-white">${stats?.totalRewards || 0}</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">Total Rewards</p>
            </CardContent>
          </Card>
          
          <Card className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm border border-white/30">
            <CardContent className="p-4 text-center">
              <TrendingUp className="h-6 w-6 text-orange-600 mx-auto mb-2" />
              <p className="text-lg font-bold text-gray-900 dark:text-white">{stats?.pendingReferrals || 0}</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">Pending</p>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <Card className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm border border-white/30">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Search className="h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search referrals by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border-0 bg-transparent"
              />
            </div>
          </CardContent>
        </Card>

        {/* Referrals Table */}
        <Card className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm border border-white/30">
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-white">All Referrals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredReferrals.length === 0 ? (
                <div className="text-center text-gray-600 dark:text-gray-400 py-8">
                  No referrals found
                </div>
              ) : (
                filteredReferrals.map((referral: any) => (
                  <div key={referral.id} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-4">
                        <div>
                          <p className="font-semibold text-gray-900 dark:text-white">
                            {referral.referrerName || 'Unknown User'}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            referred {referral.referredEmail || 'Unknown Email'}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-500">
                            Code: {referral.code} • Reward: ${referral.rewardAmount}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge 
                        variant={
                          referral.status === 'completed' ? 'default' :
                          referral.status === 'pending' ? 'secondary' : 'destructive'
                        }
                      >
                        {referral.status}
                      </Badge>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateReferralMutation.mutate({ 
                            id: referral.id, 
                            status: 'completed' 
                          })}
                          disabled={referral.status === 'completed' || updateReferralMutation.isPending}
                        >
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateReferralMutation.mutate({ 
                            id: referral.id, 
                            status: 'rejected' 
                          })}
                          disabled={referral.status === 'rejected' || updateReferralMutation.isPending}
                        >
                          Reject
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}