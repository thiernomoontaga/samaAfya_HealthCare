import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Home,
  BarChart3,
  Droplet,
  MessageSquare,
  FileText,
  User,
  Heart,
  X,
  Menu,
  Calendar
} from "lucide-react";

interface PatientSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const navigationItems = [
  {
    name: "Saisir mes données",
    href: "/patient/home",
    icon: Droplet,
    description: "Glycémies du jour"
  },
  {
    name: "Dashboard",
    href: "/patient/dashboard",
    icon: BarChart3,
    description: "Statistiques détaillées"
  },
  {
    name: "Historique",
    href: "/patient/glycemia",
    icon: Calendar,
    description: "Historique complet"
  },
  {
    name: "Messages",
    href: "/patient/messages",
    icon: MessageSquare,
    description: "Communication médicale"
  },
  {
    name: "Documents",
    href: "/patient/documents",
    icon: FileText,
    description: "Ordonnances et résultats"
  },
  {
    name: "Profil",
    href: "/patient/profile",
    icon: User,
    description: "Informations personnelles"
  }
];

export const PatientSidebar = ({ isOpen, onClose }: PatientSidebarProps) => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleNavigation = (href: string) => {
    navigate(href);
    onClose();
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 bg-white/95 backdrop-blur-sm border-r border-gray-200 shadow-lg animate-slide-in">
        {/* Logo */}
        <div className="flex items-center gap-3 px-6 py-6 border-b border-gray-100">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <Heart className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">SamaAfya</h1>
            <p className="text-xs text-gray-600">Suivi maternel</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          {navigationItems.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Button
                key={item.name}
                variant={isActive ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start gap-3 h-auto p-3 transition-all duration-200",
                  isActive && "bg-primary/10 text-primary border border-primary/20 shadow-sm"
                )}
                onClick={() => handleNavigation(item.href)}
              >
                <item.icon className="h-5 w-5 flex-shrink-0" />
                <div className="text-left">
                  <div className="font-medium">{item.name}</div>
                  <div className="text-xs text-muted-foreground">{item.description}</div>
                </div>
              </Button>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100">
          <p className="text-xs text-gray-500 text-center">
            SamaAfya Healthcare
          </p>
        </div>
      </div>

      {/* Mobile Sidebar */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-white/95 backdrop-blur-sm border-r border-gray-200 shadow-lg transform transition-transform duration-300 ease-in-out lg:hidden",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              <Heart className="h-5 w-5 text-primary" />
            </div>
            <h1 className="text-lg font-bold text-gray-900">SamaAfya</h1>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          {navigationItems.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Button
                key={item.name}
                variant={isActive ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start gap-3 h-auto p-3 transition-all duration-200",
                  isActive && "bg-primary/10 text-primary border border-primary/20 shadow-sm"
                )}
                onClick={() => handleNavigation(item.href)}
              >
                <item.icon className="h-5 w-5 flex-shrink-0" />
                <div className="text-left">
                  <div className="font-medium">{item.name}</div>
                  <div className="text-xs text-muted-foreground">{item.description}</div>
                </div>
              </Button>
            );
          })}
        </nav>
      </div>
    </>
  );
};