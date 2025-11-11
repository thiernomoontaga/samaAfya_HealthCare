import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TrendingUp, TrendingDown, Minus, Activity, Target, Calendar, BarChart3, PieChart, Heart, Sparkles, Award, CheckCircle, AlertTriangle, Zap } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart as RechartsPieChart, Pie, Cell, RadialBarChart, RadialBar, Legend, AreaChart, Area, ReferenceLine, ReferenceArea } from "recharts";
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
    <div className="space-y-6">
      {/* Hero Section */}
      <div className="text-center space-y-4 mb-8">
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
            Vos statistiques hebdomadaires 💕
          </h1>
          <p className="text-lg text-gray-600 leading-relaxed max-w-2xl mx-auto">
            Découvrez vos progrès de santé sur 7 jours avec des graphiques intuitifs et des insights personnalisés
          </p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100/50 hover:shadow-lg transition-all duration-300 cursor-pointer group">
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
            <h3 className="font-semibold text-blue-800 mb-2">Évolution</h3>
            <p className="text-sm text-blue-600">Suivez vos tendances</p>
          </CardContent>
        </Card>

        <Card className="border-2 border-green-200 bg-gradient-to-br from-green-50 to-green-100/50 hover:shadow-lg transition-all duration-300 cursor-pointer group">
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
              <Award className="h-6 w-6 text-white" />
            </div>
            <h3 className="font-semibold text-green-800 mb-2">Réussites</h3>
            <p className="text-sm text-green-600">Célébrez vos victoires</p>
          </CardContent>
        </Card>

        <Card className="border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-purple-100/50 hover:shadow-lg transition-all duration-300 cursor-pointer group">
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
              <Zap className="h-6 w-6 text-white" />
            </div>
            <h3 className="font-semibold text-purple-800 mb-2">Insights</h3>
            <p className="text-sm text-purple-600">Comprenez vos données</p>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        {/* Header with Filters */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Analyse détaillée</h2>
            <p className="text-muted-foreground">Explorez vos données de santé semaine par semaine</p>
          </div>
          <div className="flex gap-3">
            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger className="w-40 border-purple-200 focus:border-purple-300">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="current">Semaine actuelle</SelectItem>
                <SelectItem value="previous">Semaine précédente</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedDataType} onValueChange={setSelectedDataType}>
              <SelectTrigger className="w-40 border-purple-200 focus:border-purple-300">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="glycemia">Glycémie</SelectItem>
                <SelectItem value="insulin">Insuline</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Enhanced Summary Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100/30 hover:shadow-xl transition-all duration-300">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                      <Target className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-blue-700">Moyenne hebdomadaire</p>
                      <p className="text-2xl font-bold text-blue-800">{averageGlycemia.toFixed(1)} mmol/L</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-blue-600">
                    <CheckCircle className="h-3 w-3" />
                    <span>Dans la cible recommandée</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-green-200 bg-gradient-to-br from-green-50 to-green-100/30 hover:shadow-xl transition-all duration-300">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
                      <Activity className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-green-700">Mesures effectuées</p>
                      <p className="text-2xl font-bold text-green-800">{totalMeasurements}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-green-600">
                    <Award className="h-3 w-3" />
                    <span>Bravo pour votre régularité !</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-purple-100/30 hover:shadow-xl transition-all duration-300">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      trend > 0 ? 'bg-gradient-to-br from-red-400 to-red-600' : 'bg-gradient-to-br from-green-400 to-green-600'
                    }`}>
                      {getTrendIcon()}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-purple-700">Tendance</p>
                      <p className="text-2xl font-bold text-purple-800">{Math.abs(trend).toFixed(1)}%</p>
                    </div>
                  </div>
                  <div className={`flex items-center gap-2 text-xs ${
                    trend > 0 ? 'text-red-600' : 'text-green-600'
                  }`}>
                    <TrendingUp className="h-3 w-3" />
                    <span>
                      {trend > 0 ? 'À surveiller' : 'Excellente évolution'}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Main Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Glycemia Area Chart */}
          <Card className="border-2 border-blue-200 bg-gradient-to-br from-white to-blue-50/30">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                  <TrendingUp className="h-4 w-4 text-white" />
                </div>
                <span className="text-lg">Évolution de votre glycémie</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={weeklyData} margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
                    <defs>
                      <linearGradient id="fastingGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
                      </linearGradient>
                      <linearGradient id="beforeMealGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.1}/>
                      </linearGradient>
                      <linearGradient id="afterMealGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#ef4444" stopOpacity={0.1}/>
                      </linearGradient>
                    </defs>

                    <CartesianGrid strokeDasharray="3 3" className="opacity-20" stroke="#e5e7eb" />
                    <XAxis
                      dataKey="dayName"
                      fontSize={12}
                      tick={{ fontSize: 12, fill: '#6b7280' }}
                      axisLine={{ stroke: '#d1d5db' }}
                      tickLine={{ stroke: '#d1d5db' }}
                    />
                    <YAxis
                      domain={[0.3, 2.5]}
                      fontSize={12}
                      tick={{ fontSize: 12, fill: '#6b7280' }}
                      axisLine={{ stroke: '#d1d5db' }}
                      tickLine={{ stroke: '#d1d5db' }}
                      label={{ value: 'mmol/L', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fill: '#6b7280' } }}
                    />
                    <Tooltip content={<CustomTooltip />} />

                    {/* Target ranges */}
                    <ReferenceArea
                      y1={0.7}
                      y2={0.95}
                      fill="#dcfce7"
                      fillOpacity={0.4}
                      stroke="#22c55e"
                      strokeDasharray="2 2"
                      strokeWidth={1}
                    />
                    <ReferenceArea
                      y1={1.4}
                      y2={2.0}
                      fill="#fef3c7"
                      fillOpacity={0.3}
                      stroke="#f59e0b"
                      strokeDasharray="2 2"
                      strokeWidth={1}
                    />

                    {/* Data areas */}
                    <Area
                      type="monotone"
                      dataKey="fasting"
                      stroke="#3b82f6"
                      strokeWidth={3}
                      fill="url(#fastingGradient)"
                      dot={{ fill: '#3b82f6', strokeWidth: 3, r: 5, stroke: '#ffffff' }}
                      activeDot={{ r: 8, stroke: "#3b82f6", strokeWidth: 3, fill: "#ffffff" }}
                      name="À jeun"
                    />
                    <Area
                      type="monotone"
                      dataKey="beforeMeal"
                      stroke="#8b5cf6"
                      strokeWidth={3}
                      fill="url(#beforeMealGradient)"
                      dot={{ fill: '#8b5cf6', strokeWidth: 3, r: 5, stroke: '#ffffff' }}
                      activeDot={{ r: 8, stroke: "#8b5cf6", strokeWidth: 3, fill: "#ffffff" }}
                      name="Avant repas"
                    />
                    <Area
                      type="monotone"
                      dataKey="afterMeal"
                      stroke="#ef4444"
                      strokeWidth={3}
                      fill="url(#afterMealGradient)"
                      dot={{ fill: '#ef4444', strokeWidth: 3, r: 5, stroke: '#ffffff' }}
                      activeDot={{ r: 8, stroke: "#ef4444", strokeWidth: 3, fill: "#ffffff" }}
                      name="Après repas"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* Enhanced Legend */}
              <div className="grid grid-cols-3 gap-4 mt-6">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <div className="w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-sm"></div>
                    <span className="text-sm font-medium text-blue-700">À jeun</span>
                  </div>
                  <div className="text-xs text-blue-600">Matin</div>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <div className="w-4 h-4 bg-purple-500 rounded-full border-2 border-white shadow-sm"></div>
                    <span className="text-sm font-medium text-purple-700">Avant repas</span>
                  </div>
                  <div className="text-xs text-purple-600">Pré-prandial</div>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <div className="w-4 h-4 bg-red-500 rounded-full border-2 border-white shadow-sm"></div>
                    <span className="text-sm font-medium text-red-700">Après repas</span>
                  </div>
                  <div className="text-xs text-red-600">Post-prandial</div>
                </div>
              </div>

              {/* Target zones info */}
              <div className="mt-4 p-3 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200">
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-green-700 font-medium">Zones cibles affichées</span>
                  <span className="text-green-600">•</span>
                  <span className="text-gray-600">Vert: cible • Jaune: attention</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Enhanced Measurement Distribution */}
          <Card className="border-2 border-green-200 bg-gradient-to-br from-white to-green-50/30">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
                  <PieChart className="h-4 w-4 text-white" />
                </div>
                <span className="text-lg">Répartition de vos mesures</span>
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
                      innerRadius={70}
                      outerRadius={110}
                      paddingAngle={8}
                      dataKey="value"
                    >
                      {measurementDistribution.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={entry.color}
                          stroke="#ffffff"
                          strokeWidth={3}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value) => [`${value}%`, 'Pourcentage']}
                      contentStyle={{
                        backgroundColor: '#ffffff',
                        border: '2px solid #e5e7eb',
                        borderRadius: '8px',
                        boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
                      }}
                    />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </div>

              {/* Enhanced Legend */}
              <div className="grid grid-cols-1 gap-3 mt-6">
                {measurementDistribution.map((entry, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-5 h-5 rounded-full border-2 border-white shadow-sm"
                        style={{ backgroundColor: entry.color }}
                      ></div>
                      <span className="font-medium text-gray-800">{entry.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold text-gray-900">{entry.value}%</span>
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div
                          className="h-2 rounded-full transition-all duration-500"
                          style={{
                            width: `${entry.value}%`,
                            backgroundColor: entry.color
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Insights */}
              <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200">
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-semibold text-blue-800">Insight de la semaine</span>
                </div>
                <p className="text-sm text-blue-700 leading-relaxed">
                  Vous êtes très régulière dans vos mesures matinales ! Continuez ainsi pour un suivi optimal de votre diabète gestationnel.
                </p>
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

        {/* Enhanced Weekly Summary */}
        <Card className="border-2 border-purple-200 bg-gradient-to-br from-white to-purple-50/30">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center">
                <Calendar className="h-4 w-4 text-white" />
              </div>
              <span className="text-lg">Votre semaine en un coup d'œil</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
              {weeklyData.map((day, index) => {
                const isToday = index === 6; // Assuming last day is today
                const isGoodDay = day.average >= 0.7 && day.average <= 1.2;
                const isWarningDay = day.average > 1.2 && day.average <= 1.8;
                const isBadDay = day.average > 1.8;

                return (
                  <div
                    key={day.date}
                    className={`text-center p-4 rounded-xl border-2 transition-all duration-300 hover:shadow-lg ${
                      isToday
                        ? 'bg-gradient-to-br from-purple-100 to-pink-100 border-purple-300 shadow-md'
                        : isGoodDay
                        ? 'bg-gradient-to-br from-green-50 to-green-100 border-green-200'
                        : isWarningDay
                        ? 'bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200'
                        : 'bg-gradient-to-br from-red-50 to-red-100 border-red-200'
                    }`}
                  >
                    <div className={`text-sm font-semibold mb-2 ${
                      isToday ? 'text-purple-800' : 'text-gray-700'
                    }`}>
                      {day.dayName}
                      {isToday && <span className="ml-1 text-purple-600">•</span>}
                    </div>

                    <div className={`text-xl font-bold mb-2 ${
                      isGoodDay ? 'text-green-700' :
                      isWarningDay ? 'text-yellow-700' :
                      isBadDay ? 'text-red-700' : 'text-purple-700'
                    }`}>
                      {day.average.toFixed(1)}
                    </div>

                    <div className="text-xs text-gray-600 mb-2">
                      {day.measurements} mesure{day.measurements > 1 ? 's' : ''}
                    </div>

                    {/* Status indicator */}
                    <div className="flex justify-center">
                      {isGoodDay ? (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      ) : isWarningDay ? (
                        <AlertTriangle className="h-4 w-4 text-yellow-600" />
                      ) : isBadDay ? (
                        <AlertTriangle className="h-4 w-4 text-red-600" />
                      ) : (
                        <div className="w-4 h-4 rounded-full bg-purple-400"></div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Weekly insights */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-xl border border-green-200">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-semibold text-green-800">Jours excellents</span>
                </div>
                <p className="text-lg font-bold text-green-700">
                  {weeklyData.filter(d => d.average >= 0.7 && d.average <= 1.2).length}/7
                </p>
              </div>

              <div className="p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl border border-blue-200">
                <div className="flex items-center gap-2 mb-2">
                  <Activity className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-semibold text-blue-800">Régularité</span>
                </div>
                <p className="text-lg font-bold text-blue-700">
                  {Math.round((totalMeasurements / 21) * 100)}%
                </p>
              </div>

              <div className="p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl border border-purple-200">
                <div className="flex items-center gap-2 mb-2">
                  <Award className="h-4 w-4 text-purple-600" />
                  <span className="text-sm font-semibold text-purple-800">Évolution</span>
                </div>
                <p className={`text-lg font-bold ${
                  trend > 0 ? 'text-red-700' : 'text-green-700'
                }`}>
                  {trend > 0 ? '+' : ''}{trend.toFixed(1)}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default WeeklyDashboard;