import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { DailyGlycemiaCard } from "@/components/patient/dashboard/DailyGlycemiaCard";
import { WeeklyTrendsCard } from "@/components/patient/dashboard/WeeklyTrendsCard";
import { KPICard } from "@/components/patient/dashboard/KPICard";
import { DashboardHero } from "@/components/patient/dashboard/DashboardHero";
import { GlycemiaChart } from "@/components/patient/dashboard/GlycemiaChart";
import { useGlycemiaData } from "@/hooks/useGlycemiaData";
import { usePatientData } from "@/hooks/usePatientData";
import { useGlycemiaStats } from "@/hooks/useGlycemiaStats";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Plus, Heart, TrendingUp, Activity, Calendar, MessageSquare, FileText, ArrowRight, CheckCircle } from "lucide-react";

const PatientDashboard = () => {
  const navigate = useNavigate();

  console.log('🔥 PatientDashboard COMPONENT MOUNTED/RENDERED');

  const { readings, weeklyData, isLoading, error, stats: glycemiaStats } = useGlycemiaData();
  const { patient, stats: patientStats, isLoading: patientLoading } = usePatientData();

  // Calculate patient-specific stats
  const todayReadings = useMemo(() =>
    readings.filter(r => r.timestamp.startsWith(new Date().toISOString().split('T')[0])),
    [readings]
  );

  const complianceRate = useMemo(() =>
    patientStats?.complianceRate || Math.round((readings.length / (7 * 4)) * 100),
    [patientStats?.complianceRate, readings.length]
  );

  // Use the new hook for consistent stats calculation
  const stats = useGlycemiaStats(weeklyData, todayReadings.length);

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>{String(error)}</AlertDescription>
      </Alert>
    );
  }

  if (isLoading || patientLoading) {
    return (
      <div className="space-y-8">
        <Skeleton className="h-48 rounded-2xl" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-xl" />
          ))}
        </div>
        <Skeleton className="h-96 rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <DashboardHero
        title="Bonjour"
        subtitle={`Votre suivi maternel personnalisé - ${todayReadings.length} mesure${todayReadings.length !== 1 ? 's' : ''} aujourd'hui`}
        patientName={patient?.firstName}
        stats={[
          { label: `${complianceRate}% observance`, value: "" },
          { label: `${patientStats?.gestationalAge || 0} semaines d'aménorrhée`, value: "" },
        ]}
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <KPICard
          title="Mesures aujourd'hui"
          value={todayReadings.length}
          subtitle="sur 4 recommandées"
          icon={Activity}
          iconColor="text-primary"
          bgColor="bg-primary/20"
        />

        <KPICard
          title="Observance"
          value={`${complianceRate}%`}
          subtitle="des mesures recommandées"
          icon={CheckCircle}
          iconColor="text-secondary-foreground"
          bgColor="bg-secondary/30"
          className="hover:border-secondary/20 bg-gradient-to-br from-secondary/10 to-secondary/20"
        />

        <KPICard
          title="Prochain RDV"
          value={patientStats?.nextAppointmentDays || 3}
          subtitle="jours restants"
          icon={Calendar}
          iconColor="text-green-600"
          bgColor="bg-green-200"
          className="hover:border-green-200/50 bg-gradient-to-br from-green-50 to-green-100"
        />
      </div>

      {/* Quick Actions Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Add Measurement Widget */}
        <Card className="shadow-sm border-border/50">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Plus className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg">Nouvelle mesure de glycémie</CardTitle>
                <CardDescription>Saisir votre glycémie</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Button
              onClick={() => navigate('/patient/glycemia')}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl h-12"
            >
              <Plus className="h-4 w-4 mr-2" />
              Ajouter une mesure
            </Button>
          </CardContent>
        </Card>

        {/* Messages Widget */}
        <Card className="shadow-sm border-border/50">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-accent/10">
                <MessageSquare className="h-5 w-5 text-accent-foreground" />
              </div>
              <div>
                <CardTitle className="text-lg">Docteur IA</CardTitle>
                <CardDescription>Questions médicales</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Button
              variant="outline"
              onClick={() => navigate('/patient/doctor-ia')}
              className="w-full border-accent/20 hover:bg-accent/5 rounded-xl h-12"
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              Poser une question
            </Button>
          </CardContent>
        </Card>

        {/* Documents Widget */}
        <Card className="shadow-sm border-border/50">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-secondary/10">
                <FileText className="h-5 w-5 text-secondary-foreground" />
              </div>
              <div>
                <CardTitle className="text-lg">Documents</CardTitle>
                <CardDescription>Accès à vos analyses</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Button
              variant="outline"
              onClick={() => navigate('/patient/documents')}
              className="w-full border-secondary/20 hover:bg-secondary/5 rounded-xl h-12"
            >
              <FileText className="h-4 w-4 mr-2" />
              Voir mes documents
            </Button>
          </CardContent>
        </Card>
      </div>

      <GlycemiaChart
        data={weeklyData.map((day, index) => ({
          dayName: ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'][index % 7],
          average: day.average
        }))}
        title="Évolution de vos glycémies"
        description="Moyenne quotidienne cette semaine (en g/L)"
        showButton={true}
        buttonText="Voir le détail"
        onButtonClick={() => navigate('/patient/weekly')}
      />

      {/* Today's Measurements Section */}
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
            <Button
              onClick={() => navigate('/patient/glycemia')}
              className="rounded-xl bg-accent hover:bg-accent/90"
            >
              <Plus className="h-4 w-4 mr-2" />
              Ajouter
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Skeleton className="h-96 rounded-2xl" />
          ) : (
            <DailyGlycemiaCard readings={todayReadings} />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PatientDashboard;