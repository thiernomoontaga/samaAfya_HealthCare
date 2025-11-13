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
  Heart,
  MessageSquare
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
      title: 'Messages',
      url: '/medecin/messages',
      icon: MessageSquare,
    },
    {
      title: 'Codes de suivi',
      url: '/medecin/tracking-codes',
      icon: UserCheck,
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
    <Sidebar className="border-r border-border/50 bg-background">
      <SidebarHeader className="p-6 border-b border-border/50">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
            <Stethoscope className="h-7 w-7 text-primary" />
          </div>
          <div>
            <h2 className="font-bold text-foreground text-lg">SamaAfya</h2>
            <p className="text-sm text-muted-foreground">Espace Professionnel</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="p-4">
        <SidebarMenu className="space-y-2">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.url;
            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  asChild
                  className={`w-full justify-start gap-4 h-14 rounded-xl transition-all duration-200 ${
                    isActive
                      ? 'bg-primary/10 text-primary border-r-3 border-primary shadow-sm'
                      : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
                  }`}
                >
                  <Link to={item.url} className="flex items-center gap-4 px-3">
                    <div className={`p-2 rounded-lg ${isActive ? 'bg-primary/20' : 'bg-muted/30'}`}>
                      <item.icon className="h-5 w-5" />
                    </div>
                    <span className="font-medium">{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-border/50">
        <Button
          onClick={handleLogout}
          variant="ghost"
          className="w-full justify-start gap-4 text-red-600 hover:text-red-700 hover:bg-red-50/50 rounded-xl h-12 transition-colors"
        >
          <div className="p-2 rounded-lg bg-red-50">
            <LogOut className="h-5 w-5" />
          </div>
          <span className="font-medium">Déconnexion</span>
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
};

export { DoctorSidebar };