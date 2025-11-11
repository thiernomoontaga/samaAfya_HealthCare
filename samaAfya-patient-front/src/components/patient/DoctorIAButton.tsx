import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bot, MessageCircle, X, Sparkles } from "lucide-react";

export const DoctorIAButton: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const navigate = useNavigate();

  const handleChatClick = () => {
    navigate('/patient/doctor-ia');
    setIsExpanded(false);
  };

  return (
    <>
      {/* Floating Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-14 h-14 rounded-full bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 shadow-lg hover:shadow-xl transition-all duration-300 group"
          size="icon"
        >
          {isExpanded ? (
            <X className="h-6 w-6 text-white" />
          ) : (
            <div className="relative">
              <Bot className="h-6 w-6 text-white" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            </div>
          )}
        </Button>
      </div>

      {/* Expanded Card */}
      {isExpanded && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
            onClick={() => setIsExpanded(false)}
          />

          {/* Card */}
          <Card className="fixed bottom-24 right-6 w-80 z-50 shadow-2xl border-rose-100">
            <CardContent className="p-4">
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-rose-400 to-pink-400 flex items-center justify-center">
                    <Bot className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">Docteur IA</h3>
                    <p className="text-sm text-gray-600">Votre assistant médical</p>
                  </div>
                  <Badge variant="secondary" className="bg-green-100 text-green-700">
                    <Sparkles className="h-3 w-3 mr-1" />
                    En ligne
                  </Badge>
                </div>

                {/* Description */}
                <div className="bg-rose-50 rounded-lg p-3 border border-rose-100">
                  <p className="text-sm text-gray-700 leading-relaxed">
                    💙 Besoin de conseils sur votre glycémie, alimentation ou grossesse ?
                    Je suis là pour vous aider avec des réponses bienveillantes !
                  </p>
                </div>

                {/* Quick Actions */}
                <div className="space-y-2">
                  <p className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                    Questions fréquentes
                  </p>
                  <div className="grid grid-cols-1 gap-2">
                    <button className="text-left p-2 text-sm text-gray-600 hover:bg-gray-50 rounded-md transition-colors">
                      📊 Valeurs normales de glycémie
                    </button>
                    <button className="text-left p-2 text-sm text-gray-600 hover:bg-gray-50 rounded-md transition-colors">
                      🥗 Alimentation équilibrée
                    </button>
                    <button className="text-left p-2 text-sm text-gray-600 hover:bg-gray-50 rounded-md transition-colors">
                      🏃‍♀️ Activité physique adaptée
                    </button>
                    <button className="text-left p-2 text-sm text-gray-600 hover:bg-gray-50 rounded-md transition-colors">
                      🤰 Signes à surveiller
                    </button>
                  </div>
                </div>

                {/* Action Button */}
                <Button
                  onClick={handleChatClick}
                  className="w-full bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white"
                >
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Démarrer une conversation
                </Button>

                {/* Disclaimer */}
                <p className="text-xs text-gray-500 text-center leading-relaxed">
                  💡 Cet assistant fournit des conseils généraux.
                  Consultez toujours votre équipe médicale pour des recommandations personnalisées.
                </p>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </>
  );
};