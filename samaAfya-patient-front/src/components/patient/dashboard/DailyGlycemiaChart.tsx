import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, ReferenceArea } from "recharts";
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
        return "#3b82f6"; 
      case "before_meal":
        return "#8b5cf6"; 
      case "after_meal":
        return "#ef4444"; 
      default:
        return "#6b7280";
    }
  };

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <TrendingUp className="h-4 w-4 text-blue-600" />
          Glycémie journalière
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-48 mb-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis
                dataKey="time"
                fontSize={11}
                tick={{ fontSize: 11 }}
                interval="preserveStartEnd"
              />
              <YAxis
                domain={[0.5, 3]}
                fontSize={11}
                tick={{ fontSize: 11 }}
              />
              <Tooltip content={<CustomTooltip />} />

              {/* Normal range area */}
              <ReferenceArea
                y1={0.6}
                y2={1.2}
                fill="#dcfce7"
                fillOpacity={0.3}
                stroke="none"
              />

              {/* Target lines */}
              <ReferenceLine
                y={0.95}
                stroke="#22c55e"
                strokeDasharray="2 2"
              />

              {/* Data line */}
              <Line
                type="monotone"
                dataKey="value"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={(props) => {
                  const { payload } = props;
                  return (
                    <circle
                      cx={props.cx}
                      cy={props.cy}
                      r={4}
                      fill={getDotColor(payload?.mealContext)}
                      stroke="#fff"
                      strokeWidth={2}
                    />
                  );
                }}
                activeDot={{ r: 6, stroke: "#3b82f6", strokeWidth: 2, fill: "#fff" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap justify-center gap-4 text-xs">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span>À jeun</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
            <span>Avant repas</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span>Après repas</span>
          </div>
          <div className="flex items-center gap-1 ml-2">
            <div className="w-3 h-3 bg-green-200 rounded-sm opacity-60"></div>
            <span>Zone normale</span>
          </div>
        </div>

        {/* Summary */}
        {readings.length > 0 && (
          <div className="mt-3 pt-3 border-t border-gray-100">
            <div className="text-center text-sm text-gray-600">
              {readings.length} mesure{readings.length > 1 ? 's' : ''} aujourd'hui
              {readings.length > 1 && (
                <span className="ml-2">
                  • Moyenne: {(readings.reduce((sum, r) => sum + r.value, 0) / readings.length).toFixed(1)} mmol/L
                </span>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

