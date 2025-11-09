import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter
} from '@/components/ui/sidebar';
import {
  LayoutDashboard,
  Users,
  UserCheck,
  Settings,
  LogOut,
  Stethoscope,
  Heart
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const DoctorSidebar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    {
      title: 'Tableau de bord',
      url: '/medecin/dashboard',
      icon: LayoutDashboard,
    },
    {
      title: 'Mes patientes',
      url: '/medecin/patients',
      icon: Users,
    },
    {
      title: 'Paramètres',
      url: '/medecin/settings',
      icon: Settings,
    },
  ];

  const handleLogout = () => {
    localStorage.removeItem('doctorSession');
    localStorage.removeItem('doctorAuth');
    navigate('/auth/doctor-login');
  };

  return (
    <Sidebar className="border-r border-gray-200">
      <SidebarHeader className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <Stethoscope className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h2 className="font-semibold text-gray-900">SamaAfya</h2>
            <p className="text-xs text-gray-500">Espace Médecin</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="p-4">
        <SidebarMenu>
          {menuItems.map((item) => {
            const isActive = location.pathname === item.url;
            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  asChild
                  className={`w-full justify-start gap-3 h-12 ${
                    isActive
                      ? 'bg-primary/10 text-primary border-r-2 border-primary'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Link to={item.url} className="flex items-center gap-3">
                    <item.icon className="h-5 w-5" />
                    <span className="font-medium">{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-gray-200">
        <Button
          onClick={handleLogout}
          variant="ghost"
          className="w-full justify-start gap-3 text-red-600 hover:text-red-700 hover:bg-red-50"
        >
          <LogOut className="h-5 w-5" />
          <span>Déconnexion</span>
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
};

export { DoctorSidebar };