import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import { LanguageProvider } from "@/components/language-provider";
import BottomNavigation from "@/components/bottom-navigation";
import Welcome from "@/pages/welcome";
import Login from "@/pages/login";
import Register from "@/pages/register";
import Home from "@/pages/home";
import Dashboard from "@/pages/dashboard";
import Wallet from "@/pages/wallet";
import Admin from "@/pages/admin";
import Cards from "@/pages/cards";
import Support from "@/pages/support";
import Account from "@/pages/account";
import Deposit from "@/pages/deposit";
import DepositOptions from "@/pages/deposit-options";
import AccountSettings from "@/pages/account-settings";
import SecurityPrivacy from "@/pages/security-privacy";
import Notifications from "@/pages/notifications";
import Send from "@/pages/send";
import Withdraw from "@/pages/withdraw";
import Scan from "@/pages/scan";
import Transactions from "@/pages/transactions";
import EditProfile from "@/pages/edit-profile";
import Webhooks from "@/pages/webhooks";

import KYCVerification from "@/pages/kyc-verification";
import CameraTest from "@/pages/camera-test";
import DocumentCapture from "@/pages/document-capture";
import NotFound from "@/pages/not-found";

function Router() {
  const { isAuthenticated, isLoading } = useAuth();
  const [location] = useLocation();

  // صفحات التحقق من الهوية التي يجب إخفاء الشريط السفلي منها
  const kycPages = [
    '/kyc-verification',
    '/document-capture'
  ];

  const shouldHideBottomNav = kycPages.includes(location);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
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
            <Route path="/dashboard" component={Dashboard} />
            <Route path="/" component={() => { window.location.href = '/dashboard'; return null; }} />
            <Route path="/home" component={() => { window.location.href = '/dashboard'; return null; }} />
            <Route path="/wallet" component={Wallet} />
            <Route path="/admin" component={Admin} />
            <Route path="/cards" component={Cards} />
            <Route path="/support" component={Support} />
            <Route path="/account" component={Account} />
            <Route path="/deposit" component={Deposit} />
            <Route path="/deposit/options" component={DepositOptions} />
            <Route path="/account/settings" component={AccountSettings} />
            <Route path="/account/security" component={SecurityPrivacy} />
            <Route path="/account/notifications" component={Notifications} />
            <Route path="/send" component={Send} />
            <Route path="/withdraw" component={Withdraw} />
            <Route path="/scan" component={Scan} />
            <Route path="/transactions" component={Transactions} />
            <Route path="/edit-profile" component={EditProfile} />

            <Route path="/kyc-verification" component={KYCVerification} />
            <Route path="/document-capture" component={DocumentCapture} />
            <Route path="/camera-test" component={CameraTest} />
            <Route path="/webhooks" component={Webhooks} />
          </>
        )}
        <Route component={NotFound} />
      </Switch>
      {isAuthenticated && !shouldHideBottomNav && <BottomNavigation />}
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <TooltipProvider>
          <div className="min-h-screen bg-background">
            <Toaster />
            <Router />
          </div>
        </TooltipProvider>
      </LanguageProvider>
    </QueryClientProvider>
  );
}

export default App;
