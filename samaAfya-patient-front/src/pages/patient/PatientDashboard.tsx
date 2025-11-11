import { DashboardOverview } from "@/components/patient/dashboard/DashboardOverview";
import { DailyGlycemiaCard } from "@/components/patient/dashboard/DailyGlycemiaCard";
import { WeeklyTrendsCard } from "@/components/patient/dashboard/WeeklyTrendsCard";
import { useGlycemiaData } from "@/hooks/useGlycemiaData";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle, Plus, Heart, Sparkles } from "lucide-react";
import { currentPatient } from "@/data/mockData";

const PatientDashboard = () => {
  const { readings, weeklyData, isLoading, error, getStats } = useGlycemiaData();

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>{String(error)}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-8 mt-8">
        {/* Welcome Section */}
        <div className="text-center space-y-4">
          <div className="relative">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-rose-400 to-pink-400 flex items-center justify-center mx-auto shadow-lg">
              <Heart className="h-10 w-10 text-white animate-pulse" />
            </div>
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center animate-spin">
              <Sparkles className="h-3 w-3 text-white" />
            </div>
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-rose-600 via-pink-600 to-purple-600 bg-clip-text text-transparent">
              Bonjour {currentPatient.firstName} 👋
            </h1>
            <p className="text-lg text-gray-600 leading-relaxed">
              Voici votre suivi glycémique du jour. Tout va bien se passer 💕
            </p>
          </div>
        </div>

        {/* Quick Action */}
        <Card className="border-2 border-rose-200 bg-gradient-to-r from-rose-50 to-pink-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-rose-400 to-pink-400 flex items-center justify-center">
                  <Plus className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">Ajouter une mesure</h3>
                  <p className="text-gray-600">Saisissez votre glycémie rapidement et facilement</p>
                </div>
              </div>
              <Button
                className="bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                onClick={() => window.location.href = '/patient/glycemia'}
              >
                <Plus className="h-4 w-4 mr-2" />
                Nouvelle mesure
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Overview Cards */}
        {isLoading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-32 rounded-2xl" />
            ))}
          </div>
        ) : (
          <DashboardOverview stats={getStats} />
        )}

        {/* Today's Measurements */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-400 flex items-center justify-center">
              <Heart className="h-4 w-4 text-white" />
            </div>
            Mesures du jour
          </h2>

          {isLoading ? (
            <Skeleton className="h-96 rounded-2xl" />
          ) : (
            <DailyGlycemiaCard readings={readings} className="border-2 border-blue-100 bg-gradient-to-br from-white to-blue-50/30" />
          )}
        </div>

        {/* Weekly Trends */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-blue-400 flex items-center justify-center">
              <Heart className="h-4 w-4 text-white" />
            </div>
            Tendances hebdomadaires
          </h2>

          {isLoading ? (
            <Skeleton className="h-96 rounded-2xl" />
          ) : (
            <WeeklyTrendsCard data={weeklyData} className="border-2 border-green-100 bg-gradient-to-br from-white to-green-50/30" />
          )}
        </div>
    </div>
  );
};

export default PatientDashboard;