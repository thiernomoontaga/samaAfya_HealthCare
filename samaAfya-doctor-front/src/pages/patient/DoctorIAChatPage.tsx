import React from 'react';
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { PatientSidebar } from "@/components/patient/PatientSidebar";
import { DoctorIAChat } from "@/components/patient/DoctorIAChat";
import { Bot, Sparkles, Heart } from "lucide-react";

const DoctorIAChatPage: React.FC = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-rose-50/50 via-pink-50/30 to-purple-50/50">
        <PatientSidebar />
        <main className="flex-1">
          {/* Header */}
          <header className="sticky top-0 z-10 bg-white/90 backdrop-blur-md border-b border-rose-100/50 shadow-sm">
            <div className="flex items-center gap-4 px-6 py-5">
              <SidebarTrigger />
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-rose-400 to-pink-400 flex items-center justify-center shadow-lg">
                    <Bot className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">
                      Docteur IA
                    </h1>
                    <p className="text-sm text-gray-600 font-medium">
                      Votre assistant médical bienveillant 💙
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </header>

          {/* Content */}
          <div className="p-6 lg:p-8">
            <div className="max-w-5xl mx-auto">
              {/* Welcome Section */}
              <div className="mb-8 text-center">
                <div className="inline-flex items-center gap-2 bg-gradient-to-r from-rose-100 to-pink-100 px-4 py-2 rounded-full border border-rose-200">
                  <Sparkles className="h-4 w-4 text-rose-500" />
                  <span className="text-sm font-medium text-rose-700">Assistant IA Médical</span>
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mt-4 mb-2">
                  Parlez avec votre Docteur IA
                </h2>
                <p className="text-gray-600 text-lg max-w-2xl mx-auto leading-relaxed">
                  Je suis là pour répondre à vos questions sur la glycémie, l'alimentation,
                  l'activité physique et votre grossesse avec diabète gestationnel.
                  Mes conseils sont généraux et ne remplacent pas les consultations médicales.
                </p>
              </div>

              {/* Chat Component */}
              <DoctorIAChat />

              {/* Footer Info */}
              <div className="mt-8 text-center">
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-2xl border border-blue-100">
                  <div className="flex items-center justify-center gap-3 mb-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-indigo-400 flex items-center justify-center">
                      <Heart className="h-4 w-4 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-blue-900">Conseils importants</h3>
                  </div>
                  <p className="text-blue-700 text-sm leading-relaxed max-w-2xl mx-auto">
                    Cet assistant IA fournit des informations générales basées sur les recommandations médicales standards.
                    Pour des conseils personnalisés adaptés à votre situation médicale spécifique,
                    consultez toujours votre équipe médicale (médecin, diabétologue, diététicien).
                  </p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default DoctorIAChatPage;