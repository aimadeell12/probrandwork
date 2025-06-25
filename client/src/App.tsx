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

  // Show offline screen when not connected to internet
  if (!isOnline) {
    return <OfflineError onRetry={checkNetwork} />;
  }

  // Show loading while checking authentication
  if (isLoading || networkLoading) {
    return <AppLoadingSkeleton />;
  }

  // If not authenticated, show limited routes
  if (!isAuthenticated) {
    return (
      <>
        <Switch>
          <Route path="/" component={Welcome} />
          <Route path="/welcome" component={Welcome} />
          <Route path="/login" component={Login} />
          <Route path="/register" component={Register} />
          <Route path="/camera-test" component={CameraTest} />
          <Route path="/about" component={About} />
          {/* Redirect all other routes to welcome page */}
          <Route>
            <Welcome />
          </Route>
        </Switch>
      </>
    );
  }

  return (
    <>
      <Switch>
        {/* Protected routes - only for authenticated users */}
            {/* Admin routes - most specific first */}
            <Route path="/admin/users" component={UserManagement} />
            <Route path="/admin/reports" component={SystemReports} />
            <Route path="/admin/settings" component={AdminSettings} />
            <Route path="/admin/bank-transfers" component={AdminBankTransfers} />
            <Route path="/admin/deposit-requests" component={DepositRequests} />
            <Route path="/admin/referrals" component={AdminReferrals} />
            <Route path="/admin/vouchers" component={AdminVouchers} />
            <Route path="/admin/currency" component={AdminCurrency} />
            <Route path="/admin/community" component={AdminCommunity} />
            <Route path="/admin-panel" component={AdminNavigation} />

            {/* Account routes */}
            <Route path="/account/settings" component={AccountSettings} />
            <Route path="/account/security" component={SecurityPrivacy} />
            <Route path="/account/notifications" component={Notifications} />
            <Route path="/account/language" component={LanguageSettings} />
            <Route path="/account/payment-password" component={PaymentPassword} />
            <Route path="/account/referral" component={Referral} />
            <Route path="/account/vouchers" component={Vouchers} />
            <Route path="/account/currency" component={Currency} />
            <Route path="/account/help" component={Help} />
            <Route path="/account/community" component={Community} />
            <Route path="/account" component={Account} />
            
            {/* Additional pages */}
            <Route path="/security-privacy" component={SecurityPrivacy} />
            <Route path="/about" component={About} />
            <Route path="/coupons" component={Coupons} />
            <Route path="/profile" component={Profile} />

            {/* Deposit routes */}
            <Route path="/deposit/options" component={DepositOptions} />
            <Route path="/deposit" component={Deposit} />

            {/* Cards routes */}
            <Route path="/cards/priority" component={PriorityCards} />
            <Route path="/choose-card" component={ChooseCard} />
            <Route path="/cards" component={Cards} />

            {/* Other specific routes */}
            <Route path="/dashboard" component={Dashboard} />
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

            {/* Root route - always redirect authenticated users to dashboard */}
            <Route path="/">
              {() => <Dashboard />}
            </Route>
            
            {/* Welcome route - completely blocked for authenticated users */}
            <Route path="/welcome">
              {() => <Dashboard />}
            </Route>
            
            {/* 404 for authenticated users */}
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
