
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
      "group relative overflow-hidden p-6 transition-all hover:shadow-lg",
      "cursor-pointer bg-white hover:scale-105",
      className
    )}>
      <div className="mb-4">
        <Icon className="h-8 w-8 text-purple-600" />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </Card>
  );
}
