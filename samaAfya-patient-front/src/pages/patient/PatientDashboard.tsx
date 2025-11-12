import { DashboardOverview } from "@/components/patient/dashboard/DashboardOverview";
import { DailyGlycemiaCard } from "@/components/patient/dashboard/DailyGlycemiaCard";
import { WeeklyTrendsCard } from "@/components/patient/dashboard/WeeklyTrendsCard";
import { useGlycemiaData } from "@/hooks/useGlycemiaData";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { AlertTriangle, Plus, Heart, TrendingUp, Activity, Calendar, MessageSquare, FileText, ArrowRight, CheckCircle } from "lucide-react";
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

  // Calculate patient-specific stats
  const todayReadings = readings.filter(r => r.timestamp.startsWith(new Date().toISOString().split('T')[0]));
  const weeklyAverage = weeklyData.length > 0 ? weeklyData.reduce((sum, day) => sum + day.average, 0) / weeklyData.length : 0;
  const complianceRate = Math.round((readings.length / (7 * 4)) * 100); // Assuming 4 readings per day for 7 days

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
                <div className="w-3 h-3 rounded-full bg-accent"></div>
                <span className="text-foreground font-medium">{weeklyAverage.toFixed(2)} g/L moyenne hebdo</span>
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

        <Card className="shadow-sm hover:shadow-md transition-all duration-200 border-border/50 hover:border-green-200/50 bg-gradient-to-br from-green-50 to-green-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">Prochain RDV</p>
                <p className="text-4xl font-bold text-green-600">3</p>
                <p className="text-xs text-muted-foreground mt-2">jours restants</p>
              </div>
              <div className="p-4 rounded-2xl bg-green-200">
                <Calendar className="h-8 w-8 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
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
              onClick={() => window.location.href = '/patient/glycemia'}
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
              onClick={() => window.location.href = '/patient/doctor-ia'}
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
              onClick={() => window.location.href = '/patient/documents'}
              className="w-full border-secondary/20 hover:bg-secondary/5 rounded-xl h-12"
            >
              <FileText className="h-4 w-4 mr-2" />
              Voir mes documents
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Main Chart Section */}
      <Card className="shadow-sm border-border/50">
        <CardHeader className="pb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-primary/10">
                <TrendingUp className="h-6 w-6 text-primary" />
              </div>
              <div>
                <CardTitle className="text-2xl">Évolution de vos glycémies</CardTitle>
                <CardDescription className="text-base">Moyenne quotidienne cette semaine (en g/L)</CardDescription>
              </div>
            </div>
            <Button variant="outline" className="rounded-xl">
              <ArrowRight className="h-4 w-4 mr-2" />
              Voir le détail
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Skeleton className="h-96 rounded-2xl" />
          ) : (
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={weeklyData.map((day, index) => ({
                day: ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'][index % 7],
                moyenne: day.average
              }))} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                  dataKey="day"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 14, fill: '#666', fontWeight: 500 }}
                />
                <YAxis
                  domain={[0.5, 1.5]}
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 14, fill: '#666', fontWeight: 500 }}
                />
                <Tooltip
                  formatter={(value) => [`${value} g/L`, 'Moyenne']}
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e0e0e0',
                    borderRadius: '12px',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                    fontSize: '14px'
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="moyenne"
                  stroke="#e11d48"
                  strokeWidth={4}
                  dot={{ fill: '#e11d48', strokeWidth: 3, r: 8 }}
                  activeDot={{ r: 10, stroke: '#e11d48', strokeWidth: 3, fill: 'white' }}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

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
              onClick={() => window.location.href = '/patient/glycemia'}
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
            <DailyGlycemiaCard readings={readings} />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PatientDashboard;