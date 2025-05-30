import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import type { Card } from "shared/schema";

interface CreditCardProps {
  card: Card;
  showDetails?: boolean;
  onToggleVisibility?: () => void;
}

export function CreditCard({ card, showDetails = false, onToggleVisibility }: CreditCardProps) {
  // Fetch user data for card holder name
  const { data: user } = useQuery({
    queryKey: ['/api/auth/user'],
  });

  const formatCardNumber = (lastFour: string | null) => {
    if (!lastFour) return "•••• •••• •••• ••••";
    if (!showDetails) return "•••• •••• •••• " + lastFour;
    return "•••• •••• •••• " + lastFour;
  };

  const formatExpiry = () => {
    if (!showDetails) return "**/**";
    return "12/27";
  };

  const formatCVV = () => {
    if (!showDetails) return "***";
    return "***";
  };

  const getCardHolderName = () => {
    if (!user) return "CARD HOLDER";
    const firstName = (user as any).firstName || "";
    const lastName = (user as any).lastName || "";
    return `${firstName} ${lastName}`.trim().toUpperCase() || "CARD HOLDER";
  };

  return (
    <div className="relative w-full aspect-[1.6/1] rounded-3xl overflow-hidden shadow-2xl mx-auto max-w-sm">
      {/* Card Background - Purple gradient like in the image */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500 via-purple-600 to-purple-700">
        {/* Subtle overlay effects */}
        <div className="absolute inset-0">
          {/* Top right glow */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl"></div>
          {/* Bottom left glow */}
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full blur-2xl"></div>
        </div>
      </div>

      {/* Card Content */}
      <div className="relative z-10 pt-4 px-6 pb-4 h-full flex flex-col text-white">
        {/* Top Section - Brand Name */}
        <div className="mb-4">
          <h2 className="text-lg font-bold tracking-wide text-white">PAYdota</h2>
        </div>

        {/* Card Number Section with Toggle */}
        <div className="mb-4 flex items-center justify-between">
          <p className="text-base font-mono tracking-[0.15em] font-light text-white whitespace-nowrap overflow-hidden text-ellipsis flex-1">
            {formatCardNumber(card.lastFour)}
          </p>
          {onToggleVisibility && (
            <button
              onClick={onToggleVisibility}
              className="p-1.5 rounded-full hover:bg-white/20 transition-colors ml-2 flex-shrink-0"
            >
              {showDetails ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          )}
        </div>
        
        {/* Card Holder and Balance Section */}
        <div className="mb-4 flex justify-between items-start">
          <div>
            <p className="text-xs font-medium text-white tracking-wide mb-1">
              {getCardHolderName()}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs opacity-60 mb-1 uppercase tracking-wide">Available Balance</p>
            <p className="text-sm font-semibold text-white">
              ${(Number(card.balance) || 0).toFixed(2)}
            </p>
          </div>
        </div>

        {/* Bottom Section - Expiry and CVV */}
        <div className="mt-auto">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs opacity-70 uppercase tracking-wide leading-none">Valid Thru</p>
              <p className="text-xs font-mono font-medium text-white mt-1">
                {formatExpiry()}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs opacity-70 uppercase tracking-wide leading-none">CVV</p>
              <p className="text-xs font-mono font-medium text-white mt-1">
                {formatCVV()}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Card Chip - Only for Physical Cards */}
      {card.type === 'physical' && (
        <div className="absolute top-20 left-8">
          <div className="w-12 h-9 bg-gradient-to-br from-yellow-200 to-yellow-400 rounded-lg shadow-md">
            <div className="w-full h-full bg-gradient-to-br from-yellow-100/30 to-transparent rounded-lg flex items-center justify-center">
              <div className="w-8 h-6 border border-yellow-600/30 rounded-sm"></div>
            </div>
          </div>
        </div>
      )}

      {/* Card Type Indicator */}
      <div className="absolute bottom-4 right-6">
        <div className="px-2 py-1 bg-white/10 rounded backdrop-blur-sm">
          <span className="text-xs font-bold text-white uppercase tracking-wide">
            {card.type === 'virtual' ? 'VIRTUAL' : 'PHYSICAL'}
          </span>
        </div>
      </div>
    </div>
  );
}