import { useMemo } from "react";
import { TrendingUp, TrendingDown, Minus, Activity, Target, CheckCircle } from "lucide-react";

export interface GlycemiaStats {
  weeklyAverage: number;
  todayReadings: number;
  trend: number;
  regularity: number;
  trendIcon: React.ComponentType<{ className?: string }>;
  trendColor: string;
}

export interface WeeklyData {
  date: string;
  average: number;
  measurements?: number;
}

export const useGlycemiaStats = (
  weeklyData: WeeklyData[],
  todayReadingsCount: number
): GlycemiaStats => {
  return useMemo(() => {
    // Calculate weekly average
    const weeklyAverage = weeklyData.length > 0
      ? weeklyData.reduce((sum, day) => sum + day.average, 0) / weeklyData.length
      : 0;

    // Calculate trend (percentage change from first to last day)
    const trend = weeklyData.length > 1
      ? ((weeklyData[weeklyData.length - 1].average - weeklyData[0].average) / weeklyData[0].average) * 100
      : 0;

    // Calculate regularity (today's readings vs recommended 21 per week)
    const regularity = Math.round((todayReadingsCount / 21) * 100);

    // Get trend icon and color
    const getTrendIcon = () => {
      if (Math.abs(trend) < 2) return Minus;
      return trend > 0 ? TrendingUp : TrendingDown;
    };

    const getTrendColor = () => {
      if (Math.abs(trend) < 2) return "text-gray-600 bg-gray-50";
      return trend > 0 ? "text-red-600 bg-red-50" : "text-green-600 bg-green-50";
    };

    return {
      weeklyAverage,
      todayReadings: todayReadingsCount,
      trend,
      regularity,
      trendIcon: getTrendIcon(),
      trendColor: getTrendColor(),
    };
  }, [weeklyData, todayReadingsCount]);
};
