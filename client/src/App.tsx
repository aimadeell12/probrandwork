import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import BottomNavigation from "@/components/bottom-navigation";
import Login from "@/pages/login";
import Register from "@/pages/register";
import Home from "@/pages/home";
import Dashboard from "@/pages/dashboard";
import Wallet from "@/pages/wallet";
import Admin from "@/pages/admin";
import Cards from "@/pages/cards";
import Support from "@/pages/support";
import Account from "@/pages/account";
import NotFound from "@/pages/not-found";

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

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
            <Route path="/" component={Login} />
            <Route path="/login" component={Login} />
            <Route path="/register" component={Register} />
          </>
        ) : (
          <>
            <Route path="/" component={Home} />
            <Route path="/home" component={Home} />
            <Route path="/dashboard" component={Dashboard} />
            <Route path="/wallet" component={Wallet} />
            <Route path="/admin" component={Admin} />
            <Route path="/cards" component={Cards} />
            <Route path="/support" component={Support} />
            <Route path="/account" component={Account} />
          </>
        )}
        <Route component={NotFound} />
      </Switch>
      {isAuthenticated && <BottomNavigation />}
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div dir="rtl" className="min-h-screen bg-background">
          <Toaster />
          <Router />
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
