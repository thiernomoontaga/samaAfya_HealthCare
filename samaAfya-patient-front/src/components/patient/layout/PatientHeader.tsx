import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Menu, Bell, LogOut, Heart, Sparkles, User } from "lucide-react";
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
    <header className="fixed top-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-b border-rose-100/50 px-4 lg:px-6 py-4 shadow-lg animate-fade-in">
      <div className="flex items-center justify-between">
        {/* Left side - Menu button and title */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onMenuClick}
            className="lg:hidden hover:bg-rose-50"
          >
            <Menu className="h-5 w-5" />
          </Button>

          <div className="hidden lg:block">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-rose-100 to-pink-100 flex items-center justify-center">
                <Heart className="h-4 w-4 text-rose-600" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">
                {title}
              </h1>
            </div>
          </div>

          <div className="lg:hidden">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-rose-100 to-pink-100 flex items-center justify-center">
                <Heart className="h-3 w-3 text-rose-600" />
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">
                {title}
              </h1>
            </div>
          </div>
        </div>

        {/* Right side - Profile and actions */}
        <div className="flex items-center gap-4">
          {/* Pregnancy status badge */}
          <Badge variant="outline" className="hidden sm:flex bg-gradient-to-r from-rose-50 to-pink-50 text-rose-700 border-rose-200 font-medium">
            <Sparkles className="h-3 w-3 mr-1" />
            {currentPatient.gestationalAge} semaines de grossesse
          </Badge>

          {/* Notifications */}
          <Button variant="ghost" size="icon" className="relative hover:bg-blue-50">
            <Bell className="h-5 w-5 text-blue-600" />
            <span className="absolute -top-1 -right-1 h-5 w-5 bg-gradient-to-r from-red-500 to-pink-500 rounded-full text-xs text-white flex items-center justify-center font-bold shadow-lg animate-pulse">
              2
            </span>
          </Button>

          {/* Profile */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <Avatar className="h-10 w-10 border-2 border-white shadow-md">
                <AvatarImage src="" alt={currentPatient.firstName} />
                <AvatarFallback className="bg-gradient-to-br from-rose-400 to-pink-400 text-white font-semibold">
                  {currentPatient.firstName[0]}{currentPatient.lastName[0]}
                </AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
            </div>
            <div className="hidden md:block">
              <p className="text-sm font-semibold text-gray-900">
                {currentPatient.firstName} {currentPatient.lastName}
              </p>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="bg-gradient-to-r from-purple-100 to-blue-100 text-purple-700 text-xs font-medium">
                  Mode {currentPatient.monitoringMode}
                </Badge>
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              </div>
            </div>
          </div>

          {/* Logout */}
          <Button
            variant="ghost"
            size="icon"
            onClick={handleLogout}
            className="text-gray-500 hover:text-red-500 hover:bg-red-50 transition-all duration-200"
            title="Se déconnecter"
          >
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
};