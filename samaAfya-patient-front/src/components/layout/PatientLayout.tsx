import { ReactNode, useState } from "react";
import { PatientSidebar } from "../patient/layout/PatientSidebar";
import { PatientHeader } from "../patient/layout/PatientHeader";

interface PatientLayoutProps {
  children: ReactNode;
  title: string;
}

export const PatientLayout = ({ children, title }: PatientLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50/80 via-pink-50/60 via-purple-50/40 to-blue-50/60 relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-rose-200/30 to-pink-200/30 rounded-full blur-xl animate-pulse"></div>
      <div className="absolute top-40 right-20 w-24 h-24 bg-gradient-to-br from-purple-200/30 to-blue-200/30 rounded-full blur-xl animate-pulse" style={{animationDelay: '1s'}}></div>
      <div className="absolute bottom-40 left-1/4 w-20 h-20 bg-gradient-to-br from-pink-200/30 to-rose-200/30 rounded-full blur-xl animate-pulse" style={{animationDelay: '2s'}}></div>

      <PatientSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 lg:ml-64 flex flex-col min-w-0">
        <PatientHeader title={title} onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 pt-24 pb-6 overflow-y-auto animate-fade-in">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};