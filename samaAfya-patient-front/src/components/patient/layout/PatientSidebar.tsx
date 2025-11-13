import React, { useState, useEffect } from 'react';
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
  Home,
  Activity,
  BarChart3,
  MessageSquare,
  FileText,
  User,
  Calendar,
  Bot,
  LogOut,
  Heart
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const PatientSidebar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [patient, setPatient] = useState<{ trackingCode?: string; linkedDoctorId?: string } | null>(null);
  const [loading, setLoading] = useState(true);

  const hasDoctorLink = patient?.linkedDoctorId && patient.linkedDoctorId.trim() !== '';

  const menuItems = [
    {
      title: 'Tableau de bord',
      url: '/patient/home',
      icon: Home,
      disabled: false,
    },
    {
      title: 'Statistiques',
      url: '/patient/weekly',
      icon: BarChart3,
      disabled: false,
    },
    {
      title: 'Docteur IA',
      url: '/patient/doctor-ia',
      icon: Bot,
      disabled: false,
    },
    {
      title: 'Messages',
      url: '/patient/messages',
      icon: MessageSquare,
      disabled: !hasDoctorLink,
    },
    {
      title: 'Documents',
      url: '/patient/documents',
      icon: FileText,
      disabled: !hasDoctorLink,
    },
    {
      title: 'Profil',
      url: '/patient/profile',
      icon: User,
      disabled: false,
    },
    {
      title: 'Historique',
      url: '/patient/history',
      icon: Calendar,
      disabled: false,
    },
  ];

  useEffect(() => {
    const fetchPatient = async () => {
      const patientId = localStorage.getItem('currentPatientId');
      if (patientId) {
        try {
          const response = await fetch(`http://localhost:3000/patients/${patientId}`);
          const patientData = await response.json();
          setPatient(patientData);
        } catch (error) {
          console.error('Error fetching patient:', error);
        }
      }
      setLoading(false);
    };

    fetchPatient();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('currentPatientId');
    navigate('/');
  };

  return (
    <Sidebar className="border-r border-border/50 bg-background">
      <SidebarHeader className="p-6 border-b border-border/50">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
            <Heart className="h-7 w-7 text-primary" />
          </div>
          <div>
            <h2 className="font-bold text-foreground text-lg">SamaAfya Care</h2>
            <p className="text-sm text-muted-foreground">Suivi maternel connecté</p>
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
                  asChild={!item.disabled}
                  className={`w-full justify-start gap-4 h-14 rounded-xl transition-all duration-200 ${
                    item.disabled
                      ? 'opacity-50 cursor-not-allowed text-muted-foreground/50'
                      : isActive
                      ? 'bg-primary/10 text-primary border-r-3 border-primary shadow-sm'
                      : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
                  }`}
                  onClick={item.disabled ? (e) => e.preventDefault() : undefined}
                >
                  {item.disabled ? (
                    <div className="flex items-center gap-4 px-3 cursor-not-allowed">
                      <div className={`p-2 rounded-lg bg-muted/30`}>
                        <item.icon className="h-5 w-5" />
                      </div>
                      <span className="font-medium">{item.title}</span>
                    </div>
                  ) : (
                    <Link to={item.url} className="flex items-center gap-4 px-3">
                      <div className={`p-2 rounded-lg ${isActive ? 'bg-primary/20' : 'bg-muted/30'}`}>
                        <item.icon className="h-5 w-5" />
                      </div>
                      <span className="font-medium">{item.title}</span>
                    </Link>
                  )}
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

export { PatientSidebar };