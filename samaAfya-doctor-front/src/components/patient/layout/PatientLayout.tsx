import { useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { PatientSidebar } from "./PatientSidebar";
import { PatientHeader } from "./PatientHeader";
import { cn } from "@/lib/utils";

const PatientLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Get current page title based on route
  const getPageTitle = () => {
    const path = location.pathname;
    if (path === "/patient") return "Accueil";
    if (path === "/patient/dashboard") return "Dashboard";
    if (path === "/patient/glycemia") return "Glycémies";
    if (path === "/patient/messages") return "Messages";
    if (path === "/patient/documents") return "Documents";
    if (path === "/patient/profile") return "Profil";
    return "SamaAfya";
  };

  return (
    <div className="h-screen w-screen bg-gradient-to-br from-blue-50 via-pink-50 to-green-50 flex overflow-hidden">
      {/* Sidebar */}
      <PatientSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <PatientHeader
          title={getPageTitle()}
          onMenuClick={() => setSidebarOpen(true)}
        />

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          <div className="max-w-7xl mx-auto">
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
    </div>
  );
};

export default PatientLayout;