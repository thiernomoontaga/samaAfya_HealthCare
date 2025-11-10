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
  Calendar,
  Sparkles,
  Bot,
  Activity
} from "lucide-react";

interface PatientSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const navigationItems = [
  {
    name: "Accueil",
    href: "/patient/home",
    icon: Home,
    description: "Saisir mes glycémies",
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    special: false
  },
  {
    name: "Tableau de bord",
    href: "/patient/dashboard",
    icon: Activity,
    description: "Mes statistiques",
    color: "text-green-600",
    bgColor: "bg-green-50",
    special: false
  },
  {
    name: "Statistiques",
    href: "/patient/weekly",
    icon: BarChart3,
    description: "Analyse hebdomadaire",
    color: "text-purple-600",
    bgColor: "bg-purple-50",
    special: false
  },
  {
    name: "Docteur IA",
    href: "/patient/doctor-ia",
    icon: Bot,
    description: "Conseils 24/7",
    color: "text-rose-600",
    bgColor: "bg-rose-50",
    special: true
  },
  {
    name: "Messages",
    href: "/patient/messages",
    icon: MessageSquare,
    description: "Équipe médicale",
    color: "text-indigo-600",
    bgColor: "bg-indigo-50",
    special: false
  },
  {
    name: "Documents",
    href: "/patient/documents",
    icon: FileText,
    description: "Mes dossiers médicaux",
    color: "text-cyan-600",
    bgColor: "bg-cyan-50",
    special: false
  },
  {
    name: "Profil",
    href: "/patient/profile",
    icon: User,
    description: "Mes informations",
    color: "text-purple-600",
    bgColor: "bg-purple-50",
    special: false
  },
  {
    name: "Historique",
    href: "/patient/history",
    icon: Calendar,
    description: "Mes mesures passées",
    color: "text-indigo-600",
    bgColor: "bg-indigo-50",
    special: false
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
      <div className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 lg:left-0 lg:top-20 bg-gradient-to-b from-white to-rose-50/30 backdrop-blur-sm border-r border-rose-100/50 shadow-lg animate-slide-in z-30">
        {/* Logo Section */}
        <div className="flex items-center gap-3 px-6 py-6 border-b border-rose-100/50">
          <div className="relative">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-rose-400 to-pink-400 flex items-center justify-center shadow-lg">
              <Heart className="h-6 w-6 text-white animate-pulse" />
            </div>
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full flex items-center justify-center animate-spin">
              <Sparkles className="h-2 w-2 text-white" />
            </div>
          </div>
          <div>
            <h2 className="text-lg font-bold bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">
              SamaAfya Healthcare
            </h2>
            <p className="text-xs text-gray-600 font-medium">Santé maternelle 💙</p>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          {navigationItems.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Button
                key={item.name}
                variant="ghost"
                className={cn(
                  "w-full justify-start gap-3 h-auto p-3 rounded-xl transition-all duration-200 group",
                  isActive
                    ? `${item.bgColor} border-2 border-current shadow-lg transform scale-[1.02]`
                    : `hover:${item.bgColor} hover:border hover:border-current/20 hover:shadow-md`
                )}
                onClick={() => handleNavigation(item.href)}
              >
                <div className={`w-8 h-8 rounded-lg ${item.bgColor} flex items-center justify-center transition-all duration-200 ${
                  isActive ? 'shadow-md' : 'group-hover:shadow-sm'
                }`}>
                  <item.icon className={`h-4 w-4 ${item.color} ${
                    item.special && isActive ? 'animate-pulse' : ''
                  }`} />
                  {item.special && isActive && (
                    <Sparkles className="absolute -top-1 -right-1 h-3 w-3 text-rose-500 animate-bounce" />
                  )}
                </div>
                <div className="flex-1 text-left min-w-0">
                  <div className="flex items-center justify-between">
                    <span className={`text-sm font-medium truncate ${
                      isActive ? item.color.replace('text-', 'text-') : 'text-gray-700'
                    }`}>
                      {item.name}
                    </span>
                    {item.special && (
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    )}
                  </div>
                  <p className={`text-xs truncate ${
                    isActive ? 'text-current opacity-80' : 'text-gray-500'
                  }`}>
                    {item.description}
                  </p>
                </div>
              </Button>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-rose-100/50 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-xl mx-2 mb-2">
          <div className="flex items-center gap-2 mb-2">
            <Heart className="h-4 w-4 text-blue-500" />
            <span className="text-xs font-medium text-blue-700">Besoin d'aide ?</span>
          </div>
          <p className="text-xs text-blue-600 leading-relaxed">
            Votre Docteur IA est là pour répondre à vos questions sur la glycémie et la grossesse 💙
          </p>
        </div>
      </div>

      {/* Mobile Sidebar */}
      <div className={cn(
        "fixed left-0 z-50 w-64 bg-gradient-to-b from-white to-rose-50/30 backdrop-blur-sm border-r border-rose-100/50 shadow-lg transform transition-transform duration-300 ease-in-out lg:hidden",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )} style={{ top: '5rem', bottom: 0, zIndex: 50 }}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-rose-100/50">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-rose-400 to-pink-400 flex items-center justify-center shadow-lg">
                <Heart className="h-5 w-5 text-white animate-pulse" />
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full flex items-center justify-center animate-spin">
                <Sparkles className="h-2 w-2 text-white" />
              </div>
            </div>
            <div>
              <h2 className="text-lg font-bold bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">
                SamaAfya Healthcare
              </h2>
              <p className="text-xs text-gray-600 font-medium">Santé maternelle 💙</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8 hover:bg-rose-50"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          {navigationItems.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Button
                key={item.name}
                variant="ghost"
                className={cn(
                  "w-full justify-start gap-3 h-auto p-3 rounded-xl transition-all duration-200 group",
                  isActive
                    ? `${item.bgColor} border-2 border-current shadow-lg transform scale-[1.02]`
                    : `hover:${item.bgColor} hover:border hover:border-current/20 hover:shadow-md`
                )}
                onClick={() => handleNavigation(item.href)}
              >
                <div className={`w-8 h-8 rounded-lg ${item.bgColor} flex items-center justify-center transition-all duration-200 ${
                  isActive ? 'shadow-md' : 'group-hover:shadow-sm'
                }`}>
                  <item.icon className={`h-4 w-4 ${item.color} ${
                    item.special && isActive ? 'animate-pulse' : ''
                  }`} />
                  {item.special && isActive && (
                    <Sparkles className="absolute -top-1 -right-1 h-3 w-3 text-rose-500 animate-bounce" />
                  )}
                </div>
                <div className="flex-1 text-left min-w-0">
                  <div className="flex items-center justify-between">
                    <span className={`text-sm font-medium truncate ${
                      isActive ? item.color.replace('text-', 'text-') : 'text-gray-700'
                    }`}>
                      {item.name}
                    </span>
                    {item.special && (
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    )}
                  </div>
                  <p className={`text-xs truncate ${
                    isActive ? 'text-current opacity-80' : 'text-gray-500'
                  }`}>
                    {item.description}
                  </p>
                </div>
              </Button>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-rose-100/50 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-xl mx-2 mb-2">
          <div className="flex items-center gap-2 mb-2">
            <Heart className="h-4 w-4 text-blue-500" />
            <span className="text-xs font-medium text-blue-700">Besoin d'aide ?</span>
          </div>
          <p className="text-xs text-blue-600 leading-relaxed">
            Votre Docteur IA est là pour répondre à vos questions sur la glycémie et la grossesse 💙
          </p>
        </div>
      </div>
    </>
  );
};