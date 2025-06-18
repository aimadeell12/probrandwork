import { useState, useEffect } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import type { Card } from "shared/schema";

interface CreditCardProps {
  card: Card;
  showDetails?: boolean;
  onToggleVisibility?: () => void;
}

export function CreditCard({ card, showDetails = false, onToggleVisibility }: CreditCardProps) {
  const [cardDetails, setCardDetails] = useState<any>(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

  // Fetch user data for card holder name
  const { data: user } = useQuery({
    queryKey: ['/api/auth/user'],
  });

  // Fetch card details using React Query for better state management
  const { data: stripeCardDetails, isLoading: isLoadingStripeDetails } = useQuery({
    queryKey: ['/api/cards', card.id, 'details'],
    queryFn: async () => {
      if (!card.stripeCardId) return null;
      const response = await apiRequest("GET", `/api/cards/${card.id}/details`);
      if (!response.ok) throw new Error('Failed to fetch card details');
      return response.json();
    },
    enabled: showDetails && !!card.stripeCardId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
  });

  // Fetch real card details from Stripe when showing details
  const fetchCardDetails = async () => {
    if (!card.stripeCardId) return;
    if (cardDetails) return; // Don't fetch again if we already have details
    
    setLoadingDetails(true);
    try {
      console.log(`🌐 [API] Making GET request to /api/cards/${card.id}/details`, '');
      const response = await apiRequest("GET", `/api/cards/${card.id}/details`);
      console.log(`🌐 [API] Response status: ${response.status} for GET /api/cards/${card.id}/details`);
      
      if (response.ok) {
        const details = await response.json();
        console.log("🌐 [API] Success response:", details);
        console.log("💳 Setting card details state:", details);
        setCardDetails(details);
      } else {
        const errorData = await response.json();
        console.error("Failed to fetch card details:", errorData);
      }
    } catch (error) {
      console.error("Error fetching card details:", error);
    } finally {
      setLoadingDetails(false);
    }
  };

  // Fetch details when showDetails becomes true
  useEffect(() => {
    if (showDetails && card.stripeCardId && !cardDetails) {
      console.log(`🔄 Fetching card details for card ${card.id}`);
      fetchCardDetails();
    }
  }, [showDetails, card.stripeCardId]);

  // Reset card details when showDetails becomes false
  useEffect(() => {
    if (!showDetails && cardDetails) {
      console.log(`🔄 Resetting card details for card ${card.id}`);
      setCardDetails(null);
    }
  }, [showDetails]);

  const formatCardNumber = (lastFour: string | null) => {
    console.log('🔍 Card Details Debug:', {
      showDetails,
      cardDetails,
      loadingDetails,
      cardId: card.id,
      stripeCardId: card.stripeCardId
    });

    // If we have real card details from Stripe and showing details, use them
    if (showDetails && cardDetails?.number && !loadingDetails) {
      // Format the full card number with spaces every 4 digits
      const number = cardDetails.number.toString();
      const formatted = number.replace(/(.{4})/g, '$1 ').trim();
      console.log('💳 Displaying full card number:', formatted);
      return formatted;
    }
    
    // If loading details, show loading dots
    if (showDetails && loadingDetails) {
      console.log('⏳ Loading card details...');
      return "•••• •••• •••• ••••";
    }
    
    // Default masked view - show only last 4 digits
    if (!lastFour) {
      console.log('❌ No last four digits available');
      return "•••• •••• •••• ••••";
    }
    
    const masked = "•••• •••• •••• " + lastFour;
    console.log('🔒 Showing masked card number:', masked);
    return masked;
  };

  const formatExpiry = () => {
    // If we have real card details from Stripe, use them
    if (showDetails && cardDetails?.expMonth && cardDetails?.expYear && !loadingDetails) {
      const month = cardDetails.expMonth.toString().padStart(2, '0');
      const year = cardDetails.expYear.toString().slice(-2);
      return `${month}/${year}`;
    }
    
    // If loading, show loading state
    if (showDetails && loadingDetails) {
      return "**/**";
    }
    
    // Default masked view
    if (!showDetails) return "**/**";
    
    // Use card data if available
    if (card.expiryMonth && card.expiryYear) {
      const month = card.expiryMonth.toString().padStart(2, '0');
      const year = card.expiryYear.toString().slice(-2);
      return `${month}/${year}`;
    }
    
    return "**/**";
  };

  const formatCVV = () => {
    // If we have real card details from Stripe, use them
    if (showDetails && cardDetails?.cvc && !loadingDetails) {
      return cardDetails.cvc;
    }
    
    // If loading, show loading state
    if (showDetails && loadingDetails) {
      return "***";
    }
    
    // Default masked view
    if (!showDetails) return "***";
    
    // Use card data if available
    if (card.cvv) {
      return card.cvv;
    }
    
    return "***";
  };

  const getCardHolderName = () => {
    if (!user) return "CARD HOLDER";
    const firstName = (user as any).firstName || "";
    const lastName = (user as any).lastName || "";
    return `${firstName} ${lastName}`.trim().toUpperCase() || "CARD HOLDER";
  };

  const getCardDesign = () => {
    const design = card.design || 'blue';
    
    if (card.type === 'virtual') {
      switch (design) {
        case 'blue':
          return 'bg-gradient-to-br from-blue-500 to-cyan-500';
        case 'purple':
          return 'bg-gradient-to-br from-purple-500 to-pink-500';
        case 'black':
          return 'bg-gradient-to-br from-gray-800 to-gray-900';
        case 'gold':
          return 'bg-gradient-to-br from-yellow-400 to-orange-500';
        default:
          return 'bg-gradient-to-br from-blue-500 to-cyan-500';
      }
    } else {
      switch (design) {
        case 'classic':
          return 'bg-gradient-to-br from-gray-100 to-gray-200';
        case 'premium':
          return 'bg-gradient-to-br from-gray-900 to-black';
        case 'platinum':
          return 'bg-gradient-to-br from-slate-300 to-slate-400';
        case 'rose':
          return 'bg-gradient-to-br from-pink-300 to-rose-400';
        default:
          return 'bg-gradient-to-br from-gray-800 to-gray-900';
      }
    }
  };

  const isLightDesign = () => {
    const design = card.design || 'blue';
    return card.type === 'physical' && ['classic', 'platinum', 'rose'].includes(design);
  };

  return (
    <div className="relative w-full aspect-[1.6/1] rounded-3xl overflow-hidden shadow-2xl mx-auto max-w-sm">
      {/* Card Background - Different colors based on card design */}
      <div className={`absolute inset-0 ${getCardDesign()}`}>
        {/* Subtle overlay effects */}
        <div className="absolute inset-0">
          {/* Top right glow */}
          <div className={`absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl ${
            isLightDesign() 
              ? 'bg-gray-500/15'
              : 'bg-white/10'
          }`}></div>
          {/* Bottom left glow */}
          <div className={`absolute bottom-0 left-0 w-24 h-24 rounded-full blur-2xl ${
            isLightDesign() 
              ? 'bg-gray-600/10'
              : 'bg-white/5'
          }`}></div>
          
          {/* Stars for physical cards */}
          {card.type === 'physical' && (
            <>
              <div className="absolute top-4 left-12 w-1 h-1 bg-gray-300/30 rounded-full"></div>
              <div className="absolute top-8 left-20 w-0.5 h-0.5 bg-gray-200/40 rounded-full"></div>
              <div className="absolute top-12 left-16 w-1 h-1 bg-gray-400/25 rounded-full"></div>
              <div className="absolute top-6 left-32 w-0.5 h-0.5 bg-gray-300/35 rounded-full"></div>
              <div className="absolute top-16 left-28 w-1 h-1 bg-gray-200/30 rounded-full"></div>
              <div className="absolute top-20 left-36 w-0.5 h-0.5 bg-gray-400/20 rounded-full"></div>
              
              <div className="absolute top-24 right-12 w-0.5 h-0.5 bg-gray-300/25 rounded-full"></div>
              <div className="absolute top-28 right-20 w-1 h-1 bg-gray-200/30 rounded-full"></div>
              <div className="absolute top-32 right-16 w-0.5 h-0.5 bg-gray-400/35 rounded-full"></div>
              <div className="absolute top-36 right-28 w-1 h-1 bg-gray-300/20 rounded-full"></div>
            </>
          )}
        </div>
      </div>

      {/* Card Content */}
      <div className={`relative z-10 pt-4 px-6 pb-4 h-full flex flex-col ${isLightDesign() ? 'text-gray-800' : 'text-white'}`}>
        {/* Top Section - Brand Name */}
        <div className="mb-4">
          <h2 className={`text-lg font-bold tracking-wide ${isLightDesign() ? 'text-gray-800' : 'text-white'}`}>PAYdota</h2>
        </div>

        {/* Card Number Section with Toggle */}
        <div className="mb-4 flex items-center justify-between">
          <p className={`text-base font-mono tracking-[0.15em] font-light whitespace-nowrap overflow-hidden text-ellipsis flex-1 ${isLightDesign() ? 'text-gray-800' : 'text-white'}`}>
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
            <p className={`text-xs font-medium tracking-wide mb-1 ${isLightDesign() ? 'text-gray-800' : 'text-white'}`}>
              {getCardHolderName()}
            </p>
          </div>
          <div className="text-right">
            <p className={`text-xs opacity-60 mb-1 uppercase tracking-wide ${isLightDesign() ? 'text-gray-700' : 'text-white'}`}>Available Balance</p>
            <p className={`text-sm font-semibold ${isLightDesign() ? 'text-gray-800' : 'text-white'}`}>
              ${(Number(card.balance) || 0).toFixed(2)}
            </p>
          </div>
        </div>

        {/* Bottom Section - Expiry and CVV */}
        <div className="mt-auto pb-2">
          <div className="flex justify-between items-start mb-2">
            <div>
              <p className={`text-xs opacity-70 uppercase tracking-wide leading-none ${isLightDesign() ? 'text-gray-700' : 'text-white'}`}>Valid Thru</p>
              <p className={`text-xs font-mono font-medium mt-1 ${isLightDesign() ? 'text-gray-800' : 'text-white'}`}>
                {formatExpiry()}
              </p>
            </div>
            <div className="text-center">
              <p className={`text-xs opacity-70 uppercase tracking-wide leading-none ${isLightDesign() ? 'text-gray-700' : 'text-white'}`}>CVV</p>
              <p className={`text-xs font-mono font-medium mt-1 ${isLightDesign() ? 'text-gray-800' : 'text-white'}`}>
                {formatCVV()}
              </p>
            </div>
            <div className="w-16">
              {/* Spacer to balance layout */}
            </div>
          </div>
        </div>
      </div>



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