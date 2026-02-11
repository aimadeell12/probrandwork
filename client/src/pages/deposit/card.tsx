import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, CreditCard, Loader2, CheckCircle, XCircle } from "lucide-react";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";

declare global {
  interface Window {
    FlutterwaveCheckout: any;
  }
}

interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
}

export default function CardDeposit() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [amount, setAmount] = useState("");
  const [isFlutterwaveLoaded, setIsFlutterwaveLoaded] = useState(false);
  const [flutterwavePublicKey, setFlutterwavePublicKey] = useState<string | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success' | 'failed'>('idle');

  const { data: user, isLoading: isUserLoading } = useQuery<User>({
    queryKey: ['/api/auth/user'],
  });

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

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.flutterwave.com/v3.js';
    script.async = true;
    script.onload = () => setIsFlutterwaveLoaded(true);
    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  const quickAmounts = [10, 25, 50, 100, 250, 500];

  const handleDeposit = async () => {
    const depositAmount = parseFloat(amount);
    
    if (!depositAmount || depositAmount < 1) {
      toast({
        title: "Error",
        description: "Please enter a valid amount (minimum $1)",
        variant: "destructive",
      });
      return;
    }

    if (!isFlutterwaveLoaded || !flutterwavePublicKey) {
      toast({
        title: "Error",
        description: "Loading payment gateway, please wait...",
        variant: "destructive",
      });
      return;
    }

    if (isUserLoading) {
      toast({
        title: "Loading",
        description: "Please wait...",
        variant: "default",
      });
      return;
    }

    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in first",
        variant: "destructive",
      });
      setLocation('/login');
      return;
    }

    setPaymentStatus('processing');

    try {
      const initResponse = await fetch('/api/deposit/card/init', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: depositAmount }),
      });

      if (!initResponse.ok) {
        const errorData = await initResponse.json();
        throw new Error(errorData.message || 'Failed to initialize deposit');
      }

      const { txRef } = await initResponse.json();

      const modal = window.FlutterwaveCheckout({
        public_key: flutterwavePublicKey,
        tx_ref: txRef,
        amount: depositAmount,
        currency: 'USD',
        payment_options: 'card',
        customer: {
          email: user.email,
          name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email,
          phone_number: user.phone || '',
        },
        customizations: {
          title: 'Deposit Balance',
          description: `Deposit $${depositAmount} to wallet`,
          logo: '',
        },
        callback: async function(data: any) {
          console.log('Payment callback:', data);
          modal.close();
          
          if (data.status === 'successful') {
            try {
              const verifyResponse = await fetch(`/api/deposit/card/verify/${data.transaction_id}`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  txRef: txRef,
                  amount: depositAmount,
                }),
              });

              if (verifyResponse.ok) {
                setPaymentStatus('success');
                toast({
                  title: "Deposit Successful!",
                  description: `$${depositAmount} has been added to your balance`,
                });
                setTimeout(() => {
                  setLocation('/wallet');
                }, 2000);
              } else {
                setPaymentStatus('failed');
                toast({
                  title: "Verification Error",
                  description: "An error occurred while verifying the payment",
                  variant: "destructive",
                });
              }
            } catch (error) {
              console.error('Verification error:', error);
              setPaymentStatus('failed');
            }
          } else {
            setPaymentStatus('failed');
            toast({
              title: "Payment Failed",
              description: "The payment was not completed successfully",
              variant: "destructive",
            });
          }
        },
        onclose: function() {
          if (paymentStatus === 'processing') {
            setPaymentStatus('idle');
          }
        },
      });
    } catch (error) {
      console.error('Payment error:', error);
      setPaymentStatus('idle');
      toast({
        title: "Error",
        description: "An error occurred while opening the payment gateway",
        variant: "destructive",
      });
    }
  };

  if (paymentStatus === 'success') {
    return (
      <div className="min-h-screen bg-[#0f0f23] text-white flex items-center justify-center">
        <div className="text-center space-y-4 p-8">
          <div className="w-20 h-20 mx-auto bg-primary/20 rounded-full flex items-center justify-center">
            <CheckCircle className="w-12 h-12 text-green-400" />
          </div>
          <h2 className="text-2xl font-bold">Deposit Successful!</h2>
          <p className="text-gray-400">${amount} has been added to your balance</p>
          <Button
            onClick={() => setLocation('/wallet')}
            className="mt-4 bg-primary hover:bg-red-700"
            data-testid="button-go-to-wallet"
          >
            Go to Wallet
          </Button>
        </div>
      </div>
    );
  }

  if (paymentStatus === 'failed') {
    return (
      <div className="min-h-screen bg-[#0f0f23] text-white flex items-center justify-center">
        <div className="text-center space-y-4 p-8">
          <div className="w-20 h-20 mx-auto bg-primary/20 rounded-full flex items-center justify-center">
            <XCircle className="w-12 h-12 text-red-400" />
          </div>
          <h2 className="text-2xl font-bold">Deposit Failed</h2>
          <p className="text-gray-400">The payment was not completed successfully</p>
          <Button
            onClick={() => setPaymentStatus('idle')}
            className="mt-4 bg-primary hover:bg-red-700"
            data-testid="button-try-again"
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f0f23] text-white pb-24">
      <div className="max-w-md mx-auto px-4 py-6">
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setLocation("/deposit")}
            className="p-2 hover:bg-primary/20 text-gray-400 hover:text-white"
            data-testid="button-back"
          >
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <h1 className="text-xl font-bold text-white">Card Deposit</h1>
        </div>

        <div className="bg-[#3a1010] rounded-2xl p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
              <CreditCard className="h-6 w-6 text-blue-400" />
            </div>
            <div>
              <h3 className="font-semibold text-white">Credit Card</h3>
              <p className="text-sm text-gray-400">Visa, Mastercard</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-2">Deposit Amount (USD)</label>
              <Input
                type="number"
                placeholder="Enter amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="bg-[#0f0f23] border-[#4a1515] text-white text-lg h-14 text-center"
                data-testid="input-amount"
              />
            </div>

            <div className="grid grid-cols-3 gap-2">
              {quickAmounts.map((quickAmount) => (
                <Button
                  key={quickAmount}
                  variant="outline"
                  onClick={() => setAmount(quickAmount.toString())}
                  className={`border-[#4a1515] hover:border-red-500 hover:bg-primary/10 ${
                    amount === quickAmount.toString() 
                      ? 'border-red-500 bg-primary/10 text-red-400' 
                      : 'text-gray-300'
                  }`}
                  data-testid={`button-amount-${quickAmount}`}
                >
                  ${quickAmount}
                </Button>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-[#3a1010]/60 rounded-xl p-4 mb-6">
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-400">Processing Fee</span>
            <span className="text-gray-300">$0.00</span>
          </div>
          <div className="flex justify-between items-center text-sm mt-2">
            <span className="text-gray-400">Total Amount</span>
            <span className="text-white font-semibold">${amount || '0.00'}</span>
          </div>
        </div>

        <Button
          onClick={handleDeposit}
          disabled={!amount || paymentStatus === 'processing' || !isFlutterwaveLoaded || !flutterwavePublicKey || isUserLoading}
          className="w-full py-6 bg-primary hover:bg-red-700 text-white font-semibold rounded-xl text-lg"
          data-testid="button-deposit"
        >
          {paymentStatus === 'processing' ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Processing...
            </>
          ) : isUserLoading || !isFlutterwaveLoaded || !flutterwavePublicKey ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Loading...
            </>
          ) : (
            <>
              <CreditCard className="w-5 h-5 mr-2" />
              Deposit ${amount || '0'}
            </>
          )}
        </Button>

        <p className="text-center text-gray-500 text-sm mt-4">
          Secure and encrypted payment via Flutterwave
        </p>
      </div>
    </div>
  );
}
