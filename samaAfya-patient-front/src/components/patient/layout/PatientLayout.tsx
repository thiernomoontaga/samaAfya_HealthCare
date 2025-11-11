import { useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { PatientSidebar } from "./PatientSidebar";
import { PatientHeader } from "./PatientHeader";
import { DoctorIAButton } from "../DoctorIAButton";
import { cn } from "@/lib/utils";

const PatientLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Get current page title based on route
  const getPageTitle = () => {
    const path = location.pathname;
    if (path === "/patient" || path === "/patient/home") return "Accueil";
    if (path === "/patient/dashboard") return "Tableau de bord";
    if (path === "/patient/weekly") return "Statistiques";
    if (path === "/patient/glycemia" || path === "/patient/history") return "Historique";
    if (path === "/patient/messages") return "Messages";
    if (path === "/patient/documents") return "Documents";
    if (path === "/patient/profile") return "Profil";
    if (path === "/patient/doctor-ia") return "Docteur IA";
    return "SamaAfya Healthcare";
  };

  return (
    <div className="h-screen w-screen bg-gradient-to-br from-rose-50/80 via-pink-50/60 via-purple-50/40 to-blue-50/60 flex overflow-hidden">
      {/* Sidebar */}
      <PatientSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:ml-64 min-w-0 overflow-hidden">
        {/* Header */}
        <PatientHeader
          title={getPageTitle()}
          onMenuClick={() => setSidebarOpen(true)}
        />

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          <div className="max-w-7xl mx-auto h-full">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Doctor IA Button */}
      <DoctorIAButton />
    </div>
  );
};

export default PatientLayout;