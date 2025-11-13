import { Outlet, useLocation } from "react-router-dom";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { DoctorSidebar } from "./DoctorSidebar";
import { Separator } from "@/components/ui/separator";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";

const DoctorLayout = () => {
  const location = useLocation();

  // Get current page title based on route
  const getPageTitle = () => {
    const path = location.pathname;
    if (path === "/medecin" || path === "/medecin/dashboard") return "Tableau de bord";
    if (path === "/medecin/patients") return "Mes patientes";
    if (path === "/medecin/patient") return "Détails patiente";
    if (path === "/medecin/tracking-codes") return "Codes de suivi";
    if (path === "/medecin/settings") return "Paramètres";
    return "SamaAfya Healthcare";
  };

  return (
    <SidebarProvider>
      <DoctorSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="/medecin/dashboard">
                    SamaAfya Healthcare
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
    </SidebarProvider>
  );
};

export default DoctorLayout;