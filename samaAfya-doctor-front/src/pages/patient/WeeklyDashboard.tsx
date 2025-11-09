import { useState } from "react";
import { PatientLayout } from "@/components/layout/PatientLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TrendingUp, TrendingDown, Minus, Activity, Target, Calendar, BarChart3, PieChart } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart as RechartsPieChart, Pie, Cell, RadialBarChart, RadialBar, Legend } from "recharts";
import { format, subWeeks, startOfWeek, endOfWeek, eachDayOfInterval } from "date-fns";
import { fr } from "date-fns/locale";


const generateWeeklyData = () => {
  const today = new Date();
  const weekStart = startOfWeek(today, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(today, { weekStartsOn: 1 });
  const days = eachDayOfInterval({ start: weekStart, end: weekEnd });

  return days.map((day, index) => {
    const baseValue = 1.0 + Math.sin(index * 0.5) * 0.3; // Create some variation
    const fasting = baseValue + (Math.random() - 0.5) * 0.2;
    const beforeMeal = baseValue + 0.2 + (Math.random() - 0.5) * 0.15;
    const afterMeal = baseValue + 0.4 + (Math.random() - 0.5) * 0.25;

    return {
      date: format(day, 'yyyy-MM-dd'),
      dayName: format(day, 'EEE', { locale: fr }),
      fullDate: format(day, 'dd/MM', { locale: fr }),
      fasting: Math.round(fasting * 100) / 100,
      beforeMeal: Math.round(beforeMeal * 100) / 100,
      afterMeal: Math.round(afterMeal * 100) / 100,
      average: Math.round(((fasting + beforeMeal + afterMeal) / 3) * 100) / 100,
      measurements: Math.floor(Math.random() * 4) + 1, // 1-4 measurements per day
    };
  });
};

const weeklyData = generateWeeklyData();

// Calculate summary statistics
const totalMeasurements = weeklyData.reduce((sum, day) => sum + day.measurements, 0);
const averageGlycemia = weeklyData.reduce((sum, day) => sum + day.average, 0) / weeklyData.length;
const trend = weeklyData.length > 1 ?
  ((weeklyData[weeklyData.length - 1].average - weeklyData[0].average) / weeklyData[0].average) * 100 : 0;

// Measurement distribution data
const measurementDistribution = [
  { name: 'Matin (à jeun)', value: 35, color: '#3b82f6' },
  { name: 'Avant repas', value: 30, color: '#8b5cf6' },
  { name: 'Après repas', value: 35, color: '#ef4444' },
];

// Insulin data (mock - for future use)
const insulinData = weeklyData.map(day => ({
  day: day.dayName,
  basal: Math.round((Math.random() * 20 + 15) * 10) / 10, // 15-35 units
  bolus: Math.round((Math.random() * 10 + 5) * 10) / 10, // 5-15 units
}));

const WeeklyDashboard = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("current");
  const [selectedDataType, setSelectedDataType] = useState("glycemia");

  const getTrendIcon = () => {
    if (Math.abs(trend) < 2) return <Minus className="h-4 w-4 text-gray-500" />;
    return trend > 0 ?
      <TrendingUp className="h-4 w-4 text-red-500" /> :
      <TrendingDown className="h-4 w-4 text-green-500" />;
  };

  const getTrendColor = () => {
    if (Math.abs(trend) < 2) return "text-gray-600 bg-gray-50";
    return trend > 0 ? "text-red-600 bg-red-50" : "text-green-600 bg-green-50";
  };

  const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: unknown[]; label?: string }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium">{label}</p>
          {payload.map((entry: unknown, index: number) => {
            const typedEntry = entry as { name: string; value: number; color: string };
            return (
              <p key={index} style={{ color: typedEntry.color }} className="text-sm">
                {typedEntry.name}: {typedEntry.value} mmol/L
              </p>
            );
          })}
        </div>
      );
    }
    return null;
  };

  return (
    <PatientLayout title="Tableau de bord hebdomadaire">
      <div className="space-y-6">
        {/* Header with Filters */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Tableau de bord hebdomadaire</h2>
            <p className="text-muted-foreground">Suivez vos indicateurs de santé sur 7 jours</p>
          </div>
          <div className="flex gap-3">
            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="current">Semaine actuelle</SelectItem>
                <SelectItem value="previous">Semaine précédente</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedDataType} onValueChange={setSelectedDataType}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="glycemia">Glycémie</SelectItem>
                <SelectItem value="insulin">Insuline</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Summary Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Moyenne hebdomadaire</p>
                  <p className="text-2xl font-bold">{averageGlycemia.toFixed(1)} mmol/L</p>
                </div>
                <Target className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Mesures effectuées</p>
                  <p className="text-2xl font-bold">{totalMeasurements}</p>
                </div>
                <Activity className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Tendance</p>
                  <div className="flex items-center gap-2">
                    <p className="text-2xl font-bold">{Math.abs(trend).toFixed(1)}%</p>
                    {getTrendIcon()}
                  </div>
                </div>
                <div className={`p-2 rounded-full ${getTrendColor()}`}>
                  <BarChart3 className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Glycemia Line Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-blue-600" />
                Évolution de la glycémie
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={weeklyData}>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis
                      dataKey="dayName"
                      fontSize={12}
                      tick={{ fontSize: 12 }}
                    />
                    <YAxis
                      domain={[0.5, 2.5]}
                      fontSize={12}
                      label={{ value: 'mmol/L', angle: -90, position: 'insideLeft' }}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    {/* Target range lines */}
                    <Line
                      type="monotone"
                      dataKey="fasting"
                      stroke="#3b82f6"
                      strokeWidth={3}
                      dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                      name="À jeun"
                    />
                    <Line
                      type="monotone"
                      dataKey="beforeMeal"
                      stroke="#8b5cf6"
                      strokeWidth={3}
                      dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 4 }}
                      name="Avant repas"
                    />
                    <Line
                      type="monotone"
                      dataKey="afterMeal"
                      stroke="#ef4444"
                      strokeWidth={3}
                      dot={{ fill: '#ef4444', strokeWidth: 2, r: 4 }}
                      name="Après repas"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="flex justify-center gap-6 mt-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-sm">À jeun</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                  <span className="text-sm">Avant repas</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span className="text-sm">Après repas</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Measurement Distribution */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="h-5 w-5 text-green-600" />
                Répartition des mesures
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPieChart>
                    <Pie
                      data={measurementDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {measurementDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value}%`, 'Pourcentage']} />
                    <Legend />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Insulin Chart (Future feature) */}
        <Card className="opacity-60">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-amber-600" />
              Suivi de l'insuline (à venir)
              <Badge variant="outline" className="ml-auto bg-amber-50 text-amber-700 border-amber-200">
                Fonctionnalité future
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <BarChart3 className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-medium mb-2">Suivi insulinique</h3>
                <p className="text-sm">
                  Cette fonctionnalité sera disponible lors du passage au traitement insulinique.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Weekly Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              Résumé hebdomadaire
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
              {weeklyData.map((day) => (
                <div key={day.date} className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-sm font-medium text-gray-600 mb-1">{day.dayName}</div>
                  <div className="text-lg font-bold text-primary mb-1">
                    {day.average.toFixed(1)}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {day.measurements} mesure{day.measurements > 1 ? 's' : ''}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </PatientLayout>
  );
};

export default WeeklyDashboard;