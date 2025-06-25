import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import { LanguageProvider } from "@/hooks/useLanguage";
import { useNetwork } from "@/hooks/useNetwork";
import { OfflineError } from "@/components/OfflineError";
import { useEffect } from "react";
import { initializeMobileApp } from "@/lib/capacitor";
import BottomNavigation from "@/components/bottom-navigation";
import { AppLoadingSkeleton } from "@/components/skeletons";
import { ProtectedRoute } from "@/components/ProtectedRoute";

import Welcome from "@/pages/welcome";
import Login from "@/pages/login";
import Register from "@/pages/register";
import Dashboard from "@/pages/dashboard";
import Wallet from "@/pages/wallet";
import Cards from "@/pages/stripe-cards";
import Support from "@/pages/support";
import Account from "@/pages/account";
import Deposit from "@/pages/deposit";
import DepositOptions from "@/pages/deposit-options";
import AccountSettings from "@/pages/account-settings";
import SecurityPrivacy from "@/pages/security-privacy";
import Notifications from "@/pages/notifications";
import LanguageSettings from "@/pages/account/language";
import PaymentPassword from "@/pages/account/payment-password";
import About from "@/pages/about";
import Coupons from "@/pages/coupons";
import Profile from "@/pages/profile";
import Send from "@/pages/send";
import Withdraw from "@/pages/withdraw";
import Transactions from "@/pages/transactions";
import EditProfile from "@/pages/edit-profile";
import Services from "@/pages/services";
import Referral from "@/pages/account/referral";
import Vouchers from "@/pages/account/vouchers";
import Currency from "@/pages/account/currency";
import Help from "@/pages/account/help";
import Community from "@/pages/account/community";
import PriorityCards from "@/pages/cards/priority";
import ChooseCard from "@/pages/choose-card";

import KYCVerification from "@/pages/kyc-verification-new";
import KycManagement from "@/pages/kyc-management";
import AdminNavigation from "@/components/admin-navigation";
import UserManagement from "@/pages/admin/users";
import SystemReports from "@/pages/admin/reports";
import AdminSettings from "@/pages/admin/settings";
import AdminBankTransfers from "@/pages/admin/bank-transfers";
import AdminReferrals from "@/pages/admin/referrals";
import AdminVouchers from "@/pages/admin/vouchers";
import AdminCurrency from "@/pages/admin/currency";
import AdminCommunity from "@/pages/admin/community";
import DepositRequests from "@/pages/admin/deposit-requests";
import BinancePay from "@/pages/binance-pay";
import BankTransfer from "@/pages/bank-transfer";
import CameraTest from "@/pages/camera-test";
import NotFound from "@/pages/not-found";

function Router() {
  const { isAuthenticated, isLoading } = useAuth();
  const { isOnline, isLoading: networkLoading, checkNetwork } = useNetwork();
  const [location] = useLocation();

  // صفحات التحقق من الهوية التي يجب إخفاء الشريط السفلي منها
  const kycPages = [
    '/kyc-verification',
    '/choose-card'
  ];

  const shouldHideBottomNav = kycPages.includes(location);

  if (isLoading || networkLoading) {
    return <AppLoadingSkeleton />;
  }

  // Show offline screen when not connected to internet
  if (!isOnline) {
    return <OfflineError onRetry={checkNetwork} />;
  }

  return (
    <>
      <Switch>
        {!isAuthenticated ? (
          <>
            <Route path="/" component={Welcome} />
            <Route path="/welcome" component={Welcome} />
            <Route path="/login" component={Login} />
            <Route path="/register" component={Register} />
            <Route path="/camera-test" component={CameraTest} />
          </>
        ) : (
          <>
            {/* Admin routes - most specific first */}
            <Route path="/admin/users">
              <ProtectedRoute><UserManagement /></ProtectedRoute>
            </Route>
            <Route path="/admin/reports">
              <ProtectedRoute><SystemReports /></ProtectedRoute>
            </Route>
            <Route path="/admin/settings">
              <ProtectedRoute><AdminSettings /></ProtectedRoute>
            </Route>
            <Route path="/admin/bank-transfers">
              <ProtectedRoute><AdminBankTransfers /></ProtectedRoute>
            </Route>
            <Route path="/admin/deposit-requests">
              <ProtectedRoute><DepositRequests /></ProtectedRoute>
            </Route>
            <Route path="/admin/referrals">
              <ProtectedRoute><AdminReferrals /></ProtectedRoute>
            </Route>
            <Route path="/admin/vouchers">
              <ProtectedRoute><AdminVouchers /></ProtectedRoute>
            </Route>
            <Route path="/admin/currency">
              <ProtectedRoute><AdminCurrency /></ProtectedRoute>
            </Route>
            <Route path="/admin/community">
              <ProtectedRoute><AdminCommunity /></ProtectedRoute>
            </Route>
            <Route path="/admin-panel">
              <ProtectedRoute><AdminNavigation /></ProtectedRoute>
            </Route>

            {/* Account routes */}
            <Route path="/account/settings">
              <ProtectedRoute><AccountSettings /></ProtectedRoute>
            </Route>
            <Route path="/account/security">
              <ProtectedRoute><SecurityPrivacy /></ProtectedRoute>
            </Route>
            <Route path="/account/notifications">
              <ProtectedRoute><Notifications /></ProtectedRoute>
            </Route>
            <Route path="/account/language">
              <ProtectedRoute><LanguageSettings /></ProtectedRoute>
            </Route>
            <Route path="/account/payment-password">
              <ProtectedRoute><PaymentPassword /></ProtectedRoute>
            </Route>
            <Route path="/account/referral">
              <ProtectedRoute><Referral /></ProtectedRoute>
            </Route>
            <Route path="/account/vouchers">
              <ProtectedRoute><Vouchers /></ProtectedRoute>
            </Route>
            <Route path="/account/currency">
              <ProtectedRoute><Currency /></ProtectedRoute>
            </Route>
            <Route path="/account/help">
              <ProtectedRoute><Help /></ProtectedRoute>
            </Route>
            <Route path="/account/community">
              <ProtectedRoute><Community /></ProtectedRoute>
            </Route>
            <Route path="/account">
              <ProtectedRoute><Account /></ProtectedRoute>
            </Route>
            
            {/* Additional pages */}
            <Route path="/security-privacy">
              <ProtectedRoute><SecurityPrivacy /></ProtectedRoute>
            </Route>
            <Route path="/about" component={About} />
            <Route path="/coupons">
              <ProtectedRoute><Coupons /></ProtectedRoute>
            </Route>
            <Route path="/profile">
              <ProtectedRoute><Profile /></ProtectedRoute>
            </Route>

            {/* Deposit routes */}
            <Route path="/deposit/options">
              <ProtectedRoute><DepositOptions /></ProtectedRoute>
            </Route>
            <Route path="/deposit">
              <ProtectedRoute><Deposit /></ProtectedRoute>
            </Route>

            {/* Cards routes */}
            <Route path="/cards/priority">
              <ProtectedRoute><PriorityCards /></ProtectedRoute>
            </Route>
            <Route path="/choose-card">
              <ProtectedRoute><ChooseCard /></ProtectedRoute>
            </Route>
            <Route path="/cards">
              <ProtectedRoute><Cards /></ProtectedRoute>
            </Route>

            {/* Other specific routes */}
            <Route path="/dashboard">
              <ProtectedRoute><Dashboard /></ProtectedRoute>
            </Route>
            <Route path="/wallet" component={Wallet} />
            <Route path="/support" component={Support} />
            <Route path="/send" component={Send} />
            <Route path="/withdraw" component={Withdraw} />
            <Route path="/transactions" component={Transactions} />
            <Route path="/edit-profile" component={EditProfile} />
            <Route path="/kyc-verification" component={KYCVerification} />
            <Route path="/kyc-management" component={KycManagement} />
            <Route path="/bank-transfer" component={BankTransfer} />
            <Route path="/binance-pay" component={BinancePay} />
            <Route path="/services" component={Services} />
            <Route path="/hub" component={Services} />
            <Route path="/camera-test" component={CameraTest} />

            {/* Root route - last */}
            <Route path="/" component={Dashboard} />
          </>
        )}
        <Route component={NotFound} />
      </Switch>
      {isAuthenticated && !shouldHideBottomNav && <BottomNavigation />}
    </>
  );
}

function App() {
  useEffect(() => {
    // Initialize mobile app features when component mounts
    initializeMobileApp();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <TooltipProvider>
          <div className="min-h-screen bg-background app-container native-scroll">
            <Toaster />
            <Router />
          </div>
        </TooltipProvider>
      </LanguageProvider>
    </QueryClientProvider>
  );
}

export default App;
