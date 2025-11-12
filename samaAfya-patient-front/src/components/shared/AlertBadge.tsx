import { Badge } from "@/components/ui/badge";
import { AlertTriangle, CheckCircle, XCircle } from "lucide-react";

interface AlertBadgeProps {
  status: "normal" | "warning" | "critical";
  message?: string;
  className?: string;
}

const alertConfig = {
  normal: {
    icon: CheckCircle,
    color: "bg-medical-success/10 text-medical-success border-medical-success/20",
    label: "Normal",
  },
  warning: {
    icon: AlertTriangle,
    color: "bg-medical-caution/10 text-medical-caution border-medical-caution/20",
    label: "Attention requise",
  },
  critical: {
    icon: XCircle,
    color: "bg-medical-danger/10 text-medical-danger border-medical-danger/20",
    label: "Critique",
  },
};

export const AlertBadge = ({
  status,
  message,
  className = "",
}: AlertBadgeProps) => {
  const config = alertConfig[status];
  const Icon = config.icon;

  return (
    <Badge variant="outline" className={`${config.color} ${className}`}>
      <Icon className="w-3 h-3 mr-1" />
      {message || config.label}
    </Badge>
  );
};