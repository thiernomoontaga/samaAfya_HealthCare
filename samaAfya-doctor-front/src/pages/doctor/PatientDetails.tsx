import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import { DoctorSidebar } from "@/components/doctor/DoctorSidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import {
  User,
  Calendar,
  Activity,
  TrendingUp,
  MessageSquare,
  FileText,
  ArrowLeft,
  AlertTriangle,
  CheckCircle,
  Clock,
  Target,
  Heart,
  Stethoscope,
  Eye,
  Phone
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Patient, GlycemieReading } from "@/types/patient";

const API_BASE_URL = 'http://localhost:3001';

const fetchPatient = async (id: string) => {
  const response = await fetch(`${API_BASE_URL}/patients/${id}`);
  if (!response.ok) throw new Error('Failed to fetch patient');
  return response.json();
};

const fetchPatientReadings = async (patientId: string) => {
  const response = await fetch(`${API_BASE_URL}/glycemiaReadings?patientId=${patientId}`);
  if (!response.ok) throw new Error('Failed to fetch readings');
  return response.json();
};

const PatientDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: patient, isLoading: patientLoading } = useQuery({
    queryKey: ['patient', id],
    queryFn: () => fetchPatient(id!),
    enabled: !!id,
  });

  const { data: readings = [], isLoading: readingsLoading } = useQuery({
    queryKey: ['patientReadings', id],
    queryFn: () => fetchPatientReadings(id!),
    enabled: !!id,
  });

  if (patientLoading || readingsLoading) {
    return (
      <SidebarProvider>
        <DoctorSidebar />
        <SidebarInset>
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-center space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              <p className="text-muted-foreground">Chargement du profil patient...</p>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    );
  }

  if (!patient) {
    return (
      <SidebarProvider>
        <DoctorSidebar />
        <SidebarInset>
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-center space-y-6">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto">
                <User className="h-8 w-8 text-muted-foreground" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-foreground">Patiente non trouvée</h3>
                <p className="text-muted-foreground">Cette patiente n'existe pas ou a été supprimée</p>
              </div>
              <Button onClick={() => navigate('/medecin/patients')} className="rounded-xl">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Retour à la liste
              </Button>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    );
  }

  // Calculate statistics
  const totalReadings = readings.length;
  const highReadings = readings.filter((r: GlycemieReading) => r.status === 'high').length;
  const warningReadings = readings.filter((r: GlycemieReading) => r.status === 'warning').length;
  const normalReadings = readings.filter((r: GlycemieReading) => r.status === 'normal').length;

  const compliance = Math.round((totalReadings / (7 * 4)) * 100); // Expected: 7 days * 4 readings

  // Prepare chart data
  const dailyData = readings.reduce((acc: Record<string, { date: string; readings: GlycemieReading[] }>, reading: GlycemieReading) => {
    const date = reading.date;
    if (!acc[date]) {
      acc[date] = { date, readings: [] };
    }
    acc[date].readings.push(reading);
    return acc;
  }, {});

  const chartData = Object.values(dailyData).map((day: { date: string; readings: GlycemieReading[] }) => ({
    date: new Date(day.date).toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric' }),
    moyenne: day.readings.length > 0
      ? Math.round((day.readings.reduce((sum: number, r: GlycemieReading) => sum + r.value, 0) / day.readings.length) * 100) / 100
      : 0,
    mesures: day.readings.length
  }));

  // Status distribution for pie chart
  const statusData = [
    { name: 'Normal', value: normalReadings, color: '#10B981' },
    { name: 'À surveiller', value: warningReadings, color: '#F59E0B' },
    { name: 'Élevé', value: highReadings, color: '#EF4444' },
  ].filter(item => item.value > 0);

  const getPatientStatus = () => {
    if (highReadings >= 2) return { status: "urgent", label: "Contacter", color: "bg-red-500 text-white", bgColor: "bg-red-50", borderColor: "border-red-200" };
    if (highReadings > 0 || warningReadings > 2) return { status: "warning", label: "À surveiller", color: "bg-amber-500 text-white", bgColor: "bg-amber-50", borderColor: "border-amber-200" };
    return { status: "ok", label: "OK", color: "bg-green-500 text-white", bgColor: "bg-green-50", borderColor: "border-green-200" };
  };

  const { label, color, bgColor, borderColor } = getPatientStatus();

  return (
    <SidebarProvider>
      <DoctorSidebar />
      <SidebarInset>
        {/* Header / Topbar */}
        <header className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border/50">
          <div className="flex items-center justify-between px-6 py-4">
            {/* Left side - Logo & Title */}
            <div className="flex items-center gap-4">
              <SidebarTrigger className="hover:bg-muted rounded-lg p-2" />
              <Button
                variant="ghost"
                onClick={() => navigate('/medecin/patients')}
                className="rounded-xl hover:bg-primary/10 hover:text-primary"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Retour
              </Button>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <User className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-foreground">
                    {patient.firstName} {patient.lastName}
                  </h1>
                  <p className="text-xs text-muted-foreground">Profil et suivi médical</p>
                </div>
              </div>
            </div>

            {/* Right side - Status Badge */}
            <div className="flex items-center gap-4">
              <Badge className={`${color} px-4 py-2 text-sm font-semibold rounded-lg`}>
                {label}
              </Badge>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="p-8 space-y-8">
          {/* Patient Overview Hero */}
          <div className={`bg-gradient-to-r from-primary/5 to-accent/5 rounded-2xl p-8 border ${borderColor}`}>
            <div className="flex items-center justify-between">
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-2xl font-bold text-primary">
                      {patient.firstName[0]}{patient.lastName[0]}
                    </span>
                  </div>
                  <div className="space-y-1">
                    <h2 className="text-3xl font-bold text-foreground">
                      {patient.firstName} {patient.lastName}
                    </h2>
                    <p className="text-muted-foreground text-lg">
                      {patient.gestationalAge} semaines de grossesse • {patient.diabetesType}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Née le {new Date(patient.dateOfBirth).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-primary"></div>
                    <span className="text-foreground font-medium">{totalReadings} mesures enregistrées</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-accent"></div>
                    <span className="text-foreground font-medium">Compliance {compliance}%</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${highReadings > 0 ? 'bg-red-500' : warningReadings > 0 ? 'bg-amber-500' : 'bg-green-500'}`}></div>
                    <span className="text-foreground font-medium">
                      {highReadings > 0 ? `${highReadings} alertes` : warningReadings > 0 ? `${warningReadings} avertissements` : 'Situation stable'}
                    </span>
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

          {/* Patient Information Card */}
          <Card className="shadow-sm border-border/50">
            <CardHeader className="pb-6">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-primary/10">
                  <User className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-2xl">Informations personnelles</CardTitle>
                  <CardDescription className="text-base">Détails médicaux et informations de contact</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="space-y-3">
                  <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Nom complet
                  </label>
                  <p className="text-lg font-medium text-foreground">{patient.firstName} {patient.lastName}</p>
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Date de naissance
                  </label>
                  <p className="text-lg font-medium text-foreground">
                    {new Date(patient.dateOfBirth).toLocaleDateString('fr-FR')}
                  </p>
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <Heart className="h-4 w-4" />
                    Grossesse
                  </label>
                  <p className="text-lg font-medium text-foreground">{patient.gestationalAge} semaines</p>
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <Activity className="h-4 w-4" />
                    Type de diabète
                  </label>
                  <Badge variant="outline" className="text-sm px-3 py-1 rounded-lg">
                    {patient.diabetesType}
                  </Badge>
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <Stethoscope className="h-4 w-4" />
                    Mode de surveillance
                  </label>
                  <Badge variant="outline" className="text-sm px-3 py-1 rounded-lg">
                    {patient.monitoringMode || 'Classique'}
                  </Badge>
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <Target className="h-4 w-4" />
                    Statut actuel
                  </label>
                  <Badge className={`${color} px-3 py-1 text-sm font-semibold rounded-lg`}>
                    {label}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="shadow-sm hover:shadow-md transition-all duration-200 border-border/50 hover:border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-2">Total mesures</p>
                    <p className="text-4xl font-bold text-primary">{totalReadings}</p>
                    <p className="text-xs text-muted-foreground mt-2">Dernière semaine</p>
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
                    <p className="text-sm font-medium text-muted-foreground mb-2">Compliance</p>
                    <p className="text-4xl font-bold text-accent-foreground">{compliance}%</p>
                    <p className="text-xs text-muted-foreground mt-2">Taux d'observance</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-accent/30">
                    <Target className="h-8 w-8 text-accent-foreground" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-sm hover:shadow-md transition-all duration-200 border-border/50 hover:border-green-200/50 bg-gradient-to-br from-green-50 to-green-100">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-2">Mesures normales</p>
                    <p className="text-4xl font-bold text-green-600">{normalReadings}</p>
                    <p className="text-xs text-muted-foreground mt-2">Dans les normes</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-green-200">
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-sm hover:shadow-md transition-all duration-200 border-border/50 hover:border-red-200/50 bg-gradient-to-br from-red-50 to-red-100">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-2">Alertes actives</p>
                    <p className="text-4xl font-bold text-red-600">{highReadings}</p>
                    <p className="text-xs text-muted-foreground mt-2">Attention requise</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-red-200">
                    <AlertTriangle className="h-8 w-8 text-red-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Tabs */}
          <Card className="shadow-sm border-border/50">
            <CardHeader className="pb-6">
              <Tabs defaultValue="analytics" className="w-full">
                <TabsList className="grid w-full grid-cols-3 rounded-xl bg-muted/50 p-1">
                  <TabsTrigger value="analytics" className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm">
                    <TrendingUp className="h-4 w-4 mr-2" />
                    Analyses
                  </TabsTrigger>
                  <TabsTrigger value="readings" className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm">
                    <Activity className="h-4 w-4 mr-2" />
                    Mesures
                  </TabsTrigger>
                  <TabsTrigger value="actions" className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Actions
                  </TabsTrigger>
                </TabsList>

                {/* Analytics Tab */}
                <TabsContent value="analytics" className="mt-8 space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Glycemic Trend Chart */}
                    <Card className="shadow-sm border-border/50">
                      <CardHeader className="pb-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-primary/10">
                            <TrendingUp className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <CardTitle className="text-lg">Évolution glycémique</CardTitle>
                            <CardDescription>Moyenne des glycémies par jour</CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <ResponsiveContainer width="100%" height={350}>
                          <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                            <XAxis
                              dataKey="date"
                              axisLine={false}
                              tickLine={false}
                              tick={{ fontSize: 12, fill: '#666' }}
                            />
                            <YAxis
                              domain={[0.5, 1.5]}
                              axisLine={false}
                              tickLine={false}
                              tick={{ fontSize: 12, fill: '#666' }}
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
                              stroke="#007BBA"
                              strokeWidth={4}
                              dot={{ fill: '#007BBA', strokeWidth: 3, r: 8 }}
                              activeDot={{ r: 10, stroke: '#007BBA', strokeWidth: 3, fill: 'white' }}
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </CardContent>
                    </Card>

                    {/* Status Distribution Pie Chart */}
                    <Card className="shadow-sm border-border/50">
                      <CardHeader className="pb-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-accent/20">
                            <Activity className="h-5 w-5 text-accent-foreground" />
                          </div>
                          <div>
                            <CardTitle className="text-lg">Répartition des mesures</CardTitle>
                            <CardDescription>Par statut glycémique</CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between">
                          <ResponsiveContainer width="60%" height={300}>
                            <PieChart>
                              <Pie
                                data={statusData}
                                cx="50%"
                                cy="50%"
                                outerRadius={80}
                                innerRadius={50}
                                dataKey="value"
                                stroke="none"
                              >
                                {statusData.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                              </Pie>
                              <Tooltip
                                formatter={(value, name) => [`${value} mesures`, name]}
                                contentStyle={{
                                  backgroundColor: 'white',
                                  border: '1px solid #e0e0e0',
                                  borderRadius: '8px',
                                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                                }}
                              />
                            </PieChart>
                          </ResponsiveContainer>

                          <div className="space-y-3">
                            {statusData.map((entry, index) => (
                              <div key={index} className="flex items-center gap-3">
                                <div
                                  className="w-4 h-4 rounded-full"
                                  style={{ backgroundColor: entry.color }}
                                ></div>
                                <div>
                                  <p className="text-sm font-semibold text-foreground">{entry.name}</p>
                                  <p className="text-xs text-muted-foreground">{entry.value} mesures</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                {/* Readings Tab */}
                <TabsContent value="readings" className="mt-8 space-y-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 rounded-xl bg-primary/10">
                      <Activity className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-2xl">Historique des mesures</CardTitle>
                      <CardDescription className="text-base">Toutes les mesures glycémiques enregistrées ({readings.length})</CardDescription>
                    </div>
                  </div>

                  <Card className="shadow-sm border-border/50">
                    <CardContent className="p-6">
                      <div className="space-y-4 max-h-96 overflow-y-auto">
                        {readings
                          .sort((a: GlycemieReading, b: GlycemieReading) =>
                            new Date(b.date + 'T' + b.time).getTime() - new Date(a.date + 'T' + a.time).getTime()
                          )
                          .map((reading: GlycemieReading) => (
                            <div key={reading.id} className="flex items-center justify-between p-4 bg-muted/20 rounded-xl hover:bg-muted/30 transition-colors">
                              <div className="flex items-center gap-4">
                                <div className={`w-4 h-4 rounded-full ${
                                  reading.status === 'high' ? 'bg-red-500' :
                                  reading.status === 'warning' ? 'bg-amber-500' : 'bg-green-500'
                                }`} />
                                <div className="space-y-1">
                                  <p className="font-semibold text-foreground">
                                    {reading.moment.replace('_', ' ').replace('apres', 'après')} • {reading.value} g/L
                                  </p>
                                  <p className="text-sm text-muted-foreground">
                                    {reading.date} à {reading.time}
                                  </p>
                                </div>
                              </div>
                              <Badge
                                variant="outline"
                                className={`px-3 py-1 rounded-lg ${
                                  reading.status === 'high' ? 'border-red-500 text-red-700 bg-red-50' :
                                  reading.status === 'warning' ? 'border-amber-500 text-amber-700 bg-amber-50' :
                                  'border-green-500 text-green-700 bg-green-50'
                                }`}
                              >
                                {reading.status === 'high' ? 'Élevé' :
                                 reading.status === 'warning' ? 'À surveiller' : 'Normal'}
                              </Badge>
                            </div>
                          ))}
                      </div>

                      {readings.length === 0 && (
                        <div className="text-center py-12">
                          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                            <Activity className="h-8 w-8 text-muted-foreground" />
                          </div>
                          <h3 className="text-lg font-semibold text-foreground mb-2">Aucune mesure</h3>
                          <p className="text-muted-foreground">Aucune mesure glycémique n'a encore été enregistrée</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Actions Tab */}
                <TabsContent value="actions" className="mt-8 space-y-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 rounded-xl bg-primary/10">
                      <MessageSquare className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-2xl">Actions disponibles</CardTitle>
                      <CardDescription className="text-base">Communiquer et gérer les soins de la patiente</CardDescription>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card className="shadow-sm border-border/50 hover:border-primary/20 transition-all duration-200">
                      <CardHeader className="pb-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-primary/10">
                            <MessageSquare className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <CardTitle className="text-lg">Messagerie sécurisée</CardTitle>
                            <CardDescription>Contacter la patiente de manière sécurisée</CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl">
                          <MessageSquare className="h-4 w-4 mr-2" />
                          Ouvrir la messagerie
                        </Button>
                      </CardContent>
                    </Card>

                    <Card className="shadow-sm border-border/50 hover:border-accent/20 transition-all duration-200">
                      <CardHeader className="pb-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-accent/20">
                            <FileText className="h-5 w-5 text-accent-foreground" />
                          </div>
                          <div>
                            <CardTitle className="text-lg">Documents médicaux</CardTitle>
                            <CardDescription>Consulter et partager des documents</CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <Button variant="outline" className="w-full rounded-xl hover:bg-accent/5">
                          <FileText className="h-4 w-4 mr-2" />
                          Voir les documents
                        </Button>
                      </CardContent>
                    </Card>

                    <Card className="shadow-sm border-border/50 hover:border-green-200/50 transition-all duration-200">
                      <CardHeader className="pb-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-green-100">
                            <Phone className="h-5 w-5 text-green-600" />
                          </div>
                          <div>
                            <CardTitle className="text-lg">Téléconsultation</CardTitle>
                            <CardDescription>Planifier une consultation vidéo</CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <Button variant="outline" className="w-full rounded-xl hover:bg-green-5">
                          <Phone className="h-4 w-4 mr-2" />
                          Programmer un RDV
                        </Button>
                      </CardContent>
                    </Card>

                    <Card className="shadow-sm border-border/50 hover:border-blue-200/50 transition-all duration-200">
                      <CardHeader className="pb-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-blue-100">
                            <Eye className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <CardTitle className="text-lg">Rapport détaillé</CardTitle>
                            <CardDescription>Générer un rapport complet</CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <Button variant="outline" className="w-full rounded-xl hover:bg-blue-5">
                          <Eye className="h-4 w-4 mr-2" />
                          Générer le rapport
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
              </Tabs>
            </CardHeader>
          </Card>

          {/* Footer */}
          <footer className="mt-12 pt-8 border-t border-border/50">
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <div className="flex items-center gap-6">
                <span>© 2025 samaAfya HealthCare</span>
                <a href="#" className="hover:text-foreground transition-colors">Politique de confidentialité</a>
                <a href="#" className="hover:text-foreground transition-colors">Conditions d'utilisation</a>
              </div>
              <div className="flex items-center gap-4">
                <span>Version 1.0.0</span>
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <span>Système opérationnel</span>
              </div>
            </div>
          </footer>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default PatientDetails;