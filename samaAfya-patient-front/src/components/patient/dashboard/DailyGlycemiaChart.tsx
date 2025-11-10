import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Target, AlertTriangle, CheckCircle, Clock } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, ReferenceArea, Area, AreaChart } from "recharts";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface DailyReading {
  id: string;
  value: number;
  timestamp: string;
  mealContext: "fasting" | "before_meal" | "after_meal";
  status: "normal" | "warning" | "critical";
}

interface DailyGlycemiaChartProps {
  readings: DailyReading[];
  className?: string;
  patientProfile?: {
    monitoringMode?: string;
    postMealTiming?: string;
  };
}

const formatTime = (timestamp: string) => {
  try {
    const date = new Date(timestamp);
    // Check if date is valid
    if (isNaN(date.getTime())) {
      console.warn('Invalid timestamp:', timestamp);
      return '00:00';
    }
    return format(date, 'HH:mm', { locale: fr });
  } catch (error) {
    console.error('Error formatting time:', error, timestamp);
    return '00:00';
  }
};

interface TooltipProps {
  active?: boolean;
  payload?: Array<{
    name: string;
    value: number;
    color: string;
    payload?: {
      mealContext: string;
    };
  }>;
  label?: string;
}

const CustomTooltip = ({ active, payload, label }: TooltipProps) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const contextLabels = {
      fasting: "À jeun",
      before_meal: "Avant repas",
      after_meal: "Après repas"
    };

    return (
      <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
        <p className="font-medium">{label}</p>
        <p className="text-sm text-blue-600">
          {payload[0].value} mmol/L
        </p>
        <p className="text-xs text-gray-600">
          {contextLabels[data.mealContext as keyof typeof contextLabels]}
        </p>
      </div>
    );
  }
  return null;
};

export const DailyGlycemiaChart = ({
  readings,
  className = "",
  patientProfile,
}: DailyGlycemiaChartProps) => {
  
  const chartData = readings
    .filter(reading => reading.timestamp && reading.timestamp.trim() !== '')
    .sort((a, b) => {
      try {
        return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
      } catch (error) {
        console.warn('Error sorting timestamps:', error, a.timestamp, b.timestamp);
        return 0;
      }
    })
    .map(reading => ({
      time: formatTime(reading.timestamp),
      value: reading.value,
      mealContext: reading.mealContext,
      fullTime: reading.timestamp,
    }));

  const getDotColor = (mealContext: string) => {
    switch (mealContext) {
      case "fasting":
        return "#3b82f6"; // Bleu pour à jeun
      case "before_meal":
        return "#f59e0b"; // Orange pour avant repas
      case "after_meal":
        return "#ef4444"; // Rouge pour après repas
      default:
        return "#6b7280";
    }
  };

  // Calculate target ranges based on meal context
  const getTargetRanges = () => {
    if (patientProfile?.monitoringMode === 'strict' || patientProfile?.monitoringMode === 'strict8') {
      return {
        fasting: { min: 0.7, max: 0.95 },
        beforeMeal: { min: 0.7, max: 0.95 },
        afterMeal: { min: 1.0, max: 1.4 }
      };
    }
    return {
      fasting: { min: 0.7, max: 0.95 },
      beforeMeal: { min: 0.7, max: 0.95 },
      afterMeal: { min: 1.0, max: 1.4 }
    };
  };

  const targetRanges = getTargetRanges();

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <TrendingUp className="h-4 w-4 text-blue-600" />
          Glycémie journalière
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64 mb-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
              <defs>
                <linearGradient id="normalRange" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#dcfce7" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#dcfce7" stopOpacity={0.1}/>
                </linearGradient>
                <linearGradient id="warningRange" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#fef3c7" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#fef3c7" stopOpacity={0.1}/>
                </linearGradient>
              </defs>

              <CartesianGrid strokeDasharray="3 3" className="opacity-20" stroke="#e5e7eb" />
              <XAxis
                dataKey="time"
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

              {/* Target ranges with different colors based on context */}
              <ReferenceArea
                y1={targetRanges.fasting.min}
                y2={targetRanges.fasting.max}
                fill="#dcfce7"
                fillOpacity={0.4}
                stroke="#22c55e"
                strokeDasharray="2 2"
                strokeWidth={1}
              />

              {/* Warning zone */}
              <ReferenceArea
                y1={targetRanges.afterMeal.max}
                y2={2.0}
                fill="#fef3c7"
                fillOpacity={0.3}
                stroke="#f59e0b"
                strokeDasharray="2 2"
                strokeWidth={1}
              />

              {/* Critical zone */}
              <ReferenceArea
                y1={2.0}
                y2={2.5}
                fill="#fee2e2"
                fillOpacity={0.3}
                stroke="#ef4444"
                strokeDasharray="2 2"
                strokeWidth={1}
              />

              {/* Target lines */}
              <ReferenceLine
                y={targetRanges.fasting.max}
                stroke="#22c55e"
                strokeDasharray="3 3"
                strokeWidth={2}
              />

              {/* Data line with gradient */}
              <Line
                type="monotone"
                dataKey="value"
                stroke="#3b82f6"
                strokeWidth={3}
                dot={(props) => {
                  const { payload } = props;
                  if (!payload) return null;

                  const color = getDotColor(payload.mealContext);
                  return (
                    <circle
                      cx={props.cx}
                      cy={props.cy}
                      r={5}
                      fill={color}
                      stroke="#ffffff"
                      strokeWidth={3}
                      style={{
                        filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))',
                        cursor: 'pointer'
                      }}
                    />
                  );
                }}
                activeDot={{
                  r: 8,
                  stroke: "#3b82f6",
                  strokeWidth: 3,
                  fill: "#ffffff",
                  style: { filter: 'drop-shadow(0 4px 8px rgba(59, 130, 246, 0.3))' }
                }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Enhanced Legend */}
        <div className="space-y-3">
          <div className="flex flex-wrap justify-center gap-6 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-sm"></div>
              <span className="font-medium">À jeun</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-amber-500 rounded-full border-2 border-white shadow-sm"></div>
              <span className="font-medium">Avant repas</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-500 rounded-full border-2 border-white shadow-sm"></div>
              <span className="font-medium">Après repas</span>
            </div>
          </div>

          {/* Target zones legend */}
          <div className="flex flex-wrap justify-center gap-4 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-4 h-3 bg-green-200 rounded-sm border border-green-300"></div>
              <span className="text-green-700 font-medium">Zone cible</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-3 bg-yellow-200 rounded-sm border border-yellow-300"></div>
              <span className="text-yellow-700 font-medium">Zone d'attention</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-3 bg-red-200 rounded-sm border border-red-300"></div>
              <span className="text-red-700 font-medium">Zone critique</span>
            </div>
          </div>
        </div>

        {/* Enhanced Summary */}
        {readings.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div className="space-y-1">
                <div className="text-2xl font-bold text-blue-600">{readings.length}</div>
                <div className="text-xs text-gray-600">Mesures du jour</div>
              </div>
              <div className="space-y-1">
                <div className="text-2xl font-bold text-green-600">
                  {(readings.reduce((sum, r) => sum + r.value, 0) / readings.length).toFixed(1)}
                </div>
                <div className="text-xs text-gray-600">Moyenne (mmol/L)</div>
              </div>
              <div className="space-y-1">
                <div className="text-2xl font-bold text-purple-600">
                  {readings.filter(r => r.status === "normal").length}
                </div>
                <div className="text-xs text-gray-600">Dans la cible</div>
              </div>
              <div className="space-y-1">
                <div className="text-2xl font-bold text-orange-600">
                  {readings.filter(r => r.status === "warning").length}
                </div>
                <div className="text-xs text-gray-600">À surveiller</div>
              </div>
            </div>

            {/* Status badges */}
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              {readings.filter(r => r.status === "normal").length > 0 && (
                <Badge variant="secondary" className="bg-green-100 text-green-700 border-green-200">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  {readings.filter(r => r.status === "normal").length} excellentes
                </Badge>
              )}
              {readings.filter(r => r.status === "warning").length > 0 && (
                <Badge variant="secondary" className="bg-yellow-100 text-yellow-700 border-yellow-200">
                  <AlertTriangle className="h-3 w-3 mr-1" />
                  {readings.filter(r => r.status === "warning").length} à surveiller
                </Badge>
              )}
              {readings.filter(r => r.status === "critical").length > 0 && (
                <Badge variant="secondary" className="bg-red-100 text-red-700 border-red-200">
                  <AlertTriangle className="h-3 w-3 mr-1" />
                  {readings.filter(r => r.status === "critical").length} critiques
                </Badge>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

