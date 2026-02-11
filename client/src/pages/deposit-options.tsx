import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useLocation } from "wouter";
import { SiVisa, SiMastercard, SiBinance } from "react-icons/si";

interface PaymentMethod {
  id: string;
  title: string;
  subtitle: string;
  icon: "card" | "bank" | "binance";
  route: string;
}

export default function DepositOptions() {
  const [, setLocation] = useLocation();
  const [selectedMethod, setSelectedMethod] = useState<string>("card");

  const paymentMethods: PaymentMethod[] = [
    {
      id: "card",
      title: "Credit Card",
      subtitle: "Visa, Mastercard",
      icon: "card",
      route: "/deposit/card"
    },
    {
      id: "bank",
      title: "Bank Transfer",
      subtitle: "ACH, Wire Transfer",
      icon: "bank",
      route: "/bank-transfer"
    },
    {
      id: "binance",
      title: "Binance Pay",
      subtitle: "Crypto payments",
      icon: "binance",
      route: "/binance-pay"
    }
  ];

  const handleMethodSelect = (method: PaymentMethod) => {
    setSelectedMethod(method.id);
  };

  const handleContinue = () => {
    const selected = paymentMethods.find(m => m.id === selectedMethod);
    if (selected) {
      setLocation(selected.route);
    }
  };

  const renderIcon = (iconType: string) => {
    switch (iconType) {
      case "card":
        return (
          <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
            <div className="flex flex-col items-center justify-center">
              <div className="w-6 h-4 bg-blue-500 rounded-sm flex items-center justify-center">
                <div className="w-4 h-0.5 bg-blue-300 rounded"></div>
              </div>
              <div className="w-5 h-0.5 bg-blue-400 rounded mt-0.5"></div>
            </div>
          </div>
        );
      case "bank":
        return (
          <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
            <div className="grid grid-cols-3 gap-0.5">
              {[...Array(9)].map((_, i) => (
                <div key={i} className="w-2 h-2 bg-green-500 rounded-sm"></div>
              ))}
            </div>
          </div>
        );
      case "binance":
        return (
          <div className="w-12 h-12 bg-yellow-500/20 rounded-xl flex items-center justify-center">
            <SiBinance className="w-6 h-6 text-yellow-500" />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#0f0f23] text-white pb-24">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="p-4 pt-12">
          <button
            onClick={() => setLocation("/deposit")}
            className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
            data-testid="button-back"
          >
            <ArrowLeft className="h-6 w-6" />
          </button>
        </div>

        {/* Payment Methods */}
        <div className="px-4 mt-8 space-y-3">
          {paymentMethods.map((method) => (
            <button
              key={method.id}
              onClick={() => handleMethodSelect(method)}
              className={`w-full p-4 rounded-xl transition-all duration-200 flex items-center space-x-4 ${
                selectedMethod === method.id
                  ? "bg-[#3a1010] border-2 border-red-500 shadow-lg shadow-red-500/20"
                  : "bg-[#3a1010]/80 border-2 border-[#4a1515] hover:border-red-400/50"
              }`}
              data-testid={`button-method-${method.id}`}
            >
              {renderIcon(method.icon)}
              <div className="text-left">
                <h3 className="font-semibold text-white text-base">{method.title}</h3>
                <p className="text-gray-400 text-sm">{method.subtitle}</p>
              </div>
            </button>
          ))}
        </div>

        {/* Continue Button */}
        <div className="px-4 mt-8">
          <button
            onClick={handleContinue}
            className="w-full py-4 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl transition-colors"
            data-testid="button-continue"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}
