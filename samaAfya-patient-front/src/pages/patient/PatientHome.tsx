import { GlycemiaInput } from "@/components/patient/GlycemiaInput";
import { DailyGlycemiaChart } from "@/components/patient/dashboard/DailyGlycemiaChart";
import { useGlycemiaData } from "@/hooks/useGlycemiaData";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Heart, Sparkles, Plus, Eye, List, Coffee, Utensils, Moon, Clock } from "lucide-react";
import { currentPatient } from "@/data/mockData";
import { useState, useEffect } from "react";

const PatientHome = () => {
  const { toast } = useToast();
  const { readings, weeklyData, isLoading, error, addReading } = useGlycemiaData();
  const [viewMode, setViewMode] = useState<'daily' | 'meals'>('daily');
  const [patientProfile, setPatientProfile] = useState<{
    monitoringMode?: string;
    postMealTiming?: string;
    hasMonitoringMode?: boolean;
  } | null>(null);

  // Get patient monitoring mode
  useEffect(() => {
    const currentPatientId = localStorage.getItem('currentPatientId') || 'P001';
    const fetchPatientProfile = async () => {
      try {
        const response = await fetch(`http://localhost:3000/patients/${currentPatientId}`);
        if (response.ok) {
          const profile = await response.json();
          setPatientProfile(profile);
        }
      } catch (error) {
        console.error('Error fetching patient profile:', error);
      }
    };
    fetchPatientProfile();
  }, []);

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
        title: "✅ Mesure enregistrée avec succès !",
        description: `Taux de ${data.value} mmol/L enregistré.`,
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
              Saisissez vos mesures de glycémie et consultez vos tendances journalières
            </p>
          </div>
        </div>

        {/* Monitoring Mode Info */}
        {patientProfile?.monitoringMode && (
          <Card className="border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-indigo-400 flex items-center justify-center">
                    <Clock className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">
                      Mode {patientProfile.monitoringMode === 'classique' ? 'Classique' :
                           patientProfile.monitoringMode === 'lean' ? 'Lean' :
                           patientProfile.monitoringMode === 'strict' ? 'Strict (6/j)' : 'Strict (8/j)'}
                    </h3>
                    <p className="text-sm text-gray-600">
                      Temps d'attente: {patientProfile.postMealTiming === '1h' ? '1 heure' : '2 heures'} après repas
                    </p>
                  </div>
                </div>
                <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                  Actif
                </Badge>
              </div>
            </CardContent>
          </Card>
        )}

        {/* View Mode Toggle */}
        <Card className="border-2 border-gray-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-800">Affichage des mesures</h3>
              <div className="flex gap-2">
                <Button
                  variant={viewMode === 'daily' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('daily')}
                  className={viewMode === 'daily' ? 'bg-blue-500 hover:bg-blue-600' : ''}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Vue journalière
                </Button>
                <Button
                  variant={viewMode === 'meals' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('meals')}
                  className={viewMode === 'meals' ? 'bg-green-500 hover:bg-green-600' : ''}
                >
                  <List className="h-4 w-4 mr-2" />
                  Vue par repas
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats Card */}
        <Card className="border-2 border-rose-200 bg-gradient-to-r from-rose-50 to-pink-50">
          <CardContent className="p-6">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="space-y-2">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center mx-auto">
                  <Heart className="h-6 w-6 text-white" />
                </div>
                <div className="text-2xl font-bold text-gray-900">{readings.length}</div>
                <div className="text-sm text-gray-600">Mesures aujourd'hui</div>
              </div>
              <div className="space-y-2">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center mx-auto">
                  <Heart className="h-6 w-6 text-white" />
                </div>
                <div className="text-2xl font-bold text-gray-900">
                  {readings.length > 0 ? Math.round(readings.reduce((sum, r) => sum + r.value, 0) / readings.length * 10) / 10 : 0}
                </div>
                <div className="text-sm text-gray-600">Moyenne du jour</div>
              </div>
              <div className="space-y-2">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center mx-auto">
                  <Heart className="h-6 w-6 text-white" />
                </div>
                <div className="text-2xl font-bold text-gray-900">
                  {readings.filter(r => r.status === "normal").length}
                </div>
                <div className="text-sm text-gray-600">Dans la cible</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Input Form */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-rose-400 to-pink-400 flex items-center justify-center">
              <Plus className="h-4 w-4 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">Nouvelle mesure glycémique</h2>
          </div>
          <GlycemiaInput onSubmit={handleGlycemiaSubmit} className="border-2 border-blue-100 bg-gradient-to-br from-white to-blue-50/30" />
        </div>

        {/* Today's Chart */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-blue-400 flex items-center justify-center">
              <Heart className="h-4 w-4 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">
              {viewMode === 'daily' ? 'Évolution du jour' : 'Mesures par repas'}
            </h2>
          </div>

          {viewMode === 'daily' ? (
            isLoading ? (
              <Skeleton className="h-96 rounded-2xl" />
            ) : (
              <DailyGlycemiaChart
                readings={readings}
                className="border-2 border-green-100 bg-gradient-to-br from-white to-green-50/30"
                patientProfile={patientProfile}
              />
            )
          ) : (
            /* View by meals */
            <Card className="border-2 border-green-100 bg-gradient-to-br from-white to-green-50/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-blue-400 flex items-center justify-center">
                    <List className="h-4 w-4 text-white" />
                  </div>
                  Mesures organisées par repas
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Group readings by meal type */}
                {['fasting', 'breakfast', 'lunch', 'snack', 'dinner'].map((mealType) => {
                  const mealReadings = readings.filter(r => {
                    if (mealType === 'fasting') return r.mealContext === 'fasting';
                    if (mealType === 'breakfast') return r.mealContext === 'before_meal' || r.mealContext === 'after_meal';
                    if (mealType === 'lunch') return r.mealContext === 'before_meal' || r.mealContext === 'after_meal';
                    if (mealType === 'snack') return r.mealContext === 'before_meal' || r.mealContext === 'after_meal';
                    if (mealType === 'dinner') return r.mealContext === 'before_meal' || r.mealContext === 'after_meal';
                    return false;
                  });

                  if (mealReadings.length === 0) return null;

                  const getMealIcon = (type: string) => {
                    switch (type) {
                      case 'fasting': return Coffee;
                      case 'breakfast': return Coffee;
                      case 'lunch': return Utensils;
                      case 'snack': return Utensils;
                      case 'dinner': return Moon;
                      default: return Utensils;
                    }
                  };

                  const getMealLabel = (type: string) => {
                    switch (type) {
                      case 'fasting': return 'À jeun';
                      case 'breakfast': return 'Petit-déjeuner';
                      case 'lunch': return 'Déjeuner';
                      case 'snack': return 'Goûter';
                      case 'dinner': return 'Dîner';
                      default: return type;
                    }
                  };

                  const IconComponent = getMealIcon(mealType);

                  return (
                    <div key={mealType} className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-blue-400 flex items-center justify-center">
                          <IconComponent className="h-5 w-5 text-white" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-800">{getMealLabel(mealType)}</h3>
                        <Badge variant="secondary" className="bg-green-100 text-green-700">
                          {mealReadings.length} mesure{mealReadings.length > 1 ? 's' : ''}
                        </Badge>
                      </div>

                      <div className="grid gap-3 ml-13">
                        {mealReadings.map((reading) => (
                          <div key={reading.id} className="flex items-center justify-between p-4 bg-white border border-gray-100 rounded-xl">
                            <div className="flex items-center gap-3">
                              <Badge variant="outline" className={
                                reading.mealContext === 'before_meal' ? 'border-orange-300 text-orange-700' :
                                reading.mealContext === 'after_meal' ? 'border-teal-300 text-teal-700' :
                                'border-blue-300 text-blue-700'
                              }>
                                {reading.mealContext === 'before_meal' ? 'Avant' :
                                 reading.mealContext === 'after_meal' ? 'Après' : 'À jeun'}
                              </Badge>
                              <span className="text-lg font-bold text-gray-900">{reading.value} mmol/L</span>
                            </div>
                            <div className="text-right">
                              <Badge className={
                                reading.status === 'normal' ? 'bg-green-100 text-green-700 border-green-200' :
                                reading.status === 'warning' ? 'bg-amber-100 text-amber-700 border-amber-200' :
                                'bg-red-100 text-red-700 border-red-200'
                              }>
                                {reading.status === 'normal' ? '✅ Normal' :
                                 reading.status === 'warning' ? '⚠️ Attention' : '🚨 Critique'}
                              </Badge>
                              <div className="text-xs text-gray-500 mt-1">
                                {new Date(reading.timestamp).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          )}
        </div>
    </div>
  );
};

export default PatientHome;