import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import type { Card } from "shared/schema";

interface CreditCardProps {
  card: Card;
  showDetails?: boolean;
  onToggleVisibility?: () => void;
}

export function CreditCard({ card, showDetails = false, onToggleVisibility }: CreditCardProps) {
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
      <div className="relative z-10 p-6 h-full flex flex-col text-white">
        {/* Top Section - Brand Name and Toggle */}
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-xl font-bold tracking-wide text-white">PAYdota</h2>
          {onToggleVisibility && (
            <button
              onClick={onToggleVisibility}
              className="p-1.5 rounded-full hover:bg-white/20 transition-colors"
            >
              {showDetails ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          )}
        </div>

        {/* Card Number Section */}
        <div className="mb-4">
          <p className="text-lg font-mono tracking-[0.15em] font-light text-white whitespace-nowrap overflow-hidden text-ellipsis">
            {formatCardNumber(card.lastFour)}
          </p>
        </div>
        
        {/* Card Balance */}
        <div className="mb-6">
          <p className="text-xs opacity-60 mb-1 uppercase tracking-wide">Available Balance</p>
          <p className="text-base font-semibold text-white">
            ${(Number(card.balance) || 0).toFixed(2)}
          </p>
        </div>

        {/* Bottom Section - Expiry and CVV */}
        <div className="flex justify-between items-end mt-auto">
          <div>
            <p className="text-xs opacity-60 mb-1 uppercase tracking-wide">Valid Thru</p>
            <p className="text-sm font-mono font-medium text-white">
              {formatExpiry()}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs opacity-60 mb-1 uppercase tracking-wide">CVV</p>
            <p className="text-sm font-mono font-medium text-white">
              {formatCVV()}
            </p>
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
      <div className="absolute bottom-6 right-8">
        <div className="px-3 py-1 bg-white/10 rounded-lg backdrop-blur-sm">
          <span className="text-xs font-bold text-white uppercase tracking-wide">
            {card.type === 'virtual' ? 'Virtual' : 'Physical'}
          </span>
        </div>
      </div>
    </div>
  );
}