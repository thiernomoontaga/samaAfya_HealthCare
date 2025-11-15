import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Patient } from "@/types/patient";

// API functions
const API_BASE_URL = 'http://localhost:3000';

const fetchPatientData = async (patientId: string): Promise<Patient> => {
  const response = await fetch(`${API_BASE_URL}/patients/${patientId}`);
  if (!response.ok) throw new Error('Failed to fetch patient data');
  return response.json();
};

export const usePatientData = () => {
  // Get current patient ID from localStorage
  const getCurrentPatientId = () => localStorage.getItem('currentPatientId') || '';

  const { data: patient, isLoading, error, refetch } = useQuery({
    queryKey: ['patient', getCurrentPatientId()],
    queryFn: () => fetchPatientData(getCurrentPatientId()),
    enabled: !!getCurrentPatientId(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Calculate dynamic stats based on patient data
  const calculatePatientStats = (patient: Patient | undefined) => {
    if (!patient) return null;

    const now = new Date();
    const gestationalAge = patient.gestationalAge;

    // Calculate compliance rate based on monitoring mode
    // Assuming 4 readings per day for 'classique' mode
    const expectedReadingsPerWeek = patient.monitoringMode === 'classique' ? 28 :
                                   patient.monitoringMode === 'lean' ? 14 : 7;

    // For now, we'll use the stored complianceRate, but this could be calculated
    // from actual readings vs expected readings
    const complianceRate = patient.complianceRate || 0;

    // Calculate next appointment (simplified - in real app this would come from appointments API)
    const nextAppointmentDays = 3; // This should come from API

    // Calculate days in target (this would be calculated from readings)
    const daysInTarget = patient.weeklyAverage ?
      (patient.weeklyAverage <= patient.targetGlycemia.jeun.max ? 5 : 3) : 0;

    return {
      gestationalAge,
      complianceRate,
      nextAppointmentDays,
      daysInTarget,
      targetGlycemia: patient.targetGlycemia,
      diabetesType: patient.diabetesType,
      monitoringMode: patient.monitoringMode,
      lastReading: patient.lastReading,
      weeklyAverage: patient.weeklyAverage || 0,
      alertCount: patient.alertCount,
    };
  };

  const stats = calculatePatientStats(patient);

  return {
    patient,
    stats,
    isLoading,
    error,
    refetch,
  };
};
