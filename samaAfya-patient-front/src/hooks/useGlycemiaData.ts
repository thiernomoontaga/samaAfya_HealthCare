import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { mockWeekReadings, currentPatient } from "@/data/mockData";
import { GlycemieReading, DailyReadings } from "@/types/patient";

export interface GlycemiaReading {
  id: string;
  value: number;
  timestamp: string;
  mealContext: "fasting" | "before_meal" | "after_meal";
  status: "normal" | "warning" | "critical";
}

export interface WeeklyData {
  date: string;
  fasting: number | null;
  beforeMeal: number | null;
  afterMeal: number | null;
  average: number;
}

// API functions
const API_BASE_URL = 'http://localhost:3000';

const fetchGlycemiaReadings = async (patientId: string = ''): Promise<GlycemieReading[]> => {
  const response = await fetch(`${API_BASE_URL}/glycemiaReadings?patientId=${patientId}`);
  if (!response.ok) throw new Error('Failed to fetch glycemia readings');
  return response.json();
};

const fetchDailyReadings = async (patientId: string = ''): Promise<DailyReadings[]> => {
  const response = await fetch(`${API_BASE_URL}/dailyReadings?patientId=${patientId}`);
  if (!response.ok) throw new Error('Failed to fetch daily readings');
  return response.json();
};

const addGlycemiaReading = async (reading: Omit<GlycemieReading, 'id'> & { patientId: string }): Promise<GlycemieReading> => {
  const response = await fetch(`${API_BASE_URL}/glycemiaReadings`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(reading),
  });
  if (!response.ok) throw new Error('Failed to add glycemia reading');
  return response.json();
};

export const useGlycemiaData = () => {
  const queryClient = useQueryClient();

  // Get current patient ID
  const getCurrentPatientId = () => localStorage.getItem('currentPatientId') || '';

  // Fetch today's readings for current patient only
  const { data: readings = [], isLoading: readingsLoading, error: readingsError } = useQuery({
    queryKey: ['glycemiaReadings', getCurrentPatientId()],
    queryFn: () => fetchGlycemiaReadings(getCurrentPatientId()),
    enabled: !!getCurrentPatientId(), // Only fetch if patient is logged in
  });

  // Fetch weekly data for current patient only
  const { data: dailyReadings = [], isLoading: weeklyLoading, error: weeklyError } = useQuery({
    queryKey: ['dailyReadings', getCurrentPatientId()],
    queryFn: () => fetchDailyReadings(getCurrentPatientId()),
    enabled: !!getCurrentPatientId(), // Only fetch if patient is logged in
  });

  // Transform data for compatibility
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const transformedReadings: GlycemiaReading[] = readings.map((reading: any) => {
    // Handle both 'moment' and 'mealContext' formats
    const contextField = reading.moment || reading.mealContext;
    let mealContext: "fasting" | "before_meal" | "after_meal" = "before_meal";

    if (contextField) {
      if (contextField.includes("jeun") || contextField === "fasting") {
        mealContext = "fasting";
      } else if (contextField.includes("apres") || contextField === "after_meal") {
        mealContext = "after_meal";
      }
    }

    return {
      id: reading.id,
      value: reading.value,
      timestamp: reading.timestamp || `${reading.date}T${reading.time}:00`,
      mealContext,
      status: reading.status === "normal" ? "normal" :
              reading.status === "warning" ? "warning" : "critical"
    };
  });

  const transformedWeeklyData: WeeklyData[] = dailyReadings.map((day: DailyReadings) => {
    const fasting = day.readings?.find((r: GlycemieReading) => r.moment === "jeun")?.value || null;
    const beforeMeal = day.readings?.find((r: GlycemieReading) => r.moment.includes("apres_petit_dej"))?.value || null;
    const afterMeal = day.readings?.find((r: GlycemieReading) => r.moment.includes("apres_dejeuner") || r.moment.includes("apres_diner"))?.value || null;
    const average = day.readings?.length > 0
      ? day.readings.reduce((sum: number, r: GlycemieReading) => sum + r.value, 0) / day.readings.length
      : 0;

    return {
      date: day.date,
      fasting,
      beforeMeal,
      afterMeal,
      average: Math.round(average * 100) / 100
    };
  });

  // Add reading mutation
  const addReadingMutation = useMutation({
    mutationFn: (newReading: Omit<GlycemiaReading, 'id'>) => {
      // Convert back to backend format
      const moment = newReading.mealContext === "fasting" ? "jeun" :
                     newReading.mealContext === "after_meal" ? "apres_dejeuner" : "avant_dejeuner";
      const status = newReading.status === "normal" ? "normal" :
                     newReading.status === "warning" ? "warning" : "high";

      return addGlycemiaReading({
        moment,
        value: newReading.value,
        status,
        date: new Date().toISOString().split('T')[0],
        time: new Date().toTimeString().split(' ')[0],
        patientId: localStorage.getItem('currentPatientId') || ''
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['glycemiaReadings'] });
      queryClient.invalidateQueries({ queryKey: ['dailyReadings'] });
    },
  });

  const getStats = () => {
    const todayReadings = transformedReadings.length;
    const weeklyAverage = transformedWeeklyData.length > 0
      ? transformedWeeklyData.reduce((sum, day) => sum + day.average, 0) / transformedWeeklyData.length
      : 0;
    const daysInTarget = dailyReadings.filter((day: DailyReadings) => day.completed).length;
    const alertsCount = transformedReadings.filter(reading => reading.status === 'critical').length;

    return {
      todayReadings,
      weeklyAverage: Math.round(weeklyAverage * 100) / 100,
      daysInTarget,
      alertsCount
    };
  };

  return {
    readings: transformedReadings,
    weeklyData: transformedWeeklyData,
    isLoading: readingsLoading || weeklyLoading,
    error: readingsError || weeklyError,
    addReading: addReadingMutation.mutateAsync,
    getStats: getStats()
  };
};