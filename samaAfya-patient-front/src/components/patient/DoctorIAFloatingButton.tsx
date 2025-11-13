import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bot, MessageCircle, X, Sparkles } from "lucide-react";

export const DoctorIAFloatingButton: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [hasLinkedDoctor, setHasLinkedDoctor] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Check if patient has linked doctor
  useEffect(() => {
    const checkLinkedDoctor = async () => {
      const patientId = localStorage.getItem('currentPatientId');
      if (patientId) {
        try {
          const response = await fetch(`http://localhost:3000/patients/${patientId}`);
          const patient = await response.json();
          setHasLinkedDoctor(patient.linkedDoctorId && patient.linkedDoctorId.trim() !== '');
        } catch (error) {
          console.error('Error checking linked doctor:', error);
        }
      }
    };

    checkLinkedDoctor();
  }, []);

  // Hide button on Doctor IA chat page (only for patients without linked doctor)
  if (location.pathname === '/patient/doctor-ia' && !hasLinkedDoctor) {
    return null;
  }

  // Hide button on Messages page when Docteur IA is selected (for patients with linked doctor)
  if (location.pathname === '/patient/messages' && hasLinkedDoctor) {
    return null;
  }

  const handleChatClick = () => {
    if (hasLinkedDoctor) {
      // Patient with linked doctor: go to Messages and select Docteur IA
      navigate('/patient/messages');
      // Set Docteur IA as selected conversation (will be handled by MessagesPage)
      localStorage.setItem('selectedConversation', 'Docteur IA');
    } else {
      // Patient without linked doctor: go to dedicated Docteur IA page
      navigate('/patient/doctor-ia');
    }
    setIsExpanded(false);
  };

  return (
    <>
      {/* Floating Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-14 h-14 rounded-full bg-primary hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all duration-300 group"
          size="icon"
        >
          {isExpanded ? (
            <X className="h-6 w-6 text-primary-foreground" />
          ) : (
            <div className="relative">
              <Bot className="h-6 w-6 text-primary-foreground" />
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
          <Card className="fixed bottom-24 right-6 w-80 z-50 shadow-2xl border-primary/20">
            <CardContent className="p-4">
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                    <Bot className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground">Docteur IA</h3>
                    <p className="text-sm text-muted-foreground">Votre assistant médical</p>
                  </div>
                  <Badge variant="secondary" className="bg-green-100 text-green-700">
                    <Sparkles className="h-3 w-3 mr-1" />
                    En ligne
                  </Badge>
                </div>

                {/* Description */}
                <div className="bg-primary/5 rounded-lg p-3 border border-primary/20">
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    💙 Besoin de conseils sur votre glycémie, alimentation ou grossesse ?
                    Je suis là pour vous aider avec des réponses bienveillantes !
                  </p>
                </div>

                {/* Quick Actions */}
                <div className="space-y-2">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    Questions fréquentes
                  </p>
                  <div className="grid grid-cols-1 gap-2">
                    <button className="text-left p-2 text-sm text-muted-foreground hover:bg-muted/50 rounded-md transition-colors">
                      📊 Valeurs normales de glycémie
                    </button>
                    <button className="text-left p-2 text-sm text-muted-foreground hover:bg-muted/50 rounded-md transition-colors">
                      🥗 Alimentation équilibrée
                    </button>
                    <button className="text-left p-2 text-sm text-muted-foreground hover:bg-muted/50 rounded-md transition-colors">
                      🏃‍♀️ Activité physique adaptée
                    </button>
                    <button className="text-left p-2 text-sm text-muted-foreground hover:bg-muted/50 rounded-md transition-colors">
                      🤰 Signes à surveiller
                    </button>
                  </div>
                </div>

                {/* Action Button */}
                <Button
                  onClick={handleChatClick}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Démarrer une conversation
                </Button>

                {/* Disclaimer */}
                <p className="text-xs text-muted-foreground text-center leading-relaxed">
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