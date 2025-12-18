import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Bell, Menu, ChevronDown, ChevronRight, Building2, Wallet, Check } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";
import NotificationCenter from "@/components/notification-center";
import { useLocation, Link } from "wouter";
import { useToast } from "@/hooks/use-toast";

interface ExchangeRate {
  id: string;
  fromCurrency: string;
  toCurrency: string;
  rate: string;
  lastUpdated: string;
}

export default function Dashboard() {
  const { t } = useLanguage();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [isNotificationCenterOpen, setIsNotificationCenterOpen] = useState(false);
  const [sendAmount, setSendAmount] = useState("0.00");
  const [sendCurrency, setSendCurrency] = useState("USD");
  const [receiveCurrency, setReceiveCurrency] = useState("EUR");
  const [showSendCurrencyDropdown, setShowSendCurrencyDropdown] = useState(false);
  const [showReceiveCurrencyDropdown, setShowReceiveCurrencyDropdown] = useState(false);
  
  const { data: userInfo } = useQuery<any>({
    queryKey: ["/api/auth/user"],
  });

  const { data: notificationsData } = useQuery<any>({
    queryKey: ["/api/notifications/unread-count"],
  });

  const { data: walletData } = useQuery<any>({
    queryKey: ["/api/wallet/balance"],
  });

  const { data: exchangeRates } = useQuery<ExchangeRate[]>({
    queryKey: ["/api/currency/rates"],
  });

  const unreadCount = notificationsData?.count || 0;
  const walletBalance = walletData?.balance || 0;

  const getFirstName = () => {
    if (userInfo?.firstName) {
      return userInfo.firstName;
    }
    return "User";
  };

  const currencies = [
    { code: "USD", flag: "🇺🇸", symbol: "$", name: "US Dollar" },
    { code: "EUR", flag: "🇪🇺", symbol: "€", name: "Euro" },
    { code: "GBP", flag: "🇬🇧", symbol: "£", name: "British Pound" },
    { code: "MAD", flag: "🇲🇦", symbol: "د.م", name: "Moroccan Dirham" },
    { code: "AED", flag: "🇦🇪", symbol: "د.إ", name: "UAE Dirham" },
    { code: "SAR", flag: "🇸🇦", symbol: "﷼", name: "Saudi Riyal" },
  ];

  const getSendCurrencyData = () => currencies.find(c => c.code === sendCurrency) || currencies[0];
  const getReceiveCurrencyData = () => currencies.find(c => c.code === receiveCurrency) || currencies[1];

  const getExchangeRate = (): { rate: number; found: boolean } => {
    if (!exchangeRates || exchangeRates.length === 0) {
      return { rate: 1.0, found: false };
    }
    
    // Try direct rate first
    const directRate = exchangeRates.find(
      r => r.fromCurrency === sendCurrency && r.toCurrency === receiveCurrency
    );
    
    if (directRate) {
      return { rate: parseFloat(directRate.rate), found: true };
    }
    
    // Try inverse rate
    const inverseRate = exchangeRates.find(
      r => r.fromCurrency === receiveCurrency && r.toCurrency === sendCurrency
    );
    
    if (inverseRate) {
      return { rate: 1 / parseFloat(inverseRate.rate), found: true };
    }
    
    // Same currency
    if (sendCurrency === receiveCurrency) {
      return { rate: 1.0, found: true };
    }
    
    return { rate: 1.0, found: false };
  };

  const rateInfo = getExchangeRate();
  const exchangeRate = rateInfo.rate;
  const hasValidRate = rateInfo.found;
  const fee = 0;
  const totalToPay = parseFloat(sendAmount) || 0;
  const receiverGets = (totalToPay * exchangeRate).toFixed(2);

  const handleContinue = () => {
    const amount = parseFloat(sendAmount);
    if (amount <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter an amount greater than 0.",
        variant: "destructive",
      });
      return;
    }

    if (amount > walletBalance) {
      toast({
        title: "Insufficient Balance",
        description: `Your wallet balance is $${Number(walletBalance).toFixed(2)}. Please add funds.`,
        variant: "destructive",
      });
      return;
    }

    if (!hasValidRate && sendCurrency !== receiveCurrency) {
      toast({
        title: "Exchange Rate Unavailable",
        description: `Cannot find exchange rate for ${sendCurrency} to ${receiveCurrency}. Please try a different currency pair.`,
        variant: "destructive",
      });
      return;
    }

    // Navigate to send page with the amount pre-filled
    setLocation(`/send?amount=${amount}&from=${sendCurrency}&to=${receiveCurrency}&rate=${exchangeRate}`);
  };

  const bgColor = '#0f0a19';
  const cardBg = '#1a1230';
  const inputBg = '#1f1730';
  const borderColor = '#2a2040';

  const handleSelectSendCurrency = (code: string) => {
    setSendCurrency(code);
    setShowSendCurrencyDropdown(false);
    if (code === receiveCurrency) {
      const other = currencies.find(c => c.code !== code);
      if (other) setReceiveCurrency(other.code);
    }
  };

  const handleSelectReceiveCurrency = (code: string) => {
    setReceiveCurrency(code);
    setShowReceiveCurrencyDropdown(false);
    if (code === sendCurrency) {
      const other = currencies.find(c => c.code !== code);
      if (other) setSendCurrency(other.code);
    }
  };

  return (
    <div 
      className="fixed inset-0 overflow-y-auto"
      style={{ backgroundColor: bgColor }}
    >
      <div className="min-h-full flex flex-col pb-24" style={{ backgroundColor: bgColor }}>
        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-4 sm:py-5">
          <Button 
            variant="ghost" 
            size="icon"
            className="text-purple-400 hover:bg-purple-500/20 rounded-full w-10 h-10 sm:w-11 sm:h-11"
          >
            <Menu className="w-5 h-5 sm:w-6 sm:h-6" />
          </Button>
          
          <h1 className="text-white font-semibold text-lg sm:text-xl">Send money</h1>
          
          <Button 
            variant="ghost" 
            size="icon"
            className="relative text-purple-400 hover:bg-purple-500/20 rounded-full w-10 h-10 sm:w-11 sm:h-11"
            onClick={() => setIsNotificationCenterOpen(true)}
            data-testid="button-notifications"
          >
            <Bell className="w-5 h-5 sm:w-6 sm:h-6" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </Button>
        </div>

        {/* Wallet Balance */}
        <div className="px-4 sm:px-6 mb-3">
          <div 
            className="rounded-xl sm:rounded-2xl p-3 sm:p-4 flex items-center justify-between"
            style={{ backgroundColor: '#1a1f35', border: `1px solid ${borderColor}` }}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-700 rounded-full flex items-center justify-center">
                <Wallet className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-gray-400 text-xs">Available Balance</p>
                <p className="text-white font-bold text-lg" data-testid="text-wallet-balance">
                  ${Number(walletBalance).toFixed(2)}
                </p>
              </div>
            </div>
            <Link href="/deposit">
              <Button 
                variant="outline" 
                size="sm" 
                className="border-purple-500 text-purple-400 hover:bg-purple-500/20"
                data-testid="button-add-funds"
              >
                Add Funds
              </Button>
            </Link>
          </div>
        </div>


        {/* You Send Section */}
        <div className="px-4 sm:px-6 mb-3 sm:mb-4">
          <div 
            className="rounded-xl sm:rounded-2xl p-4 sm:p-5"
            style={{ backgroundColor: cardBg, border: `1px solid ${borderColor}` }}
          >
            <p className="text-gray-400 text-xs sm:text-sm font-medium mb-2 sm:mb-3">You Send</p>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                <span className="text-purple-400 text-2xl sm:text-3xl font-light">{getSendCurrencyData().symbol}</span>
                <input
                  type="text"
                  value={sendAmount}
                  onChange={(e) => {
                    const val = e.target.value.replace(/[^0-9.]/g, '');
                    setSendAmount(val);
                  }}
                  className="bg-transparent text-white text-2xl sm:text-3xl font-semibold w-32 sm:w-40 outline-none"
                  placeholder="0.00"
                  data-testid="input-send-amount"
                />
              </div>
              
              <div className="relative">
                <div 
                  className="flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
                  style={{ backgroundColor: inputBg, border: `1px solid ${borderColor}` }}
                  onClick={() => setShowSendCurrencyDropdown(!showSendCurrencyDropdown)}
                  data-testid="dropdown-send-currency"
                >
                  <span className="text-xl sm:text-2xl">{getSendCurrencyData().flag}</span>
                  <span className="text-white font-medium text-sm sm:text-base">{sendCurrency}</span>
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </div>
                
                {showSendCurrencyDropdown && (
                  <div 
                    className="absolute right-0 top-full mt-2 z-50 rounded-xl overflow-hidden shadow-xl min-w-[180px]"
                    style={{ backgroundColor: cardBg, border: `1px solid ${borderColor}` }}
                  >
                    {currencies.map((c) => (
                      <div
                        key={c.code}
                        className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-purple-500/20 transition-colors"
                        onClick={() => handleSelectSendCurrency(c.code)}
                        data-testid={`option-send-${c.code}`}
                      >
                        <span className="text-xl">{c.flag}</span>
                        <div>
                          <p className="text-white font-medium text-sm">{c.code}</p>
                          <p className="text-gray-400 text-xs">{c.name}</p>
                        </div>
                        {c.code === sendCurrency && (
                          <Check className="w-4 h-4 text-green-400 ml-auto" />
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Fee Details Section */}
        <div className="px-4 sm:px-6 mb-3 sm:mb-4">
          <div 
            className="rounded-xl sm:rounded-2xl p-4 sm:p-5 space-y-3 sm:space-y-4"
            style={{ backgroundColor: cardBg, border: `1px solid ${borderColor}` }}
          >
            {/* Fee */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs sm:text-sm">✓</span>
                </div>
                <span className="text-gray-300 text-sm sm:text-base">Fee</span>
              </div>
              <span className="text-green-400 font-semibold text-sm sm:text-base" data-testid="text-fee">FREE</span>
            </div>

            {/* Total to pay */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center">
                  <Wallet className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
                </div>
                <span className="text-gray-300 text-sm sm:text-base">Total to pay</span>
              </div>
              <span className="text-white font-semibold text-sm sm:text-base" data-testid="text-total">
                {getSendCurrencyData().symbol}{totalToPay.toFixed(2)}
              </span>
            </div>

            {/* Rate */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className={`w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br ${hasValidRate ? 'from-orange-400 to-orange-600' : 'from-red-400 to-red-600'} rounded-full flex items-center justify-center`}>
                  <span className="text-white text-xs sm:text-sm">{hasValidRate ? '≈' : '!'}</span>
                </div>
                <span className="text-gray-300 text-sm sm:text-base">Rate</span>
              </div>
              {hasValidRate || sendCurrency === receiveCurrency ? (
                <span className="text-white font-medium text-xs sm:text-sm" data-testid="text-rate">
                  {getSendCurrencyData().symbol} 1 = {getReceiveCurrencyData().symbol} {exchangeRate.toFixed(6)}
                </span>
              ) : (
                <span className="text-red-400 font-medium text-xs sm:text-sm" data-testid="text-rate-error">
                  Rate unavailable
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Receiver Gets Section */}
        <div className="px-4 sm:px-6 mb-3 sm:mb-4">
          <div 
            className="rounded-xl sm:rounded-2xl p-4 sm:p-5"
            style={{ backgroundColor: cardBg, border: `1px solid ${borderColor}` }}
          >
            <p className="text-gray-400 text-xs sm:text-sm font-medium mb-2 sm:mb-3">Receiver Gets</p>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                <span className="text-purple-400 text-2xl sm:text-3xl font-light">{getReceiveCurrencyData().symbol}</span>
                <span className="text-white text-2xl sm:text-3xl font-semibold" data-testid="text-receiver-amount">{receiverGets}</span>
              </div>
              
              <div className="relative">
                <div 
                  className="flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
                  style={{ backgroundColor: inputBg, border: `1px solid ${borderColor}` }}
                  onClick={() => setShowReceiveCurrencyDropdown(!showReceiveCurrencyDropdown)}
                  data-testid="dropdown-receive-currency"
                >
                  <span className="text-xl sm:text-2xl">{getReceiveCurrencyData().flag}</span>
                  <span className="text-white font-medium text-sm sm:text-base">{receiveCurrency}</span>
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </div>
                
                {showReceiveCurrencyDropdown && (
                  <div 
                    className="absolute right-0 top-full mt-2 z-50 rounded-xl overflow-hidden shadow-xl min-w-[180px]"
                    style={{ backgroundColor: cardBg, border: `1px solid ${borderColor}` }}
                  >
                    {currencies.filter(c => c.code !== sendCurrency).map((c) => (
                      <div
                        key={c.code}
                        className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-purple-500/20 transition-colors"
                        onClick={() => handleSelectReceiveCurrency(c.code)}
                        data-testid={`option-receive-${c.code}`}
                      >
                        <span className="text-xl">{c.flag}</span>
                        <div>
                          <p className="text-white font-medium text-sm">{c.code}</p>
                          <p className="text-gray-400 text-xs">{c.name}</p>
                        </div>
                        {c.code === receiveCurrency && (
                          <Check className="w-4 h-4 text-green-400 ml-auto" />
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Delivery Method Section */}
        <div className="px-4 sm:px-6 mb-6">
          <p className="text-gray-500 text-xs sm:text-sm font-medium mb-2 sm:mb-3 uppercase tracking-wider">Delivery Method</p>
          <div 
            className="rounded-xl sm:rounded-2xl p-4 sm:p-5 flex items-center justify-between cursor-pointer hover:opacity-90 transition-opacity"
            style={{ backgroundColor: cardBg, border: `1px solid ${borderColor}` }}
            data-testid="card-delivery-method"
          >
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-purple-500 to-purple-700 rounded-xl flex items-center justify-center">
                <Building2 className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div>
                <h4 className="text-white font-semibold text-sm sm:text-base">Bank Account</h4>
                <p className="text-gray-400 text-xs sm:text-sm">Transfers within 2 days</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </div>
        </div>

        {/* Continue Button */}
        <div className="px-4 sm:px-6 mt-auto">
          <Button
            className="w-full h-12 sm:h-14 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 text-white font-semibold rounded-xl sm:rounded-2xl shadow-lg shadow-purple-500/30 text-base sm:text-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            data-testid="button-continue"
            disabled={totalToPay <= 0 || (!hasValidRate && sendCurrency !== receiveCurrency)}
            onClick={handleContinue}
          >
            {!hasValidRate && sendCurrency !== receiveCurrency ? "Rate Unavailable" : "Continue"}
          </Button>
        </div>
      </div>

      {/* Click outside to close dropdowns */}
      {(showSendCurrencyDropdown || showReceiveCurrencyDropdown) && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => {
            setShowSendCurrencyDropdown(false);
            setShowReceiveCurrencyDropdown(false);
          }}
        />
      )}

      {/* Notification Center */}
      <NotificationCenter 
        isOpen={isNotificationCenterOpen}
        onClose={() => setIsNotificationCenterOpen(false)}
      />
    </div>
  );
}
