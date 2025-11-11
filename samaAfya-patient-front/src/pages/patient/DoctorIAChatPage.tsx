import React from 'react';
import { DoctorIAChat } from "@/components/patient/DoctorIAChat";

const DoctorIAChatPage: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-rose-100 to-pink-100 px-4 py-2 rounded-full border border-rose-200 mb-4">
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-rose-400 to-pink-400 flex items-center justify-center">
            <span className="text-white font-bold text-sm">🤖</span>
          </div>
          <span className="text-sm font-medium text-rose-700">Assistant IA Médical</span>
        </div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-rose-600 via-pink-600 to-purple-600 bg-clip-text text-transparent mb-4">
          Docteur IA
        </h1>
        <p className="text-gray-600 text-base max-w-2xl mx-auto leading-relaxed">
          Je suis là pour répondre à vos questions sur la glycémie, l'alimentation,
          l'activité physique et votre grossesse avec diabète gestationnel.
          Mes conseils sont généraux et ne remplacent pas les consultations médicales.
        </p>
      </div>

      {/* Chat Component */}
      <DoctorIAChat />

      {/* Footer Info */}
      <div className="text-center">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-100">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-400 to-indigo-400 flex items-center justify-center">
              <span className="text-white text-sm">💙</span>
            </div>
            <h3 className="text-sm font-semibold text-blue-900">Conseils importants</h3>
          </div>
          <p className="text-blue-700 text-xs leading-relaxed max-w-xl mx-auto">
            Cet assistant IA fournit des informations générales basées sur les recommandations médicales standards.
            Pour des conseils personnalisés adaptés à votre situation médicale spécifique,
            consultez toujours votre équipe médicale (médecin, diabétologue, diététicien).
          </p>
        </div>
      </div>
    </div>
  );
};

export default DoctorIAChatPage;