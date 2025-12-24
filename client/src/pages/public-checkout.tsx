import { useEffect, useState } from "react";
import { useRoute } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CreditCard, Loader2, CheckCircle2, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { PaymentLink } from "@shared/schema";

declare global {
  interface Window {
    FlutterwaveCheckout: any;
  }
}

export default function PublicCheckoutPage() {
  const [, params] = useRoute("/pay/:txRef");
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success' | 'failed'>('idle');
  const [isFlutterwaveLoaded, setIsFlutterwaveLoaded] = useState(false);
  const [flutterwavePublicKey, setFlutterwavePublicKey] = useState<string>('');

  const { data: paymentLink, isLoading, error } = useQuery<PaymentLink>({
    queryKey: [`/api/public/payment-link/${params?.txRef}`],
    enabled: !!params?.txRef,
  });

  // Fetch Flutterwave public key from backend
  useEffect(() => {
    fetch('/api/public/flutterwave-config')
      .then(res => res.json())
      .then(data => {
        if (data.publicKey) {
          setFlutterwavePublicKey(data.publicKey);
        }
      })
      .catch(err => console.error('Failed to fetch Flutterwave config:', err));
  }, []);

  // Load Flutterwave script
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.flutterwave.com/v3.js';
    script.async = true;
    script.onload = () => setIsFlutterwaveLoaded(true);
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handlePayment = () => {
    if (!paymentLink || !isFlutterwaveLoaded || !flutterwavePublicKey) return;

    setPaymentStatus('processing');

    const modal = window.FlutterwaveCheckout({
      public_key: flutterwavePublicKey,
      tx_ref: paymentLink.txRef,
      amount: parseFloat(paymentLink.amount),
      currency: paymentLink.currency || 'NGN',
      payment_options: paymentLink.paymentOptions || 'card',
      customer: {
        email: paymentLink.customerEmail,
        name: paymentLink.customerName || '',
        phone_number: paymentLink.customerPhone || '',
      },
      customizations: {
        title: paymentLink.title,
        description: paymentLink.description || '',
        logo: paymentLink.logo || '',
      },
      callback: function(data: any) {
        console.log('Payment callback:', data);
        if (data.status === 'successful') {
          setPaymentStatus('success');
          // Verify payment on backend
          fetch(`/api/public/payment-verify/${data.transaction_id}`, {
            method: 'POST',
          }).catch(console.error);
        } else {
          setPaymentStatus('failed');
        }
        modal.close();
      },
      onclose: function() {
        if (paymentStatus === 'processing') {
          setPaymentStatus('idle');
        }
      },
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center p-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-red-200/15 to-pink-200/15 dark:from-red-800/20 dark:to-pink-800/20 rounded-full blur-xl"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-blue-200/10 to-red-200/10 dark:from-blue-800/15 dark:to-red-800/15 rounded-full blur-xl"></div>
        <Card className="w-full max-w-md sm:max-w-lg relative z-10 shadow-lg border border-gray-200 dark:border-gray-700 dark:bg-gray-800">
          <CardContent className="pt-8 pb-8">
            <div className="flex items-center justify-center">
              <Loader2 className="w-8 h-8 animate-spin text-red-600 dark:text-red-400" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !paymentLink) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center p-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-red-200/15 to-pink-200/15 dark:from-red-800/20 dark:to-pink-800/20 rounded-full blur-xl"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-blue-200/10 to-red-200/10 dark:from-blue-800/15 dark:to-red-800/15 rounded-full blur-xl"></div>
        <Card className="w-full max-w-md sm:max-w-lg border-red-200 dark:border-red-800 shadow-lg relative z-10 dark:bg-gray-800">
          <CardHeader className="text-center space-y-3 pt-8">
            <div className="flex justify-center">
              <div className="p-3 bg-red-50 dark:bg-red-900/30 rounded-full">
                <XCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
              </div>
            </div>
            <CardTitle className="text-2xl text-gray-900 dark:text-white">Payment Link Not Found</CardTitle>
            <CardDescription className="text-base text-gray-600 dark:text-gray-400">
              This payment link is invalid or has expired.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  if (paymentLink.status !== 'active') {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center p-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-red-200/15 to-pink-200/15 dark:from-red-800/20 dark:to-pink-800/20 rounded-full blur-xl"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-blue-200/10 to-red-200/10 dark:from-blue-800/15 dark:to-red-800/15 rounded-full blur-xl"></div>
        <Card className="w-full max-w-md sm:max-w-lg border-orange-200 dark:border-orange-800 shadow-lg relative z-10 dark:bg-gray-800">
          <CardHeader className="text-center space-y-3 pt-8">
            <div className="flex justify-center">
              <div className="p-3 bg-orange-50 dark:bg-orange-900/30 rounded-full">
                <XCircle className="w-8 h-8 text-orange-600 dark:text-orange-400" />
              </div>
            </div>
            <CardTitle className="text-2xl text-gray-900 dark:text-white">Payment Link Inactive</CardTitle>
            <CardDescription className="text-base text-gray-600 dark:text-gray-400">
              This payment link has been disabled or expired.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center p-4 sm:p-6 md:p-8 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-br from-red-200/15 to-pink-200/15 dark:from-red-800/20 dark:to-pink-800/20 rounded-full blur-xl"></div>
      <div className="absolute bottom-0 left-0 w-32 h-32 sm:w-40 sm:h-40 bg-gradient-to-tr from-blue-200/10 to-red-200/10 dark:from-blue-800/15 dark:to-red-800/15 rounded-full blur-xl"></div>
      
      <Card className="w-full max-w-md sm:max-w-lg shadow-xl border border-gray-200 dark:border-gray-700 relative z-10 dark:bg-gray-800">
        <CardHeader className="text-center space-y-3 pt-8 pb-20 px-6 sm:px-8">
          {paymentLink.logo && (
            <div className="flex justify-center mb-2">
              <img src={paymentLink.logo} alt="Logo" className="h-16 sm:h-20 w-auto" />
            </div>
          )}
          <CardTitle className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
            {paymentLink.title}
          </CardTitle>
          {paymentLink.description && (
            <CardDescription className="text-base sm:text-lg text-gray-600 dark:text-gray-400">
              {paymentLink.description}
            </CardDescription>
          )}
        </CardHeader>

        <CardContent className="space-y-6 pb-8 px-6 sm:px-8">
          {/* Amount Display */}
          <div className="wallet-gradient rounded-xl sm:rounded-2xl p-6 sm:p-8 text-center shadow-lg">
            <p className="text-sm sm:text-base text-white/90 mb-2 font-medium">Amount to Pay</p>
            <p className="text-4xl sm:text-5xl font-bold text-white">
              {paymentLink.currency} {parseFloat(paymentLink.amount).toLocaleString()}
            </p>
          </div>

          {/* Customer Information */}
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-5 sm:p-6 space-y-3">
            <div className="flex justify-between items-center py-2 sm:py-3">
              <span className="text-sm sm:text-base text-gray-600 dark:text-gray-400 font-medium">Email</span>
              <span className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white break-all ml-4 text-right">{paymentLink.customerEmail}</span>
            </div>
            {paymentLink.customerName && (
              <div className="flex justify-between items-center py-2 sm:py-3 border-t border-gray-200 dark:border-gray-600">
                <span className="text-sm sm:text-base text-gray-600 dark:text-gray-400 font-medium">Name</span>
                <span className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white">{paymentLink.customerName}</span>
              </div>
            )}
            {paymentLink.customerPhone && (
              <div className="flex justify-between items-center py-2 sm:py-3 border-t border-gray-200 dark:border-gray-600">
                <span className="text-sm sm:text-base text-gray-600 dark:text-gray-400 font-medium">Phone</span>
                <span className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white">{paymentLink.customerPhone}</span>
              </div>
            )}
          </div>

          {/* Payment Status Messages */}
          {paymentStatus === 'success' && (
            <div className="bg-green-50 dark:bg-green-900/30 border-2 border-green-200 dark:border-green-700 rounded-xl p-5 sm:p-6">
              <div className="flex items-center gap-3 text-green-800 dark:text-green-300 mb-3">
                <div className="p-2 bg-green-100 dark:bg-green-900/50 rounded-full">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <p className="text-lg font-bold">Payment Successful!</p>
              </div>
              <p className="text-sm sm:text-base text-green-700 dark:text-green-400">
                Thank you for your payment. You will receive a confirmation email shortly.
              </p>
            </div>
          )}

          {paymentStatus === 'failed' && (
            <div className="bg-red-50 dark:bg-red-900/30 border-2 border-red-200 dark:border-red-700 rounded-xl p-5 sm:p-6">
              <div className="flex items-center gap-3 text-red-800 dark:text-red-300 mb-3">
                <div className="p-2 bg-red-100 dark:bg-red-900/50 rounded-full">
                  <XCircle className="w-6 h-6" />
                </div>
                <p className="text-lg font-bold">Payment Failed</p>
              </div>
              <p className="text-sm sm:text-base text-red-700 dark:text-red-400">
                Your payment was not successful. Please try again.
              </p>
            </div>
          )}

          {/* Payment Button */}
          {paymentStatus === 'idle' && (
            <Button
              onClick={handlePayment}
              disabled={!isFlutterwaveLoaded || !flutterwavePublicKey}
              className="w-full h-14 sm:h-16 text-lg sm:text-xl font-semibold wallet-gradient hover:opacity-90 transition-opacity shadow-lg rounded-xl"
              data-testid="button-pay-now"
            >
              {(!isFlutterwaveLoaded || !flutterwavePublicKey) ? (
                <>
                  <Loader2 className="w-5 h-5 sm:w-6 sm:h-6 mr-2 animate-spin" />
                  Loading...
                </>
              ) : (
                <>
                  <CreditCard className="w-5 h-5 sm:w-6 sm:h-6 mr-2" />
                  Pay Now
                </>
              )}
            </Button>
          )}

          {paymentStatus === 'processing' && (
            <Button
              disabled
              className="w-full h-14 sm:h-16 text-lg sm:text-xl font-semibold rounded-xl"
              data-testid="button-processing"
            >
              <Loader2 className="w-5 h-5 sm:w-6 sm:h-6 mr-2 animate-spin" />
              Processing Payment...
            </Button>
          )}

          {paymentStatus === 'success' && paymentLink.redirectUrl && (
            <Button
              onClick={() => window.location.href = paymentLink.redirectUrl!}
              className="w-full h-14 sm:h-16 text-lg sm:text-xl font-semibold wallet-gradient hover:opacity-90 transition-opacity shadow-lg rounded-xl"
              data-testid="button-continue"
            >
              Continue
            </Button>
          )}

          {paymentStatus === 'failed' && (
            <Button
              onClick={() => setPaymentStatus('idle')}
              className="w-full h-14 sm:h-16 text-lg sm:text-xl font-semibold rounded-xl border-2"
              variant="outline"
              data-testid="button-try-again"
            >
              Try Again
            </Button>
          )}

          {/* Security Badge */}
          <div className="flex items-center justify-center gap-3 text-xs sm:text-sm text-gray-500 dark:text-gray-400 pt-2 border-t border-gray-200 dark:border-gray-600">
            <Badge variant="outline" className="text-xs sm:text-sm px-3 py-1 dark:border-gray-600 dark:text-gray-300">
              <CreditCard className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5" />
              Secure Payment
            </Badge>
            <span className="text-gray-400 dark:text-gray-500">•</span>
            <span className="font-medium dark:text-gray-300">Powered by Flutterwave</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
