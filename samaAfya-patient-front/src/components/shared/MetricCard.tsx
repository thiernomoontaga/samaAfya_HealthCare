import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LucideIcon } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string | number;
  unit?: string;
  icon: LucideIcon;
  status: "normal" | "warning" | "critical";
  timestamp?: string;
  className?: string;
}

const statusConfig = {
  normal: {
    color: "bg-medical-normal/10 text-medical-normal border-medical-normal/20",
    label: "Normal",
  },
  warning: {
    color: "bg-medical-caution/10 text-medical-caution border-medical-caution/20",
    label: "Attention",
  },
  critical: {
    color: "bg-medical-danger/10 text-medical-danger border-medical-danger/20",
    label: "Critique",
  },
};

export const MetricCard = ({
  title,
  value,
  unit,
  icon: Icon,
  status,
  timestamp,
  className = "",
}: MetricCardProps) => {
  const config = statusConfig[status];

  return (
    <Card className={`transition-all hover:shadow-md ${className}`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <Badge variant="outline" className={config.color}>
          {config.label}
        </Badge>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-2">
          <Icon className="h-5 w-5 text-muted-foreground" />
          <div>
            <div className="text-2xl font-bold">
              {value}
              {unit && <span className="text-sm text-muted-foreground ml-1">{unit}</span>}
            </div>
            {timestamp && (
              <p className="text-xs text-muted-foreground">{timestamp}</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};