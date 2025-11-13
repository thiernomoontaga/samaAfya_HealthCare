import { Outlet, useLocation } from "react-router-dom";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { PatientSidebar } from "./PatientSidebar";
import { DoctorIAFloatingButton } from "../DoctorIAFloatingButton";
import { Separator } from "@/components/ui/separator";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";

const PatientLayout = () => {
  const location = useLocation();

  // Get current page title based on route
  const getPageTitle = () => {
    const path = location.pathname;
    if (path === "/patient" || path === "/patient/home") return "Tableau de bord";
    if (path === "/patient/weekly") return "Statistiques";
    if (path === "/patient/glycemia" || path === "/patient/history") return "Historique";
    if (path === "/patient/messages") return "Messages";
    if (path === "/patient/documents") return "Documents";
    if (path === "/patient/profile") return "Profil";
    if (path === "/patient/doctor-ia") return "Docteur IA";
    return "SamaAfya Care";
  };

  return (
    <SidebarProvider>
      <PatientSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="/patient/home">
                    SamaAfya Care
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>{getPageTitle()}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="mx-auto max-w-7xl w-full">
            <Outlet />
          </div>
        </div>
      </SidebarInset>

      {/* Floating Doctor IA Button - Always available for instant IA chat */}
      <DoctorIAFloatingButton />
    </SidebarProvider>
  );
};

export default PatientLayout;