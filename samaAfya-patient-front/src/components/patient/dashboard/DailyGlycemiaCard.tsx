import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Droplet, Clock, Coffee, Utensils, Moon, Heart } from "lucide-react";

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

const getMealContextInfo = (context: string) => {
  switch (context) {
    case "fasting":
      return {
        label: "À jeun",
        icon: Coffee,
        color: "from-blue-400 to-blue-600",
        bgColor: "from-blue-50 to-blue-100",
        emoji: "🌅"
      };
    case "before_meal":
      return {
        label: "Avant repas",
        icon: Utensils,
        color: "from-purple-400 to-purple-600",
        bgColor: "from-purple-50 to-purple-100",
        emoji: "🍽️"
      };
    case "after_meal":
      return {
        label: "Après repas",
        icon: Utensils,
        color: "from-green-400 to-green-600",
        bgColor: "from-green-50 to-green-100",
        emoji: "✅"
      };
    case "dinner":
      return {
        label: "Après dîner",
        icon: Moon,
        color: "from-indigo-400 to-indigo-600",
        bgColor: "from-indigo-50 to-indigo-100",
        emoji: "🌙"
      };
    default:
      return {
        label: context,
        icon: Droplet,
        color: "from-gray-400 to-gray-600",
        bgColor: "from-gray-50 to-gray-100",
        emoji: "📊"
      };
  }
};

const getStatusInfo = (status: string) => {
  switch (status) {
    case "normal":
      return {
        label: "Normal",
        color: "text-green-700 bg-green-100 border-green-200",
        emoji: "✅"
      };
    case "warning":
      return {
        label: "Attention",
        color: "text-amber-700 bg-amber-100 border-amber-200",
        emoji: "⚠️"
      };
    case "critical":
      return {
        label: "Alerte",
        color: "text-red-700 bg-red-100 border-red-200",
        emoji: "🚨"
      };
    default:
      return {
        label: "Inconnu",
        color: "text-gray-700 bg-gray-100 border-gray-200",
        emoji: "❓"
      };
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
    <Card className={`${className} overflow-hidden`}>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-400 flex items-center justify-center">
            <Droplet className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold text-gray-800">Mesures du jour</span>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Latest Reading - Featured */}
        {latestReading && (
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl"></div>
            <div className="relative p-6 bg-white/80 backdrop-blur-sm rounded-2xl border border-blue-100">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${getMealContextInfo(latestReading.mealContext).color} flex items-center justify-center shadow-lg`}>
                    {(() => {
                      const IconComponent = getMealContextInfo(latestReading.mealContext).icon;
                      return <IconComponent className="h-6 w-6 text-white" />;
                    })()}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">Dernière mesure</h3>
                    <p className="text-sm text-gray-600">{getMealContextInfo(latestReading.mealContext).label}</p>
                  </div>
                </div>
                <Badge className={`${getStatusInfo(latestReading.status).color} border font-medium`}>
                  {getStatusInfo(latestReading.status).emoji} {getStatusInfo(latestReading.status).label}
                </Badge>
              </div>

              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold text-gray-900">{latestReading.value}</span>
                <span className="text-lg text-gray-600">mmol/L</span>
              </div>

              <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
                <Clock className="h-4 w-4" />
                {new Date(latestReading.timestamp).toLocaleTimeString('fr-FR', {
                  hour: '2-digit',
                  minute: '2-digit',
                  day: 'numeric',
                  month: 'short'
                })}
              </div>
            </div>
          </div>
        )}

        {/* Average */}
        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-400 to-gray-600 flex items-center justify-center">
              <Heart className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700">Moyenne journalière</p>
              <p className="text-xs text-gray-500">Toutes vos mesures</p>
            </div>
          </div>
          <div className="text-right">
            <span className="text-2xl font-bold text-gray-900">{averageReading}</span>
            <span className="text-sm text-gray-600 ml-1">mmol/L</span>
          </div>
        </div>

        {/* Recent Readings List */}
        <div className="space-y-3">
          <h4 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <Heart className="h-5 w-5 text-rose-500" />
            Mesures récentes
          </h4>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {readings.slice(-5).reverse().map((reading) => {
              const contextInfo = getMealContextInfo(reading.mealContext);
              const statusInfo = getStatusInfo(reading.status);

              return (
                <div
                  key={reading.id}
                  className="flex items-center justify-between p-4 bg-white border border-gray-100 rounded-xl hover:shadow-md transition-all duration-200"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${contextInfo.bgColor} border border-white flex items-center justify-center`}>
                      {(() => {
                        const IconComponent = contextInfo.icon;
                        return <IconComponent className={`h-5 w-5 ${contextInfo.color.replace('from-', 'text-').replace('to-', '').split(' ')[0]}-600`} />;
                      })()}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-700">{contextInfo.emoji} {contextInfo.label}</span>
                        <Badge variant="outline" className={`text-xs ${statusInfo.color} border`}>
                          {statusInfo.emoji}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Clock className="h-3 w-3" />
                        {new Date(reading.timestamp).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-bold text-gray-900">{reading.value}</span>
                    <span className="text-sm text-gray-600 ml-1">mmol/L</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};