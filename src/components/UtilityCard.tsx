
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
      "group relative overflow-hidden p-6 transition-all hover:shadow-2xl",
      "cursor-pointer bg-[#1E1E1E] border-[#2C2C2C] hover:border-[#3A3A3A]",
      "hover:scale-105 hover:bg-[#252525]",
      "text-gray-300 hover:text-white",
      "border",
      className
    )}>
      <div className="mb-4">
        <Icon className="h-8 w-8 text-blue-400 group-hover:text-blue-300" />
      </div>
      <h3 className="text-xl font-semibold mb-2 text-white/90 group-hover:text-white">
        {title}
      </h3>
      <p className="text-gray-500 group-hover:text-gray-300">
        {description}
      </p>
    </Card>
  );
}
