import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/auth/Login";
import PatientSignup from "./pages/auth/PatientSignup";
import MonitoringSetup from "./pages/auth/MonitoringSetup";
import DoctorLogin from "./pages/auth/DoctorLogin";
import DoctorMFA from "./pages/auth/DoctorMFA";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import PatientHome from "./pages/patient/PatientHome";
import PatientDashboard from "./pages/patient/PatientDashboard";
import WeeklyDashboard from "./pages/patient/WeeklyDashboard";
import MessagesPage from "./pages/patient/MessagesPage";
import DocumentsPage from "./pages/patient/DocumentsPage";
import ProfilePage from "./pages/patient/ProfilePage";
import HistoryPage from "./pages/patient/HistoryPage";
import DoctorDashboard from "./pages/doctor/DoctorDashboard";
import DoctorPatients from "./pages/doctor/DoctorPatients";
import PatientDetails from "./pages/doctor/PatientDetails";
import DoctorSettings from "./pages/doctor/DoctorSettings";
import DoctorIAChatPage from "./pages/patient/DoctorIAChatPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/auth/login" element={<Login />} />
          <Route path="/auth/signup" element={<PatientSignup />} />
          <Route path="/patient/home" element={<PatientHome />} />
          <Route path="/patient/dashboard" element={<PatientDashboard />} />
          <Route path="/patient/weekly" element={<WeeklyDashboard />} />
          <Route path="/patient/glycemia" element={<HistoryPage />} />
          <Route path="/patient/messages" element={<MessagesPage />} />
          <Route path="/patient/documents" element={<DocumentsPage />} />
          <Route path="/patient/profile" element={<ProfilePage />} />
          <Route path="/patient/monitoring-mode" element={<MonitoringSetup />} />
          <Route path="/auth/monitoring-setup" element={<MonitoringSetup />} />
          <Route path="/patient/doctor-ia" element={<DoctorIAChatPage />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
