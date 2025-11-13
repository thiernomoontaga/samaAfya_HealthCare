import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { Users, AlertCircle, CheckCircle, TrendingUp, MessageSquare, ArrowRight, Activity, Calendar, Clock, Search, LogOut, Stethoscope, Heart, Bell, Plus, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Patient, GlycemieReading } from "@/types/patient";


const API_BASE_URL = 'http://localhost:3001';

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
    readings.filter((r: GlycemieReading) => r.patientId === p.id && r.status === 'high').length > 0
  ).length;

  const highCompliancePatients = patients.filter((p: Patient) => {
    const patientReadings = readings.filter((r: GlycemieReading) => r.patientId === p.id);
    const totalExpected = 7 * 4; // 7 days * 4 readings per day
    const compliance = patientReadings.length / totalExpected * 100;
    return compliance >= 85;
  }).length;

  const averageCompliance = totalPatients > 0 ? Math.round(
    patients.reduce((sum: number, p: Patient) => {
      const patientReadings = readings.filter((r: GlycemieReading) => r.patientId === p.id);
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
    const patientAlerts = readings.filter((r: GlycemieReading) => r.patientId === patient.id && r.status === 'high').length;
    if (patientAlerts >= 2) return { status: "urgent", label: "Contacter", color: "bg-red-500 text-white" };
    if (patientAlerts > 0) return { status: "warning", label: "À surveiller", color: "bg-amber-500 text-white" };
    return { status: "ok", label: "OK", color: "bg-green-500 text-white" };
  };

  const isLoading = patientsLoading || readingsLoading;

  return (
    <div className="space-y-8 mt-8">
            {/* Hero / Welcome Section */}
            {doctorInfo && (
              <div className="bg-gradient-to-r from-primary/5 to-accent/5 rounded-2xl p-8 border border-primary/10">
                <div className="flex items-center justify-between">
                  <div className="space-y-3">
                    <h2 className="text-4xl font-bold text-foreground">
                      Bonjour Dr. {doctorInfo.firstname} {doctorInfo.lastname}
                    </h2>
                    <p className="text-muted-foreground text-xl">
                      Voici votre tableau de bord médical - {totalPatients} patientes suivies
                    </p>
                    <div className="flex items-center gap-6 mt-6">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full bg-primary"></div>
                        <span className="text-foreground font-medium">{totalPatients} patientes actives</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full bg-accent"></div>
                        <span className="text-foreground font-medium">{averageCompliance}% compliance moyenne</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                        <span className="text-foreground font-medium">{patientsWithAlerts} alertes actives</span>
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
            )}

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="shadow-sm hover:shadow-md transition-all duration-200 border-border/50 hover:border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-2">Patientes actives</p>
                      <p className="text-4xl font-bold text-primary">{totalPatients}</p>
                      <p className="text-xs text-muted-foreground mt-2">Suivies actuellement</p>
                    </div>
                    <div className="p-4 rounded-2xl bg-primary/20">
                      <Users className="h-8 w-8 text-primary" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-sm hover:shadow-md transition-all duration-200 border-border/50 hover:border-amber-200/50 bg-gradient-to-br from-amber-50 to-amber-100">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-2">Alertes actives</p>
                      <p className="text-4xl font-bold text-amber-600">{patientsWithAlerts}</p>
                      <p className="text-xs text-muted-foreground mt-2">Nécessitent attention</p>
                    </div>
                    <div className="p-4 rounded-2xl bg-amber-200">
                      <AlertCircle className="h-8 w-8 text-amber-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-sm hover:shadow-md transition-all duration-200 border-border/50 hover:border-green-200/50 bg-gradient-to-br from-green-50 to-green-100">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-2">Moyenne glycémie</p>
                      <p className="text-4xl font-bold text-green-600">1.02</p>
                      <p className="text-xs text-muted-foreground mt-2">g/L cette semaine</p>
                    </div>
                    <div className="p-4 rounded-2xl bg-green-200">
                      <Activity className="h-8 w-8 text-green-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-sm hover:shadow-md transition-all duration-200 border-border/50 hover:border-accent/20 bg-gradient-to-br from-accent/10 to-accent/20">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-2">RDV à venir</p>
                      <p className="text-4xl font-bold text-accent-foreground">3</p>
                      <p className="text-xs text-muted-foreground mt-2">Cette semaine</p>
                    </div>
                    <div className="p-4 rounded-2xl bg-accent/30">
                      <Calendar className="h-8 w-8 text-accent-foreground" />
                    </div>
                  </div>
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
                      <CardTitle className="text-2xl">Évolution glycémique hebdomadaire</CardTitle>
                      <CardDescription className="text-base">Moyenne des glycémies par jour (en g/L)</CardDescription>
                    </div>
                  </div>
                  <Button variant="outline" className="rounded-xl">
                    <Eye className="h-4 w-4 mr-2" />
                    Voir détails
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={weeklyData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
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
                      stroke="#007BBA"
                      strokeWidth={4}
                      dot={{ fill: '#007BBA', strokeWidth: 3, r: 8 }}
                      activeDot={{ r: 10, stroke: '#007BBA', strokeWidth: 3, fill: 'white' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Widgets Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Status Distribution Widget */}
              <Card className="shadow-sm border-border/50">
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-accent/10">
                      <Activity className="h-5 w-5 text-accent-foreground" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">Statuts patients</CardTitle>
                      <CardDescription>Répartition actuelle</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie
                        data={statusData}
                        cx="50%"
                        cy="50%"
                        outerRadius={70}
                        innerRadius={40}
                        dataKey="value"
                        stroke="none"
                      >
                        {statusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value, name) => [`${value} patientes`, name]}
                        contentStyle={{
                          backgroundColor: 'white',
                          border: '1px solid #e0e0e0',
                          borderRadius: '8px',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="space-y-2 mt-4">
                    {statusData.map((entry, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: entry.color }}
                          ></div>
                          <span className="text-sm text-muted-foreground">{entry.name}</span>
                        </div>
                        <span className="text-sm font-semibold">{entry.value}</span>
                      </div>
                    ))}
                  </div>
  
                </CardContent>
              </Card>

              {/* Recent Alerts Widget */}
              <Card className="shadow-sm border-border/50">
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-red-50">
                      <AlertCircle className="h-5 w-5 text-red-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">Alertes récentes</CardTitle>
                      <CardDescription>Derniers signaux d'alarme</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {readings.filter((r: GlycemieReading) => r.status === 'high').slice(0, 3).map((reading: GlycemieReading) => {
                      const patient = patients.find((p: Patient) => p.id === reading.patientId);
                      return (
                        <div key={reading.id} className="flex items-center gap-3 p-3 bg-red-50 rounded-lg border border-red-100">
                          <div className="w-2 h-2 rounded-full bg-red-500"></div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-red-900">
                              {patient ? `${patient.firstName} ${patient.lastName}` : 'Patient inconnu'}
                            </p>
                            <p className="text-xs text-red-700">
                              {reading.value} g/L • {reading.moment.replace('_', ' ')}
                            </p>
                          </div>
                          <span className="text-xs text-red-600">{reading.date}</span>
                        </div>
                      );
                    })}
                    {readings.filter((r: GlycemieReading) => r.status === 'high').length === 0 && (
                      <div className="text-center py-8 text-muted-foreground">
                        <CheckCircle className="h-8 w-8 mx-auto mb-2 text-green-500" />
                        <p className="text-sm">Aucune alerte active</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions Widget */}
              <Card className="shadow-sm border-border/50">
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Plus className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">Actions rapides</CardTitle>
                      <CardDescription>Outils fréquemment utilisés</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Button
                      onClick={() => navigate('/medecin/patients')}
                      className="w-full justify-start gap-3 h-12 rounded-xl bg-primary hover:bg-primary/90"
                    >
                      <Users className="h-5 w-5" />
                      Voir la liste des patientes
                    </Button>

                    <Button
                      variant="outline"
                      className="w-full justify-start gap-3 h-12 rounded-xl border-primary/20 hover:bg-primary/5"
                    >
                      <MessageSquare className="h-5 w-5" />
                      Envoyer un message
                    </Button>

                    <Button
                      variant="outline"
                      className="w-full justify-start gap-3 h-12 rounded-xl border-accent/20 hover:bg-accent/5"
                    >
                      <Calendar className="h-5 w-5" />
                      Programmer un RDV
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>



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
  );
};

export default DoctorDashboard;