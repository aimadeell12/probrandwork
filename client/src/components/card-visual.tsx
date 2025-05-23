import { CreditCard } from "lucide-react";

interface CardVisualProps {
  design?: string;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export default function CardVisual({ design = "blue", className = "", size = "sm" }: CardVisualProps) {
  const sizeClasses = {
    sm: "w-12 h-8",
    md: "w-16 h-10",
    lg: "w-20 h-12"
  };

  const getGradientClass = (design: string) => {
    switch (design) {
      case "green":
        return "card-gradient-green";
      case "purple":
        return "card-gradient-purple";
      default:
        return "card-gradient-blue";
    }
  };

  return (
    <div className={`${getGradientClass(design)} ${sizeClasses[size]} rounded flex items-center justify-center ${className}`}>
      <CreditCard className="text-white h-4 w-4" />
    </div>
  );
}
