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
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Link2, Copy, CheckCircle2, XCircle, Clock, ExternalLink, CreditCard, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/hooks/useLanguage";
import KycWarning from "@/components/kyc-warning";

const paymentLinkFormSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().optional(),
  amount: z.string().min(1, "Amount is required"),
  currency: z.string().default("NGN"),
  paymentOptions: z.string().default("card"),
  customerEmail: z.string().min(1, "Customer email is required").email("Invalid email address"),
  customerName: z.string().optional(),
  customerPhone: z.string().optional(),
  redirectUrl: z.string().url().optional().or(z.literal("")),
  logo: z.string().url().optional().or(z.literal("")),
});

type PaymentLinkFormValues = z.infer<typeof paymentLinkFormSchema>;

export default function PaymentLinksPage() {
  const { language } = useLanguage();
  const { toast } = useToast();
  const [copied, setCopied] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const { data: paymentLinks, isLoading } = useQuery({
    queryKey: ["/api/payment-links"],
  });

  const { data: transactions } = useQuery({
    queryKey: ["/api/payment/transactions"],
  });

  const { data: kycStatus } = useQuery({
    queryKey: ["/api/user/kyc-status"],
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
      setDialogOpen(false);
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
      title: language === 'ar' ? "تم النسخ!" : "Copied!",
      description: language === 'ar' ? "تم نسخ رابط الدفع إلى الحافظة" : "Payment link copied to clipboard",
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
        return <Badge className="bg-green-600 text-xs" data-testid="badge-successful"><CheckCircle2 className="w-2.5 h-2.5 lg:w-3 lg:h-3 mr-1" /> Successful</Badge>;
      case "failed":
        return <Badge className="bg-primary text-xs" data-testid="badge-failed"><XCircle className="w-2.5 h-2.5 lg:w-3 lg:h-3 mr-1" /> Failed</Badge>;
      case "pending":
        return <Badge className="bg-yellow-600 text-xs" data-testid="badge-pending"><Clock className="w-2.5 h-2.5 lg:w-3 lg:h-3 mr-1" /> Pending</Badge>;
      default:
        return <Badge className="text-xs" data-testid="badge-unknown">{status}</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-background pb-24 lg:pb-6">
      <div className="container mx-auto px-3 pt-0 pb-3 lg:p-6 max-w-7xl">
        {/* Info Banner */}
        <div className="mb-4 lg:mb-6 bg-gradient-to-r from-red-50 to-blue-50 dark:from-red-900/20 dark:to-blue-900/20 border border-red-200 dark:border-red-700/50 rounded-lg p-3 lg:p-4">
          <div className="flex items-start gap-3">
            <CreditCard className="w-5 h-5 text-primary dark:text-red-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-sm lg:text-base text-gray-900 dark:text-white mb-1">Payment Link Acceptance via Bank Card</h3>
              <p className="text-xs lg:text-sm text-gray-700 dark:text-gray-300">
                Create secure payment links that accept payments directly via bank cards. Share the link with your customers to receive payments instantly.
              </p>
            </div>
          </div>
        </div>

        <div className="mb-4 lg:mb-8 pt-3 lg:pt-0 flex items-center justify-between">
          <div>
            <h1 className="text-xl lg:text-3xl font-bold mb-1 lg:mb-2" data-testid="heading-payment-links">Payment Links</h1>
            <p className="text-xs lg:text-sm text-muted-foreground">Create and manage payment links</p>
          </div>
          
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-primary hover:to-pink-600">
                <Plus className="w-4 h-4 mr-2" />
                Create Payment Link
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto p-4 md:p-6">
              <DialogHeader className="mb-4">
                <DialogTitle>Create New Payment Link</DialogTitle>
                <DialogDescription>
                  Generate a new payment link for your customers
                </DialogDescription>
              </DialogHeader>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem className="mb-3">
                        <FormLabel className="text-sm font-medium mb-1.5 block">Title</FormLabel>
                        <FormControl>
                          <Input placeholder="Product Purchase" {...field} data-testid="input-title" className="h-9 border border-input bg-background dark:bg-gray-800 dark:border-gray-600" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem className="mb-3">
                        <FormLabel className="text-sm font-medium mb-1.5 block">Description</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Payment for services rendered" {...field} data-testid="input-description" className="min-h-[80px] border border-input bg-background dark:bg-gray-800 dark:border-gray-600" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-3">
                    <FormField
                      control={form.control}
                      name="amount"
                      render={({ field }) => (
                        <FormItem className="mb-0">
                          <FormLabel className="text-sm font-medium mb-1.5 block">Amount</FormLabel>
                          <FormControl>
                            <Input type="number" placeholder="1000" {...field} data-testid="input-amount" className="h-9 border border-input bg-background dark:bg-gray-800 dark:border-gray-600" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="currency"
                      render={({ field }) => (
                        <FormItem className="mb-0">
                          <FormLabel className="text-sm font-medium mb-1.5 block">Currency</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger data-testid="select-currency" className="h-9 border border-input bg-background dark:bg-gray-800 dark:border-gray-600">
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
                      <FormItem className="mb-3">
                        <FormLabel className="text-sm font-medium mb-1.5 block">Customer Email</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="[email protected]" {...field} data-testid="input-email" className="h-9 border border-input bg-background dark:bg-gray-800 dark:border-gray-600" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="customerName"
                    render={({ field }) => (
                      <FormItem className="mb-3">
                        <FormLabel className="text-sm font-medium mb-1.5 block">Customer Name (Optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="John Doe" {...field} data-testid="input-customer-name" className="h-9 border border-input bg-background dark:bg-gray-800 dark:border-gray-600" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="customerPhone"
                    render={({ field }) => (
                      <FormItem className="mb-3">
                        <FormLabel className="text-sm font-medium mb-1.5 block">Customer Phone (Optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="+234800000000" {...field} data-testid="input-phone" className="h-9 border border-input bg-background dark:bg-gray-800 dark:border-gray-600" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="paymentOptions"
                    render={({ field }) => (
                      <FormItem className="mb-4">
                        <FormLabel className="text-sm font-medium mb-1.5 block">Payment Options</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger data-testid="select-payment-options" className="h-9 border border-input bg-background dark:bg-gray-800 dark:border-gray-600">
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
                        <FormDescription className="text-xs mt-1">Choose payment methods to accept</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button 
                    type="submit" 
                    className="w-full mt-2" 
                    disabled={createLinkMutation.isPending}
                    data-testid="button-create-link"
                  >
                    <Link2 className="w-4 h-4 mr-2" />
                    {createLinkMutation.isPending ? "Creating..." : "Create Payment Link"}
                  </Button>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="space-y-4 lg:space-y-6">
          <Card>
            <CardHeader className="p-4 lg:p-6">
              <CardTitle className="text-base lg:text-lg" data-testid="heading-your-links">Your Payment Links</CardTitle>
              <CardDescription className="text-xs lg:text-sm">Manage and track your payment links</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center py-8 text-muted-foreground">Loading...</div>
              ) : paymentLinks && Array.isArray(paymentLinks) && paymentLinks.length > 0 ? (
                <div className="space-y-4">
                  {paymentLinks.map((link: any) => (
                    <div key={link.id} className="border rounded-lg p-3 lg:p-4 space-y-2 lg:space-y-3" data-testid={`link-item-${link.txRef}`}>
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="font-semibold text-sm lg:text-lg truncate" data-testid={`link-title-${link.txRef}`}>{link.title}</h3>
                            <Badge className={getStatusColor(link.status)} data-testid={`link-status-${link.txRef}`}>
                              {link.status}
                            </Badge>
                          </div>
                          {link.description && (
                            <p className="text-xs lg:text-sm text-muted-foreground mt-1 line-clamp-2">{link.description}</p>
                          )}
                          <div className="mt-2">
                            <span className="font-medium text-sm lg:text-base" data-testid={`link-amount-${link.txRef}`}>
                              {link.currency} {parseFloat(link.amount).toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </div>

                      {link.flutterwaveLink && (
                        <div className="flex items-center gap-1 lg:gap-2 bg-muted p-2 rounded">
                          <div className="flex-1 min-w-0 overflow-hidden">
                            <p className="text-xs truncate" data-testid={`link-url-${link.txRef}`}>
                              {link.flutterwaveLink}
                            </p>
                          </div>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-8 w-8 p-0 flex-shrink-0"
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
                            className="h-8 w-8 p-0 flex-shrink-0"
                            onClick={() => window.open(link.flutterwaveLink, '_blank')}
                            data-testid={`button-open-${link.txRef}`}
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Button>
                        </div>
                      )}

                      <div className="flex items-center justify-between pt-2 border-t">
                        <span className="text-xs text-muted-foreground">
                          {new Date(link.createdAt).toLocaleDateString()}
                        </span>
                        {link.status === 'active' && (
                          <Button
                            size="sm"
                            variant="destructive"
                            className="h-7 text-xs px-2 lg:h-8 lg:text-sm lg:px-3"
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
            <CardHeader className="p-4 lg:p-6">
              <CardTitle className="text-base lg:text-lg" data-testid="heading-transactions">Recent Transactions</CardTitle>
              <CardDescription className="text-xs lg:text-sm">Track payments made via your links</CardDescription>
            </CardHeader>
            <CardContent>
              {transactions && Array.isArray(transactions) && transactions.length > 0 ? (
                <div className="space-y-3">
                  {transactions.slice(0, 10).map((tx: any) => (
                    <div key={tx.id} className="flex items-center justify-between border rounded-lg p-2 lg:p-3" data-testid={`transaction-${tx.id}`}>
                      <div className="flex items-center gap-2 lg:gap-3 flex-1 min-w-0">
                        <div className="p-1.5 lg:p-2 bg-muted rounded flex-shrink-0">
                          <CreditCard className="w-3.5 h-3.5 lg:w-4 lg:h-4" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-xs lg:text-sm truncate" data-testid={`transaction-method-${tx.id}`}>{tx.paymentMethod || 'Payment'}</p>
                          <p className="text-xs text-muted-foreground truncate">
                            {new Date(tx.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0 ml-2">
                        <p className="font-semibold text-xs lg:text-sm" data-testid={`transaction-amount-${tx.id}`}>
                          {tx.currency} {parseFloat(tx.amount).toLocaleString()}
                        </p>
                        <div className="mt-1">
                          {getTransactionStatusBadge(tx.status)}
                        </div>
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
