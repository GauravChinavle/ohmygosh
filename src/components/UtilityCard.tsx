import { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";

interface UtilityCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  className?: string;
  route?: string;
}

export function UtilityCard({ title, description, icon: Icon, className, route }: UtilityCardProps) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (route) {
      navigate(route);
    }
  };

  return (
    <Card 
      onClick={handleClick}
      className={cn(
        "group relative overflow-hidden p-4 sm:p-6 transition-all duration-300 ease-in-out",
        "cursor-pointer bg-[#121721] border-[#1E2530] hover:border-[#2C3645]",
        "hover:scale-[1.02] hover:bg-[#1A2028]",
        "border border-opacity-10 hover:border-opacity-30",
        "text-gray-300 hover:text-white",
        "shadow-sm hover:shadow-md",
        "rounded-lg",
        "transition-all duration-300 ease-in-out",
        "flex flex-col justify-between",
        "min-h-[160px] sm:min-h-[180px]",
        className
      )}>
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <Icon className="h-5 w-5 sm:h-6 sm:w-6 text-blue-300 group-hover:text-blue-200 transition-colors duration-300 opacity-80 group-hover:opacity-100" />
        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-xs text-gray-500 group-hover:text-gray-300">
          Use Tool
        </div>
      </div>
      <div>
        <h3 className="text-base sm:text-lg font-medium mb-1.5 sm:mb-2 text-white/90 group-hover:text-white transition-colors duration-300">
          {title}
        </h3>
        <p className="text-xs sm:text-sm text-gray-400 group-hover:text-gray-200 transition-colors duration-300">
          {description}
        </p>
      </div>
    </Card>
  );
}
