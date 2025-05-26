import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Trash2, Webhook, Plus, CheckCircle, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface WebhookSubscription {
  id: string;
  subscribeUrl: string;
  status?: string;
  createdAt?: string;
}

export default function Webhooks() {
  const [subscribeUrl, setSubscribeUrl] = useState("");
  const { toast } = useToast();

  // Fetch existing webhook subscriptions
  const { data: subscriptions, isLoading } = useQuery<WebhookSubscription[]>({
    queryKey: ["/api/webhooks"],
  });

  // Subscribe to webhook mutation
  const subscribeMutation = useMutation({
    mutationFn: async (url: string) => {
      const response = await fetch("/api/webhooks/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ subscribeUrl: url }),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to subscribe to webhook");
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/webhooks"] });
      setSubscribeUrl("");
      toast({
        title: "Webhook Subscribed",
        description: "Successfully subscribed to webhook notifications",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Subscription Failed",
        description: error.message || "Failed to subscribe to webhook",
        variant: "destructive",
      });
    },
  });

  // Delete webhook subscription mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiRequest(`/api/webhooks/${id}`, {
        method: "DELETE",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/webhooks"] });
      toast({
        title: "Webhook Deleted",
        description: "Webhook subscription deleted successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Delete Failed",
        description: error.message || "Failed to delete webhook subscription",
        variant: "destructive",
      });
    },
  });

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subscribeUrl.trim()) return;
    
    // Basic URL validation
    try {
      new URL(subscribeUrl);
      subscribeMutation.mutate(subscribeUrl.trim());
    } catch {
      toast({
        title: "Invalid URL",
        description: "Please enter a valid webhook URL",
        variant: "destructive",
      });
    }
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this webhook subscription?")) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Webhook Management</h1>
        <p className="text-muted-foreground">
          Subscribe to real-time notifications from Reap's API for card events, transactions, and status changes.
        </p>
      </div>

      {/* Information Alert */}
      <Alert className="mb-6">
        <Webhook className="h-4 w-4" />
        <AlertDescription>
          Webhooks allow your system to receive real-time updates about card events. 
          Your webhook server must be publicly accessible and respond with a 200 status code.
        </AlertDescription>
      </Alert>

      {/* Subscribe Form */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Subscribe to Webhook
          </CardTitle>
          <CardDescription>
            Enter your webhook server URL to receive real-time notifications
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubscribe} className="flex gap-4">
            <Input
              placeholder="https://your-webhook-server.com/reap-webhook"
              value={subscribeUrl}
              onChange={(e) => setSubscribeUrl(e.target.value)}
              className="flex-1"
              disabled={subscribeMutation.isPending}
            />
            <Button 
              type="submit" 
              disabled={subscribeMutation.isPending || !subscribeUrl.trim()}
            >
              {subscribeMutation.isPending ? "Subscribing..." : "Subscribe"}
            </Button>
          </form>
          <p className="text-sm text-muted-foreground mt-2">
            Example: https://webhook-test.com/your-webhook-endpoint
          </p>
        </CardContent>
      </Card>

      {/* Webhook Subscriptions List */}
      <Card>
        <CardHeader>
          <CardTitle>Active Webhook Subscriptions</CardTitle>
          <CardDescription>
            Manage your current webhook subscriptions
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="text-muted-foreground mt-2">Loading subscriptions...</p>
            </div>
          ) : !subscriptions || subscriptions.length === 0 ? (
            <div className="text-center py-8">
              <Webhook className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No webhook subscriptions found</p>
              <p className="text-sm text-muted-foreground mt-1">
                Subscribe to your first webhook to start receiving real-time notifications
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {subscriptions.map((subscription) => (
                <div
                  key={subscription.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="font-medium">Active Subscription</span>
                      <Badge variant="secondary">ID: {subscription.id}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground font-mono">
                      {subscription.subscribeUrl}
                    </p>
                    {subscription.createdAt && (
                      <p className="text-xs text-muted-foreground mt-1">
                        Created: {new Date(subscription.createdAt).toLocaleString()}
                      </p>
                    )}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(subscription.id)}
                    disabled={deleteMutation.isPending}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Webhook Events Information */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Webhook Events</CardTitle>
          <CardDescription>
            Types of events your webhook will receive
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-blue-500 mt-0.5" />
              <div>
                <h4 className="font-medium">Transaction Events</h4>
                <p className="text-sm text-muted-foreground">
                  Receive notifications when transactions are created, authorized, or cleared
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-green-500 mt-0.5" />
              <div>
                <h4 className="font-medium">Card Status Changes</h4>
                <p className="text-sm text-muted-foreground">
                  Get notified when cards are activated, suspended, or cancelled
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-orange-500 mt-0.5" />
              <div>
                <h4 className="font-medium">Balance Updates</h4>
                <p className="text-sm text-muted-foreground">
                  Monitor real-time balance changes and fund transfers
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}