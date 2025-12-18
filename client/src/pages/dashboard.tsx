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
      className="h-screen overflow-hidden"
      style={{ backgroundColor: bgColor }}
    >
      <div className="h-full flex flex-col overflow-hidden" style={{ backgroundColor: bgColor }}>
        {/* Container wrapper for desktop */}
        <div className="flex-1 max-w-2xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-2 sm:py-6 overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-2 sm:mb-4 lg:mb-6">
            <Button 
              variant="ghost" 
              size="icon"
              className="text-purple-400 hover:bg-purple-500/20 rounded-full w-9 h-9 sm:w-12 sm:h-12 flex-shrink-0"
            >
              <Menu className="w-5 h-5 sm:w-6 sm:h-6" />
            </Button>
            
            <h1 className="text-white font-bold text-lg sm:text-2xl lg:text-3xl">Send Money</h1>
            
            <Button 
              variant="ghost" 
              size="icon"
              className="relative text-purple-400 hover:bg-purple-500/20 rounded-full w-9 h-9 sm:w-12 sm:h-12 flex-shrink-0"
              onClick={() => setIsNotificationCenterOpen(true)}
              data-testid="button-notifications"
            >
              <Bell className="w-5 h-5 sm:w-6 sm:h-6" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold text-[10px]">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </Button>
          </div>

          {/* Wallet Balance */}
          <div className="mb-2 sm:mb-4 lg:mb-6">
            <div 
              className="rounded-lg sm:rounded-2xl lg:rounded-3xl p-2.5 sm:p-5 lg:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0"
              style={{ backgroundColor: '#1a1f35', border: `1px solid ${borderColor}` }}
            >
              <div className="flex items-center gap-2 sm:gap-4 flex-1">
                <div className="w-9 h-9 sm:w-14 sm:h-14 bg-gradient-to-br from-green-500 to-green-700 rounded-full flex items-center justify-center flex-shrink-0">
                  <Wallet className="w-5 h-5 sm:w-7 sm:h-7 text-white" />
                </div>
                <div className="min-w-0">
                  <p className="text-gray-400 text-xs sm:text-sm">Available Balance</p>
                  <p className="text-white font-bold text-lg sm:text-2xl lg:text-3xl truncate" data-testid="text-wallet-balance">
                    ${Number(walletBalance).toFixed(2)}
                  </p>
                </div>
              </div>
              <Link href="/deposit" className="w-full sm:w-auto">
                <Button 
                  variant="outline" 
                  className="border-purple-500 text-purple-400 hover:bg-purple-500/20 w-full sm:w-auto h-9 sm:h-12 text-xs sm:text-base px-3 sm:px-4"
                  data-testid="button-add-funds"
                >
                  Add Funds
                </Button>
              </Link>
            </div>
          </div>


        {/* You Send Section */}
        <div className="mb-2 sm:mb-4 lg:mb-6">
          <div 
            className="rounded-lg sm:rounded-2xl lg:rounded-3xl p-2.5 sm:p-6 lg:p-7"
            style={{ backgroundColor: cardBg, border: `1px solid ${borderColor}` }}
          >
            <p className="text-gray-400 text-xs sm:text-sm lg:text-base font-medium mb-1.5 sm:mb-4 lg:mb-5">You Send</p>
            <div className="flex items-center justify-between gap-2 sm:gap-4">
              <div className="flex items-center gap-1 flex-1 min-w-0">
                <span className="text-purple-400 text-xl sm:text-4xl lg:text-5xl font-light flex-shrink-0">{getSendCurrencyData().symbol}</span>
                <input
                  type="text"
                  value={sendAmount}
                  onChange={(e) => {
                    const val = e.target.value.replace(/[^0-9.]/g, '');
                    setSendAmount(val);
                  }}
                  className="bg-transparent text-white text-xl sm:text-4xl lg:text-5xl font-semibold outline-none flex-1 min-w-0"
                  placeholder="0.00"
                  data-testid="input-send-amount"
                />
              </div>
              
              <div className="relative flex-shrink-0">
                <div 
                  className="flex items-center gap-1 px-2 sm:px-4 py-1.5 sm:py-3 rounded-lg sm:rounded-xl cursor-pointer hover:opacity-80 transition-opacity"
                  style={{ backgroundColor: inputBg, border: `1px solid ${borderColor}` }}
                  onClick={() => setShowSendCurrencyDropdown(!showSendCurrencyDropdown)}
                  data-testid="dropdown-send-currency"
                >
                  <span className="text-lg sm:text-3xl">{getSendCurrencyData().flag}</span>
                  <span className="text-white font-medium text-xs sm:text-base hidden xs:inline">{sendCurrency}</span>
                  <ChevronDown className="w-3 h-3 sm:w-5 sm:h-5 text-gray-400" />
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
        <div className="mb-2 sm:mb-4 lg:mb-6">
          <div 
            className="rounded-lg sm:rounded-2xl lg:rounded-3xl p-2.5 sm:p-6 lg:p-7 space-y-2 sm:space-y-4 lg:space-y-6"
            style={{ backgroundColor: cardBg, border: `1px solid ${borderColor}` }}
          >
            {/* Fee */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 sm:gap-4">
                <div className="w-6 h-6 sm:w-10 sm:h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-xs sm:text-base">✓</span>
                </div>
                <span className="text-gray-300 text-xs sm:text-base lg:text-lg">Fee</span>
              </div>
              <span className="text-green-400 font-semibold text-xs sm:text-base lg:text-lg" data-testid="text-fee">FREE</span>
            </div>

            {/* Total to pay */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 sm:gap-4">
                <div className="w-6 h-6 sm:w-10 sm:h-10 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <Wallet className="w-3 h-3 sm:w-5 sm:h-5 text-white" />
                </div>
                <span className="text-gray-300 text-xs sm:text-base lg:text-lg">Total to pay</span>
              </div>
              <span className="text-white font-semibold text-xs sm:text-base lg:text-lg" data-testid="text-total">
                {getSendCurrencyData().symbol}{totalToPay.toFixed(2)}
              </span>
            </div>

            {/* Rate */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 sm:gap-4">
                <div className={`w-6 h-6 sm:w-10 sm:h-10 bg-gradient-to-br ${hasValidRate ? 'from-orange-400 to-orange-600' : 'from-red-400 to-red-600'} rounded-full flex items-center justify-center flex-shrink-0`}>
                  <span className="text-white text-xs sm:text-base">{hasValidRate ? '≈' : '!'}</span>
                </div>
                <span className="text-gray-300 text-xs sm:text-base lg:text-lg">Rate</span>
              </div>
              {hasValidRate || sendCurrency === receiveCurrency ? (
                <span className="text-white font-medium text-[10px] sm:text-sm lg:text-base" data-testid="text-rate">
                  1 = {exchangeRate.toFixed(4)}
                </span>
              ) : (
                <span className="text-red-400 font-medium text-[10px] sm:text-sm lg:text-base" data-testid="text-rate-error">
                  Unavailable
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Receiver Gets Section */}
        <div className="mb-2 sm:mb-4 lg:mb-6">
          <div 
            className="rounded-lg sm:rounded-2xl lg:rounded-3xl p-2.5 sm:p-6 lg:p-7"
            style={{ backgroundColor: cardBg, border: `1px solid ${borderColor}` }}
          >
            <p className="text-gray-400 text-xs sm:text-sm lg:text-base font-medium mb-1.5 sm:mb-4 lg:mb-5">Receiver Gets</p>
            <div className="flex items-center justify-between gap-2 sm:gap-4">
              <div className="flex items-center gap-1 flex-1 min-w-0">
                <span className="text-purple-400 text-xl sm:text-4xl lg:text-5xl font-light flex-shrink-0">{getReceiveCurrencyData().symbol}</span>
                <span className="text-white text-xl sm:text-4xl lg:text-5xl font-semibold truncate" data-testid="text-receiver-amount">{receiverGets}</span>
              </div>
              
              <div className="relative flex-shrink-0">
                <div 
                  className="flex items-center gap-1 px-2 sm:px-4 py-1.5 sm:py-3 rounded-lg sm:rounded-xl cursor-pointer hover:opacity-80 transition-opacity"
                  style={{ backgroundColor: inputBg, border: `1px solid ${borderColor}` }}
                  onClick={() => setShowReceiveCurrencyDropdown(!showReceiveCurrencyDropdown)}
                  data-testid="dropdown-receive-currency"
                >
                  <span className="text-lg sm:text-3xl">{getReceiveCurrencyData().flag}</span>
                  <span className="text-white font-medium text-xs sm:text-base hidden xs:inline">{receiveCurrency}</span>
                  <ChevronDown className="w-3 h-3 sm:w-5 sm:h-5 text-gray-400" />
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
          <div className="mb-2 sm:mb-4 lg:mb-6">
            <p className="text-gray-500 text-xs sm:text-sm lg:text-base font-medium mb-1.5 sm:mb-4 lg:mb-5 uppercase tracking-wider hidden sm:block">Delivery</p>
            <div 
              className="rounded-lg sm:rounded-2xl lg:rounded-3xl p-2.5 sm:p-6 lg:p-7 flex items-center justify-between cursor-pointer hover:opacity-90 transition-opacity"
              style={{ backgroundColor: cardBg, border: `1px solid ${borderColor}` }}
              data-testid="card-delivery-method"
            >
              <div className="flex items-center gap-2 sm:gap-5 flex-1 min-w-0">
                <div className="w-9 h-9 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-gradient-to-br from-purple-500 to-purple-700 rounded-lg sm:rounded-xl lg:rounded-2xl flex items-center justify-center flex-shrink-0">
                  <Building2 className="w-5 h-5 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-white" />
                </div>
                <div className="min-w-0">
                  <h4 className="text-white font-semibold text-xs sm:text-base lg:text-lg">Bank Account</h4>
                  <p className="text-gray-400 text-[10px] sm:text-sm lg:text-base">2 days</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 sm:w-7 sm:h-7 text-gray-400 flex-shrink-0" />
            </div>
          </div>

          {/* Continue Button */}
          <div className="mb-2 sm:mb-4 lg:mb-6">
            <Button
              className="w-full h-10 sm:h-12 lg:h-14 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 text-white font-semibold rounded-lg sm:rounded-xl lg:rounded-2xl shadow-lg shadow-purple-500/30 text-xs sm:text-base lg:text-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              data-testid="button-continue"
              disabled={totalToPay <= 0 || (!hasValidRate && sendCurrency !== receiveCurrency)}
              onClick={handleContinue}
            >
              {!hasValidRate && sendCurrency !== receiveCurrency ? "Rate Unavailable" : "Continue"}
            </Button>
          </div>
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
