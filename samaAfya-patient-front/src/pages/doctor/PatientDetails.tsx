import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { DoctorSidebar } from "@/components/doctor/DoctorSidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
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
  Target
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";

const API_BASE_URL = 'http://localhost:5000';

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
        <div className="min-h-screen flex w-full">
          <DoctorSidebar />
          <main className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-gray-600">Chargement du profil patient...</p>
            </div>
          </main>
        </div>
      </SidebarProvider>
    );
  }

  if (!patient) {
    return (
      <SidebarProvider>
        <div className="min-h-screen flex w-full">
          <DoctorSidebar />
          <main className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">Patiente non trouvée</p>
              <Button onClick={() => navigate('/medecin/patients')}>
                Retour à la liste
              </Button>
            </div>
          </main>
        </div>
      </SidebarProvider>
    );
  }

  // Calculate statistics
  const totalReadings = readings.length;
  const highReadings = readings.filter((r: any) => r.status === 'high').length;
  const warningReadings = readings.filter((r: any) => r.status === 'warning').length;
  const normalReadings = readings.filter((r: any) => r.status === 'normal').length;

  const compliance = Math.round((totalReadings / (7 * 4)) * 100); // Expected: 7 days * 4 readings

  // Prepare chart data
  const dailyData = readings.reduce((acc: any, reading: any) => {
    const date = reading.date;
    if (!acc[date]) {
      acc[date] = { date, readings: [] };
    }
    acc[date].readings.push(reading);
    return acc;
  }, {});

  const chartData = Object.values(dailyData).map((day: any) => ({
    date: new Date(day.date).toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric' }),
    moyenne: day.readings.length > 0
      ? Math.round((day.readings.reduce((sum: number, r: any) => sum + r.value, 0) / day.readings.length) * 100) / 100
      : 0,
    mesures: day.readings.length
  }));

  // Status distribution
  const statusData = [
    { name: 'Normal', value: normalReadings, color: '#10B981' },
    { name: 'À surveiller', value: warningReadings, color: '#F59E0B' },
    { name: 'Élevé', value: highReadings, color: '#EF4444' },
  ];

  const getPatientStatus = () => {
    if (highReadings >= 2) return { status: "urgent", label: "Contacter", color: "bg-red-500 text-white" };
    if (highReadings > 0 || warningReadings > 2) return { status: "warning", label: "À surveiller", color: "bg-amber-500 text-white" };
    return { status: "ok", label: "OK", color: "bg-green-500 text-white" };
  };

  const { label, color } = getPatientStatus();

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <DoctorSidebar />
        <main className="flex-1">
          {/* Header */}
          <header className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
            <div className="flex items-center gap-4 px-6 py-4">
              <SidebarTrigger />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/medecin/patients')}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Retour
              </Button>
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-foreground">
                  {patient.firstName} {patient.lastName}
                </h1>
                <p className="text-sm text-muted-foreground">
                  Profil et suivi médical
                </p>
              </div>
              <Badge className={color}>{label}</Badge>
            </div>
          </header>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Patient Info */}
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Informations patiente
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-500">Nom complet</p>
                    <p className="text-lg font-semibold">{patient.firstName} {patient.lastName}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-500">Date de naissance</p>
                    <p className="text-lg">{new Date(patient.dateOfBirth).toLocaleDateString('fr-FR')}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-500">Trimestre de grossesse</p>
                    <p className="text-lg">{patient.gestationalWeek ? `${patient.gestationalWeek} SA` : 'N/A'}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-500">Type de diabète</p>
                    <Badge variant="outline">{patient.diabetesType}</Badge>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-500">Mode de surveillance</p>
                    <Badge variant="outline">{patient.monitoringMode || 'Non défini'}</Badge>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-500">Pays</p>
                    <p className="text-lg">{patient.country || 'Non spécifié'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="shadow-md">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Total mesures
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    <Activity className="h-6 w-6 text-primary" />
                    <p className="text-3xl font-bold">{totalReadings}</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-md">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Compliance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    <Target className="h-6 w-6 text-primary" />
                    <p className="text-3xl font-bold">{compliance}%</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-md">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Mesures normales
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-6 w-6 text-green-500" />
                    <p className="text-3xl font-bold text-green-600">{normalReadings}</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-md">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Alertes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-6 w-6 text-red-500" />
                    <p className="text-3xl font-bold text-red-600">{highReadings}</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Charts and Details */}
            <Tabs defaultValue="charts" className="space-y-4">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="charts">Graphiques</TabsTrigger>
                <TabsTrigger value="readings">Mesures détaillées</TabsTrigger>
                <TabsTrigger value="actions">Actions</TabsTrigger>
              </TabsList>

              <TabsContent value="charts" className="space-y-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Glycemic Trend */}
                  <Card className="shadow-md">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <TrendingUp className="h-5 w-5" />
                        Évolution glycémique
                      </CardTitle>
                      <CardDescription>
                        Moyenne des glycémies par jour
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={chartData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="date" />
                          <YAxis domain={[0.5, 1.5]} />
                          <Tooltip formatter={(value) => [`${value} g/L`, 'Moyenne']} />
                          <Line
                            type="monotone"
                            dataKey="moyenne"
                            stroke="#2F80ED"
                            strokeWidth={3}
                            dot={{ fill: '#2F80ED', strokeWidth: 2, r: 6 }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>

                  {/* Status Distribution */}
                  <Card className="shadow-md">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Activity className="h-5 w-5" />
                        Répartition des mesures
                      </CardTitle>
                      <CardDescription>
                        Par statut glycémique
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={statusData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Bar dataKey="value" fill="#2F80ED" />
                        </BarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="readings" className="space-y-4">
                <Card className="shadow-md">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Activity className="h-5 w-5" />
                      Historique des mesures ({readings.length})
                    </CardTitle>
                    <CardDescription>
                      Toutes les mesures glycémiques enregistrées
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      {readings
                        .sort((a: any, b: any) =>
                          new Date(b.date + 'T' + b.time).getTime() - new Date(a.date + 'T' + a.time).getTime()
                        )
                        .map((reading: any) => (
                          <div key={reading.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                            <div className="flex items-center gap-4">
                              <div className={`w-3 h-3 rounded-full ${
                                reading.status === 'high' ? 'bg-red-500' :
                                reading.status === 'warning' ? 'bg-amber-500' : 'bg-green-500'
                              }`} />
                              <div>
                                <p className="font-medium">
                                  {reading.moment.replace('_', ' ').replace('apres', 'après')} • {reading.value} g/L
                                </p>
                                <p className="text-sm text-gray-600">
                                  {reading.date} à {reading.time}
                                </p>
                              </div>
                            </div>
                            <Badge
                              variant="outline"
                              className={
                                reading.status === 'high' ? 'border-red-500 text-red-700' :
                                reading.status === 'warning' ? 'border-amber-500 text-amber-700' :
                                'border-green-500 text-green-700'
                              }
                            >
                              {reading.status === 'high' ? 'Élevé' :
                               reading.status === 'warning' ? 'À surveiller' : 'Normal'}
                            </Badge>
                          </div>
                        ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="actions" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card className="shadow-md">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <MessageSquare className="h-5 w-5" />
                        Contacter la patiente
                      </CardTitle>
                      <CardDescription>
                        Envoyer un message sécurisé
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button className="w-full">
                        Ouvrir messagerie
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="shadow-md">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <FileText className="h-5 w-5" />
                        Documents médicaux
                      </CardTitle>
                      <CardDescription>
                        Consulter les documents partagés
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button variant="outline" className="w-full">
                        Voir documents
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default PatientDetails;