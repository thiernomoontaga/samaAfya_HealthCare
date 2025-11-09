import { PatientLayout } from "@/components/layout/PatientLayout";
import { DashboardOverview } from "@/components/patient/dashboard/DashboardOverview";
import { DailyGlycemiaCard } from "@/components/patient/dashboard/DailyGlycemiaCard";
import { WeeklyTrendsCard } from "@/components/patient/dashboard/WeeklyTrendsCard";
import { useGlycemiaData } from "@/hooks/useGlycemiaData";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

const PatientDashboard = () => {
  const { readings, weeklyData, isLoading, error, getStats } = useGlycemiaData();

  if (error) {
    return (
      <PatientLayout title="Tableau de bord">
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </PatientLayout>
    );
  }

  return (
    <PatientLayout title="Tableau de bord">
      <div className="space-y-6">
        {/* Overview Cards */}
        {isLoading ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-32" />
            ))}
          </div>
        ) : (
          <DashboardOverview stats={getStats} />
        )}

        {/* Charts Section */}
        <div className="grid gap-6">
          {isLoading ? (
            <Skeleton className="h-96" />
          ) : (
            <WeeklyTrendsCard data={weeklyData} />
          )}
        </div>
      </div>
    </PatientLayout>
  );
};

export default PatientDashboard;