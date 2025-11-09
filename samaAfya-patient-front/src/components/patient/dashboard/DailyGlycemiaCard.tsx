import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Droplet, Clock } from "lucide-react";
import { MetricCard } from "@/components/shared/MetricCard";

interface GlycemiaReading {
  id: string;
  value: number;
  timestamp: string;
  mealContext: "fasting" | "before_meal" | "after_meal" | "dinner";
  status: "normal" | "warning" | "critical";
}

interface DailyGlycemiaCardProps {
  readings: GlycemiaReading[];
  className?: string;
}

const getMealContextLabel = (context: string) => {
  switch (context) {
    case "fasting":
      return "À jeun";
    case "before_meal":
      return "Avant repas";
    case "after_meal":
      return "Après repas";
    default:
      return context;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "normal":
      return "text-medical-success";
    case "warning":
      return "text-medical-caution";
    case "critical":
      return "text-medical-danger";
    default:
      return "text-gray-600";
  }
};

export const DailyGlycemiaCard = ({
  readings,
  className = "",
}: DailyGlycemiaCardProps) => {
  const latestReading = readings[readings.length - 1];
  const averageReading = readings.length > 0
    ? Math.round(readings.reduce((sum, r) => sum + r.value, 0) / readings.length * 10) / 10
    : 0;

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Droplet className="h-5 w-5 text-blue-600" />
          Glycémies du jour
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Latest Reading */}
        {latestReading && (
          <MetricCard
            title="Dernière mesure"
            value={latestReading.value}
            unit="mmol/L"
            icon={Droplet}
            status={latestReading.status}
            timestamp={`${getMealContextLabel(latestReading.mealContext)} • ${new Date(latestReading.timestamp).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`}
          />
        )}

        {/* Average */}
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-gray-500" />
            <span className="text-sm font-medium">Moyenne journalière</span>
          </div>
          <span className="text-lg font-semibold">{averageReading} mmol/L</span>
        </div>

        {/* Recent Readings List */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-700">Mesures récentes</h4>
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {readings.slice(-3).reverse().map((reading) => (
              <div
                key={reading.id}
                className="flex items-center justify-between p-2 bg-white border rounded-md"
              >
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    {getMealContextLabel(reading.mealContext)}
                  </Badge>
                  <span className="text-sm font-medium">{reading.value} mmol/L</span>
                </div>
                <div className="text-right">
                  <div className={`text-sm font-medium ${getStatusColor(reading.status)}`}>
                    {reading.status === "normal" ? "✓" : reading.status === "warning" ? "⚠" : "⚠"}
                  </div>
                  <div className="text-xs text-gray-500">
                    {new Date(reading.timestamp).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};