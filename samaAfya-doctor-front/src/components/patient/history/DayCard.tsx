import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import {
  ChevronDown,
  ChevronRight,
  Calendar,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Clock,
  Droplet
} from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { cn } from "@/lib/utils";

interface GlycemiaReading {
  id: string;
  moment: "jeun" | "apres_petit_dej" | "avant_dejeuner" | "apres_dejeuner" | "avant_diner" | "apres_diner" | "coucher";
  value: number;
  status: "hypo" | "normal" | "warning" | "high";
  date: string;
  time: string;
}

interface DayCardProps {
  date: string;
  readings: GlycemiaReading[];
  completed: boolean;
  average: number;
  min: number;
  max: number;
  status: "good" | "warning" | "critical";
  isExpanded?: boolean;
  onToggle?: () => void;
}

const getMealContextLabel = (moment: string) => {
  const labels: Record<string, string> = {
    "jeun": "À jeun",
    "apres_petit_dej": "Après petit-déj",
    "avant_dejeuner": "Avant déjeuner",
    "apres_dejeuner": "Après déjeuner",
    "avant_diner": "Avant dîner",
    "apres_diner": "Après dîner",
    "coucher": "Au coucher"
  };
  return labels[moment] || moment;
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "hypo":
      return "text-purple-600 bg-purple-50 border-purple-200";
    case "normal":
      return "text-green-600 bg-green-50 border-green-200";
    case "warning":
      return "text-amber-600 bg-amber-50 border-amber-200";
    case "high":
      return "text-red-600 bg-red-50 border-red-200";
    default:
      return "text-gray-600 bg-gray-50 border-gray-200";
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case "hypo":
      return <TrendingDown className="h-4 w-4" />;
    case "normal":
      return <CheckCircle className="h-4 w-4" />;
    case "warning":
      return <AlertTriangle className="h-4 w-4" />;
    case "high":
      return <TrendingUp className="h-4 w-4" />;
    default:
      return <Clock className="h-4 w-4" />;
  }
};

const getDayStatusColor = (status: string) => {
  switch (status) {
    case "good":
      return "bg-green-50 border-green-200 text-green-700";
    case "warning":
      return "bg-amber-50 border-amber-200 text-amber-700";
    case "critical":
      return "bg-red-50 border-red-200 text-red-700";
    default:
      return "bg-gray-50 border-gray-200 text-gray-700";
  }
};

const getDayStatusLabel = (status: string) => {
  switch (status) {
    case "good":
      return "Jour normal";
    case "warning":
      return "Attention requise";
    case "critical":
      return "Jour critique";
    default:
      return "Statut inconnu";
  }
};

export const DayCard = ({
  date,
  readings,
  completed,
  average,
  min,
  max,
  status,
  isExpanded = false,
  onToggle
}: DayCardProps) => {
  const [expanded, setExpanded] = useState(isExpanded);

  const handleToggle = () => {
    setExpanded(!expanded);
    onToggle?.();
  };

  const dayDate = new Date(date);
  const isToday = format(dayDate, "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd");

  return (
    <Card className={cn(
      "transition-all duration-200 hover:shadow-md",
      isToday && "ring-2 ring-primary/20 bg-primary/5"
    )}>
      <Collapsible open={expanded} onOpenChange={handleToggle}>
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer hover:bg-gray-50/50 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  {expanded ? (
                    <ChevronDown className="h-5 w-5 text-muted-foreground" />
                  ) : (
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  )}
                  <Calendar className="h-5 w-5 text-primary" />
                </div>

                <div className="text-left">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-lg">
                      {format(dayDate, "EEEE d MMMM yyyy", { locale: fr })}
                    </h3>
                    {isToday && (
                      <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                        Aujourd'hui
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                    <span>{readings.length} mesure{readings.length > 1 ? 's' : ''}</span>
                    {completed && (
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        Complet
                      </Badge>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                {/* Quick Stats */}
                <div className="hidden sm:flex items-center gap-4 text-sm">
                  {average > 0 && (
                    <div className="text-center">
                      <div className="font-semibold text-lg">{average.toFixed(1)}</div>
                      <div className="text-muted-foreground text-xs">Moyenne</div>
                    </div>
                  )}
                  {readings.length > 0 && (
                    <div className="text-center">
                      <div className="font-semibold text-lg">{min.toFixed(1)} - {max.toFixed(1)}</div>
                      <div className="text-muted-foreground text-xs">Min - Max</div>
                    </div>
                  )}
                </div>

                {/* Day Status */}
                <Badge variant="outline" className={getDayStatusColor(status)}>
                  {getDayStatusLabel(status)}
                </Badge>
              </div>
            </div>

            {/* Mini Chart */}
            {readings.length > 0 && (
              <div className="mt-4 flex gap-1">
                {readings.map((reading, index) => (
                  <div
                    key={index}
                    className={cn(
                      "h-3 flex-1 rounded-full transition-all duration-200",
                      reading.status === "normal" ? "bg-green-400 hover:bg-green-500" :
                      reading.status === "warning" ? "bg-amber-400 hover:bg-amber-500" :
                      reading.status === "high" ? "bg-red-400 hover:bg-red-500" :
                      "bg-purple-400 hover:bg-purple-500"
                    )}
                    title={`${getMealContextLabel(reading.moment)}: ${reading.value} mmol/L à ${reading.time}`}
                  />
                ))}
              </div>
            )}
          </CardHeader>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <CardContent className="pt-0">
            <div className="space-y-3">
              {/* Summary Stats for Mobile */}
              <div className="sm:hidden grid grid-cols-3 gap-4 p-3 bg-gray-50 rounded-lg">
                <div className="text-center">
                  <div className="font-semibold text-lg">{average > 0 ? average.toFixed(1) : "N/A"}</div>
                  <div className="text-muted-foreground text-xs">Moyenne</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold text-lg">{min > 0 ? min.toFixed(1) : "N/A"}</div>
                  <div className="text-muted-foreground text-xs">Minimum</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold text-lg">{max > 0 ? max.toFixed(1) : "N/A"}</div>
                  <div className="text-muted-foreground text-xs">Maximum</div>
                </div>
              </div>

              {/* Measurements List */}
              <div className="space-y-2">
                <h4 className="font-medium text-sm text-muted-foreground mb-3">
                  Mesures de la journée
                </h4>

                {readings.length > 0 ? (
                  <div className="grid gap-2">
                    {readings.map((reading) => (
                      <div
                        key={reading.id}
                        className={cn(
                          "flex items-center justify-between p-4 border rounded-lg transition-all duration-200 hover:shadow-sm",
                          getStatusColor(reading.status)
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-white/50">
                            <Droplet className="h-5 w-5" />
                          </div>
                          <div>
                            <div className="font-medium text-sm">
                              {getMealContextLabel(reading.moment)}
                            </div>
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Clock className="h-3 w-3" />
                              {reading.time}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <div className="text-right">
                            <div className="font-bold text-lg">
                              {reading.value}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              mmol/L
                            </div>
                          </div>
                          <div className="flex items-center gap-1">
                            {getStatusIcon(reading.status)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Droplet className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>Aucune mesure enregistrée pour ce jour</p>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};