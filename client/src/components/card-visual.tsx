import { CreditCard } from "lucide-react";

interface CardVisualProps {
  design?: string;
  className?: string;
  size?: "sm" | "md" | "lg" | "full";
  card?: any;
  showDetails?: boolean;
}

export default function CardVisual({ 
  design = "blue", 
  className = "", 
  size = "sm", 
  card,
  showDetails = false 
}: CardVisualProps) {
  const sizeClasses = {
    sm: "w-12 h-8",
    md: "w-16 h-10", 
    lg: "w-20 h-12",
    full: "w-full h-48"
  };

  const getGradientClass = (design: string) => {
    switch (design) {
      case "green":
        return "card-gradient-green";
      case "purple":
        return "card-gradient-red";
      default:
        return "card-gradient-blue";
    }
  };

  // For small cards, show simple icon
  if (size !== "full" || !showDetails) {
    return (
      <div className={`${getGradientClass(design)} ${sizeClasses[size]} rounded flex items-center justify-center ${className}`}>
        <CreditCard className="text-white h-4 w-4" />
      </div>
    );
  }

  // For full cards, show complete card design
  return (
    <div className={`${getGradientClass(design)} ${sizeClasses[size]} rounded-xl p-6 text-white relative overflow-hidden ${className}`}>
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-4 right-4 w-12 h-12 rounded-full bg-white/20"></div>
        <div className="absolute bottom-4 left-4 w-8 h-8 rounded-full bg-white/10"></div>
      </div>

      {/* Logo */}
      <div className="flex justify-between items-start mb-8">
        <div className="w-12 h-8 bg-yellow-400 rounded-md flex items-center justify-center">
          <div className="w-6 h-4 bg-yellow-300 rounded-sm"></div>
        </div>
        <div className="text-right">
          <div className="text-xl font-bold tracking-wider">DIGITAL</div>
        </div>
      </div>

      {/* Card number */}
      <div className="mb-6">
        <div className="text-lg font-mono tracking-widest">
          •••• •••• •••• {card?.lastFour || "1234"}
        </div>
      </div>

      {/* Card details */}
      <div className="flex justify-between items-end">
        <div>
          <div className="text-xs text-white/70 mb-1">VALID THRU</div>
          <div className="text-sm font-mono">
            {card?.expiryMonth ? `${card.expiryMonth.toString().padStart(2, '0')}/${card.expiryYear?.toString().slice(-2)}` : "12/28"}
          </div>
        </div>
        <div className="text-right">
          <div className="text-xs text-white/70 mb-1">CARDHOLDER</div>
          <div className="text-sm font-medium uppercase truncate max-w-32">
            {card?.holderName || "CARD HOLDER"}
          </div>
        </div>
      </div>

      {/* Card type indicator */}
      <div className="absolute bottom-4 left-6">
        <div className="bg-primary/80 text-white text-xs px-2 py-1 rounded-full">
          {card?.type === "virtual" ? "افتراضية" : "فيزيائية"}
        </div>
      </div>
    </div>
  );
}