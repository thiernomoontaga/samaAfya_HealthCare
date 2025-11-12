export type GlycemieStatus = "hypo" | "normal" | "warning" | "high";

export interface GlycemieReading {
  id: string;
  moment: "jeun" | "apres_petit_dej" | "avant_dejeuner" | "apres_dejeuner" | "avant_diner" | "apres_diner" | "coucher";
  value: number;
  status: GlycemieStatus;
  date: string;
  time: string;
  patientId: string;
}

export interface DailyReadings {
  date: string;
  readings: GlycemieReading[];
  completed: boolean;
  mode: "classique" | "lean" | "strict";
}

export interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  dateOfBirth: string;
  gestationalAge: number; // en semaines
  diabetesType: "gestationnel" | "type1" | "type2";
  targetGlycemia: {
    jeun: { min: number; max: number };
    postprandial: { min: number; max: number };
  };
  monitoringMode: "classique" | "lean" | "strict";
  lastReading?: GlycemieReading;
  weeklyAverage?: number;
  alertCount: number;
  complianceRate: number; // pourcentage de complétion
}

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderType: "patient" | "doctor";
  content: string;
  timestamp: string;
  read: boolean;
}

export interface Document {
  id: string;
  title: string;
  type: "ordonnance" | "resultat" | "consigne" | "autre";
  date: string;
  url: string;
}
