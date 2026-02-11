import { useState, useEffect } from "react";
import { useRoute, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2, CreditCard, Lock, Check, AlertCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { apiRequest } from "@/lib/queryClient";

interface PaymentLink {
  id: string;
  userId: string;
  title: string;
  description?: string;
  amount: string;
  currency: string;
  paymentOptions: string;
  customerEmail: string;
  customerName?: string;
  customerPhone?: string;
  txRef: string;
  redirectUrl?: string;
  logo?: string;
  status: string;
}

const cardFormSchema = z.object({
  cardNumber: z.string()
    .min(13, "Card number must be at least 13 digits")
    .max(19, "Card number must be at most 19 digits")
    .regex(/^\d+$/, "Card number must contain only digits"),
  cvv: z.string()
    .min(3, "CVV must be 3 or 4 digits")
    .max(4, "CVV must be 3 or 4 digits")
    .regex(/^\d+$/, "CVV must contain only digits"),
  expiryMonth: z.string()
    .min(1, "Month is required")
    .regex(/^(0[1-9]|1[0-2])$/, "Month must be between 01 and 12"),
  expiryYear: z.string()
    .min(2, "Year is required")
    .regex(/^\d{2}$/, "Year must be 2 digits"),
  pin: z.string().optional(),
  otp: z.string().optional(),
});

type CardFormValues = z.infer<typeof cardFormSchema>;

export default function CustomCheckoutPage() {
  const [, params] = useRoute("/checkout/:txRef");
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success' | 'failed' | 'requires_otp' | 'requires_pin'>('idle');
  const [flwRef, setFlwRef] = useState<string>("");
  const [authMessage, setAuthMessage] = useState<string>("");
  const [savedCardData, setSavedCardData] = useState<CardFormValues | null>(null);

  const { data: paymentLink, isLoading, error } = useQuery({
    queryKey: [`/api/public/payment-link/${params?.txRef}`],
    enabled: !!params?.txRef,
  });

  const form = useForm<CardFormValues>({
    resolver: zodResolver(cardFormSchema),
    defaultValues: {
      cardNumber: "",
      cvv: "",
      expiryMonth: "",
      expiryYear: "",
      pin: "",
      otp: "",
    },
  });

  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\s/g, '');
    const formatted = cleaned.match(/.{1,4}/g)?.join(' ') || cleaned;
    return formatted;
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\s/g, '');
    if (value.length <= 19) {
      form.setValue('cardNumber', value);
    }
  };

  const onSubmit = async (data: CardFormValues) => {
    if (!paymentLink) return;

    setPaymentStatus('processing');

    try {
      if (paymentStatus === 'requires_otp' && data.otp) {
        const validateResponse = await apiRequest("POST", "/api/payment/validate-charge", {
          flwRef,
          otp: data.otp,
        });

        const validateData = await validateResponse.json();

        if (validateData.status === 'success' && validateData.data.status === 'successful') {
          setPaymentStatus('success');
          setSavedCardData(null);
          toast({
            title: "Payment Successful!",
            description: `Payment of ${paymentLink.currency} ${paymentLink.amount} completed successfully.`,
          });
          setTimeout(() => {
            if (paymentLink.redirectUrl) {
              window.location.href = paymentLink.redirectUrl;
            }
          }, 2000);
        } else {
          setPaymentStatus('failed');
          setSavedCardData(null);
          toast({
            title: "Payment Failed",
            description: validateData.message || "Failed to validate OTP",
            variant: "destructive",
          });
        }
        return;
      }

      if (paymentStatus === 'requires_pin' && data.pin && savedCardData) {
        const chargeResponse = await apiRequest("POST", "/api/payment/charge-card", {
          txRef: params?.txRef,
          amount: paymentLink.amount,
          currency: paymentLink.currency,
          cardNumber: savedCardData.cardNumber,
          cvv: savedCardData.cvv,
          expiryMonth: savedCardData.expiryMonth,
          expiryYear: savedCardData.expiryYear,
          customerEmail: paymentLink.customerEmail,
          customerName: paymentLink.customerName,
          customerPhone: paymentLink.customerPhone,
          pin: data.pin,
        });

        const chargeData = await chargeResponse.json();

        if (chargeData.status === 'success' && chargeData.data.status === 'successful') {
          setPaymentStatus('success');
          setSavedCardData(null);
          toast({
            title: "Payment Successful!",
            description: `Payment of ${paymentLink.currency} ${paymentLink.amount} completed successfully.`,
          });
          setTimeout(() => {
            if (paymentLink.redirectUrl) {
              window.location.href = paymentLink.redirectUrl;
            }
          }, 2000);
        } else if (chargeData.status === 'success' && chargeData.data?.auth_model === 'otp') {
          setPaymentStatus('requires_otp');
          setFlwRef(chargeData.data.flw_ref);
          setAuthMessage("Please enter the OTP sent to your phone");
          toast({
            title: "OTP Required",
            description: "Please enter the OTP sent to your phone or email",
          });
        } else {
          setPaymentStatus('failed');
          setSavedCardData(null);
          toast({
            title: "Payment Failed",
            description: chargeData.message || "Failed to process payment with PIN",
            variant: "destructive",
          });
        }
        return;
      }

      const chargeResponse = await apiRequest("POST", "/api/payment/charge-card", {
        txRef: params?.txRef,
        amount: paymentLink.amount,
        currency: paymentLink.currency,
        cardNumber: data.cardNumber,
        cvv: data.cvv,
        expiryMonth: data.expiryMonth,
        expiryYear: data.expiryYear,
        customerEmail: paymentLink.customerEmail,
        customerName: paymentLink.customerName,
        customerPhone: paymentLink.customerPhone,
        pin: data.pin,
      });

      const chargeData = await chargeResponse.json();

      if (chargeData.status === 'success') {
        const authModel = chargeData.data?.auth_model || chargeData.data?.meta?.authorization?.mode;

        if (authModel === 'pin') {
          setPaymentStatus('requires_pin');
          setFlwRef(chargeData.data.flw_ref);
          setSavedCardData(data);
          setAuthMessage("This card requires a PIN. Please enter your card PIN to continue.");
          toast({
            title: "PIN Required",
            description: "Please enter your card PIN to continue with the payment",
          });
        } else if (authModel === 'otp') {
          setPaymentStatus('requires_otp');
          setFlwRef(chargeData.data.flw_ref);
          setSavedCardData(data);
          setAuthMessage(chargeData.message || "Please enter the OTP sent to your phone");
          toast({
            title: "OTP Required",
            description: "Please enter the OTP sent to your phone or email",
          });
        } else if (authModel === 'redirect' && chargeData.data?.meta?.authorization?.redirect) {
          window.location.href = chargeData.data.meta.authorization.redirect;
        } else if (chargeData.data.status === 'successful') {
          setPaymentStatus('success');
          setSavedCardData(null);
          toast({
            title: "Payment Successful!",
            description: `Payment of ${paymentLink.currency} ${paymentLink.amount} completed successfully.`,
          });
          setTimeout(() => {
            if (paymentLink.redirectUrl) {
              window.location.href = paymentLink.redirectUrl;
            }
          }, 2000);
        } else {
          setPaymentStatus('idle');
          toast({
            title: "Payment Processing",
            description: chargeData.message || "Payment is being processed",
          });
        }
      } else {
        setPaymentStatus('failed');
        setSavedCardData(null);
        toast({
          title: "Payment Failed",
          description: chargeData.message || "Failed to process payment",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      setPaymentStatus('failed');
      setSavedCardData(null);
      toast({
        title: "Error",
        description: error.message || "An error occurred while processing payment",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="flex items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !paymentLink) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-red-600">Payment Link Not Found</CardTitle>
            <CardDescription>
              The payment link you're looking for doesn't exist or has expired.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  if (paymentStatus === 'success') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
              <Check className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>
            <CardTitle className="text-green-600 dark:text-green-400">Payment Successful!</CardTitle>
            <CardDescription>
              Your payment of {paymentLink.currency} {paymentLink.amount} has been processed successfully.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center text-sm text-muted-foreground">
            You will be redirected shortly...
          </CardContent>
        </Card>
      </div>
    );
  }

  if (paymentStatus === 'failed') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-rose-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-900">
              <AlertCircle className="h-8 w-8 text-red-600 dark:text-red-400" />
            </div>
            <CardTitle className="text-red-600 dark:text-red-400">Payment Failed</CardTitle>
            <CardDescription>
              Your payment could not be processed. Please try again or contact support.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button
              onClick={() => {
                setPaymentStatus('idle');
                form.reset();
              }}
              variant="outline"
              data-testid="button-retry-payment"
            >
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Secure Payment
          </CardTitle>
          <CardDescription>
            {paymentLink.title}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6 p-4 bg-primary/5 rounded-lg border border-primary/10">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-muted-foreground">Amount</span>
              <span className="text-2xl font-bold text-primary">
                {paymentLink.currency} {paymentLink.amount}
              </span>
            </div>
            {paymentLink.description && (
              <p className="text-sm text-muted-foreground mt-2">{paymentLink.description}</p>
            )}
          </div>

          {paymentStatus === 'requires_otp' ? (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                  <p className="text-sm text-blue-800 dark:text-blue-200 mb-3">
                    {authMessage}
                  </p>
                  <FormField
                    control={form.control}
                    name="otp"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>OTP Code</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Enter 6-digit OTP"
                            maxLength={6}
                            data-testid="input-otp"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={paymentStatus === 'processing'}
                  data-testid="button-submit-otp"
                >
                  {paymentStatus === 'processing' ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    <>
                      <Lock className="mr-2 h-4 w-4" />
                      Verify OTP
                    </>
                  )}
                </Button>
              </form>
            </Form>
          ) : paymentStatus === 'requires_pin' ? (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800">
                  <p className="text-sm text-orange-800 dark:text-orange-200 mb-3">
                    {authMessage}
                  </p>
                  <FormField
                    control={form.control}
                    name="pin"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Card PIN</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="password"
                            placeholder="Enter 4-digit PIN"
                            maxLength={4}
                            data-testid="input-pin-required"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={paymentStatus === 'processing'}
                  data-testid="button-submit-pin"
                >
                  {paymentStatus === 'processing' ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Lock className="mr-2 h-4 w-4" />
                      Submit PIN
                    </>
                  )}
                </Button>
              </form>
            </Form>
          ) : (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="cardNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Card Number</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          value={formatCardNumber(field.value)}
                          onChange={(e) => {
                            const value = e.target.value.replace(/\s/g, '');
                            if (value.length <= 19) {
                              field.onChange(value);
                            }
                          }}
                          placeholder="1234 5678 9012 3456"
                          maxLength={23}
                          data-testid="input-card-number"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="expiryMonth"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Month</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="MM"
                            maxLength={2}
                            data-testid="input-expiry-month"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="expiryYear"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Year</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="YY"
                            maxLength={2}
                            data-testid="input-expiry-year"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="cvv"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>CVV</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="password"
                            placeholder="123"
                            maxLength={4}
                            data-testid="input-cvv"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="pin"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Card PIN (Optional)</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="password"
                          placeholder="Enter 4-digit PIN if required"
                          maxLength={4}
                          data-testid="input-pin"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Lock className="h-3 w-3" />
                  <span>Your payment information is secure and encrypted</span>
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={paymentStatus === 'processing'}
                  data-testid="button-pay"
                >
                  {paymentStatus === 'processing' ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Lock className="mr-2 h-4 w-4" />
                      Pay {paymentLink.currency} {paymentLink.amount}
                    </>
                  )}
                </Button>
              </form>
            </Form>
          )}

          <div className="mt-6 text-center text-xs text-muted-foreground">
            <p>Powered by Flutterwave</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
