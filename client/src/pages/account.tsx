import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { 
  Settings, 
  Shield, 
  CreditCard, 
  Bell, 
  HelpCircle, 
  LogOut,
  ChevronRight,
  Globe,
  User,
  Gift,
  Phone,
  Crown,
  FileCheck,
  MessageCircle,
  Trash2
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/hooks/useLanguage";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { LanguageToggle } from "@/components/language-toggle";
import { useLocation } from "wouter";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { useNativeInteractions } from "@/hooks/useNativeInteractions";
import PullToRefresh from "@/components/pull-to-refresh";
import { AccountSkeleton } from "@/components/skeletons";
import { Input } from "@/components/ui/input";

export default function Account() {
  const { user } = useAuth() as { user: any };
  const { t } = useLanguage();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const { triggerHaptic } = useNativeInteractions();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [confirmEmail, setConfirmEmail] = useState("");
  
  // Fetch user info
  const { data: userInfo, isLoading } = useQuery({
    queryKey: ["/api/auth/user"],
  });

  // Delete account mutation
  const deleteAccountMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("DELETE", "/api/user/account");
      return response;
    },
    onSuccess: () => {
      toast({
        title: "Account Deleted",
        description: "Your account has been successfully deleted",
      });
      window.location.href = "/login";
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: "Failed to delete account",
        variant: "destructive",
      });
    },
  });

  const userEmail = (userInfo as any)?.email || "";
  const isEmailMatch = confirmEmail.toLowerCase() === userEmail.toLowerCase();

  const handleDeleteAccount = () => {
    if (!isEmailMatch) {
      toast({
        title: "Email Mismatch",
        description: "Please enter your email address correctly to confirm deletion",
        variant: "destructive",
      });
      return;
    }
    deleteAccountMutation.mutate();
    setShowDeleteDialog(false);
    setConfirmEmail("");
  };

  const handleCloseDeleteDialog = (open: boolean) => {
    setShowDeleteDialog(open);
    if (!open) {
      setConfirmEmail("");
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { 
        method: 'POST',
        credentials: 'include'
      });
      window.location.href = "/login";
    } catch (error) {
      toast({
        title: t("error"),
        description: t("logoutError"),
        variant: "destructive",
      });
    }
  };

  const navigateTo = (path: string) => {
    setLocation(path);
  };

  const handleRefresh = async () => {
    triggerHaptic();
    await queryClient.invalidateQueries();
  };

  // Format phone number with masking
  const formatPhoneNumber = (phone: string) => {
    if (!phone) return "Phone not set";
    // Remove any non-digit characters
    const digits = phone.replace(/\D/g, '');
    // Format as XXX***XXXX
    if (digits.length >= 7) {
      const start = digits.slice(0, 3);
      const end = digits.slice(-4);
      return `${start}***${end}`;
    }
    return phone;
  };

  // Show skeleton while loading
  if (isLoading) {
    return <AccountSkeleton />;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-background w-full pb-24 lg:pb-6">
      <PullToRefresh onRefresh={handleRefresh}>
        {/* Header */}
        <div className="bg-white dark:bg-background lg:bg-transparent border-b lg:border-0 border-gray-100 dark:border-border p-4 lg:p-6 relative z-10">
          <div className="flex items-center justify-center">
            <h1 className="text-xl font-medium text-gray-900 dark:text-white">
              {userInfo ? `${(userInfo as any).firstName} ${(userInfo as any).lastName}` : 'My Account'}
            </h1>
          </div>
        </div>

        {/* Content */}
        <div className="container mx-auto px-3 lg:px-6 py-4 lg:py-6 relative z-10 max-w-sm lg:max-w-4xl">
        
        {/* User Profile Card */}
        <Card className="bg-gradient-to-br from-red-400 via-red-500 to-pink-500 text-white mb-4 shadow-lg border-0 rounded-2xl overflow-hidden lg:max-w-2xl lg:mx-auto">
          <CardContent className="p-4">
            <button 
              onClick={() => navigateTo("/profile")}
              className="w-full flex items-center space-x-3 hover:bg-white/10 transition-colors rounded-lg p-1"
            >
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <User className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1 text-left">
                <p className="text-white/90 text-sm font-medium mb-1">Hello!</p>
                <p className="text-white text-lg font-semibold">
                  {formatPhoneNumber(userInfo ? (userInfo as any).phone : "")}
                </p>
              </div>
              <ChevronRight className="h-5 w-5 text-white/70" />
            </button>
          </CardContent>
        </Card>

        {/* Menu Items */}
        {/* Settings Group */}
        <Card className="bg-white/80 dark:bg-background backdrop-blur-sm border-red-200/30 dark:border-border shadow-lg mb-3 rounded-xl overflow-hidden">
          <CardContent className="p-0">
            <button 
              onClick={() => navigateTo("/account/language")} 
              className="w-full p-3 flex items-center justify-between hover:bg-red-50/50 dark:hover:bg-red-900/20 transition-colors border-b border-red-100/30 dark:border-red-700/30 last:border-b-0"
            >
              <div className="flex items-center space-x-3">
                <div className="rounded-lg p-1.5">
                  <Globe className="h-5 w-5 text-red-600 dark:text-red-400" />
                </div>
                <span className="text-gray-900 dark:text-white font-medium text-sm">
                  Language
                </span>
              </div>
              <ChevronRight className="h-4 w-4 text-gray-400" />
            </button>
            
            <button 
              onClick={() => navigateTo("/kyc-verification")} 
              className="w-full p-3 flex items-center justify-between hover:bg-red-50/50 dark:hover:bg-red-900/20 transition-colors border-b border-red-100/30 dark:border-red-700/30"
            >
              <div className="flex items-center space-x-3">
                <div className="rounded-lg p-1.5">
                  <FileCheck className="h-5 w-5 text-red-600 dark:text-red-400" />
                </div>
                <span className="text-gray-900 dark:text-white font-medium text-sm">
                  Identity Verification
                </span>
              </div>
              <ChevronRight className="h-4 w-4 text-gray-400" />
            </button>

            <button 
              onClick={() => navigateTo("/account/payment-password")} 
              className="w-full p-3 flex items-center justify-between hover:bg-red-50/50 dark:hover:bg-red-900/20 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <div className="rounded-lg p-1.5">
                  <Settings className="h-5 w-5 text-red-600 dark:text-red-400" />
                </div>
                <span className="text-gray-900 dark:text-white font-medium text-sm">
                  Setting Payment Password
                </span>
              </div>
              <ChevronRight className="h-4 w-4 text-gray-400" />
            </button>
          </CardContent>
        </Card>

        {/* Support Group */}
        <Card className="bg-white/80 dark:bg-background backdrop-blur-sm border-red-200/30 dark:border-border shadow-lg mb-3 rounded-xl overflow-hidden">
          <CardContent className="p-0">
            <button 
              onClick={() => navigateTo("/customer-service")} 
              className="w-full p-3 flex items-center justify-between hover:bg-red-50/50 dark:hover:bg-red-900/20 transition-colors border-b border-red-100/30 dark:border-red-700/30"
            >
              <div className="flex items-center space-x-3">
                <div className="rounded-lg p-1.5">
                  <Phone className="h-5 w-5 text-red-600 dark:text-red-400" />
                </div>
                <span className="text-gray-900 dark:text-white font-medium text-sm">
                  Customer Service
                </span>
              </div>
              <ChevronRight className="h-4 w-4 text-gray-400" />
            </button>
            
            <button 
              onClick={() => navigateTo("/security-privacy")} 
              className="w-full p-3 flex items-center justify-between hover:bg-red-50/50 dark:hover:bg-red-900/20 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <div className="rounded-lg p-1.5">
                  <Shield className="h-5 w-5 text-red-600 dark:text-red-400" />
                </div>
                <span className="text-gray-900 dark:text-white font-medium text-sm">
                  Security Settings
                </span>
              </div>
              <ChevronRight className="h-4 w-4 text-gray-400" />
            </button>
          </CardContent>
        </Card>

        {/* Cards & Services Group */}
        <Card className="bg-white/80 dark:bg-background backdrop-blur-sm border-red-200/30 dark:border-border shadow-lg mb-3 rounded-xl overflow-hidden">
          <CardContent className="p-0">
            <button 
              onClick={() => navigateTo("/card-purchase-record")} 
              className="w-full p-3 flex items-center justify-between hover:bg-red-50/50 dark:hover:bg-red-900/20 transition-colors border-b border-red-100/30 dark:border-red-700/30"
            >
              <div className="flex items-center space-x-3">
                <div className="rounded-lg p-1.5">
                  <CreditCard className="h-5 w-5 text-red-600 dark:text-red-400" />
                </div>
                <span className="text-gray-900 dark:text-white font-medium text-sm">
                  Card Purchase Record
                </span>
              </div>
              <ChevronRight className="h-4 w-4 text-gray-400" />
            </button>
            
            <button 
              onClick={() => navigateTo("/coupons")} 
              className="w-full p-3 flex items-center justify-between hover:bg-red-50/50 dark:hover:bg-red-900/20 transition-colors border-b border-red-100/30 dark:border-red-700/30"
            >
              <div className="flex items-center space-x-3">
                <div className="rounded-lg p-1.5">
                  <Gift className="h-5 w-5 text-red-600 dark:text-red-400" />
                </div>
                <span className="text-gray-900 dark:text-white font-medium text-sm">
                  Coupons
                </span>
              </div>
              <ChevronRight className="h-4 w-4 text-gray-400" />
            </button>
            
            <button 
              onClick={() => navigateTo("/about")} 
              className="w-full p-3 flex items-center justify-between hover:bg-red-50/50 dark:hover:bg-red-900/20 transition-colors border-b border-red-100/30 dark:border-red-700/30"
            >
              <div className="flex items-center space-x-3">
                <div className="rounded-lg p-1.5">
                  <HelpCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                </div>
                <div className="flex-1 text-left">
                  <span className="text-gray-900 dark:text-white font-medium text-sm block">
                    About <span className="text-red-600">AppsPay</span>
                  </span>
                </div>
                <span className="text-gray-400 text-xs mr-2">v2.0.21</span>
              </div>
              <ChevronRight className="h-4 w-4 text-gray-400" />
            </button>

            <button 
              onClick={() => navigateTo("/legal/privacy")} 
              className="w-full p-3 flex items-center justify-between hover:bg-red-50/50 dark:hover:bg-red-900/20 transition-colors border-b border-red-100/30 dark:border-red-700/30 last:border-b-0"
            >
              <div className="flex items-center space-x-3">
                <div className="rounded-lg p-1.5">
                  <Shield className="h-5 w-5 text-red-600 dark:text-red-400" />
                </div>
                <span className="text-gray-900 dark:text-white font-medium text-sm">
                  Privacy Policy
                </span>
              </div>
              <ChevronRight className="h-4 w-4 text-gray-400" />
            </button>

            <button 
              onClick={() => navigateTo("/aml-policy")} 
              className="w-full p-3 flex items-center justify-between hover:bg-red-50/50 dark:hover:bg-red-900/20 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <div className="rounded-lg p-1.5">
                  <FileCheck className="h-5 w-5 text-red-600 dark:text-red-400" />
                </div>
                <span className="text-gray-900 dark:text-white font-medium text-sm">
                  AML Policy
                </span>
              </div>
              <ChevronRight className="h-4 w-4 text-gray-400" />
            </button>
          </CardContent>
        </Card>

        {/* Admin Panel - Only show for admin users */}
        {user && user.role === "admin" && (
          <Card className="bg-gradient-to-r from-red-500/10 to-pink-500/10 dark:from-red-900/20 dark:to-pink-900/20 backdrop-blur-sm border-red-300/50 dark:border-red-600/50 shadow-lg mb-3 rounded-xl overflow-hidden">
            <CardContent className="p-0">
              <button 
                onClick={() => navigateTo("/admin-panel")}
                className="w-full p-3 flex items-center justify-between hover:bg-red-50/70 dark:hover:bg-red-900/30 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <div className="rounded-lg p-1.5 bg-gradient-to-r from-red-600 to-pink-600">
                    <Crown className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1 text-left">
                    <span className="text-red-700 dark:text-red-300 font-semibold text-sm block">
                      Admin Panel
                    </span>
                    <span className="text-red-600/70 dark:text-red-400/70 text-xs">
                      Manage platform settings
                    </span>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-red-500" />
              </button>
            </CardContent>
          </Card>
        )}

        {/* Logout & Delete Account */}
        <Card className="bg-white/80 dark:bg-background backdrop-blur-sm border-red-200/30 dark:border-border shadow-lg rounded-xl overflow-hidden mb-24 lg:mb-6">
          <CardContent className="p-0">
            <button 
              onClick={handleLogout}
              className="w-full p-3 flex items-center justify-between hover:bg-red-50/50 dark:hover:bg-red-900/20 transition-colors border-b border-red-100/30 dark:border-red-700/30"
              data-testid="button-logout"
            >
              <div className="flex items-center space-x-3">
                <div className="rounded-lg p-1.5">
                  <LogOut className="h-5 w-5 text-red-600 dark:text-red-400" />
                </div>
                <span className="text-red-600 dark:text-red-400 font-medium text-sm">
                  Log out
                </span>
              </div>
              <ChevronRight className="h-4 w-4 text-gray-400" />
            </button>
            
            <button 
              onClick={() => setShowDeleteDialog(true)}
              className="w-full p-3 flex items-center justify-between hover:bg-red-50/50 dark:hover:bg-red-900/20 transition-colors"
              data-testid="button-delete-account"
            >
              <div className="flex items-center space-x-3">
                <div className="rounded-lg p-1.5">
                  <Trash2 className="h-5 w-5 text-red-600 dark:text-red-400" />
                </div>
                <span className="text-red-600 dark:text-red-400 font-medium text-sm">
                  Delete Account
                </span>
              </div>
              <ChevronRight className="h-4 w-4 text-gray-400" />
            </button>
          </CardContent>
        </Card>
        </div>
      </PullToRefresh>

      {/* Delete Account Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={handleCloseDeleteDialog}>
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-red-600">Confirm Account Deletion</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete your account? All your data will be permanently deleted and cannot be recovered.
              <div className="mt-4">
                <p className="text-sm font-medium mb-2">Enter your email to confirm:</p>
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={confirmEmail}
                  onChange={(e) => setConfirmEmail(e.target.value)}
                  className="w-full"
                  data-testid="input-confirm-email"
                />
                {userEmail && (
                  <p className="text-xs text-gray-500 mt-1">Your email: {userEmail}</p>
                )}
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteAccount}
              className="bg-red-600 hover:bg-red-700 text-white"
              disabled={deleteAccountMutation.isPending || !isEmailMatch}
            >
              {deleteAccountMutation.isPending ? "Deleting..." : "Delete Account"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}