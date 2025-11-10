import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertBadge } from "@/components/shared/AlertBadge";
import { Activity, Target, Calendar, AlertTriangle, TrendingUp, TrendingDown, Heart } from "lucide-react";

interface DashboardOverviewProps {
  stats: {
    todayReadings: number;
    weeklyAverage: number;
    daysInTarget: number;
    alertsCount: number;
  };
  className?: string;
}

export const DashboardOverview = ({
  stats,
  className = "",
}: DashboardOverviewProps) => {
  const cards = [
    {
      title: "Mesures aujourd'hui",
      value: stats.todayReadings,
      icon: Activity,
      color: "from-blue-400 to-blue-600",
      bgColor: "from-blue-50 to-blue-100",
      trend: { value: 12, isPositive: true }
    },
    {
      title: "Moyenne hebdomadaire",
      value: `${stats.weeklyAverage} mmol/L`,
      icon: Target,
      color: "from-purple-400 to-purple-600",
      bgColor: "from-purple-50 to-purple-100",
      trend: { value: -5, isPositive: false }
    },
    {
      title: "Jours dans la cible",
      value: stats.daysInTarget,
      icon: Calendar,
      color: "from-green-400 to-green-600",
      bgColor: "from-green-50 to-green-100",
      trend: { value: 8, isPositive: true }
    },
    {
      title: "Alertes actives",
      value: stats.alertsCount,
      icon: AlertTriangle,
      color: "from-amber-400 to-orange-600",
      bgColor: "from-amber-50 to-orange-100",
      trend: null
    }
  ];

  return (
    <div className={`grid gap-6 md:grid-cols-2 lg:grid-cols-4 ${className}`}>
      {cards.map((card, index) => (
        <Card key={index} className={`border-2 border-transparent hover:border-current transition-all duration-300 hover:shadow-xl group bg-gradient-to-br ${card.bgColor} relative overflow-hidden`}>
          <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-white/20 to-transparent rounded-bl-full"></div>

          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                <card.icon className="h-6 w-6 text-white" />
              </div>
              {card.trend && (
                <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                  card.trend.isPositive
                    ? 'bg-green-100 text-green-700'
                    : 'bg-red-100 text-red-700'
                }`}>
                  {card.trend.isPositive ? (
                    <TrendingUp className="h-3 w-3" />
                  ) : (
                    <TrendingDown className="h-3 w-3" />
                  )}
                  {Math.abs(card.trend.value)}%
                </div>
              )}
            </div>
          </CardHeader>

          <CardContent className="pt-0">
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-600">{card.title}</p>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-gray-900">{card.value}</span>
                {typeof card.value === 'string' && card.value.includes('mmol/L') && (
                  <span className="text-sm text-gray-500">gly.</span>
                )}
              </div>
            </div>

            {/* Special badge for alerts */}
            {card.title === "Alertes actives" && stats.alertsCount > 0 && (
              <div className="absolute -top-2 -right-2">
                <AlertBadge status="warning" />
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};