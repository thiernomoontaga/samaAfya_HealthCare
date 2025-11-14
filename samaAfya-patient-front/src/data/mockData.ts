import { Patient, GlycemieReading, DailyReadings, Message, Document, GlycemieStatus } from "@/types/patient";

// Helper function to determine glycemia status
export const getGlycemiaStatus = (value: number, moment: string): GlycemieStatus => {
  const isPostprandial = moment.includes("apres");
  
  if (value < 0.6) return "hypo";
  if (isPostprandial) {
    if (value <= 1.2) return "normal";
    if (value <= 1.4) return "warning";
    return "high";
  } else {
    if (value <= 0.95) return "normal";
    if (value <= 1.05) return "warning";
    return "high";
  }
};

// Mock current patient - CLEARED FOR DYNAMIC TESTING
export const currentPatient: Patient = {
  id: "",
  firstName: "",
  lastName: "",
  dateOfBirth: "",
  gestationalAge: 0,
  diabetesType: "gestationnel" as const,
  targetGlycemia: {
    jeun: { min: 0.6, max: 0.95 },
    postprandial: { min: 0.6, max: 1.2 },
  },
  monitoringMode: "classique" as const,
  weeklyAverage: 0,
  alertCount: 0,
  complianceRate: 0,
};

// Mock glycemia readings for the week - CLEARED FOR DYNAMIC TESTING
export const mockWeekReadings: DailyReadings[] = [];

// Mock patients for doctor dashboard - CLEARED FOR DYNAMIC TESTING
export const mockPatients: Patient[] = [];

// Mock messages - CLEARED FOR DYNAMIC TESTING
export const mockMessages: Message[] = [];

// Mock documents - CLEARED FOR DYNAMIC TESTING
export const mockDocuments: Document[] = [];