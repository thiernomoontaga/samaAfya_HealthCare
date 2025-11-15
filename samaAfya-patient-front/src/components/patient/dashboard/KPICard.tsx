import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface KPICardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  iconColor?: string;
  bgColor?: string;
  className?: string;
}

export const KPICard: React.FC<KPICardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  iconColor = "text-primary",
  bgColor = "bg-primary/20",
  className = "",
}) => {
  return (
    <Card className={`shadow-sm hover:shadow-md transition-all duration-200 border-border/50 hover:border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10 ${className}`}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-2">{title}</p>
            <p className="text-4xl font-bold text-primary">{value}</p>
            {subtitle && <p className="text-xs text-muted-foreground mt-2">{subtitle}</p>}
          </div>
          <div className={`p-4 rounded-2xl ${bgColor}`}>
            <Icon className={`h-8 w-8 ${iconColor}`} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
