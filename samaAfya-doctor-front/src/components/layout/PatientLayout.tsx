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
    <div className="min-h-screen bg-gradient-to-br from-blue-50/50 via-white to-green-50/30">
      <PatientSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 lg:ml-64 flex flex-col min-w-0">
        <PatientHeader title={title} onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 py-6 overflow-y-auto animate-fade-in">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};