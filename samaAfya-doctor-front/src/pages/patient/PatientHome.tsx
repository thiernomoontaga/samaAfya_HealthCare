import { PatientLayout } from "@/components/layout/PatientLayout";
import { GlycemiaInput } from "@/components/patient/GlycemiaInput";
import { DailyGlycemiaChart } from "@/components/patient/dashboard/DailyGlycemiaChart";
import { useGlycemiaData } from "@/hooks/useGlycemiaData";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import { currentPatient } from "@/data/mockData";

const PatientHome = () => {
  const { toast } = useToast();
  const { readings, weeklyData, isLoading, error, addReading } = useGlycemiaData();

  const handleGlycemiaSubmit = async (data: {
    date: Date;
    time: string;
    value: number;
    mealType: "fasting" | "breakfast" | "lunch" | "dinner";
    mealTiming: "before" | "after";
    notes?: string;
  }) => {
    try {
      const newReading = {
        value: data.value,
        timestamp: `${data.date.toISOString().split('T')[0]}T${data.time}:00`,
        mealContext: (data.mealType === "fasting" ? "fasting" :
                     data.mealTiming === "after" ? "after_meal" : "before_meal") as "fasting" | "after_meal" | "before_meal",
        status: "normal" as const, // This would be calculated based on medical logic
      };

      await addReading(newReading);

      toast({
        title: "Mesure enregistrée",
        description: `Taux de ${data.value} mmol/L enregistré avec succès.`,
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible d'enregistrer la mesure. Veuillez réessayer.",
        variant: "destructive",
      });
    }
  };

  if (error) {
    return (
      <PatientLayout title="Saisir mes données">
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </PatientLayout>
    );
  }

  return (
    <PatientLayout title="Glycémies">
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Bonjour, {currentPatient.firstName} 💕
          </h2>
          <p className="text-gray-600 mb-6">
            Saisissez vos mesures de glycémie et consultez vos tendances journalières
          </p>
        </div>

        {/* Input Form */}
        <GlycemiaInput onSubmit={handleGlycemiaSubmit} />

        {/* Today's Chart */}
        {isLoading ? (
          <Skeleton className="h-96" />
        ) : (
          <DailyGlycemiaChart readings={readings} />
        )}

      </div>
    </PatientLayout>
  );
};

export default PatientHome;