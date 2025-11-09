import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { DoctorSidebar } from "@/components/doctor/DoctorSidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { Users, AlertCircle, CheckCircle, TrendingUp, MessageSquare, ArrowRight, Activity, Calendar, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Patient, GlycemieReading } from "@/types/patient";


const API_BASE_URL = 'http://localhost:3002';

const fetchPatients = async () => {
  const response = await fetch(`${API_BASE_URL}/patients`);
  if (!response.ok) throw new Error('Failed to fetch patients');
  return response.json();
};

const fetchGlycemiaReadings = async () => {
  const response = await fetch(`${API_BASE_URL}/glycemiaReadings`);
  if (!response.ok) throw new Error('Failed to fetch glycemia readings');
  return response.json();
};

const DoctorDashboard = () => {
  const navigate = useNavigate();
  const [doctorInfo, setDoctorInfo] = useState<{id: string; email: string; firstname: string; lastname: string} | null>(null);

  // Fetch data
  const { data: patients = [], isLoading: patientsLoading } = useQuery({
    queryKey: ['patients'],
    queryFn: fetchPatients,
  });

  const { data: readings = [], isLoading: readingsLoading } = useQuery({
    queryKey: ['glycemiaReadings'],
    queryFn: fetchGlycemiaReadings,
  });

  useEffect(() => {
    // Get doctor info from session
    const session = localStorage.getItem('doctorSession');
    if (session) {
      setDoctorInfo(JSON.parse(session));
    } else {
      navigate('/auth/doctor-login');
    }
  }, [navigate]);

  // Calculate statistics
  const totalPatients = patients.length;
  const patientsWithAlerts = patients.filter((p: Patient) =>
    readings.filter((r: any) => r.patientId === p.id && r.status === 'high').length > 0
  ).length;

  const highCompliancePatients = patients.filter((p: Patient) => {
    const patientReadings = readings.filter((r: any) => r.patientId === p.id);
    const totalExpected = 7 * 4; // 7 days * 4 readings per day
    const compliance = patientReadings.length / totalExpected * 100;
    return compliance >= 85;
  }).length;

  const averageCompliance = totalPatients > 0 ? Math.round(
    patients.reduce((sum: number, p: Patient) => {
      const patientReadings = readings.filter((r: any) => r.patientId === p.id);
      const totalExpected = 7 * 4;
      const compliance = patientReadings.length / totalExpected * 100;
      return sum + compliance;
    }, 0) / totalPatients
  ) : 0;

  // Prepare chart data
  const weeklyData = [
    { day: 'Lun', moyenne: 1.05 },
    { day: 'Mar', moyenne: 1.12 },
    { day: 'Mer', moyenne: 0.98 },
    { day: 'Jeu', moyenne: 1.08 },
    { day: 'Ven', moyenne: 1.15 },
    { day: 'Sam', moyenne: 1.02 },
    { day: 'Dim', moyenne: 0.95 },
  ];

  const statusData = [
    { name: 'Normal', value: patients.length - patientsWithAlerts, color: '#10B981' },
    { name: 'À surveiller', value: patientsWithAlerts, color: '#F59E0B' },
  ];

  const getPatientStatus = (patient: Patient) => {
    const patientAlerts = readings.filter((r: any) => r.patientId === patient.id && r.status === 'high').length;
    if (patientAlerts >= 2) return { status: "urgent", label: "Contacter", color: "bg-red-500 text-white" };
    if (patientAlerts > 0) return { status: "warning", label: "À surveiller", color: "bg-amber-500 text-white" };
    return { status: "ok", label: "OK", color: "bg-green-500 text-white" };
  };

  const isLoading = patientsLoading || readingsLoading;

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <DoctorSidebar />
        <main className="flex-1">
          {/* Header */}
          <header className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
            <div className="flex items-center gap-4 px-6 py-4">
              <SidebarTrigger />
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-foreground">Vue d'ensemble</h1>
                <p className="text-sm text-muted-foreground">Suivi de vos patientes</p>
              </div>
            </div>
          </header>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Welcome Header */}
            {doctorInfo && (
              <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg p-6 border border-primary/20">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      Bonjour Dr. {doctorInfo.firstname} {doctorInfo.lastname}
                    </h2>
                    <p className="text-gray-600 mt-1">
                      Voici un aperçu de vos patientes et de leur suivi glycémique
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Dernière connexion</p>
                    <p className="text-sm font-medium">{new Date().toLocaleDateString('fr-FR')}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="shadow-md hover:shadow-lg transition-shadow border-primary/20">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Total Patientes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Users className="h-6 w-6 text-primary" />
                    </div>
                    <p className="text-3xl font-bold">{totalPatients}</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-md hover:shadow-lg transition-shadow border-medical-warning/20">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Alertes actives
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-medical-warning/10">
                      <AlertCircle className="h-6 w-6 text-medical-warning" />
                    </div>
                    <p className="text-3xl font-bold">{patientsWithAlerts}</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-md hover:shadow-lg transition-shadow border-medical-normal/20">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Bon suivi
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-medical-normal/10">
                      <CheckCircle className="h-6 w-6 text-medical-normal" />
                    </div>
                    <p className="text-3xl font-bold">{highCompliancePatients}</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-md hover:shadow-lg transition-shadow border-accent/20">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Taux moyen
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-accent/10">
                      <TrendingUp className="h-6 w-6 text-accent-foreground" />
                    </div>
                    <p className="text-3xl font-bold">{averageCompliance}%</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Weekly Glycemic Trend */}
              <Card className="shadow-md">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    Évolution glycémique hebdomadaire
                  </CardTitle>
                  <CardDescription>
                    Moyenne des glycémies par jour (en g/L)
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={weeklyData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="day" />
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

              {/* Patient Status Distribution */}
              <Card className="shadow-md">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5 text-primary" />
                    Répartition des statuts patients
                  </CardTitle>
                  <CardDescription>
                    État de santé des patientes suivies
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={statusData}
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        dataKey="value"
                        label={({ name, value, percent }) =>
                          `${name}: ${value} (${(percent * 100).toFixed(0)}%)`
                        }
                      >
                        {statusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-primary" />
                  Activité récente
                </CardTitle>
                <CardDescription>
                  Dernières mesures glycémiques enregistrées
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {readings.slice(-5).reverse().map((reading: any) => {
                    const patient = patients.find((p: Patient) => p.id === reading.patientId);
                    return (
                      <div key={reading.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className={`w-3 h-3 rounded-full ${
                            reading.status === 'high' ? 'bg-red-500' :
                            reading.status === 'warning' ? 'bg-amber-500' : 'bg-green-500'
                          }`} />
                          <div>
                            <p className="font-medium">
                              {patient ? `${patient.firstName} ${patient.lastName}` : 'Patient inconnu'}
                            </p>
                            <p className="text-sm text-gray-600">
                              {reading.moment.replace('_', ' ').replace('apres', 'après')} • {reading.value} g/L
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">{reading.date}</p>
                          <p className="text-xs text-gray-500">{reading.time}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Patients List */}
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  Revue hebdomadaire des patientes
                </CardTitle>
                <CardDescription>
                  État du suivi et alertes pour chaque patiente - Vue d'ensemble
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {patients.map((patient) => {
                    const { status, label, color } = getPatientStatus(patient);
                    
                    return (
                      <div
                        key={patient.id}
                        className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-center gap-4 flex-1">
                          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                            <span className="text-lg font-semibold text-primary">
                              {patient.firstName[0]}{patient.lastName[0]}
                            </span>
                          </div>
                          
                          <div className="flex-1">
                            <p className="font-semibold">
                              {patient.firstName} {patient.lastName}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {patient.gestationalAge} SA • {patient.diabetesType}
                            </p>
                          </div>

                          <div className="hidden md:flex items-center gap-4 text-sm">
                            <div className="text-center">
                              <p className="font-semibold">{patient.weeklyAverage?.toFixed(2)} g/L</p>
                              <p className="text-xs text-muted-foreground">Moyenne</p>
                            </div>
                            <div className="text-center">
                              <p className="font-semibold">{patient.complianceRate}%</p>
                              <p className="text-xs text-muted-foreground">Complétion</p>
                            </div>
                            {patient.alertCount > 0 && (
                              <div className="text-center">
                                <p className="font-semibold text-medical-warning">{patient.alertCount}</p>
                                <p className="text-xs text-muted-foreground">Alertes</p>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <Badge className={color}>{label}</Badge>
                          <Button variant="ghost" size="icon">
                            <ArrowRight className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default DoctorDashboard;