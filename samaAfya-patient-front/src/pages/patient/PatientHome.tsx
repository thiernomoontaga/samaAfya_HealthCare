import { GlycemiaInput } from "@/components/patient/GlycemiaInput";
import { DailyGlycemiaChart } from "@/components/patient/dashboard/DailyGlycemiaChart";
import { useGlycemiaData } from "@/hooks/useGlycemiaData";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Heart, Plus, Coffee, Utensils, Moon, Activity, TrendingUp, CheckCircle, User, RefreshCw } from "lucide-react";
import EnterTrackingCode from "@/components/patient/EnterTrackingCode";
import { currentPatient } from "@/data/mockData";
import { useState, useEffect } from "react";

const PatientHome = () => {
  const { toast } = useToast();
  const { readings, weeklyData, isLoading, error, addReading, getStats } = useGlycemiaData();
  const [viewMode, setViewMode] = useState<'daily' | 'meals'>('daily');
  const [patientProfile, setPatientProfile] = useState<{
    monitoringMode?: string;
    postMealTiming?: string;
    hasMonitoringMode?: boolean;
    doctorName?: string;
    doctorId?: string;
    trackingCode?: string;
    hasUnlockedFeatures?: boolean;
    associatedAt?: string;
    associationMethod?: 'registration' | 'manual';
  } | null>(null);

  const [refreshKey, setRefreshKey] = useState(0);
  const [showAssociationNotification, setShowAssociationNotification] = useState(false);

  // Get patient monitoring mode
  useEffect(() => {
    const fetchPatientProfile = async () => {
      // Try to get patient ID from localStorage
      let currentPatientId = localStorage.getItem('currentPatientId');

      // If no ID in localStorage, try to find the most recently registered patient
      // This handles the case where a patient just registered but hasn't logged in yet
      if (!currentPatientId) {
        try {
          console.log('No patient ID in localStorage, fetching all patients to find recent registration...');
          const allPatientsResponse = await fetch('http://localhost:3000/patients');
          if (allPatientsResponse.ok) {
            const allPatients = await allPatientsResponse.json();
            // Sort by ID (assuming IDs are incremental) and take the last one
            const sortedPatients = allPatients.sort((a: { id: string }, b: { id: string }) => parseInt(b.id) - parseInt(a.id));
            if (sortedPatients.length > 0) {
              currentPatientId = sortedPatients[0].id;
              console.log('Using most recent patient ID:', currentPatientId);
            }
          }
        } catch (error) {
          console.error('Error fetching patients list:', error);
        }
      }

      // Default fallback
      currentPatientId = currentPatientId || 'P001';

      console.log('Fetching patient profile for ID:', currentPatientId);

      try {
        const response = await fetch(`http://localhost:3000/patients/${currentPatientId}`);
        if (response.ok) {
          const profile = await response.json();
          console.log('Patient profile fetched successfully:', profile);
          console.log('Patient profile keys:', Object.keys(profile));
          console.log('Doctor-related fields:', {
            doctorId: profile.doctorId,
            doctorName: profile.doctorName,
            linkedDoctorId: profile.linkedDoctorId,
            trackingCode: profile.trackingCode,
            hasUnlockedFeatures: profile.hasUnlockedFeatures
          });

          // If patient has unlocked features but no doctor name, try to fetch doctor info
          let finalProfile = profile;
          if ((profile.hasUnlockedFeatures || profile.trackingCode) && !profile.doctorName && (profile.doctorId || profile.linkedDoctorId)) {
            try {
              const doctorId = profile.doctorId || profile.linkedDoctorId;
              console.log('Fetching missing doctor info for ID:', doctorId);
              const doctorResponse = await fetch(`http://localhost:3001/doctors/${doctorId}`);
              if (doctorResponse.ok) {
                const doctor = await doctorResponse.json();
                finalProfile = {
                  ...profile,
                  doctorName: `${doctor.firstName} ${doctor.lastName}`,
                  doctorId: doctor.id,
                };
                console.log('Doctor info retrieved and added to profile:', finalProfile.doctorName);
              }
            } catch (error) {
              console.error('Error fetching doctor info:', error);
            }
          }

          setPatientProfile(finalProfile);

          // Store the ID in localStorage for future use
          localStorage.setItem('currentPatientId', currentPatientId);

          // Show association notification temporarily for manual associations (only once)
          if (finalProfile?.associationMethod === 'manual') {
            const notificationKey = `association_notification_${currentPatientId}`;
            const hasShownNotification = localStorage.getItem(notificationKey);

            if (!hasShownNotification) {
              setShowAssociationNotification(true);
              localStorage.setItem(notificationKey, 'shown');

              // Hide notification after 10 seconds
              setTimeout(() => {
                setShowAssociationNotification(false);
              }, 10000);
            }
          }
        } else {
          console.error('Failed to fetch patient profile:', response.status, response.statusText);
          // Try with fallback ID
          if (currentPatientId !== 'P001') {
            console.log('Trying with fallback ID P001...');
            const fallbackResponse = await fetch('http://localhost:3000/patients/P001');
            if (fallbackResponse.ok) {
              const fallbackProfile = await fallbackResponse.json();
              console.log('Fallback profile fetched:', fallbackProfile);
              setPatientProfile(fallbackProfile);
            }
          }
        }
      } catch (error) {
        console.error('Error fetching patient profile:', error);
      }
    };

    fetchPatientProfile();
  }, [refreshKey]);

  const refreshPatientData = () => {
    setRefreshKey(prev => prev + 1);
  };

  // Calculate stats for dashboard
  const todayReadings = readings.filter(r => r.timestamp.startsWith(new Date().toISOString().split('T')[0]));
  const weeklyAverage = weeklyData.length > 0 ? weeklyData.reduce((sum, day) => sum + day.average, 0) / weeklyData.length : 0;
  const complianceRate = Math.round((readings.length / (7 * 4)) * 100); // Assuming 4 readings per day for 7 days

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
    <div className="space-y-8">
      {/* Hero / Welcome Section */}
      <div className="bg-gradient-to-r from-primary/5 to-accent/5 rounded-2xl p-8 border border-primary/10">
        <div className="flex items-center justify-between">
          <div className="space-y-3">
            <h2 className="text-4xl font-bold text-foreground">
              Bonjour {currentPatient.firstName}
            </h2>
            <p className="text-muted-foreground text-xl">
              Votre suivi maternel personnalisé - {todayReadings.length} mesure{todayReadings.length !== 1 ? 's' : ''} aujourd'hui
            </p>
            <div className="flex items-center gap-6 mt-6">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-primary"></div>
                <span className="text-foreground font-medium">{complianceRate}% observance</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-secondary"></div>
                <span className="text-foreground font-medium">{currentPatient.gestationalAge} semaines d'aménorrhée</span>
              </div>
            </div>
          </div>
          <div className="hidden lg:block">
            <div className="w-32 h-32 rounded-full bg-primary/10 flex items-center justify-center">
              <Heart className="h-16 w-16 text-primary" />
            </div>
          </div>
        </div>
      </div>

      {/* Doctor Association Success Notification - Only for manual associations, shown temporarily */}
      {showAssociationNotification && patientProfile?.doctorName && patientProfile?.trackingCode && patientProfile?.associationMethod === 'manual' && (
        <Card className="shadow-sm border-green-200 bg-gradient-to-r from-green-50 to-emerald-50">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-green-800 mb-1">
                  ✅ Association réussie avec votre médecin
                </h3>
                <p className="text-green-700 text-sm">
                  Vous êtes maintenant associée au <strong>Dr. {patientProfile.doctorName}</strong>.
                  Toutes les fonctionnalités avancées (Messages et Documents) sont désormais disponibles.
                </p>
                <div className="flex items-center gap-4 mt-3">
                  <Badge className="bg-green-100 text-green-700 border-green-200">
                    Code de suivi: {patientProfile.trackingCode}
                  </Badge>
                  <Badge className="bg-blue-100 text-blue-700 border-blue-200">
                    Fonctionnalités débloquées
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Monitoring Mode Info */}
      {patientProfile?.monitoringMode && (
        <Card className="shadow-sm border-border/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Activity className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground">
                    Mode {patientProfile.monitoringMode === 'classique' ? 'Classique' :
                      patientProfile.monitoringMode === 'lean' ? 'Lean' :
                      patientProfile.monitoringMode === 'strict' ? 'Strict (6/j)' : 'Strict (8/j)'}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Temps d'attente: {patientProfile.postMealTiming === '1h' ? '1 heure' : '2 heures'} après repas
                  </p>
                </div>
              </div>
              <Badge className="bg-primary/10 text-primary border-primary/20">
                Actif
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="shadow-sm hover:shadow-md transition-all duration-200 border-border/50 hover:border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">Mesures aujourd'hui</p>
                <p className="text-4xl font-bold text-primary">{todayReadings.length}</p>
                <p className="text-xs text-muted-foreground mt-2">sur 4 recommandées</p>
              </div>
              <div className="p-4 rounded-2xl bg-primary/20">
                <Activity className="h-8 w-8 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm hover:shadow-md transition-all duration-200 border-border/50 hover:border-accent/20 bg-gradient-to-br from-accent/10 to-accent/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">Moyenne hebdomadaire</p>
                <p className="text-4xl font-bold text-accent-foreground">{weeklyAverage.toFixed(2)}</p>
                <p className="text-xs text-muted-foreground mt-2">g/L cette semaine</p>
              </div>
              <div className="p-4 rounded-2xl bg-accent/30">
                <TrendingUp className="h-8 w-8 text-accent-foreground" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm hover:shadow-md transition-all duration-200 border-border/50 hover:border-secondary/20 bg-gradient-to-br from-secondary/10 to-secondary/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">Observance</p>
                <p className="text-4xl font-bold text-secondary-foreground">{complianceRate}%</p>
                <p className="text-xs text-muted-foreground mt-2">des mesures recommandées</p>
              </div>
              <div className="p-4 rounded-2xl bg-secondary/30">
                <CheckCircle className="h-8 w-8 text-secondary-foreground" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm hover:shadow-md transition-all duration-200 border-border/50 hover:border-secondary/20 bg-gradient-to-br from-secondary/10 to-secondary/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium text-muted-foreground">Médecin associé</p>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={refreshPatientData}
                    className="h-6 w-6 p-0 hover:bg-secondary/20"
                    title="Rafraîchir les données"
                  >
                    <RefreshCw className="h-3 w-3" />
                  </Button>
                </div>


                {patientProfile?.doctorName ? (
                  <div className="space-y-3">
                    {/* Doctor name with confirmation */}
                    <div className="flex items-center gap-2">
                      <p className="text-lg font-bold text-secondary-foreground">
                        Dr. {patientProfile.doctorName}
                      </p>
                      <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                    </div>

                    {/* Status badges */}
                    <div className="flex flex-wrap gap-2">
                      <Badge className="bg-green-100 text-green-800 border-green-200 text-xs">
                        ✅ Association confirmée
                      </Badge>
                      {patientProfile?.trackingCode && (
                        <Badge className="bg-blue-100 text-blue-800 border-blue-200 text-xs">
                          Code: {patientProfile.trackingCode}
                        </Badge>
                      )}
                    </div>

                  </div>
                ) : (
                  <div className="space-y-3">
                    <div>
                      <p className="text-lg font-bold text-secondary-foreground mb-1">
                        Non associé
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Associez-vous à un médecin
                      </p>
                    </div>

                  </div>
                )}
              </div>
              <div className="p-4 rounded-2xl bg-secondary/30">
                <User className="h-8 w-8 text-secondary-foreground" />
              </div>
            </div>

            {/* Enter tracking code component - only show if not associated */}
            {!patientProfile?.doctorName && (
              <div className="mt-4 pt-4 border-t border-secondary/20">
                <EnterTrackingCode />
              </div>
            )}
          </CardContent>
        </Card>
      </div>


      {/* Main Input Section */}
      <Card className="shadow-sm border-border/50">
        <CardHeader className="pb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-primary/10">
                <Plus className="h-6 w-6 text-primary" />
              </div>
              <div>
                <CardTitle className="text-2xl">Nouvelle mesure de glycémie</CardTitle>
                <CardDescription className="text-base">Saisissez votre taux de glycémie actuel</CardDescription>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <GlycemiaInput onSubmit={handleGlycemiaSubmit} />
        </CardContent>
      </Card>


      {/* Today's Measurements */}
      <Card className="shadow-sm border-border/50">
        <CardHeader className="pb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-accent/10">
                <Activity className="h-6 w-6 text-accent-foreground" />
              </div>
              <div>
                <CardTitle className="text-2xl">Mesures d'aujourd'hui</CardTitle>
                <CardDescription className="text-base">Vos glycémies enregistrées aujourd'hui</CardDescription>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant={viewMode === 'daily' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('daily')}
                className="rounded-xl"
              >
                Vue journalière
              </Button>
              <Button
                variant={viewMode === 'meals' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('meals')}
                className="rounded-xl"
              >
                Vue par repas
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {viewMode === 'daily' ? (
            isLoading ? (
              <Skeleton className="h-96 rounded-2xl" />
            ) : (
              <DailyGlycemiaChart readings={readings} patientProfile={patientProfile} />
            )
          ) : (
            <div className="space-y-6">
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
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <IconComponent className="h-5 w-5 text-primary" />
                      </div>
                      <h3 className="text-lg font-semibold text-foreground">{getMealLabel(mealType)}</h3>
                      <Badge className="bg-primary/10 text-primary border-primary/20">
                        {mealReadings.length} mesure{mealReadings.length > 1 ? 's' : ''}
                      </Badge>
                    </div>

                    <div className="space-y-3">
                      {mealReadings.map((reading) => (
                        <div key={reading.id} className="flex items-center justify-between p-4 bg-muted/20 border border-border/50 rounded-xl">
                          <div className="flex items-center gap-3">
                            <Badge variant="outline" className={
                              reading.mealContext === 'before_meal' ? 'border-orange-300 text-orange-700' :
                              reading.mealContext === 'after_meal' ? 'border-teal-300 text-teal-700' :
                              'border-blue-300 text-blue-700'
                            }>
                              {reading.mealContext === 'before_meal' ? 'Avant' :
                               reading.mealContext === 'after_meal' ? 'Après' : 'À jeun'}
                            </Badge>
                            <span className="text-lg font-bold text-foreground">{reading.value} mmol/L</span>
                          </div>
                          <div className="text-right">
                            <Badge className={
                              reading.status === 'normal' ? 'bg-green-100 text-green-700 border-green-200' :
                              reading.status === 'warning' ? 'bg-amber-100 text-amber-700 border-amber-200' :
                              'bg-red-100 text-red-700 border-red-200'
                            }>
                              {reading.status === 'normal' ? 'Normal' :
                               reading.status === 'warning' ? 'Attention' : 'Critique'}
                            </Badge>
                            <div className="text-xs text-muted-foreground mt-1">
                              {new Date(reading.timestamp).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PatientHome;