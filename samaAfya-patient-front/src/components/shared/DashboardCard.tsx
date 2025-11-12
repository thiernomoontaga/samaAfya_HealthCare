import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface DashboardCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
}

export const DashboardCard = ({
  title,
  value,
  icon: Icon,
  trend,
  className = "",
}: DashboardCardProps) => {
  return (
    <Card className={`transition-all hover:shadow-md hover:scale-105 animate-fade-in ${className}`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {trend && (
          <p className="text-xs text-muted-foreground">
            <span
              className={
                trend.isPositive ? "text-medical-success" : "text-medical-danger"
              }
            >
              {trend.isPositive ? "+" : ""}
              {trend.value}%
            </span>{" "}
            depuis la semaine dernière
          </p>
        )}
      </CardContent>
    </Card>
  );
};