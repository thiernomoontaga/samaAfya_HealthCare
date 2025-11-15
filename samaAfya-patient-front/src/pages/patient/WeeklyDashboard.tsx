import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TrendingUp, TrendingDown, Minus, Activity, Target, Calendar, BarChart3, PieChart, Heart, Sparkles, Award, CheckCircle, AlertTriangle, Zap } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart as RechartsPieChart, Pie, Cell, RadialBarChart, RadialBar, Legend, AreaChart, Area, ReferenceLine, ReferenceArea } from "recharts";
import { format, subWeeks, startOfWeek, endOfWeek, eachDayOfInterval } from "date-fns";
import { fr } from "date-fns/locale";
import { useGlycemiaData } from "@/hooks/useGlycemiaData";

const WeeklyDashboard = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("current");
  const [selectedDataType, setSelectedDataType] = useState("glycemia");

  // Get real data from the hook
  const { readings, weeklyData, isLoading, stats } = useGlycemiaData();

  // Calculate trend from real data
  const trend = weeklyData.length > 1 ?
    ((weeklyData[weeklyData.length - 1].average - weeklyData[0].average) / weeklyData[0].average) * 100 : 0;

  // Transform weekly data to match component expectations
  const transformedWeeklyData = weeklyData.map((day, index) => {
    const dayNames = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
    return {
      ...day,
      dayName: dayNames[index] || '???',
      fullDate: new Date(day.date).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' }),
      measurements: readings.filter(r => r.timestamp.startsWith(day.date)).length
    };
  });

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
    <div className="space-y-8 mt-8">
      {/* Hero / Welcome Section */}
      <div className="bg-gradient-to-r from-primary/5 to-accent/5 rounded-2xl p-8 border border-primary/10">
        <div className="flex items-center justify-between">
          <div className="space-y-3">
            <h2 className="text-4xl font-bold text-foreground">
              Vos statistiques hebdomadaires
            </h2>
            <p className="text-muted-foreground text-xl">
              Analyse de vos glycémies sur 7 jours - {stats.todayReadings} mesure{stats.todayReadings !== 1 ? 's' : ''} effectuée{stats.todayReadings !== 1 ? 's' : ''}
            </p>
            <div className="flex items-center gap-6 mt-6">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-primary"></div>
                <span className="text-foreground font-medium">Moyenne: {stats.weeklyAverage.toFixed(1)} g/L</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-accent"></div>
                <span className="text-foreground font-medium">Tendance: {Math.abs(trend).toFixed(1)}%</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-secondary"></div>
                <span className="text-foreground font-medium">Régularité: {Math.round((stats.todayReadings / 21) * 100)}%</span>
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
                <p className="text-sm font-medium text-muted-foreground mb-2">Moyenne hebdomadaire</p>
                <p className="text-4xl font-bold text-primary">{stats.weeklyAverage.toFixed(1)}</p>
                <p className="text-xs text-muted-foreground mt-2">g/L</p>
              </div>
              <div className="p-4 rounded-2xl bg-primary/20">
                <Target className="h-8 w-8 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm hover:shadow-md transition-all duration-200 border-border/50 hover:border-accent/20 bg-gradient-to-br from-accent/10 to-accent/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">Mesures effectuées</p>
                <p className="text-4xl font-bold text-accent-foreground">{stats.todayReadings}</p>
                <p className="text-xs text-muted-foreground mt-2">cette semaine</p>
              </div>
              <div className="p-4 rounded-2xl bg-accent/30">
                <Activity className="h-8 w-8 text-accent-foreground" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm hover:shadow-md transition-all duration-200 border-border/50 hover:border-secondary/20 bg-gradient-to-br from-secondary/10 to-secondary/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">Tendance</p>
                <p className="text-4xl font-bold text-secondary-foreground">{Math.abs(trend).toFixed(1)}%</p>
                <p className="text-xs text-muted-foreground mt-2">{trend > 0 ? 'à surveiller' : 'positive'}</p>
              </div>
              <div className="p-4 rounded-2xl bg-secondary/30">
                {getTrendIcon()}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm hover:shadow-md transition-all duration-200 border-border/50 hover:border-green-200/50 bg-gradient-to-br from-green-50 to-green-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">Régularité</p>
                <p className="text-4xl font-bold text-green-600">{Math.round((stats.todayReadings / 21) * 100)}</p>
                <p className="text-xs text-muted-foreground mt-2">% des mesures</p>
              </div>
              <div className="p-4 rounded-2xl bg-green-200">
                <CheckCircle className="h-8 w-8 text-green-600" />
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
                <CardTitle className="text-2xl">Évolution hebdomadaire</CardTitle>
                <CardDescription className="text-base">Vos moyennes glycémiques quotidiennes (en g/L)</CardDescription>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={transformedWeeklyData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                dataKey="dayName"
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
                dataKey="average"
                stroke="#e11d48"
                strokeWidth={4}
                dot={{ fill: '#e11d48', strokeWidth: 3, r: 8 }}
                activeDot={{ r: 10, stroke: '#e11d48', strokeWidth: 3, fill: 'white' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Weekly Summary */}
      <Card className="shadow-sm border-border/50">
        <CardHeader className="pb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-accent/10">
              <Calendar className="h-6 w-6 text-accent-foreground" />
            </div>
            <div>
              <CardTitle className="text-2xl">Résumé hebdomadaire</CardTitle>
              <CardDescription className="text-base">Votre semaine en un coup d'œil</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
            {transformedWeeklyData.map((day, index) => {
              const isGoodDay = day.average >= 0.7 && day.average <= 1.2;
              const isWarningDay = day.average > 1.2 && day.average <= 1.8;
              const isBadDay = day.average > 1.8;

              return (
                <div
                  key={day.date}
                  className={`text-center p-4 rounded-xl border transition-all duration-300 hover:shadow-lg ${
                    isGoodDay
                      ? 'bg-green-50 border-green-200'
                      : isWarningDay
                      ? 'bg-yellow-50 border-yellow-200'
                      : 'bg-red-50 border-red-200'
                  }`}
                >
                  <div className="text-sm font-semibold mb-2 text-gray-700">
                    {day.dayName}
                  </div>

                  <div className={`text-xl font-bold mb-2 ${
                    isGoodDay ? 'text-green-700' :
                    isWarningDay ? 'text-yellow-700' :
                    'text-red-700'
                  }`}>
                    {day.average.toFixed(1)}
                  </div>

                  <div className="text-xs text-gray-600 mb-2">
                    {day.measurements} mesure{day.measurements > 1 ? 's' : ''}
                  </div>

                  <div className="flex justify-center">
                    {isGoodDay ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : isWarningDay ? (
                      <AlertTriangle className="h-4 w-4 text-yellow-600" />
                    ) : (
                      <AlertTriangle className="h-4 w-4 text-red-600" />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WeeklyDashboard;