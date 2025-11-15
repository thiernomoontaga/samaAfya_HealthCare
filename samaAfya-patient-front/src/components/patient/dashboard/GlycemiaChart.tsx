import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, ArrowRight } from "lucide-react";

interface WeeklyData {
  dayName?: string;
  average: number;
  date?: string;
}

interface GlycemiaChartProps {
  data: WeeklyData[];
  title?: string;
  description?: string;
  showButton?: boolean;
  buttonText?: string;
  onButtonClick?: () => void;
}

export const GlycemiaChart: React.FC<GlycemiaChartProps> = ({
  data,
  title = "Évolution de vos glycémies",
  description = "Moyenne quotidienne cette semaine (en g/L)",
  showButton = false,
  buttonText = "Voir le détail",
  onButtonClick,
}) => {
  return (
    <Card className="shadow-sm border-border/50">
      <CardHeader className="pb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-primary/10">
              <TrendingUp className="h-6 w-6 text-primary" />
            </div>
            <div>
              <CardTitle className="text-2xl">{title}</CardTitle>
              <CardDescription className="text-base">{description}</CardDescription>
            </div>
          </div>
          {showButton && (
            <Button variant="outline" className="rounded-xl" onClick={onButtonClick}>
              <ArrowRight className="h-4 w-4 mr-2" />
              {buttonText}
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
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
  );
};
