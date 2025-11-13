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
import DoctorLayout from "./components/doctor/DoctorLayout";
import DoctorDashboard from "./pages/doctor/DoctorDashboard";
import DoctorPatients from "./pages/doctor/DoctorPatients";
import PatientDetails from "./pages/doctor/PatientDetails";
import DoctorMessages from "./pages/doctor/DoctorMessages";
import DoctorSettings from "./pages/doctor/DoctorSettings";
import TrackingCodesPage from "./pages/doctor/TrackingCodesPage";
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
          <Route path="/auth/doctor-login" element={<DoctorLogin />} />
          <Route path="/auth/doctor-mfa" element={<DoctorMFA />} />
          <Route path="/medecin/*" element={<DoctorLayout />}>
            <Route path="dashboard" element={<DoctorDashboard />} />
            <Route path="patients" element={<DoctorPatients />} />
            <Route path="patient/:id" element={<PatientDetails />} />
            <Route path="messages" element={<DoctorMessages />} />
            <Route path="tracking-codes" element={<TrackingCodesPage />} />
            <Route path="settings" element={<DoctorSettings />} />
          </Route>
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
