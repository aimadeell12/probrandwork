import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import Login from "@/pages/login";
import Home from "@/pages/home";
import Dashboard from "@/pages/dashboard";
import Wallet from "@/pages/wallet";
import Admin from "@/pages/admin";
import Cards from "@/pages/cards";
import Support from "@/pages/support";
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
    <Switch>
      {!isAuthenticated ? (
        <Route path="/" component={Login} />
      ) : (
        <>
          <Route path="/" component={Wallet} />
          <Route path="/home" component={Home} />
          <Route path="/dashboard" component={Dashboard} />
          <Route path="/admin" component={Admin} />
          <Route path="/cards" component={Cards} />
          <Route path="/support" component={Support} />
        </>
      )}
      <Route component={NotFound} />
    </Switch>
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
