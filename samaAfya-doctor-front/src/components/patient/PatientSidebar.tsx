import { NavLink } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Home, Activity, MessageSquare, FileText, Heart, Lock, Bot, Sparkles } from "lucide-react";

const menuItems = [
  {
    title: "Accueil",
    url: "/",
    icon: Home,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    description: "Page d'accueil"
  },
  {
    title: "Tableau de bord",
    url: "/patient/dashboard",
    icon: Activity,
    color: "text-green-600",
    bgColor: "bg-green-50",
    description: "Suivi glycémique"
  },
  {
    title: "Docteur IA",
    url: "/patient/doctor-ia",
    icon: Bot,
    color: "text-rose-600",
    bgColor: "bg-rose-50",
    description: "Discutez avec l'IA médicale",
    special: true
  },
  {
    title: "Messages",
    url: "/patient/messages",
    icon: MessageSquare,
    color: "text-purple-600",
    bgColor: "bg-purple-50",
    description: "Communication",
    requiresCode: true
  },
  {
    title: "Documents",
    url: "/patient/documents",
    icon: FileText,
    color: "text-indigo-600",
    bgColor: "bg-indigo-50",
    description: "Dossiers médicaux",
    requiresCode: true
  },
];

export const PatientSidebar = () => {
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  // Check if patient has tracking code (simplified - in real app, get from context/API)
  const hasTrackingCode = localStorage.getItem('currentPatientId') ? true : false; // Simplified check

  return (
    <Sidebar collapsible="icon" className="border-r border-rose-100/50 bg-gradient-to-b from-white to-rose-50/30">
      <SidebarContent className="p-4">
        {/* Logo Section */}
        <SidebarGroup>
          <SidebarGroupLabel className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-400 to-pink-400 flex items-center justify-center shadow-lg">
              <Heart className="h-5 w-5 text-white" />
            </div>
            {!isCollapsed && (
              <div>
                <h2 className="text-lg font-bold bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">
                  SamaAfya
                </h2>
                <p className="text-xs text-gray-500 font-medium">Santé maternelle 💙</p>
              </div>
            )}
          </SidebarGroupLabel>
        </SidebarGroup>

        {/* Navigation Menu */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-2">
              {menuItems.map((item) => {
                const isDisabled = item.requiresCode && !hasTrackingCode;
                const isActive = window.location.pathname === item.url;

                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      {isDisabled ? (
                        <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50/50 border border-gray-100 cursor-not-allowed opacity-60">
                          <div className={`w-8 h-8 rounded-lg ${item.bgColor} flex items-center justify-center`}>
                            <Lock className="h-4 w-4 text-gray-400" />
                          </div>
                          {!isCollapsed && (
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-gray-500 truncate">
                                  {item.title}
                                </span>
                                <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-full">
                                  Code requis
                                </span>
                              </div>
                              <p className="text-xs text-gray-400 truncate">{item.description}</p>
                            </div>
                          )}
                        </div>
                      ) : (
                        <NavLink
                          to={item.url}
                          className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-200 group ${
                            isActive
                              ? `${item.bgColor} border-2 border-current shadow-lg transform scale-[1.02]`
                              : `hover:${item.bgColor} hover:border hover:border-current/20 hover:shadow-md`
                          }`}
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
                          {!isCollapsed && (
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <span className={`text-sm font-medium truncate ${
                                  isActive ? item.color.replace('text-', 'text-') : 'text-gray-700'
                                }`}>
                                  {item.title}
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
                          )}
                        </NavLink>
                      )}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Footer */}
        {!isCollapsed && (
          <SidebarGroup className="mt-auto">
            <div className="p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
              <div className="flex items-center gap-2 mb-2">
                <Heart className="h-4 w-4 text-blue-500" />
                <span className="text-xs font-medium text-blue-700">Besoin d'aide ?</span>
              </div>
              <p className="text-xs text-blue-600 leading-relaxed">
                Votre Docteur IA est là pour répondre à vos questions sur la glycémie et la grossesse 💙
              </p>
            </div>
          </SidebarGroup>
        )}
      </SidebarContent>
    </Sidebar>
  );
};