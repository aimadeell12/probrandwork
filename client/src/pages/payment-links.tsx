import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Link2, Copy, CheckCircle2, XCircle, Clock, ExternalLink, CreditCard } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const paymentLinkFormSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().optional(),
  amount: z.string().min(1, "Amount is required"),
  currency: z.string().default("NGN"),
  paymentOptions: z.string().default("card"),
  customerEmail: z.string().email("Invalid email address"),
  customerName: z.string().optional(),
  customerPhone: z.string().optional(),
  redirectUrl: z.string().url().optional().or(z.literal("")),
  logo: z.string().url().optional().or(z.literal("")),
});

type PaymentLinkFormValues = z.infer<typeof paymentLinkFormSchema>;

export default function PaymentLinksPage() {
  const { toast } = useToast();
  const [copied, setCopied] = useState<string | null>(null);

  const { data: paymentLinks, isLoading } = useQuery({
    queryKey: ["/api/payment-links"],
  });

  const { data: transactions } = useQuery({
    queryKey: ["/api/payment/transactions"],
  });

  const createLinkMutation = useMutation({
    mutationFn: async (data: PaymentLinkFormValues) => {
      return await apiRequest("POST", "/api/payment-links", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/payment-links"] });
      toast({
        title: "Success",
        description: "Payment link created successfully",
      });
      form.reset();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create payment link",
        variant: "destructive",
      });
    },
  });

  const disableLinkMutation = useMutation({
    mutationFn: async (id: string) => {
      return await apiRequest("POST", `/api/payment-links/${id}/disable`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/payment-links"] });
      toast({
        title: "Success",
        description: "Payment link disabled successfully",
      });
    },
  });

  const form = useForm<PaymentLinkFormValues>({
    resolver: zodResolver(paymentLinkFormSchema),
    defaultValues: {
      title: "",
      description: "",
      amount: "",
      currency: "NGN",
      paymentOptions: "card",
      customerEmail: "",
      customerName: "",
      customerPhone: "",
      redirectUrl: "",
      logo: "",
    },
  });

  const onSubmit = (data: PaymentLinkFormValues) => {
    createLinkMutation.mutate(data);
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
    toast({
      title: "Copied!",
      description: "Payment link copied to clipboard",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-500";
      case "disabled": return "bg-red-500";
      case "expired": return "bg-gray-500";
      default: return "bg-blue-500";
    }
  };

  const getTransactionStatusBadge = (status: string) => {
    switch (status) {
      case "successful":
        return <Badge className="bg-green-600" data-testid="badge-successful"><CheckCircle2 className="w-3 h-3 mr-1" /> Successful</Badge>;
      case "failed":
        return <Badge className="bg-red-600" data-testid="badge-failed"><XCircle className="w-3 h-3 mr-1" /> Failed</Badge>;
      case "pending":
        return <Badge className="bg-yellow-600" data-testid="badge-pending"><Clock className="w-3 h-3 mr-1" /> Pending</Badge>;
      default:
        return <Badge data-testid="badge-unknown">{status}</Badge>;
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2" data-testid="heading-payment-links">Flutterwave Payment Links</h1>
        <p className="text-muted-foreground">Create and manage payment links for card payments</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle data-testid="heading-create-link">Create Payment Link</CardTitle>
              <CardDescription>Generate a new payment link for your customers</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input placeholder="Product Purchase" {...field} data-testid="input-title" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Payment for services rendered" {...field} data-testid="input-description" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="amount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Amount</FormLabel>
                          <FormControl>
                            <Input type="number" placeholder="1000" {...field} data-testid="input-amount" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="currency"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Currency</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger data-testid="select-currency">
                                <SelectValue placeholder="Select currency" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="NGN">NGN (Nigerian Naira)</SelectItem>
                              <SelectItem value="USD">USD (US Dollar)</SelectItem>
                              <SelectItem value="GBP">GBP (British Pound)</SelectItem>
                              <SelectItem value="EUR">EUR (Euro)</SelectItem>
                              <SelectItem value="KES">KES (Kenyan Shilling)</SelectItem>
                              <SelectItem value="GHS">GHS (Ghana Cedi)</SelectItem>
                              <SelectItem value="ZAR">ZAR (South African Rand)</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="customerEmail"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Customer Email</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="[email protected]" {...field} data-testid="input-email" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="customerName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Customer Name (Optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="John Doe" {...field} data-testid="input-customer-name" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="customerPhone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Customer Phone (Optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="+234800000000" {...field} data-testid="input-phone" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="paymentOptions"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Payment Options</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger data-testid="select-payment-options">
                              <SelectValue placeholder="Select payment method" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="card">Card Only</SelectItem>
                            <SelectItem value="card,account">Card & Bank Account</SelectItem>
                            <SelectItem value="card,ussd">Card & USSD</SelectItem>
                            <SelectItem value="card,mobilemoney">Card & Mobile Money</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>Choose payment methods to accept</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={createLinkMutation.isPending}
                    data-testid="button-create-link"
                  >
                    <Link2 className="w-4 h-4 mr-2" />
                    {createLinkMutation.isPending ? "Creating..." : "Create Payment Link"}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle data-testid="heading-your-links">Your Payment Links</CardTitle>
              <CardDescription>Manage and track your payment links</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center py-8 text-muted-foreground">Loading...</div>
              ) : paymentLinks && Array.isArray(paymentLinks) && paymentLinks.length > 0 ? (
                <div className="space-y-4">
                  {paymentLinks.map((link: any) => (
                    <div key={link.id} className="border rounded-lg p-4 space-y-3" data-testid={`link-item-${link.txRef}`}>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-lg" data-testid={`link-title-${link.txRef}`}>{link.title}</h3>
                            <Badge className={getStatusColor(link.status)} data-testid={`link-status-${link.txRef}`}>
                              {link.status}
                            </Badge>
                          </div>
                          {link.description && (
                            <p className="text-sm text-muted-foreground mt-1">{link.description}</p>
                          )}
                          <div className="flex items-center gap-4 mt-2 text-sm">
                            <span className="font-medium" data-testid={`link-amount-${link.txRef}`}>
                              {link.currency} {parseFloat(link.amount).toLocaleString()}
                            </span>
                            <span className="text-muted-foreground">
                              {link.customerEmail}
                            </span>
                          </div>
                        </div>
                      </div>

                      {link.flutterwaveLink && (
                        <div className="flex items-center gap-2 bg-muted p-2 rounded">
                          <input
                            type="text"
                            value={link.flutterwaveLink}
                            readOnly
                            className="flex-1 bg-transparent text-sm outline-none"
                            data-testid={`link-url-${link.txRef}`}
                          />
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => copyToClipboard(link.flutterwaveLink, link.id)}
                            data-testid={`button-copy-${link.txRef}`}
                          >
                            {copied === link.id ? (
                              <CheckCircle2 className="w-4 h-4 text-green-600" />
                            ) : (
                              <Copy className="w-4 h-4" />
                            )}
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => window.open(link.flutterwaveLink, '_blank')}
                            data-testid={`button-open-${link.txRef}`}
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Button>
                        </div>
                      )}

                      <div className="flex items-center justify-between pt-2 border-t">
                        <span className="text-xs text-muted-foreground">
                          Created: {new Date(link.createdAt).toLocaleDateString()}
                        </span>
                        {link.status === 'active' && (
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => disableLinkMutation.mutate(link.txRef)}
                            disabled={disableLinkMutation.isPending}
                            data-testid={`button-disable-${link.txRef}`}
                          >
                            Disable Link
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Link2 className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No payment links yet. Create your first one!</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle data-testid="heading-transactions">Recent Transactions</CardTitle>
              <CardDescription>Track payments made via your links</CardDescription>
            </CardHeader>
            <CardContent>
              {transactions && Array.isArray(transactions) && transactions.length > 0 ? (
                <div className="space-y-3">
                  {transactions.slice(0, 10).map((tx: any) => (
                    <div key={tx.id} className="flex items-center justify-between border rounded-lg p-3" data-testid={`transaction-${tx.id}`}>
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-muted rounded">
                          <CreditCard className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="font-medium text-sm" data-testid={`transaction-email-${tx.id}`}>{tx.customerEmail}</p>
                          <p className="text-xs text-muted-foreground">
                            {tx.paymentMethod} • {new Date(tx.createdAt).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold" data-testid={`transaction-amount-${tx.id}`}>
                          {tx.currency} {parseFloat(tx.amount).toLocaleString()}
                        </p>
                        {getTransactionStatusBadge(tx.status)}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <CreditCard className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No transactions yet</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
