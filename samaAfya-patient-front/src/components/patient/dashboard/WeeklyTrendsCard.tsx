import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrendingUp, Download, Calendar } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";

interface WeeklyData {
  date: string;
  fasting: number | null;
  beforeMeal: number | null;
  afterMeal: number | null;
  average: number;
}

interface WeeklyTrendsCardProps {
  data: WeeklyData[];
  className?: string;
}

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric' });
};

interface TooltipProps {
  active?: boolean;
  payload?: Array<{
    name: string;
    value: number;
    color: string;
  }>;
  label?: string;
}

const CustomTooltip = ({ active, payload, label }: TooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
        <p className="font-medium">{formatDate(label)}</p>
        {payload.map((entry, index) => (
          <p key={index} style={{ color: entry.color }} className="text-sm">
            {entry.name}: {entry.value} mmol/L
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export const WeeklyTrendsCard = ({
  data,
  className = "",
}: WeeklyTrendsCardProps) => {
  // For daily trends, show today's data in a different format
  const todayData = data.find(d => d.date === new Date().toISOString().split('T')[0]);
  const chartData = todayData ? [{
    time: "Matin",
    value: todayData.fasting || 0,
    label: "À jeun"
  }, {
    time: "Midi",
    value: todayData.beforeMeal || 0,
    label: "Avant repas"
  }, {
    time: "Après-midi",
    value: todayData.afterMeal || 0,
    label: "Après repas"
  }] : [];

  const handleExport = () => {
    // Create CSV data
    const csvData = [
      ['Date', 'À jeun', 'Avant repas', 'Après repas', 'Moyenne'],
      ...data.map(day => [
        day.date,
        day.fasting || '',
        day.beforeMeal || '',
        day.afterMeal || '',
        day.average
      ])
    ];

    // Convert to CSV string
    const csvContent = csvData.map(row => row.join(',')).join('\n');

    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `tendances-glycemiques-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-green-600" />
            Glycémie hebdomadaire
          </CardTitle>
          <Button variant="outline" size="sm" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Exporter
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-64 mb-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis
                dataKey="date"
                tickFormatter={formatDate}
                fontSize={12}
              />
              <YAxis
                domain={[2, 12]}
                fontSize={12}
                label={{ value: 'mmol/L', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip content={<CustomTooltip />} />
              {/* Target range lines */}
              <ReferenceLine y={5.5} stroke="hsl(var(--success))" strokeDasharray="5 5" label="Cible" />
              <ReferenceLine y={7.8} stroke="hsl(var(--caution))" strokeDasharray="5 5" />
              {/* Data lines */}
              <Line
                type="monotone"
                dataKey="À jeun"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                connectNulls={false}
              />
              <Line
                type="monotone"
                dataKey="Avant repas"
                stroke="#8b5cf6"
                strokeWidth={2}
                dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 4 }}
                connectNulls={false}
              />
              <Line
                type="monotone"
                dataKey="Après repas"
                stroke="#ef4444"
                strokeWidth={2}
                dot={{ fill: '#ef4444', strokeWidth: 2, r: 4 }}
                connectNulls={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span>À jeun</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
            <span>Avant repas</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span>Après repas</span>
          </div>
          <div className="flex items-center gap-2 ml-4">
            <div className="w-3 h-0.5 bg-green-500 border-dashed border-t-2"></div>
            <span>Cible (5.5 mmol/L)</span>
          </div>
        </div>

        {/* Summary stats */}
        <div className="mt-4 grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">
              {data.filter(d => d.average <= 5.5).length}
            </div>
            <div className="text-sm text-green-700">Jours dans la cible</div>
          </div>
          <div className="text-center p-3 bg-amber-50 rounded-lg">
            <div className="text-2xl font-bold text-amber-600">
              {Math.round(data.reduce((sum, d) => sum + d.average, 0) / data.length * 10) / 10}
            </div>
            <div className="text-sm text-amber-700">Tendance hebdomadaire</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};