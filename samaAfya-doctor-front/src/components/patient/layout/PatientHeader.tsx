import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Menu, Bell, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { currentPatient } from "@/data/mockData";

interface PatientHeaderProps {
  title: string;
  onMenuClick: () => void;
}

export const PatientHeader = ({ title, onMenuClick }: PatientHeaderProps) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/");
  };

  return (
    <header className="bg-white/90 backdrop-blur-md border-b border-gray-200/50 px-4 lg:px-6 py-4 flex-shrink-0 shadow-sm animate-fade-in">
      <div className="flex items-center justify-between">
        {/* Left side - Menu button and title */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onMenuClick}
            className="lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </Button>

          <div className="hidden lg:block">
            <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          </div>

          <div className="lg:hidden">
            <h1 className="text-xl font-bold text-gray-900">{title}</h1>
          </div>
        </div>

        {/* Right side - Profile and actions */}
        <div className="flex items-center gap-4">
          {/* Pregnancy status badge */}
          <Badge variant="outline" className="hidden sm:flex bg-primary/10 text-primary border-primary/20">
            {currentPatient.gestationalAge} semaines
          </Badge>

          {/* Notifications */}
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
              2
            </span>
          </Button>

          {/* Profile */}
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src="" alt={currentPatient.firstName} />
              <AvatarFallback className="bg-primary/10 text-primary">
                {currentPatient.firstName[0]}{currentPatient.lastName[0]}
              </AvatarFallback>
            </Avatar>
            <div className="hidden md:block">
              <p className="text-sm font-medium text-gray-900">
                {currentPatient.firstName} {currentPatient.lastName}
              </p>
              <p className="text-xs text-gray-500">
                Mode {currentPatient.monitoringMode}
              </p>
            </div>
          </div>

          {/* Logout */}
          <Button
            variant="ghost"
            size="icon"
            onClick={handleLogout}
            className="text-gray-500 hover:text-gray-700"
          >
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
};