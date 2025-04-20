
import { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface UtilityCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  className?: string;
}

export function UtilityCard({ title, description, icon: Icon, className }: UtilityCardProps) {
  return (
    <Card className={cn(
      "group relative overflow-hidden p-6 transition-all duration-300 ease-in-out",
      "cursor-pointer bg-[#1A1F2C] border-[#2C2C2C] hover:border-[#4A4E5A]",
      "hover:scale-[1.03] hover:bg-[#222831]", // Subtle scale and background change
      "border border-opacity-20 hover:border-opacity-50", // Refined border effect
      "text-gray-300 hover:text-white",
      "shadow-md hover:shadow-2xl", // Enhanced shadow for depth
      "transition-all duration-300 ease-in-out", // Smooth transitions
      "overflow-hidden rounded-xl", // Rounded corners
      className
    )}>
      <div className="mb-4 flex items-center justify-between">
        <Icon className="h-8 w-8 text-blue-400 group-hover:text-blue-300 transition-colors duration-300" />
        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-xs text-gray-500 group-hover:text-gray-300">
          Click to use
        </div>
      </div>
      <h3 className="text-xl font-semibold mb-2 text-white/90 group-hover:text-white transition-colors duration-300">
        {title}
      </h3>
      <p className="text-gray-500 group-hover:text-gray-300 transition-colors duration-300">
        {description}
      </p>
    </Card>
  );
}
