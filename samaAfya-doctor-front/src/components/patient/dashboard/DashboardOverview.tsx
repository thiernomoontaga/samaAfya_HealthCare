import { DashboardCard } from "@/components/shared/DashboardCard";
import { AlertBadge } from "@/components/shared/AlertBadge";
import { Activity, Target, Calendar, AlertTriangle } from "lucide-react";

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
  return (
    <div className={`grid gap-4 md:grid-cols-2 lg:grid-cols-4 ${className}`}>
      <DashboardCard
        title="Mesures aujourd'hui"
        value={stats.todayReadings}
        icon={Activity}
        trend={{ value: 12, isPositive: true }}
      />

      <DashboardCard
        title="Moyenne hebdomadaire"
        value={`${stats.weeklyAverage} mmol/L`}
        icon={Target}
        trend={{ value: -5, isPositive: false }}
      />

      <DashboardCard
        title="Jours dans la cible"
        value={stats.daysInTarget}
        icon={Calendar}
        trend={{ value: 8, isPositive: true }}
      />

      <div className="relative">
        <DashboardCard
          title="Alertes actives"
          value={stats.alertsCount}
          icon={AlertTriangle}
        />
        {stats.alertsCount > 0 && (
          <div className="absolute -top-2 -right-2">
            <AlertBadge status="warning" />
          </div>
        )}
      </div>
    </div>
  );
};