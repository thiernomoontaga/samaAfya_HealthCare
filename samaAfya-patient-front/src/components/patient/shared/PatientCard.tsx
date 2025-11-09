import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface PatientCardProps {
  title: string;
  description?: string;
  icon?: LucideIcon;
  children: React.ReactNode;
  className?: string;
  badge?: {
    text: string;
    variant?: "default" | "secondary" | "destructive" | "outline";
  };
}

export const PatientCard = ({
  title,
  description,
  icon: Icon,
  children,
  className,
  badge
}: PatientCardProps) => {
  return (
    <Card className={cn("bg-white/90 backdrop-blur-sm border-0 shadow-lg", className)}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {Icon && (
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Icon className="h-5 w-5 text-primary" />
              </div>
            )}
            <div>
              <CardTitle className="text-lg font-semibold text-gray-900">
                {title}
              </CardTitle>
              {description && (
                <CardDescription className="text-gray-600">
                  {description}
                </CardDescription>
              )}
            </div>
          </div>
          {badge && (
            <Badge variant={badge.variant || "default"}>
              {badge.text}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {children}
      </CardContent>
    </Card>
  );
};