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

// Mock current patient
export const currentPatient: Patient = {
  id: "P001",
  firstName: "Amina",
  lastName: "Ndiaye",
  dateOfBirth: "1990-05-15",
  gestationalAge: 28,
  diabetesType: "gestationnel",
  targetGlycemia: {
    jeun: { min: 0.6, max: 0.95 },
    postprandial: { min: 0.6, max: 1.2 },
  },
  monitoringMode: "classique",
  weeklyAverage: 1.05,
  alertCount: 2,
  complianceRate: 85,
};

// Mock glycemia readings for the week
export const mockWeekReadings: DailyReadings[] = [
  {
    date: "2025-01-13",
    mode: "classique",
    completed: true,
    readings: [
      { id: "r1", moment: "jeun", value: 0.88, status: "normal", date: "2025-01-13", time: "07:30" },
      { id: "r2", moment: "apres_petit_dej", value: 1.15, status: "normal", date: "2025-01-13", time: "09:30" },
      { id: "r3", moment: "apres_dejeuner", value: 1.32, status: "warning", date: "2025-01-13", time: "14:30" },
      { id: "r4", moment: "apres_diner", value: 1.18, status: "normal", date: "2025-01-13", time: "21:00" },
    ],
  },
  {
    date: "2025-01-14",
    mode: "classique",
    completed: true,
    readings: [
      { id: "r5", moment: "jeun", value: 0.92, status: "normal", date: "2025-01-14", time: "07:15" },
      { id: "r6", moment: "apres_petit_dej", value: 1.08, status: "normal", date: "2025-01-14", time: "09:15" },
      { id: "r7", moment: "apres_dejeuner", value: 1.25, status: "warning", date: "2025-01-14", time: "14:20" },
      { id: "r8", moment: "apres_diner", value: 1.12, status: "normal", date: "2025-01-14", time: "20:45" },
    ],
  },
  {
    date: "2025-01-15",
    mode: "classique",
    completed: true,
    readings: [
      { id: "r9", moment: "jeun", value: 0.85, status: "normal", date: "2025-01-15", time: "07:45" },
      { id: "r10", moment: "apres_petit_dej", value: 1.10, status: "normal", date: "2025-01-15", time: "09:45" },
      { id: "r11", moment: "apres_dejeuner", value: 1.19, status: "normal", date: "2025-01-15", time: "14:30" },
      { id: "r12", moment: "apres_diner", value: 1.15, status: "normal", date: "2025-01-15", time: "21:00" },
    ],
  },
  {
    date: "2025-01-16",
    mode: "classique",
    completed: false,
    readings: [
      { id: "r13", moment: "jeun", value: 0.90, status: "normal", date: "2025-01-16", time: "07:30" },
      { id: "r14", moment: "apres_petit_dej", value: 1.12, status: "normal", date: "2025-01-16", time: "09:30" },
    ],
  },
  {
    date: "2025-01-17",
    mode: "classique",
    completed: false,
    readings: [],
  },
];

// Mock patients for doctor dashboard
export const mockPatients: Patient[] = [
  {
    id: "P001",
    firstName: "Amina",
    lastName: "Ndiaye",
    dateOfBirth: "1990-05-15",
    gestationalAge: 28,
    diabetesType: "gestationnel",
    targetGlycemia: {
      jeun: { min: 0.6, max: 0.95 },
      postprandial: { min: 0.6, max: 1.2 },
    },
    monitoringMode: "classique",
    weeklyAverage: 1.05,
    alertCount: 2,
    complianceRate: 85,
    lastReading: { id: "r1", moment: "apres_diner", value: 1.18, status: "normal", date: "2025-01-16", time: "21:00" },
  },
  {
    id: "P002",
    firstName: "Fatou",
    lastName: "Diop",
    dateOfBirth: "1992-08-22",
    gestationalAge: 32,
    diabetesType: "gestationnel",
    targetGlycemia: {
      jeun: { min: 0.6, max: 0.95 },
      postprandial: { min: 0.6, max: 1.2 },
    },
    monitoringMode: "lean",
    weeklyAverage: 0.98,
    alertCount: 0,
    complianceRate: 95,
    lastReading: { id: "r2", moment: "jeun", value: 0.88, status: "normal", date: "2025-01-17", time: "07:30" },
  },
  {
    id: "P003",
    firstName: "Mariam",
    lastName: "Sow",
    dateOfBirth: "1988-11-10",
    gestationalAge: 26,
    diabetesType: "type2",
    targetGlycemia: {
      jeun: { min: 0.6, max: 0.95 },
      postprandial: { min: 0.6, max: 1.2 },
    },
    monitoringMode: "strict",
    weeklyAverage: 1.28,
    alertCount: 5,
    complianceRate: 72,
    lastReading: { id: "r3", moment: "apres_dejeuner", value: 1.45, status: "high", date: "2025-01-17", time: "14:30" },
  },
  {
    id: "P004",
    firstName: "Aissatou",
    lastName: "Ba",
    dateOfBirth: "1995-03-18",
    gestationalAge: 30,
    diabetesType: "gestationnel",
    targetGlycemia: {
      jeun: { min: 0.6, max: 0.95 },
      postprandial: { min: 0.6, max: 1.2 },
    },
    monitoringMode: "classique",
    weeklyAverage: 1.01,
    alertCount: 1,
    complianceRate: 90,
    lastReading: { id: "r4", moment: "apres_petit_dej", value: 1.08, status: "normal", date: "2025-01-17", time: "09:30" },
  },
];

// Mock messages
export const mockMessages: Message[] = [
  {
    id: "m1",
    senderId: "D001",
    senderName: "Dr. Konaté",
    senderType: "doctor",
    content: "Bonjour Amina, vos résultats de cette semaine sont encourageants. Continuez à surveiller vos glycémies après le déjeuner.",
    timestamp: "2025-01-16T10:30:00",
    read: true,
  },
  {
    id: "m2",
    senderId: "P001",
    senderName: "Amina Ndiaye",
    senderType: "patient",
    content: "Merci Docteur. J'ai une question concernant mon alimentation le soir.",
    timestamp: "2025-01-16T14:15:00",
    read: true,
  },
  {
    id: "m3",
    senderId: "D001",
    senderName: "Dr. Konaté",
    senderType: "doctor",
    content: "Bien sûr, je vous écoute. Qu'aimeriez-vous savoir ?",
    timestamp: "2025-01-16T15:00:00",
    read: false,
  },
];

// Mock documents
export const mockDocuments: Document[] = [
  {
    id: "d1",
    title: "Ordonnance initiale",
    type: "ordonnance",
    date: "2024-12-15",
    url: "#",
  },
  {
    id: "d2",
    title: "Résultats glycémie à jeun",
    type: "resultat",
    date: "2025-01-10",
    url: "#",
  },
  {
    id: "d3",
    title: "Consignes alimentaires",
    type: "consigne",
    date: "2024-12-20",
    url: "#",
  },
  {
    id: "d4",
    title: "Échographie T3",
    type: "resultat",
    date: "2025-01-05",
    url: "#",
  },
];